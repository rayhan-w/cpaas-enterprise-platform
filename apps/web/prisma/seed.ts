import { PrismaClient, RoleType, UserStatus, RequestStatus, CaseStatus, CasePriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TrackOps production-ready platform database...');

  // 1. Password Hashes (bcrypt 12 rounds for high security)
  const superAdminHash = await bcrypt.hash('SuperAdmin@TrackOps2026!', 12);
  const adminHash = await bcrypt.hash('Admin@TrackOps2026!', 12);
  const userHash = await bcrypt.hash('User@TrackOps2026!', 12);

  // 2. Default System Settings
  const defaultSettings = [
    { key: 'registration_enabled', value: 'true', category: 'GENERAL', description: 'Allow new user self-registration' },
    { key: 'maintenance_mode', value: 'false', category: 'GENERAL', description: 'Enable platform maintenance mode' },
    { key: 'retention_days_analytics', value: '90', category: 'RETENTION', description: 'Data retention limit for link visit logs in days' },
    { key: 'retention_days_audit', value: '365', category: 'RETENTION', description: 'Audit log retention period in days' },
    { key: 'camera_feature_globally_enabled', value: 'true', category: 'PERMISSIONS', description: 'Global toggle for user-initiated camera verification' },
    { key: 'location_feature_globally_enabled', value: 'true', category: 'PERMISSIONS', description: 'Global toggle for user-initiated location reporting' },
    { key: 'require_owner_approval_for_cases', value: 'false', category: 'PERMISSIONS', description: 'Require Super Admin sign-off for investigation features' },
    { key: 'max_links_per_user', value: '100', category: 'GENERAL', description: 'Maximum active links allowed per standard user' },
    { key: 'rate_limit_per_minute', value: '120', category: 'SECURITY', description: 'API rate limiting window requests per IP/token' },
  ];

  for (const s of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category, description: s.description },
      create: s,
    });
  }

  // 3. Super Admin (Platform Owner)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@trackops.dev' },
    update: {
      name: 'Super Admin (Platform Owner)',
      role: RoleType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: superAdminHash,
    },
    create: {
      name: 'Super Admin (Platform Owner)',
      email: 'superadmin@trackops.dev',
      role: RoleType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: superAdminHash,
      lastLoginAt: new Date(),
    },
  });

  // 4. Administrator (Access Approval Manager)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trackops.dev' },
    update: {
      name: 'Alex Rivera (Approval Manager)',
      role: RoleType.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: adminHash,
    },
    create: {
      name: 'Alex Rivera (Approval Manager)',
      email: 'admin@trackops.dev',
      role: RoleType.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: adminHash,
      lastLoginAt: new Date(Date.now() - 3600000 * 2),
    },
  });

  // Assign Scopes to Administrator
  const adminScopes = [
    { featureKey: 'FEATURE_CAMERA', canApprove: true, canRevoke: true },
    { featureKey: 'FEATURE_LOCATION', canApprove: true, canRevoke: true },
    { featureKey: 'FEATURE_EXPORT', canApprove: true, canRevoke: true },
    { featureKey: 'FEATURE_ANALYTICS_PRO', canApprove: true, canRevoke: true },
  ];

  for (const sc of adminScopes) {
    await prisma.administratorScope.upsert({
      where: { adminId_featureKey: { adminId: admin.id, featureKey: sc.featureKey } },
      update: { canApprove: sc.canApprove, canRevoke: sc.canRevoke, assignedBy: superAdmin.id },
      create: {
        adminId: admin.id,
        featureKey: sc.featureKey,
        canApprove: sc.canApprove,
        canRevoke: sc.canRevoke,
        assignedBy: superAdmin.id,
      },
    });
  }

  // 5. Regular User (Platform User)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@trackops.dev' },
    update: {
      name: 'Jordan Lee (Platform User)',
      role: RoleType.USER,
      status: UserStatus.ACTIVE,
      passwordHash: userHash,
    },
    create: {
      name: 'Jordan Lee (Platform User)',
      email: 'user@trackops.dev',
      role: RoleType.USER,
      status: UserStatus.ACTIVE,
      passwordHash: userHash,
      lastLoginAt: new Date(Date.now() - 3600000 * 5),
    },
  });

  // 6. Access Requests & Permissions for regularUser
  // A. Approved Camera feature
  const cameraRequest = await prisma.accessRequest.create({
    data: {
      userId: regularUser.id,
      featureKey: 'FEATURE_CAMERA',
      purpose: 'Field asset condition inspection and equipment verification',
      status: RequestStatus.APPROVED,
      reviewedById: admin.id,
      reviewedByName: admin.name,
      reviewedAt: new Date(Date.now() - 86400000 * 2),
      decisionReason: 'Verified operational business justification for hardware audit.',
      grantedExpiry: new Date(Date.now() + 86400000 * 30),
    },
  });

  await prisma.userFeaturePermission.upsert({
    where: { userId_featureKey: { userId: regularUser.id, featureKey: 'FEATURE_CAMERA' } },
    update: {
      status: RequestStatus.APPROVED,
      grantedBy: admin.id,
      grantedByName: admin.name,
      expiresAt: new Date(Date.now() + 86400000 * 30),
      requestId: cameraRequest.id,
    },
    create: {
      userId: regularUser.id,
      featureKey: 'FEATURE_CAMERA',
      status: RequestStatus.APPROVED,
      grantedBy: admin.id,
      grantedByName: admin.name,
      expiresAt: new Date(Date.now() + 86400000 * 30),
      requestId: cameraRequest.id,
    },
  });

  // B. Pending Location request
  await prisma.accessRequest.create({
    data: {
      userId: regularUser.id,
      featureKey: 'FEATURE_LOCATION',
      purpose: 'Geographic verification of warehouse delivery drop-off points',
      status: RequestStatus.PENDING,
    },
  });

  // C. Rejected Investigation Case Management request
  await prisma.accessRequest.create({
    data: {
      userId: regularUser.id,
      featureKey: 'FEATURE_INVESTIGATION',
      purpose: 'Reviewing audit logs across unauthorized business partners',
      status: RequestStatus.REJECTED,
      reviewedById: superAdmin.id,
      reviewedByName: superAdmin.name,
      reviewedAt: new Date(Date.now() - 86400000),
      decisionReason: 'Requires Level 2 Security clearance. User role does not permit case modification.',
    },
  });

  // 7. TrackOps Links & Privacy-Friendly Analytics
  const link1 = await prisma.link.upsert({
    where: { slug: 'ops-portal' },
    update: { destinationUrl: 'https://trackops.dev/docs' },
    create: {
      userId: regularUser.id,
      title: 'Operations Portal Documentation',
      slug: 'ops-portal',
      destinationUrl: 'https://trackops.dev/docs',
      isActive: true,
      visitCount: 142,
    },
  });

  const link2 = await prisma.link.upsert({
    where: { slug: 'q4-brief' },
    update: { destinationUrl: 'https://trackops.dev/reports/q4' },
    create: {
      userId: regularUser.id,
      title: 'Q4 Field Operations Briefing',
      slug: 'q4-brief',
      destinationUrl: 'https://trackops.dev/reports/q4',
      isActive: true,
      visitCount: 89,
    },
  });

  // Seed realistic link events (privacy-friendly hashed visitors)
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const oss = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  const countries = ['United States', 'United Kingdom', 'Germany', 'Canada', 'Singapore', 'India', 'Japan'];

  for (let i = 0; i < 45; i++) {
    const d = new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000);
    const fakeIp = `192.168.${i % 20}.${(i * 7) % 250}`;
    const visitorHash = Buffer.from(fakeIp + '_privacy_salt_2026').toString('base64').substring(0, 32);

    await prisma.linkEvent.create({
      data: {
        linkId: i % 2 === 0 ? link1.id : link2.id,
        visitorHash,
        deviceCategory: devices[i % devices.length],
        browserFamily: browsers[i % browsers.length],
        osFamily: oss[i % oss.length],
        referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://linkedin.com' : 'Direct',
        country: countries[i % countries.length],
        region: 'Region-' + (i % 5),
        city: 'Metropolis',
        timestamp: d,
      },
    });
  }

  // 8. Investigation Case Management
  const existingCase = await prisma.investigationCase.findUnique({
    where: { caseNumber: 'CAS-2026-001' },
  });

  if (!existingCase) {
    const invCase = await prisma.investigationCase.create({
      data: {
        caseNumber: 'CAS-2026-001',
        title: 'Suspicious Redirect Pattern Analysis on External Campaign Links',
        description: 'Investigation into reported third-party phishing redirect attempts bypassing perimeter safe-URL filters.',
        status: CaseStatus.IN_PROGRESS,
        priority: CasePriority.HIGH,
        createdById: superAdmin.id,
      },
    });

    // Assign Alex Rivera (Admin) as Lead Investigator
    await prisma.caseAssignment.create({
      data: {
        caseId: invCase.id,
        userId: admin.id,
        assignedBy: superAdmin.id,
        role: 'LEAD_INVESTIGATOR',
      },
    });

    // Case Notes
    await prisma.caseNote.create({
      data: {
        caseId: invCase.id,
        authorId: admin.id,
        authorName: admin.name,
        content: 'Initial telemetry indicates non-conforming host headers originating from residential proxy subnet.',
      },
    });

    // Evidence Record
    await prisma.evidenceRecord.create({
      data: {
        caseId: invCase.id,
        title: 'Redirect Destination Analysis Log',
        description: 'Captured cryptographic hashes and HTTP response headers for target link.',
        evidenceType: 'LOG_EXTRACT',
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        chainOfCustody: JSON.stringify([
          { action: 'ACQUIRED', timestamp: new Date(), actor: admin.name, role: 'ADMIN' },
          { action: 'INTEGRITY_VERIFIED', timestamp: new Date(), actor: superAdmin.name, role: 'SUPER_ADMIN' },
        ]),
        submittedById: admin.id,
      },
    });
  }

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: regularUser.id,
        title: 'Access Request Approved',
        message: 'Your request for Camera Verification has been approved by Alex Rivera.',
        type: 'REQUEST_APPROVED',
        link: '/dashboard/features/camera',
        isRead: false,
      },
      {
        userId: regularUser.id,
        title: 'Access Request Rejected',
        message: 'Your request for Investigation Case Access was rejected: Level 2 Security required.',
        type: 'REQUEST_REJECTED',
        link: '/dashboard/requests',
        isRead: false,
      },
      {
        userId: admin.id,
        title: 'New Access Request Pending Review',
        message: 'Jordan Lee submitted a request for Geolocation Access.',
        type: 'SYSTEM',
        link: '/admin/requests',
        isRead: false,
      },
      {
        userId: superAdmin.id,
        title: 'Security Audit Checkpoint',
        message: 'System settings baseline verified. 0 open security alerts.',
        type: 'SECURITY_ALERT',
        link: '/super-admin/audit',
        isRead: false,
      },
    ],
  });

  // 10. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: superAdmin.id,
        actorName: superAdmin.name,
        actorEmail: superAdmin.email,
        actorRole: 'SUPER_ADMIN',
        action: 'SYSTEM_INITIALIZED',
        resourceType: 'SETTING',
        details: JSON.stringify({ note: 'TrackOps Enterprise security baseline instantiated' }),
      },
      {
        actorId: admin.id,
        actorName: admin.name,
        actorEmail: admin.email,
        actorRole: 'ADMIN',
        action: 'ACCESS_REQUEST_APPROVED',
        resourceType: 'ACCESS_REQUEST',
        details: JSON.stringify({ feature: 'FEATURE_CAMERA', targetUser: regularUser.email }),
      },
      {
        actorId: superAdmin.id,
        actorName: superAdmin.name,
        actorEmail: superAdmin.email,
        actorRole: 'SUPER_ADMIN',
        action: 'ADMIN_SCOPE_ASSIGNED',
        resourceType: 'USER',
        details: JSON.stringify({ admin: admin.email, scopes: ['CAMERA', 'LOCATION', 'EXPORT', 'ANALYTICS_PRO'] }),
      },
    ],
  });

  console.log('✅ TrackOps seed completed successfully!');
  console.log('Credentials:');
  console.log('  Super Admin: superadmin@trackops.dev / SuperAdmin@TrackOps2026!');
  console.log('  Admin:       admin@trackops.dev      / Admin@TrackOps2026!');
  console.log('  User:        user@trackops.dev       / User@TrackOps2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
