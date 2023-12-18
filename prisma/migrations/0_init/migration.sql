-- CreateTable
CREATE TABLE "nf_event" (
    "id" SERIAL NOT NULL,
    "uid" VARCHAR,
    "user_id" INTEGER,
    "title" VARCHAR,
    "bookname" VARCHAR,
    "roomname" VARCHAR,
    "ou" VARCHAR,
    "startmills" BIGINT,
    "endmills" BIGINT,
    "color" VARCHAR,
    "paymntref" VARCHAR,

    CONSTRAINT "nf_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nf_room" (
    "row" SERIAL NOT NULL,
    "title" VARCHAR,

    CONSTRAINT "nf_room_pkey" PRIMARY KEY ("row")
);

-- CreateTable
CREATE TABLE "nf_user" (
    "id" SERIAL NOT NULL,
    "user_email" VARCHAR,
    "user_pass_hash" VARCHAR,
    "vipps_sub" VARCHAR,
    "google_sub" VARCHAR,
    "user_is_logged_in" BOOLEAN,
    "user_confirmed" BOOLEAN,
    "user_conf_by_admin" BOOLEAN,
    "access_token" VARCHAR,
    "last_seen" VARCHAR,
    "is_admin" BOOLEAN,
    "ou" VARCHAR,
    "address" VARCHAR,

    CONSTRAINT "nf_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nf_book" (
    "row" SERIAL NOT NULL,
    "title" VARCHAR,

    CONSTRAINT "nf_book_pkey" PRIMARY KEY ("row")
);

-- CreateTable
CREATE TABLE "nf_payment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "reference" VARCHAR,
    "vipps_sub" VARCHAR,
    "amount" VARCHAR,
    "bookname" VARCHAR,
    "is_consumed" BOOLEAN,

    CONSTRAINT "nf_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "nf_room_title_key" ON "nf_room"("title");

-- CreateIndex
CREATE UNIQUE INDEX "nf_user_user_email_key" ON "nf_user"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "nf_book_title_key" ON "nf_book"("title");

-- CreateIndex
CREATE UNIQUE INDEX "nf_payment_reference_key" ON "nf_payment"("reference");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- AddForeignKey
ALTER TABLE "nf_event" ADD CONSTRAINT "nf_event_userId_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nf_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nf_payment" ADD CONSTRAINT "nf_payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nf_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

