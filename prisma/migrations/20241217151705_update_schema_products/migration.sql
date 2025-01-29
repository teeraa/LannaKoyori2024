-- CreateTable
CREATE TABLE `businessinfo` (
    `ID` VARCHAR(13) NOT NULL,
    `DataYear` YEAR NOT NULL,
    `BusiTypeId` VARCHAR(255) NOT NULL,
    `BussinessName` VARCHAR(255) NOT NULL,
    `BussinessNameEng` VARCHAR(255) NOT NULL,
    `AddressThai` VARCHAR(255) NOT NULL,
    `AddressT` VARCHAR(255) NOT NULL,
    `TumbolT` VARCHAR(255) NOT NULL,
    `AmphurT` VARCHAR(255) NOT NULL,
    `ProvinceT` VARCHAR(255) NOT NULL,
    `ZipCodeT` VARCHAR(255) NOT NULL,
    `CountryT` VARCHAR(255) NOT NULL,
    `AddressEng` VARCHAR(255) NOT NULL,
    `AddressE` VARCHAR(255) NOT NULL,
    `TumbolE` VARCHAR(255) NOT NULL,
    `AmphurE` VARCHAR(255) NOT NULL,
    `ProvinceE` VARCHAR(255) NOT NULL,
    `ZipCodeE` VARCHAR(255) NOT NULL,
    `CountryE` VARCHAR(255) NOT NULL,
    `Latitude` FLOAT NOT NULL,
    `Longtitude` FLOAT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `businesstype` (
    `BusiTypeId` INTEGER NOT NULL,
    `BusiTypeName_TH` VARCHAR(50) NOT NULL,
    `BusiTypeName_EN` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`BusiTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultantinfo` (
    `ID` INTEGER NOT NULL,
    `BusinessID` INTEGER NULL,
    `NameThai` VARCHAR(255) NULL,
    `NameEng` VARCHAR(255) NULL,
    `gender` VARCHAR(10) NOT NULL,
    `nationality` VARCHAR(100) NOT NULL,
    `RoleThai` VARCHAR(255) NULL,
    `RoleEng` VARCHAR(255) NULL,
    `Year` YEAR NOT NULL,
    `picture` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materials` (
    `ID` VARCHAR(11) NOT NULL,
    `Material` VARCHAR(100) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personinfo` (
    `ID` INTEGER NOT NULL,
    `BusinessID` INTEGER NULL,
    `NameThai` VARCHAR(255) NULL,
    `NameEng` VARCHAR(255) NULL,
    `RoleThai` VARCHAR(255) NULL,
    `RoleEng` VARCHAR(255) NULL,
    `Position` VARCHAR(255) NULL,
    `nationality` VARCHAR(100) NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    `Institute` VARCHAR(255) NULL,
    `Contact` VARCHAR(255) NULL,
    `Year` YEAR NOT NULL,
    `picture` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `ID` VARCHAR(18) NOT NULL,
    `productName` VARCHAR(255) NULL,
    `price` INTEGER NULL,
    `mainMaterial` VARCHAR(18) NULL,
    `subMaterial1` VARCHAR(18) NULL,
    `subMaterial2` VARCHAR(18) NULL,
    `subMaterial3` VARCHAR(18) NULL,
    `bussinessID` VARCHAR(18) NULL,
    `image` VARCHAR(255) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topic` (
    `BusinessID` INTEGER NOT NULL,
    `TopicID` INTEGER NOT NULL,
    `First_TopicName` VARCHAR(255) NULL,
    `Second_TopicName` VARCHAR(255) NULL,
    `First_TopicNameEN` VARCHAR(255) NULL,
    `Second_TopicNameEN` VARCHAR(255) NULL,
    `First_TopicNameJP` VARCHAR(255) NULL,
    `Second_TopicNameJP` VARCHAR(255) NULL,

    PRIMARY KEY (`BusinessID`, `TopicID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topic_detail` (
    `BusinessID` INTEGER NOT NULL,
    `TopicID` INTEGER NOT NULL,
    `First_DescriptionTH` TEXT NULL,
    `Second_DescriptionTH` TEXT NULL,
    `First_DescriptionEN` TEXT NULL,
    `Second_DescriptionEN` TEXT NULL,
    `First_DescriptionJP` TEXT NULL,
    `Second_DescriptionJP` TEXT NULL,

    PRIMARY KEY (`BusinessID`, `TopicID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_mainMaterial_fkey` FOREIGN KEY (`mainMaterial`) REFERENCES `materials`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subMaterial1_fkey` FOREIGN KEY (`subMaterial1`) REFERENCES `materials`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subMaterial2_fkey` FOREIGN KEY (`subMaterial2`) REFERENCES `materials`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subMaterial3_fkey` FOREIGN KEY (`subMaterial3`) REFERENCES `materials`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_bussinessID_fkey` FOREIGN KEY (`bussinessID`) REFERENCES `businessinfo`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
