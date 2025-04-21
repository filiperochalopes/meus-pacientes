-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `patient_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactPoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `system` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `patient_id` INTEGER NULL,

    UNIQUE INDEX `ContactPoint_system_value_patient_id_key`(`system`, `value`, `patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Identifier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `system` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `patient_id` INTEGER NULL,

    UNIQUE INDEX `Identifier_system_value_key`(`system`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` INTEGER NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `appointment_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `property` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Quando o paciente for deletado, os contatos também serão deletados
ALTER TABLE `Contact` 
ADD CONSTRAINT `Contact_patient_id_fkey` 
FOREIGN KEY (`patient_id`) 
REFERENCES `Patient`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Quando o paciente for deletado, os meios de contato também serão deletados
ALTER TABLE `ContactPoint` 
ADD CONSTRAINT `ContactPoint_patient_id_fkey` 
FOREIGN KEY (`patient_id`) 
REFERENCES `Patient`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Quando o paciente for deletado, os identificadores também serão deletados
ALTER TABLE `Identifier` 
ADD CONSTRAINT `Identifier_patient_id_fkey` 
FOREIGN KEY (`patient_id`) 
REFERENCES `Patient`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Quando o paciente for deletado, os agendamentos também serão deletados
ALTER TABLE `Appointment` 
ADD CONSTRAINT `Appointment_patient_id_fkey` 
FOREIGN KEY (`patient_id`) 
REFERENCES `Patient`(`id`) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
