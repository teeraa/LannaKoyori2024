/*
  Warnings:

  - You are about to alter the column `BusinessID` on the `personinfo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(13)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `personinfo` DROP FOREIGN KEY `personinfo_BusinessID_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_bussinessID_fkey`;

-- DropIndex
DROP INDEX `personinfo_BusinessID_fkey` ON `personinfo`;

-- DropIndex
DROP INDEX `products_bussinessID_fkey` ON `products`;

-- AlterTable
ALTER TABLE `personinfo` MODIFY `BusinessID` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `bussinessID` VARCHAR(18) NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_bussinessID_fkey` FOREIGN KEY (`bussinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
