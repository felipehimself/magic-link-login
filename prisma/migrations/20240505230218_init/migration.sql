-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confirm_account" (
    "userId" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "code_confirmation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_session" (
    "userId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expiration" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "confirm_account_userId_key" ON "confirm_account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "confirm_account_code_confirmation_key" ON "confirm_account"("code_confirmation");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_userId_key" ON "user_session"("userId");

-- AddForeignKey
ALTER TABLE "confirm_account" ADD CONSTRAINT "confirm_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_session" ADD CONSTRAINT "user_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
