/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - The `id` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `studentId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `studentId` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `studentId` on the `FeeTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `studentId` on the `Grade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `faculty` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "FeeTransaction" DROP CONSTRAINT "FeeTransaction_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FeeTransaction" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "email",
ADD COLUMN     "faculty" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER;

-- AddForeignKey
ALTER TABLE "FeeTransaction" ADD CONSTRAINT "FeeTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
