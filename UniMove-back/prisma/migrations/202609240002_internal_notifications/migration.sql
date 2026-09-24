-- Activate accounts created by the removed email-verification flow.
UPDATE "users"
SET "status" = 'ACTIVE'
WHERE "status" = 'PENDING_EMAIL_VERIFICATION';

-- Remove the obsolete user status without discarding existing accounts.
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED');
ALTER TABLE "users"
  ALTER COLUMN "status" TYPE "UserStatus"
  USING ("status"::text::"UserStatus");
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
DROP TYPE "UserStatus_old";

-- Convert existing notification types to the V1 internal-notification vocabulary.
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
CREATE TYPE "NotificationType" AS ENUM (
  'RIDE_REQUEST_RECEIVED',
  'RIDE_REQUEST_ACCEPTED',
  'RIDE_REQUEST_REJECTED',
  'RIDE_REQUEST_EXPIRED',
  'RIDE_CANCELLED',
  'RIDE_STARTED',
  'RIDE_COMPLETED',
  'MESSAGE_RECEIVED',
  'INCIDENT_UPDATED',
  'SYSTEM'
);
ALTER TABLE "notifications"
  ALTER COLUMN "type" TYPE "NotificationType"
  USING (
    CASE "type"::text
      WHEN 'RIDE_REQUESTED' THEN 'RIDE_REQUEST_RECEIVED'
      WHEN 'RIDE_REMINDER' THEN 'SYSTEM'
      ELSE "type"::text
    END
  )::"NotificationType";
DROP TYPE "NotificationType_old";

-- Notification is an in-app resource, independent of any push provider.
ALTER TABLE "notifications" RENAME COLUMN "payload" TO "metadata";
ALTER TABLE "notifications" ADD COLUMN "resource_type" TEXT;
ALTER TABLE "notifications" ADD COLUMN "resource_id" UUID;
ALTER TABLE "notifications" ADD COLUMN "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "notifications" ALTER COLUMN "updated_at" DROP DEFAULT;

-- Email verification, email reset and push-device storage are outside V1.
DROP TABLE "email_verification_tokens";
DROP TABLE "password_reset_tokens";
DROP TABLE "device_tokens";
DROP TYPE "DevicePlatform";
ALTER TABLE "users" DROP COLUMN "email_verified";
