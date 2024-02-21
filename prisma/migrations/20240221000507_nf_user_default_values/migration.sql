-- AlterTable
ALTER TABLE "nf_user" ALTER COLUMN "user_is_logged_in" SET DEFAULT false,
ALTER COLUMN "user_confirmed" SET DEFAULT false,
ALTER COLUMN "user_conf_by_admin" SET DEFAULT false;
