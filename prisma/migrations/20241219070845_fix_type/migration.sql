/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(18)` to `Int`.

*/
-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);
