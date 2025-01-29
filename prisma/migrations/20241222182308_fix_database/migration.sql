/*
  Warnings:

  - Added the required column `picture` to the `businessinfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `businessinfo` ADD COLUMN `picture` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `sketch` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `consultantinfo` ADD CONSTRAINT `consultantinfo_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personinfo` ADD CONSTRAINT `personinfo_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
