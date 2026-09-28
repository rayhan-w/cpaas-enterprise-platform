import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { extractTokenFromRequest, verifySessionToken, TokenPayload } from './security';
import { RoleType, UserStatus, RequestStatus } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: UserStatus;
  twoFactorEnabled: boolean;
}

export interface AuthContext {
  user: AuthenticatedUser | null;
  error?: string;
  status: number;
}

/**
 * Centralized Authentication & Account Status Verification
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthContext> {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return { user: null, error: 'Authentication required. No session token provided.', status: 401 };
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return { user: null, error: 'Invalid or expired session token.', status: 401 };
  }

  // Always verify real-time status in database to enforce immediate suspension or role revocation
  const dbUser = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      twoFactorEnabled: true,
    },
  });

  if (!dbUser) {
    return { user: null, error: 'User account not found.', status: 401 };
  }

  if (dbUser.status === UserStatus.SUSPENDED) {
    return { user: null, error: 'Account has been suspended. Please contact platform administrators.', status: 403 };
  }

  return {
    user: dbUser,
    status: 200,
  };
}

/**
 * Strict Role Verification Guard
 */
export function requireRole(user: AuthenticatedUser, allowedRoles: RoleType[]): { authorized: boolean; error?: string } {
  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      error: `Access Denied. Your role (${user.role}) does not have permission to perform this action.`,
    };
  }
  return { authorized: true };
}

/**
 * Scope Verification for Administrators:
 * Super Admin can approve/revoke any feature.
 * Admin can ONLY approve/revoke features explicitly granted in administrator_scopes.
 */
export async function verifyAdminFeatureScope(
  adminId: string,
  userRole: RoleType,
  featureKey: string,
  action: 'APPROVE' | 'REVOKE' = 'APPROVE'
): Promise<{ allowed: boolean; reason?: string }> {
  // Super Admin has full platform authority
  if (userRole === RoleType.SUPER_ADMIN) {
    return { allowed: true };
  }

  if (userRole !== RoleType.ADMIN) {
    return { allowed: false, reason: 'Only authorized administrators can review access requests.' };
  }

  // Check administrator's explicit scope
  const scope = await prisma.administratorScope.findUnique({
    where: {
      adminId_featureKey: {
        adminId,
        featureKey,
      },
    },
  });

  if (!scope) {
    return {
      allowed: false,
      reason: `You are not authorized to manage '${featureKey}'. Super Admin must grant you scope for this feature.`,
    };
  }

  if (action === 'APPROVE' && !scope.canApprove) {
    return { allowed: false, reason: `Approval permission for '${featureKey}' has been revoked for your administrator account.` };
  }

  if (action === 'REVOKE' && !scope.canRevoke) {
    return { allowed: false, reason: `Revocation permission for '${featureKey}' is not permitted for your administrator account.` };
  }

  return { allowed: true };
}

/**
 * User Feature Permission Guard (Default-Deny)
 * Checks if user has an active, non-expired permission for the sensitive feature.
 */
export async function verifyUserFeatureAccess(
  userId: string,
  featureKey: string
): Promise<{ granted: boolean; permission?: any; error?: string }> {
  // 1. Check if feature is globally disabled in SystemSettings
  const settingKey = featureKey === 'FEATURE_CAMERA'
    ? 'camera_feature_globally_enabled'
    : featureKey === 'FEATURE_LOCATION'
    ? 'location_feature_globally_enabled'
    : null;

  if (settingKey) {
    const setting = await prisma.systemSetting.findUnique({ where: { key: settingKey } });
    if (setting && setting.value === 'false') {
      return { granted: false, error: 'This feature is currently disabled platform-wide by the Super Admin.' };
    }
  }

  // 2. Query user permission
  const perm = await prisma.userFeaturePermission.findUnique({
    where: {
      userId_featureKey: {
        userId,
        featureKey,
      },
    },
  });

  if (!perm || perm.status !== RequestStatus.APPROVED) {
    return { granted: false, error: `Access required. You do not have approved permission for '${featureKey}'.` };
  }

  // 3. Expiration Check
  if (perm.expiresAt && new Date() > perm.expiresAt) {
    // Mark as expired in DB
    await prisma.userFeaturePermission.update({
      where: { id: perm.id },
      data: { status: RequestStatus.EXPIRED },
    });
    return { granted: false, error: `Your permission for '${featureKey}' has expired. Please submit a new access request.` };
  }

  return { granted: true, permission: perm };
}

/**
 * Centralized Immutable Audit Logger
 */
export async function logAuditEvent(params: {
  actor: { id: string; name: string; email: string; role: string };
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actor.id,
        actorName: params.actor.name,
        actorEmail: params.actor.email,
        actorRole: params.actor.role,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress || '127.0.0.1',
        userAgent: params.userAgent || 'Internal-System',
        details: params.details ? JSON.stringify(params.details) : null,
      },
    });
  } catch (err) {
    console.error('Audit logging failure:', err);
  }
}

/**
 * In-App Notification Dispatcher
 */
export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type: 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'PERMISSION_REVOKED' | 'SECURITY_ALERT' | 'SYSTEM';
  link?: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        link: params.link,
      },
    });
  } catch (err) {
    console.error('Notification dispatch failure:', err);
    return null;
  }
}
