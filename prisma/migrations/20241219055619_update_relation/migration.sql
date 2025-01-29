/*
  Warnings:

  - You are about to alter the column `bussinessID` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(18)` to `VarChar(13)`.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_bussinessID_fkey`;

-- AlterTable
ALTER TABLE `personinfo` MODIFY `BusinessID` VARCHAR(13) NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `bussinessID` VARCHAR(13) NULL;

-- AddForeignKey
ALTER TABLE `personinfo` ADD CONSTRAINT `personinfo_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_bussinessID_fkey` FOREIGN KEY (`bussinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
