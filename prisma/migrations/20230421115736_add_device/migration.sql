-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "notification_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_notification_token_key" ON "Device"("notification_token");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
