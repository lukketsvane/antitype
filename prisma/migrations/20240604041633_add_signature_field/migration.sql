/*
  Warnings:

  - You are about to drop the column `image` on the `Guestbook` table. All the data in the column will be lost.
  - Added the required column `signature` to the `Guestbook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guestbook" DROP COLUMN "image",
ADD COLUMN     "signature" TEXT NOT NULL;
