-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('none', 'yellow', 'orange', 'red');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "notification_status" "NotificationStatus" NOT NULL DEFAULT 'none';
