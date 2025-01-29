/*
  Warnings:

  - The primary key for the `businessinfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID` on the `businessinfo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(13)` to `Int`.
  - You are about to alter the column `bussinessID` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(18)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_bussinessID_fkey`;

-- DropIndex
DROP INDEX `products_bussinessID_fkey` ON `products`;

-- AlterTable
ALTER TABLE `businessinfo` DROP PRIMARY KEY,
    MODIFY `ID` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID`);

-- AlterTable
ALTER TABLE `products` MODIFY `bussinessID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_bussinessID_fkey` FOREIGN KEY (`bussinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
