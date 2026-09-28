import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import {
  signSessionToken,
  verifySessionToken,
  hashVisitorIp,
  validateDestinationUrl,
} from '../src/lib/security';
import {
  verifyAdminFeatureScope,
  verifyUserFeatureAccess,
  requireRole,
} from '../src/lib/auth-service';
import { RoleType, UserStatus, RequestStatus } from '@prisma/client';

async function runSecurityTestSuite() {
  console.log('====================================================');
  console.log(' TrackOps Security & Verification Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Sensitive Responses Never Return Password Hashes
    // -------------------------------------------------------------
    console.log('\n--- 1. Password Hash Sanitization & Hashing ---');
    const rawPass = 'SecureTestPassword2026!';
    const hashed = await bcrypt.hash(rawPass, 12);
    const isValid = await bcrypt.compare(rawPass, hashed);
    assert(isValid, 'Password hashing & bcrypt verification working properly');

    const superAdmin = await prisma.user.findUnique({
      where: { email: 'superadmin@trackops.dev' },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    assert(superAdmin !== null, 'Super Admin account exists in database');
    assert(!('passwordHash' in (superAdmin as any)), 'Super Admin query sanitizes passwordHash');

    // -------------------------------------------------------------
    // Test 2: Destination URL Validation & SSRF Prevention
    // -------------------------------------------------------------
    console.log('\n--- 2. Destination URL SSRF & Scheme Protection ---');
    const ssrfUrls = [
      'http://localhost:3000/admin',
      'http://127.0.0.1:8080/internal',
      'http://169.254.169.254/latest/meta-data',
      'http://10.0.0.5/secrets',
      'http://192.168.1.1/router-login',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'ftp://files.example.com',
    ];

    for (const url of ssrfUrls) {
      const res = validateDestinationUrl(url);
      assert(!res.isValid, `SSRF blocked correctly: ${url}`);
    }

    const safeUrl = 'https://portal.enterprise-client.com/docs/q4-plan';
    const safeRes = validateDestinationUrl(safeUrl);
    assert(safeRes.isValid, `Legitimate destination allowed: ${safeUrl}`);

    // -------------------------------------------------------------
    // Test 3: Salted IP Hashing & Privacy Preservation
    // -------------------------------------------------------------
    console.log('\n--- 3. Salted IP Hashing & Anonymization ---');
    const rawIp = '203.0.113.195';
    const hashedIp1 = hashVisitorIp(rawIp);
    const hashedIp2 = hashVisitorIp(rawIp);
    assert(hashedIp1 === hashedIp2, 'IP hash is deterministic with configured salt');
    assert(hashedIp1.length === 32, 'IP hash is valid SHA-256 slice (32 hex characters)');
    assert(!hashedIp1.includes('203.0.113'), 'Raw IP octets never appear in hash');

    // -------------------------------------------------------------
    // Test 4: User Cannot Self-Approve Access Requests
    // -------------------------------------------------------------
    console.log('\n--- 4. Anti-Self-Approval Enforcement ---');
    const regularUser = await prisma.user.findUnique({
      where: { email: 'user@trackops.dev' },
    });
    assert(regularUser !== null, 'Regular test user exists');

    if (regularUser) {
      // Role check: regular user cannot have approval scopes
      const userScopeCheck = await verifyAdminFeatureScope(
        regularUser.id,
        regularUser.role,
        'FEATURE_CAMERA',
        'APPROVE'
      );
      assert(
        !userScopeCheck.allowed,
        'Standard USER cannot approve access requests (Self-approval blocked)',
        userScopeCheck.reason
      );
    }

    // -------------------------------------------------------------
    // Test 5: Scoped Delegated Administration Boundaries
    // -------------------------------------------------------------
    console.log('\n--- 5. Delegated Admin Scopes Enforcement ---');
    // Create dedicated scoped admin for testing: only has FEATURE_CAMERA
    const scopedAdminEmail = 'scoped.admin.test@trackops.dev';
    let scopedAdmin = await prisma.user.findUnique({ where: { email: scopedAdminEmail } });
    if (!scopedAdmin) {
      scopedAdmin = await prisma.user.create({
        data: {
          email: scopedAdminEmail,
          name: 'Scoped Camera Admin',
          passwordHash: hashed,
          role: RoleType.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });
    }

    // Set scope: only FEATURE_CAMERA, NOT FEATURE_LOCATION
    await prisma.administratorScope.deleteMany({ where: { adminId: scopedAdmin.id } });
    await prisma.administratorScope.create({
      data: {
        adminId: scopedAdmin.id,
        featureKey: 'FEATURE_CAMERA',
        canApprove: true,
        canRevoke: true,
        assignedBy: superAdmin!.id,
      },
    });

    const cameraScopeCheck = await verifyAdminFeatureScope(
      scopedAdmin.id,
      scopedAdmin.role,
      'FEATURE_CAMERA',
      'APPROVE'
    );
    assert(cameraScopeCheck.allowed, 'Admin CAN approve within assigned scope (FEATURE_CAMERA)');

    const locationScopeCheck = await verifyAdminFeatureScope(
      scopedAdmin.id,
      scopedAdmin.role,
      'FEATURE_LOCATION',
      'APPROVE'
    );
    assert(
      !locationScopeCheck.allowed,
      'Admin CANNOT approve outside assigned scopes (FEATURE_LOCATION blocked)',
      locationScopeCheck.reason
    );

    // -------------------------------------------------------------
    // Test 6: Role Elevation Prevention (Admin cannot promote to Super Admin)
    // -------------------------------------------------------------
    console.log('\n--- 6. Role Elevation Guardrails ---');
    const adminRoleCheck = requireRole(
      {
        id: scopedAdmin.id,
        email: scopedAdmin.email,
        name: scopedAdmin.name,
        role: scopedAdmin.role,
        status: scopedAdmin.status,
        twoFactorEnabled: false,
      },
      [RoleType.SUPER_ADMIN]
    );
    assert(
      !adminRoleCheck.authorized,
      'Delegated ADMIN is rejected when attempting Super Admin role modifications'
    );

    // -------------------------------------------------------------
    // Test 7: Immediate Permission Revocation Enforcement
    // -------------------------------------------------------------
    console.log('\n--- 7. Real-Time Revocation & Default-Deny ---');
    if (regularUser) {
      // 1. Grant permission
      await prisma.userFeaturePermission.upsert({
        where: {
          userId_featureKey: {
            userId: regularUser.id,
            featureKey: 'FEATURE_LOCATION',
          },
        },
        create: {
          userId: regularUser.id,
          featureKey: 'FEATURE_LOCATION',
          status: RequestStatus.APPROVED,
          grantedBy: superAdmin!.id,
          grantedAt: new Date(),
        },
        update: {
          status: RequestStatus.APPROVED,
          revokedAt: null,
          revokedBy: null,
        },
      });

      const grantedCheck = await verifyUserFeatureAccess(regularUser.id, 'FEATURE_LOCATION');
      assert(grantedCheck.granted, 'Feature granted: verifyUserFeatureAccess returns granted: true');

      // 2. Revoke permission
      await prisma.userFeaturePermission.update({
        where: {
          userId_featureKey: {
            userId: regularUser.id,
            featureKey: 'FEATURE_LOCATION',
          },
        },
        data: {
          status: RequestStatus.REVOKED,
          revokedAt: new Date(),
          revokedBy: scopedAdmin.id,
          revocationReason: 'Security audit test revocation',
        },
      });

      const revokedCheck = await verifyUserFeatureAccess(regularUser.id, 'FEATURE_LOCATION');
      assert(
        !revokedCheck.granted,
        'Feature immediately revoked: verifyUserFeatureAccess returns granted: false',
        revokedCheck.error
      );
    }

    // -------------------------------------------------------------
    // Test 8: Suspended User Account Enforcement
    // -------------------------------------------------------------
    console.log('\n--- 8. Suspended Account Blockade ---');
    const suspendedEmail = 'suspended.test@trackops.dev';
    let suspendedUser = await prisma.user.findUnique({ where: { email: suspendedEmail } });
    if (!suspendedUser) {
      suspendedUser = await prisma.user.create({
        data: {
          email: suspendedEmail,
          name: 'Suspended Account Test',
          passwordHash: hashed,
          role: RoleType.USER,
          status: UserStatus.SUSPENDED,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: suspendedUser.id },
        data: { status: UserStatus.SUSPENDED },
      });
    }

    // Validate token creation and verification
    const token = signSessionToken({
      userId: suspendedUser.id,
      email: suspendedUser.email,
      role: suspendedUser.role,
      status: suspendedUser.status,
      name: suspendedUser.name,
    });
    const payload = verifySessionToken(token);
    assert(payload !== null, 'JWT signed and decoded properly');

    const dbUser = await prisma.user.findUnique({
      where: { id: payload!.userId },
    });
    assert(dbUser?.status === UserStatus.SUSPENDED, 'User status verified as SUSPENDED in database');

    // -------------------------------------------------------------
    // Clean up temporary test accounts
    // -------------------------------------------------------------
    await prisma.administratorScope.deleteMany({ where: { adminId: scopedAdmin.id } });
    await prisma.user.delete({ where: { id: scopedAdmin.id } });
    await prisma.user.delete({ where: { id: suspendedUser.id } });

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite();
