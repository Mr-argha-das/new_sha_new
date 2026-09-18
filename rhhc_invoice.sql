-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 07, 2026 at 12:28 PM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rhhc_invoice`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'RHHC', 1, 1, '2025-09-08 11:51:12', '2025-10-31 18:10:03'),
(3, 'Scorow Test', 1, 1, '2025-09-08 11:51:12', '2025-10-31 18:10:03');

-- --------------------------------------------------------

--
-- Table structure for table `account_settings`
--

CREATE TABLE `account_settings` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `logo` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address_lines` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bank_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `qr_scanner` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stamp` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stamp_signature` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `use_stamp_image` int DEFAULT '0' COMMENT 'which stamp image to use in invoice pdf, 0 =  only stamp, 1 =  stamp_signature image',
  `extra_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `service_type` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `account_settings`
--

INSERT INTO `account_settings` (`id`, `account_id`, `branch_id`, `name`, `logo`, `address_lines`, `mobile`, `email`, `website`, `bank_details`, `qr_scanner`, `stamp`, `stamp_signature`, `use_stamp_image`, `extra_ids`, `service_type`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'REWELLNESS HOME HEALTH CARE', '/uploads/accountSettings/1-1/logo_logo_no_bg_1766136385625.png', 'SHOP No 1 GF, DEV HOME TOWN 4, Nr. HOME TOWN 4, DHARTI NAGAR, TRAGAD ROAD, CHANDKHEDA, AHMEDABAD  382470  ', '7404084849', 'info@rewellness.co.in', NULL, '{\"bank_name\":\"CSB BANK LTD\",\"account_holder_name\":\"REWELLNESS HOME HEALTH CARE\",\"account_number\":\"083505004053195001\",\"ifsc\":\"CSBK0000835\"}', '/uploads/accountSettings/1-1/qr_scanner_qr_code_1767346038710.png', '/uploads/accountSettings/1-1/stamp_adobe_express___file_1770298065665.png', '/uploads/accountSettings/1-1/stamp_signature_2_sign_1770298065666.png', 1, '{\"PAN\":\"EUNPS6151M\",\"MSME\":\"UDYAM-GJ-01-0329764\"}', 'Nursing/Equipment', 0, 1, 1, '2025-08-29 13:29:15', '2026-06-25 14:35:30'),
(3, 3, 3, 'Scorow', '/uploads/accountSettings/3-3/logo_logo_placeholder_1770794360627.png', '626, Emporis by Poddar Realty Group, B/s. Decathlon, Visat Road, Near Tapovan Circle, Motera, Ahmedabad, Gujarat 380005', '9999999999', 'scorow@gmail.com', NULL, '{\"bank_name\":\"CSB BANK LTD\",\"account_holder_name\":\"REWELLNESS HOME HEALTH CARE\",\"account_number\":\"083505004053195001\",\"ifsc\":\"CSBK0000835\"}', '/uploads/accountSettings/3-3/qr_scanner_2_sign_1770362131486.png', '/uploads/accountSettings/3-3/stamp_adobe_express___file_1770362131485.png', NULL, 0, '{\"PAN\":\"PANNUMBER\"}', 'IT', 0, 1, 47, '2025-08-29 13:29:15', '2026-02-11 07:19:20');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `account_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `settings`, `account_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'RHHC', NULL, 1, 1, 1, '2025-09-08 11:51:48', '2025-10-31 18:11:26'),
(3, 'Scorow Test', NULL, 3, 1, 1, '2025-09-08 11:51:48', '2025-10-31 18:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `invoice_number` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `total_amount` decimal(10,4) DEFAULT NULL,
  `discount_amount` decimal(10,4) DEFAULT NULL,
  `last_invoice_due` decimal(10,4) DEFAULT NULL,
  `paid_amount` decimal(10,4) DEFAULT NULL,
  `due_amount` decimal(10,4) DEFAULT NULL,
  `other_charges` decimal(10,4) DEFAULT NULL,
  `transportation_charge` decimal(10,4) DEFAULT NULL,
  `settlement_amount` decimal(10,4) DEFAULT NULL,
  `lead_id` int NOT NULL,
  `is_deposit_counted` tinyint(1) DEFAULT '0',
  `security_deposit` decimal(10,4) DEFAULT NULL,
  `sub_total` decimal(10,4) DEFAULT NULL,
  `payment_status` enum('unpaid','partial','paid','carry-forward') COLLATE utf8mb4_general_ci DEFAULT 'unpaid',
  `invoice_status` enum('draft','published') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `notes` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `account_id`, `branch_id`, `invoice_number`, `customer_id`, `invoice_date`, `due_date`, `total_amount`, `discount_amount`, `last_invoice_due`, `paid_amount`, `due_amount`, `other_charges`, `transportation_charge`, `settlement_amount`, `lead_id`, `is_deposit_counted`, `security_deposit`, `sub_total`, `payment_status`, `invoice_status`, `notes`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(15, 3, 3, 'RH_S_P_17_12_2025_0001', 50, '2025-07-01', NULL, 510.0000, 0.0000, 0.0000, 510.0000, 0.0000, 0.0000, 0.0000, NULL, 13, 0, NULL, 510.0000, 'carry-forward', 'published', 'qwerwq', 0, 47, 47, '2025-12-17 13:38:29', '2025-12-18 05:33:37'),
(16, 3, 3, 'RH_S_P_18_12_2025_0002', 50, '2025-07-10', NULL, -4080.0000, 0.0000, 410.0000, -4080.0000, 0.0000, 0.0000, 0.0000, -4080.0000, 13, 1, 5000.0000, 920.0000, 'paid', 'published', NULL, 0, 47, 47, '2025-12-18 05:33:37', '2025-12-18 05:33:37'),
(17, 1, 1, 'RH_S_19_12_2025_0001', 55, '2025-12-01', NULL, 1000.0000, 0.0000, 0.0000, 1000.0000, 0.0000, 0.0000, 0.0000, NULL, 14, 0, NULL, 1000.0000, 'carry-forward', 'published', NULL, 1, 1, 1, '2025-12-19 09:51:37', '2026-02-13 13:20:37'),
(18, 1, 1, 'RH_S_20_12_2025_0002', 55, '2025-12-02', NULL, 1500.0000, 0.0000, 500.0000, 1500.0000, 0.0000, 0.0000, 0.0000, NULL, 14, 0, NULL, 1500.0000, 'paid', 'published', '', 1, 1, 1, '2025-12-20 08:41:01', '2026-02-13 13:20:37'),
(19, 1, 1, 'RH_S_P_02_01_2026_0003', 57, '2026-01-02', NULL, 1100.0000, 0.0000, 0.0000, 1100.0000, 0.0000, 0.0000, 0.0000, NULL, 16, 0, NULL, 1100.0000, 'paid', 'published', '', 1, 1, 1, '2026-01-02 09:13:53', '2026-02-13 13:20:26'),
(20, 1, 1, 'RH_S_02_01_2026_0004', 55, '2026-01-02', NULL, 1000.0000, 0.0000, 0.0000, 0.0000, 1000.0000, 0.0000, 0.0000, NULL, 14, 0, NULL, 1000.0000, 'unpaid', 'published', '', 1, 1, 1, '2026-01-02 09:20:18', '2026-02-13 13:20:37'),
(21, 3, 3, 'RH_S_P_06_02_2026_0003', 50, '2026-02-01', NULL, 3410.0000, 0.0000, 0.0000, 0.0000, 3410.0000, 0.0000, 0.0000, NULL, 18, 0, NULL, 3410.0000, 'unpaid', 'published', NULL, 0, 47, NULL, '2026-02-06 09:22:04', '2026-02-06 09:22:04'),
(22, 3, 3, 'RH_S_P_10_02_2026_0004', 66, '2026-02-01', NULL, 1860.0000, 0.0000, 0.0000, 0.0000, 1860.0000, 0.0000, 0.0000, NULL, 19, 0, NULL, 1860.0000, 'partial', 'published', NULL, 1, 47, 47, '2026-02-10 11:50:21', '2026-02-10 12:11:50'),
(23, 3, 3, 'RH_S_P_10_02_2026_0005', 66, '2026-02-01', NULL, 2160.0000, 0.0000, 0.0000, 2160.0000, 0.0000, 200.0000, 100.0000, NULL, 19, 0, NULL, 2160.0000, 'carry-forward', 'published', NULL, 0, 47, 47, '2026-02-10 12:30:52', '2026-02-10 12:32:48'),
(24, 3, 3, 'RH_S_P_10_02_2026_0006', 66, '2026-02-10', NULL, 2540.0000, 0.0000, 2160.0000, 2540.0000, 0.0000, 0.0000, 0.0000, NULL, 19, 1, 100.0000, 2640.0000, 'paid', 'published', NULL, 0, 47, 47, '2026-02-10 12:32:48', '2026-02-10 12:32:48'),
(25, 1, 1, 'RH_S_P_11_02_2026_0005', 70, '2026-02-10', NULL, 1890.0000, 10.0000, 0.0000, 1890.0000, 0.0000, 0.0000, 100.0000, NULL, 20, 0, NULL, 1890.0000, 'carry-forward', 'published', NULL, 1, 1, 1, '2026-02-11 08:01:09', '2026-02-13 13:20:10'),
(26, 1, 1, 'RH_S_P_11_02_2026_0006', 70, '2026-02-11', NULL, 1700.0000, 0.0000, 1600.0000, 1700.0000, 0.0000, 0.0000, 0.0000, NULL, 20, 1, 100.0000, 1800.0000, 'paid', 'published', NULL, 1, 1, 1, '2026-02-11 08:11:14', '2026-02-13 13:20:10'),
(27, 1, 1, 'RH_S_18_02_2026_0007', 78, '2026-02-10', NULL, 120.0000, 200.0000, 0.0000, 100.0000, 20.0000, 100.0000, 10.0000, NULL, 25, 0, NULL, 120.0000, 'partial', 'published', NULL, 1, 1, 1, '2026-02-18 08:39:44', '2026-03-13 15:58:22'),
(28, 3, 3, 'RH_S_P_13_03_2026_0007', 64, '2026-03-11', NULL, 7220.0000, 0.0000, 0.0000, 0.0000, 7220.0000, 0.0000, 0.0000, NULL, 26, 0, NULL, 7220.0000, 'partial', 'published', NULL, 0, 47, 47, '2026-03-13 07:11:22', '2026-03-13 07:50:21'),
(29, 3, 3, 'RH_S_P_13_03_2026_0008', 64, '2026-03-12', NULL, 10830.0000, 0.0000, 7220.0000, 0.0000, 10830.0000, 0.0000, 0.0000, NULL, 26, 0, NULL, 10830.0000, 'unpaid', 'draft', NULL, 1, 47, 47, '2026-03-13 07:30:04', '2026-03-13 07:50:21'),
(30, 1, 1, 'RH_S_13_03_2026_0008', 94, '2026-03-13', NULL, 1999.6800, 0.0000, 0.0000, 1999.6800, 0.0000, 0.0000, 0.0000, NULL, 35, 0, NULL, 1999.6800, 'paid', 'published', NULL, 1, 1, 1, '2026-03-13 19:21:19', '2026-03-13 19:45:17'),
(31, 1, 1, 'RH_S_13_03_2026_0009', 94, '2026-03-13', NULL, 1999.6800, 0.0000, 0.0000, 1999.6800, 0.0000, 0.0000, 0.0000, NULL, 35, 0, NULL, 1999.6800, 'paid', 'published', NULL, 1, 1, 1, '2026-03-13 19:21:43', '2026-03-13 19:45:17'),
(33, 1, 1, 'RH_S_23_03_2026_0010', 96, '2026-03-22', NULL, 5000.0000, 1000.0000, 0.0000, 0.0000, 5000.0000, 0.0000, 0.0000, NULL, 37, 0, NULL, 5000.0000, 'unpaid', 'published', 'Include attendar charges', 1, 1, 1, '2026-03-23 21:02:09', '2026-03-23 21:13:16'),
(34, 1, 1, 'RH_S_23_03_2026_0011', 101, '2026-03-22', NULL, 5000.0000, 700.0000, 0.0000, 5000.0000, 0.0000, 0.0000, 0.0000, NULL, 38, 0, NULL, 5000.0000, 'paid', 'published', NULL, 1, 1, 1, '2026-03-23 21:36:47', '2026-06-17 16:29:35'),
(35, 1, 1, 'RH_S_19_05_2026_0012', 103, '2026-05-21', NULL, 7510.2400, 0.0000, 0.0000, 7510.2400, 0.0000, 0.0000, 10.0000, NULL, 44, 0, NULL, 7510.2400, 'carry-forward', 'published', NULL, 1, 1, 1, '2026-05-19 07:44:55', '2026-05-19 19:13:53'),
(36, 1, 1, 'RH_S_19_05_2026_0013', 103, '2026-05-25', NULL, 17535.5400, 0.0000, 7410.2400, 17535.5400, 0.0000, 0.0000, 0.0000, NULL, 44, 0, NULL, 17535.5400, 'carry-forward', 'published', NULL, 1, 1, 1, '2026-05-19 07:48:54', '2026-05-19 19:13:53'),
(37, 1, 1, 'RH_S_19_05_2026_0014', 103, '2026-05-30', NULL, 30119.2600, 0.0000, 17535.5400, 30119.2600, 0.0000, 0.0000, 0.0000, NULL, 44, 0, NULL, 30119.2600, 'carry-forward', 'published', NULL, 1, 1, 1, '2026-05-19 07:49:43', '2026-05-19 19:13:53'),
(40, 1, 1, 'RH_S_19_05_2026_0015', 103, '2026-06-01', NULL, 35019.4200, 0.0000, 30119.2600, 35019.4200, 0.0000, 0.0000, 0.0000, NULL, 44, 1, 100.0000, 35119.4200, 'paid', 'published', NULL, 1, 1, 1, '2026-05-19 07:50:54', '2026-05-19 19:13:53'),
(41, 3, 3, 'RH_S_P_19_05_2026_0009', 105, '2026-05-08', NULL, 14430.0000, 0.0000, 0.0000, 14430.0000, 0.0000, 0.0000, 0.0000, NULL, 47, 0, NULL, 14430.0000, 'paid', 'published', '', 0, 47, 47, '2026-05-19 12:08:07', '2026-07-01 10:13:17'),
(42, 1, 1, 'RH_S_13_06_2026_0016', 93, '2026-03-31', NULL, 77502.4800, 0.0000, 0.0000, 77502.4800, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 77502.4800, 'paid', 'published', NULL, 0, 1, 1, '2026-06-13 15:04:39', '2026-06-13 15:04:39'),
(43, 1, 1, 'RH_S_17_06_2026_0017', 93, '2026-04-30', NULL, 74999.9500, 0.0000, 0.0000, 74999.9500, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 74999.9500, 'paid', 'published', NULL, 0, 1, 1, '2026-06-17 15:42:37', '2026-06-17 15:42:37'),
(44, 1, 1, 'RH_S_17_06_2026_0018', 93, '2026-05-31', NULL, 77499.9500, 0.0000, 0.0000, 77499.9500, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 77499.9500, 'paid', 'published', NULL, 0, 1, 1, '2026-06-17 15:45:12', '2026-06-17 15:45:12'),
(45, 3, 3, 'RH_S_24_06_2026_0010', 80, '2026-06-30', NULL, 8400.0000, 0.0000, 0.0000, 0.0000, 8400.0000, 0.0000, 0.0000, NULL, 50, 0, NULL, 8400.0000, 'unpaid', 'draft', NULL, 0, 47, NULL, '2026-06-24 12:14:54', '2026-06-24 12:14:54'),
(46, 1, 1, 'RH_S_P_25_06_2026_0019', 111, '2026-06-30', NULL, 155880.0000, 0.0000, 0.0000, 0.0000, 155880.0000, 0.0000, 0.0000, NULL, 51, 0, NULL, 155880.0000, 'unpaid', 'draft', NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(47, 1, 1, 'RH_S_P_25_06_2026_0020', 111, '2026-06-30', NULL, 112480.0000, 0.0000, 0.0000, 0.0000, 112480.0000, 0.0000, 0.0000, NULL, 51, 0, NULL, 112479.9000, 'unpaid', 'draft', NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(48, 1, 1, 'RH_S_P_25_06_2026_0021', 111, '2026-06-30', NULL, 112480.0000, 0.0000, 0.0000, 0.0000, 112480.0000, 0.0000, 0.0000, NULL, 51, 0, NULL, 112479.8800, 'unpaid', 'published', '', 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(49, 1, 1, 'RH_S_P_26_06_2026_0022', 111, '2026-06-09', NULL, 50800.0000, 0.0000, 0.0000, 0.0000, 50800.0000, 0.0000, 0.0000, NULL, 52, 0, NULL, 50800.0000, 'unpaid', 'draft', NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(50, 1, 1, 'RH_S_27_06_2026_0023', 93, '2026-06-30', NULL, 75002.0000, 0.0000, 0.0000, 75002.0000, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 75002.4000, 'paid', 'published', NULL, 1, 1, 1, '2026-06-27 06:54:19', '2026-06-27 06:54:19'),
(51, 1, 1, 'RH_P_27_06_2026_0024', 112, '2026-06-30', NULL, 1500.0000, 0.0000, 0.0000, 1500.0000, 0.0000, 0.0000, 0.0000, NULL, 53, 0, NULL, 1500.0000, 'carry-forward', 'published', NULL, 0, 1, 1, '2026-06-27 07:33:44', '2026-07-31 09:57:33'),
(52, 1, 1, 'RH_S_P_30_06_2026_0025', 93, '2026-06-30', NULL, 81303.0000, 0.0000, 0.0000, 0.0000, 81303.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 81302.5600, 'unpaid', 'published', NULL, 1, 1, 1, '2026-06-30 16:57:47', '2026-06-30 17:09:32'),
(53, 1, 1, 'RH_S_P_30_06_2026_0026', 93, '2026-06-30', NULL, 78802.0000, 0.0000, 0.0000, 0.0000, 78802.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 78802.4800, 'unpaid', 'published', '', 1, 1, 1, '2026-06-30 17:23:21', '2026-06-30 17:25:57'),
(54, 1, 1, 'RH_S_P_30_06_2026_0027', 93, '2026-06-30', NULL, 78952.0000, 0.0000, 0.0000, 0.0000, 78952.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 78952.4800, 'unpaid', 'published', NULL, 1, 1, 1, '2026-06-30 17:27:27', '2026-06-30 17:33:06'),
(55, 1, 1, 'RH_S_P_30_06_2026_0028', 93, '2026-06-30', NULL, 78802.0000, 0.0000, 0.0000, 0.0000, 78802.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 78802.4800, 'unpaid', 'published', NULL, 1, 1, 1, '2026-06-30 17:34:44', '2026-06-30 17:37:17'),
(56, 1, 1, 'RH_S_P_30_06_2026_0029', 93, '2026-06-30', NULL, 78802.0000, 0.0000, 0.0000, 0.0000, 78802.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 78802.4800, 'unpaid', 'published', NULL, 1, 1, 1, '2026-06-30 17:39:38', '2026-06-30 18:47:13'),
(57, 1, 1, 'RH_S_P_30_06_2026_0030', 111, '2026-06-30', NULL, 107300.0000, 0.0000, 0.0000, 107300.0000, 0.0000, 0.0000, 2000.0000, NULL, 52, 0, NULL, 107300.0000, 'carry-forward', 'published', NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-07-19 08:03:40'),
(58, 1, 1, 'RH_S_P_30_06_2026_0031', 93, '2026-06-30', NULL, 81303.0000, 0.0000, 0.0000, 81303.0000, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 81302.5600, 'paid', 'published', NULL, 0, 1, 1, '2026-06-30 18:49:24', '2026-07-04 16:07:04'),
(59, 1, 1, 'RH_P_19_07_2026_0032', 111, '2026-07-17', NULL, 2300.0000, 9950.0000, 52300.0000, 2300.0000, 0.0000, 0.0000, 0.0000, NULL, 52, 1, 50000.0000, 52300.0000, 'paid', 'published', NULL, 0, 1, 1, '2026-07-19 08:03:40', '2026-07-19 08:03:40'),
(60, 1, 1, 'RH_S_19_07_2026_0033', 113, '2026-07-20', NULL, 46500.0000, 0.0000, 0.0000, 46500.0000, 0.0000, 0.0000, 0.0000, NULL, 54, 0, NULL, 46500.0000, 'paid', 'published', '', 0, 1, 1, '2026-07-19 08:07:36', '2026-07-31 09:51:10'),
(61, 3, 3, 'RH_S_30_07_2026_0011', 105, '2026-07-30', NULL, 2400.0000, 0.0000, 0.0000, 0.0000, 2400.0000, 0.0000, 0.0000, NULL, 45, 0, NULL, 2400.0000, 'unpaid', 'draft', NULL, 0, 47, NULL, '2026-07-30 04:56:57', '2026-07-30 04:56:57'),
(62, 1, 1, 'RH_S_P_31_07_2026_0034', 93, '2026-07-31', NULL, 78432.0000, 0.0000, 0.0000, 78432.0000, 0.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 78432.4800, 'paid', 'published', NULL, 0, 1, 1, '2026-07-31 09:50:39', '2026-09-01 09:20:27'),
(63, 1, 1, 'RH_P_31_07_2026_0035', 112, '2026-07-31', NULL, 3050.0000, 0.0000, 1500.0000, 3050.0000, 0.0000, 0.0000, 0.0000, NULL, 53, 0, NULL, 3050.0000, 'carry-forward', 'published', '', 0, 1, 1, '2026-07-31 09:57:05', '2026-09-01 14:35:58'),
(64, 1, 1, 'RH_S_P_01_09_2026_0036', 93, '2026-08-31', NULL, 79683.0000, 0.0000, 0.0000, 0.0000, 79683.0000, 0.0000, 0.0000, NULL, 34, 0, NULL, 79682.5200, 'unpaid', 'published', NULL, 0, 1, NULL, '2026-09-01 14:34:47', '2026-09-01 14:34:47'),
(65, 1, 1, 'RH_P_01_09_2026_0037', 112, '2026-08-31', NULL, 4600.0000, 0.0000, 3050.0000, 0.0000, 4600.0000, 0.0000, 0.0000, NULL, 53, 0, NULL, 4600.0000, 'unpaid', 'published', NULL, 0, 1, NULL, '2026-09-01 14:35:58', '2026-09-01 14:35:58');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_carry_forward`
--

CREATE TABLE `invoice_carry_forward` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `from_invoice_id` int NOT NULL,
  `to_invoice_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `lead_id` int NOT NULL,
  `amount` decimal(10,4) NOT NULL,
  `status` enum('pending','applied','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `is_deleted` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_carry_forward`
--

INSERT INTO `invoice_carry_forward` (`id`, `account_id`, `branch_id`, `from_invoice_id`, `to_invoice_id`, `customer_id`, `lead_id`, `amount`, `status`, `created_by`, `updated_by`, `is_deleted`, `created_at`, `updated_at`) VALUES
(5, 3, 3, 15, 16, 50, 13, 410.0000, 'pending', 47, NULL, 0, '2025-12-18 05:33:37', '2025-12-18 05:33:37'),
(6, 1, 1, 17, 18, 55, 14, 500.0000, 'pending', 1, NULL, 0, '2025-12-20 08:41:01', '2025-12-20 08:41:00'),
(7, 3, 3, 23, 24, 66, 19, 2160.0000, 'pending', 47, NULL, 0, '2026-02-10 12:32:48', '2026-02-10 12:32:48'),
(8, 1, 1, 25, 26, 70, 20, 1600.0000, 'pending', 1, NULL, 0, '2026-02-11 08:11:14', '2026-02-11 08:11:13'),
(9, 3, 3, 28, 29, 64, 26, 7220.0000, 'pending', 47, NULL, 1, '2026-03-13 07:30:04', '2026-03-13 07:50:20'),
(10, 1, 1, 35, 36, 103, 44, 7410.2400, 'pending', 1, NULL, 0, '2026-05-19 07:48:54', '2026-05-19 07:48:54'),
(11, 1, 1, 36, 37, 103, 44, 17535.5400, 'pending', 1, NULL, 0, '2026-05-19 07:49:43', '2026-05-19 07:49:43'),
(14, 1, 1, 37, 40, 103, 44, 30119.2600, 'pending', 1, NULL, 0, '2026-05-19 07:50:54', '2026-05-19 07:50:53'),
(15, 1, 1, 57, 59, 111, 52, 52300.0000, 'pending', 1, NULL, 0, '2026-07-19 08:03:40', '2026-07-19 08:03:39'),
(16, 1, 1, 51, 63, 112, 53, 1500.0000, 'pending', 1, NULL, 0, '2026-07-31 09:57:05', '2026-07-31 09:57:04'),
(17, 1, 1, 63, 65, 112, 53, 3050.0000, 'pending', 1, NULL, 0, '2026-09-01 14:35:58', '2026-09-01 14:35:57');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `item_type` enum('product','service','payslip') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deal_type` enum('rent','sell') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `days` int DEFAULT NULL,
  `unit_price` decimal(10,4) DEFAULT NULL,
  `hours_per_day` decimal(10,4) DEFAULT NULL COMMENT 'Per day hours for service/product used in service',
  `notes` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `account_id`, `branch_id`, `item_type`, `deal_type`, `item_id`, `item_name`, `quantity`, `days`, `unit_price`, `hours_per_day`, `notes`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(15, 15, 3, 3, 'service', NULL, '7', 's1', 10, NULL, 50.0000, NULL, 'saasd', 0, 47, 47, '2025-12-17 13:38:29', '2025-12-17 13:38:28'),
(16, 15, 3, 3, 'product', 'rent', '5', 'p2', 1, NULL, 10.0000, NULL, NULL, 0, 47, 47, '2025-12-17 13:38:29', '2025-12-17 13:38:28'),
(17, 16, 3, 3, 'service', NULL, '7', 's1', 10, NULL, 50.0000, NULL, 'saasd', 0, 47, 47, '2025-12-18 05:33:37', '2025-12-18 05:33:37'),
(18, 16, 3, 3, 'product', 'rent', '5', 'p2', 1, NULL, 10.0000, NULL, NULL, 0, 47, 47, '2025-12-18 05:33:37', '2025-12-18 05:33:37'),
(19, 17, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 10, NULL, 100.0000, NULL, NULL, 1, 1, 1, '2025-12-19 09:51:37', '2026-02-13 13:20:37'),
(20, 18, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 10, NULL, 100.0000, NULL, NULL, 1, 1, 1, '2025-12-20 08:41:01', '2026-02-13 13:20:37'),
(21, 19, 1, 1, 'product', 'rent', '6', '3 FUNCTION BED', 1, NULL, 100.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:13:53', '2026-02-13 13:20:26'),
(22, 19, 1, 1, 'service', NULL, '12', 'Baby Care', 1, NULL, 1000.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:13:53', '2026-02-13 13:20:26'),
(23, 20, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 10, NULL, 100.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:20:18', '2026-02-13 13:20:37'),
(24, 21, 3, 3, 'service', NULL, '8', 's2', 1, 31, 100.0000, NULL, NULL, 0, 47, 47, '2026-02-06 09:22:04', '2026-02-06 09:22:04'),
(25, 21, 3, 3, 'product', 'rent', '5', 'p2', 1, 31, 10.0000, NULL, NULL, 0, 47, 47, '2026-02-06 09:22:04', '2026-02-06 09:22:04'),
(26, 22, 3, 3, 'service', NULL, '7', 's1', 1, 31, 50.0000, NULL, NULL, 1, 47, 47, '2026-02-10 11:50:21', '2026-02-10 12:11:50'),
(27, 22, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 31, 10.0000, NULL, NULL, 1, 47, 47, '2026-02-10 11:50:21', '2026-02-10 12:11:50'),
(28, 23, 3, 3, 'service', NULL, '7', 's1', 1, 31, 50.0000, NULL, NULL, 0, 47, 47, '2026-02-10 12:30:52', '2026-02-10 12:30:52'),
(29, 23, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 31, 10.0000, NULL, NULL, 0, 47, 47, '2026-02-10 12:30:52', '2026-02-10 12:30:52'),
(30, 24, 3, 3, 'service', NULL, '7', 's1', 1, 8, 50.0000, NULL, NULL, 0, 47, 47, '2026-02-10 12:32:48', '2026-02-10 12:32:48'),
(31, 24, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 8, 10.0000, NULL, NULL, 0, 47, 47, '2026-02-10 12:32:48', '2026-02-10 12:32:48'),
(32, 25, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 1, 9, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 08:01:09', '2026-02-13 13:20:10'),
(33, 25, 1, 1, 'product', 'rent', '6', '3 FUNCTION BED', 1, 9, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 08:01:09', '2026-02-13 13:20:10'),
(34, 26, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 1, 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 08:11:14', '2026-02-13 13:20:10'),
(35, 26, 1, 1, 'product', 'rent', '6', '3 FUNCTION BED', 1, 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 08:11:14', '2026-02-13 13:20:10'),
(36, 27, 1, 1, 'service', NULL, '13', 'Attendant', 1, 5, 42.0000, NULL, NULL, 1, 1, 1, '2026-02-18 08:39:44', '2026-03-13 15:58:22'),
(37, 28, 3, 3, 'service', NULL, '7', 's1', 1, 2, 50.0000, 24.0000, NULL, 0, 47, 47, '2026-03-13 07:11:22', '2026-03-13 07:11:21'),
(38, 28, 3, 3, 'service', NULL, '8', 's2', 1, 2, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-03-13 07:11:22', '2026-03-13 07:11:21'),
(39, 28, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 2, 10.0000, 1.0000, NULL, 0, 47, 47, '2026-03-13 07:11:22', '2026-03-13 07:11:21'),
(40, 29, 3, 3, 'service', NULL, '7', 's1', 1, 1, 50.0000, 24.0000, NULL, 1, 47, 47, '2026-03-13 07:30:04', '2026-03-13 07:50:21'),
(41, 29, 3, 3, 'service', NULL, '8', 's2', 1, 1, 100.0000, 24.0000, NULL, 1, 47, 47, '2026-03-13 07:30:04', '2026-03-13 07:50:21'),
(42, 29, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 1, 10.0000, 1.0000, NULL, 1, 47, 47, '2026-03-13 07:30:04', '2026-03-13 07:50:21'),
(43, 30, 1, 1, 'service', NULL, '13', 'Attendant', 1, 2, 41.6600, 24.0000, NULL, 1, 1, 1, '2026-03-13 19:21:19', '2026-03-13 19:45:17'),
(44, 31, 1, 1, 'service', NULL, '13', 'Attendant', 1, 2, 41.6600, 24.0000, NULL, 1, 1, 1, '2026-03-13 19:21:43', '2026-03-13 19:45:17'),
(46, 33, 1, 1, 'service', NULL, '10', 'Nursing', 1, 2, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-03-23 21:02:09', '2026-03-23 21:13:16'),
(47, 34, 1, 1, 'service', NULL, '10', 'Nursing', 1, 2, 125.0000, 12.0000, 'well trend ICU staff', 1, 1, 1, '2026-03-23 21:36:47', '2026-06-17 16:29:35'),
(48, 34, 1, 1, 'service', NULL, '14', 'Nursing 2', 1, 1, 125.0000, 12.0000, NULL, 1, 1, 1, '2026-03-23 21:36:47', '2026-06-17 16:29:35'),
(49, 34, 1, 1, 'service', NULL, '13', 'Attendant', 1, 1, 50.0000, 24.0000, NULL, 1, 1, 1, '2026-03-23 21:36:47', '2026-06-17 16:29:35'),
(50, 35, 1, 1, 'service', NULL, '10', 'Nursing', 1, 3, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-05-19 07:44:55', '2026-05-19 19:13:53'),
(51, 36, 1, 1, 'service', NULL, '10', 'Nursing', 1, 4, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-05-19 07:48:54', '2026-05-19 19:13:53'),
(52, 36, 1, 1, 'service', NULL, '13', 'Attendant', 1, 3, 41.6600, 1.0000, NULL, 1, 1, 1, '2026-05-19 07:48:54', '2026-05-19 19:13:53'),
(53, 37, 1, 1, 'service', NULL, '10', 'Nursing', 1, 5, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-05-19 07:49:43', '2026-05-19 19:13:53'),
(54, 37, 1, 1, 'service', NULL, '13', 'Attendant', 1, 2, 41.6600, 1.0000, NULL, 1, 1, 1, '2026-05-19 07:49:43', '2026-05-19 19:13:53'),
(55, 40, 1, 1, 'service', NULL, '10', 'Nursing', 1, 2, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-05-19 07:50:54', '2026-05-19 19:13:53'),
(56, 41, 3, 3, 'service', NULL, '8', 's2', 1, 6, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-05-19 12:08:07', '2026-05-19 12:08:07'),
(57, 41, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 3, 10.0000, 1.0000, NULL, 0, 47, 47, '2026-05-19 12:08:07', '2026-05-19 12:08:07'),
(58, 42, 1, 1, 'service', NULL, '10', 'Nursing', 1, 31, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-06-13 15:04:39', '2026-06-13 15:04:38'),
(59, 43, 1, 1, 'service', NULL, '10', 'Nursing', 1, 30, 104.1666, 24.0000, NULL, 0, 1, 1, '2026-06-17 15:42:37', '2026-06-17 15:42:37'),
(60, 44, 1, 1, 'service', NULL, '10', 'Nursing', 1, 31, 104.1666, 24.0000, NULL, 0, 1, 1, '2026-06-17 15:45:12', '2026-06-17 15:45:11'),
(61, 45, 3, 3, 'service', NULL, '7', 's1', 1, 7, 50.0000, 24.0000, 'afaff', 0, 47, 47, '2026-06-24 12:14:54', '2026-06-24 12:14:53'),
(62, 46, 1, 1, 'service', NULL, '10', 'Nursing', 1, 16, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(63, 46, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 31, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(64, 46, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 31, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(65, 46, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 31, 700.0000, 2.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(66, 46, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 31, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(67, 46, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 31, 50.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:40:35', '2026-06-25 14:39:51'),
(68, 47, 1, 1, 'service', NULL, '10', 'Nursing', 1, 16, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(69, 47, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 31, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(70, 47, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 31, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(71, 47, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 31, 29.1666, 24.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(72, 47, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 31, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(73, 47, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 31, 50.0000, 1.0000, NULL, 1, 1, 1, '2026-06-25 13:59:10', '2026-06-25 14:39:51'),
(74, 48, 1, 1, 'service', NULL, '10', 'Nursing', 1, 16, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(75, 48, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 31, 6.2500, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(76, 48, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 31, 7.5000, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(77, 48, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 31, 29.1666, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(78, 48, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 31, 6.2500, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(79, 48, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 31, 2.0833, 24.0000, NULL, 1, 1, 1, '2026-06-25 14:05:00', '2026-06-25 14:39:51'),
(80, 49, 1, 1, 'service', NULL, '10', 'Nursing', 1, 10, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(81, 49, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 10, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(82, 49, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 10, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(83, 49, 1, 1, 'product', 'rent', '23', 'Nimbus Air Bed ', 2, 10, 700.0000, 1.0000, NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(84, 49, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 10, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(85, 49, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 10, 50.0000, 1.0000, 'MONTHLY COUNT', 1, 1, 1, '2026-06-26 04:26:29', '2026-06-26 04:26:39'),
(86, 50, 1, 1, 'service', NULL, '10', 'Nursing', 1, 30, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-27 06:54:19', '2026-06-27 06:54:18'),
(87, 51, 1, 1, 'product', 'rent', '10', 'Suction Machine', 1, 30, 50.0000, 1.0000, NULL, 0, 1, 1, '2026-06-27 07:33:44', '2026-06-27 07:33:44'),
(88, 52, 1, 1, 'service', NULL, '10', 'Nursing', 1, 12, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 16:57:48', '2026-06-30 17:09:32'),
(89, 52, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 1, 0.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 16:57:48', '2026-06-30 17:09:32'),
(90, 52, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 20, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 16:57:48', '2026-06-30 17:09:32'),
(91, 52, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 16:57:48', '2026-06-30 17:09:32'),
(92, 52, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 16:57:48', '2026-06-30 17:09:32'),
(93, 53, 1, 1, 'service', NULL, '10', 'Nursing', 1, 10, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:23:21', '2026-06-30 17:25:57'),
(94, 53, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 20, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:23:21', '2026-06-30 17:25:57'),
(95, 53, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:23:21', '2026-06-30 17:25:57'),
(96, 53, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:23:21', '2026-06-30 17:25:57'),
(97, 54, 1, 1, 'service', NULL, '10', 'Nursing', 1, 11, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:27:27', '2026-06-30 17:33:06'),
(98, 54, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 20, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:27:27', '2026-06-30 17:33:06'),
(99, 54, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:27:27', '2026-06-30 17:33:06'),
(100, 54, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:27:27', '2026-06-30 17:33:06'),
(101, 55, 1, 1, 'service', NULL, '10', 'Nursing', 1, 10, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:34:44', '2026-06-30 17:37:17'),
(102, 55, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 20, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:34:44', '2026-06-30 17:37:17'),
(103, 55, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:34:44', '2026-06-30 17:37:17'),
(104, 55, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:34:44', '2026-06-30 17:37:17'),
(105, 56, 1, 1, 'service', NULL, '10', 'Nursing', 1, 10, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:39:38', '2026-06-30 18:47:13'),
(106, 56, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 21, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 17:39:38', '2026-06-30 18:47:13'),
(107, 56, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:39:38', '2026-06-30 18:47:13'),
(108, 56, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 17:39:38', '2026-06-30 18:47:13'),
(109, 57, 1, 1, 'service', NULL, '10', 'Nursing', 1, 16, 125.0000, 24.0000, NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(110, 57, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 31, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(111, 57, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 30, 180.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(112, 57, 1, 1, 'product', 'rent', '23', 'Nimbus Air Bed ', 2, 26, 700.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(113, 57, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 31, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(114, 57, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 31, 50.0000, 1.0000, 'MONTHLY COUNT', 0, 1, 1, '2026-06-30 18:31:19', '2026-06-30 18:31:19'),
(115, 58, 1, 1, 'service', NULL, '10', 'Nursing', 1, 12, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-06-30 18:49:24', '2026-06-30 18:49:23'),
(116, 58, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 20, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-06-30 18:49:24', '2026-06-30 18:49:23'),
(117, 58, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30, 30.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:49:24', '2026-06-30 18:49:23'),
(118, 58, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 1, 400.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 18:49:24', '2026-06-30 18:49:23'),
(119, 59, 1, 1, 'product', 'rent', '11', 'A 2 Function Manual ABS Panels', 1, 17, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-19 08:03:40', '2026-07-19 08:03:39'),
(120, 59, 1, 1, 'product', 'rent', '11', 'A 2 Function Manual ABS Panels', 1, 17, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-19 08:03:40', '2026-07-19 08:03:39'),
(121, 59, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 17, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-19 08:03:40', '2026-07-19 08:03:39'),
(122, 60, 1, 1, 'service', NULL, '10', 'Nursing', 1, 31, 125.0000, 12.0000, NULL, 0, 1, 1, '2026-07-19 08:07:36', '2026-07-19 08:07:35'),
(123, 61, 3, 3, 'service', NULL, '8', 's2', 1, 1, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-07-30 04:56:57', '2026-07-30 04:56:57'),
(124, 62, 1, 1, 'service', NULL, '10', 'Nursing', 1, 13, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-07-31 09:50:39', '2026-07-31 09:50:39'),
(125, 62, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 18, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-07-31 09:50:39', '2026-07-31 09:50:39'),
(126, 62, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 31, 30.0000, 1.0000, NULL, 0, 1, 1, '2026-07-31 09:50:39', '2026-07-31 09:50:39'),
(127, 63, 1, 1, 'product', 'rent', '10', 'Suction Machine', 1, 31, 50.0000, 1.0000, NULL, 0, 1, 1, '2026-07-31 09:57:05', '2026-07-31 09:57:04'),
(128, 64, 1, 1, 'service', NULL, '10', 'Nursing', 1, 30, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-09-01 14:34:47', '2026-09-01 14:34:47'),
(129, 64, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 31, 30.0000, 1.0000, NULL, 0, 1, 1, '2026-09-01 14:34:47', '2026-09-01 14:34:47'),
(130, 64, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 1, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-09-01 14:34:47', '2026-09-01 14:34:47'),
(131, 65, 1, 1, 'product', 'rent', '10', 'Suction Machine', 1, 31, 50.0000, 1.0000, NULL, 0, 1, 1, '2026-09-01 14:35:58', '2026-09-01 14:35:57');

-- --------------------------------------------------------

--
-- Table structure for table `lead_generate`
--

CREATE TABLE `lead_generate` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `lead_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `security_deposit` decimal(10,4) DEFAULT '0.0000',
  `status` enum('draft','finalised','invalid','onhold') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `lead_status` enum('created','inProgress','productReturnPending','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` longtext COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_generate`
--

INSERT INTO `lead_generate` (`id`, `account_id`, `branch_id`, `customer_id`, `lead_name`, `start_date`, `end_date`, `security_deposit`, `status`, `lead_status`, `notes`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(13, 3, 3, 50, 'L2 OM', '2002-12-01', '2003-12-17', 5000.0000, 'finalised', 'completed', 'ada', 0, 47, 47, '2025-12-17 12:48:35', '2025-12-18 05:33:37'),
(14, 1, 1, 55, 'BHARAT', '2025-12-01', '2025-12-18', 0.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2025-12-19 06:44:51', '2026-02-13 13:20:37'),
(15, 1, 1, 57, 'Baby care', '2026-01-01', '2026-06-30', 1000.0000, 'finalised', 'created', 'baby care taker', 1, 1, 1, '2026-01-02 09:02:03', '2026-02-13 13:20:32'),
(16, 1, 1, 57, 'Baby care taker', '2026-01-01', '2026-04-30', 0.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-01-02 09:12:07', '2026-02-13 13:20:26'),
(17, 3, 3, 50, '6-2 l1', '2026-01-01', '2026-02-28', 100.0000, 'finalised', 'created', NULL, 0, 47, NULL, '2026-02-06 07:06:07', '2026-02-06 07:06:06'),
(18, 3, 3, 50, '06 -2 l2', '2026-01-01', '2026-02-28', 100.0000, 'finalised', 'inProgress', NULL, 0, 47, 47, '2026-02-06 07:36:00', '2026-02-06 09:22:04'),
(19, 3, 3, 66, '10-2-l1', '2026-01-01', '2026-04-30', 100.0000, 'finalised', 'completed', 'direct finalized ', 0, 47, 47, '2026-02-10 11:39:54', '2026-02-10 12:36:19'),
(20, 1, 1, 70, '11-2-c1', '2026-02-01', '2026-03-31', 100.0000, 'finalised', 'completed', NULL, 1, 1, 1, '2026-02-11 07:56:58', '2026-02-13 13:20:10'),
(21, 1, 1, 55, 'BHJ', '2026-02-13', '2026-05-31', 1000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-02-13 13:31:08', '2026-02-13 14:09:51'),
(22, 1, 1, 74, 'ravi', '2026-02-13', '2026-03-31', 50000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-02-13 14:33:03', '2026-02-14 11:27:40'),
(23, 3, 3, 67, 'L2 OM', '2026-02-05', '2026-03-31', 100.0000, 'finalised', 'created', NULL, 0, 47, NULL, '2026-02-18 08:03:31', '2026-02-18 08:03:31'),
(24, 1, 1, 78, 'Narendra', '2026-02-05', '2026-03-31', 10000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-02-18 08:06:07', '2026-02-18 08:10:34'),
(25, 1, 1, 78, 'Narendra', '2026-02-05', '2026-02-28', 10000.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-02-18 08:11:23', '2026-03-13 15:58:22'),
(26, 3, 3, 64, 'Health service', '2026-03-09', NULL, 200.0000, 'finalised', 'inProgress', NULL, 0, 47, 47, '2026-03-13 06:35:54', '2026-03-13 07:11:22'),
(27, 3, 3, 80, 'L1 13-3-26', '2026-03-01', NULL, 100.0000, 'finalised', 'created', 'hello', 0, 47, NULL, '2026-03-13 07:05:07', '2026-03-13 07:05:07'),
(28, 3, 3, 67, 'Health man', '2026-03-10', NULL, 10.0000, 'draft', 'created', NULL, 0, 47, 47, '2026-03-13 07:24:35', '2026-03-13 07:28:53'),
(29, 1, 1, 83, 'DILIP KUMAR', '2026-03-09', NULL, 30000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-03-13 11:48:51', '2026-03-13 16:38:35'),
(30, 1, 1, 78, 'Narendra', '2026-02-05', NULL, 10000.0000, 'draft', 'created', NULL, 1, 1, 1, '2026-03-13 16:00:02', '2026-03-13 16:28:21'),
(31, 1, 1, 78, 'At.Kishan Yadav', '2026-03-01', NULL, 10000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-03-13 16:32:51', '2026-03-13 16:38:41'),
(32, 1, 1, 83, 'DILIP KUMAR', '2026-03-09', NULL, 30000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-03-13 16:45:14', '2026-06-18 12:22:04'),
(33, 1, 1, 78, 'At.Kishan Yadav', '2026-03-01', NULL, 10000.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-03-13 16:46:48', '2026-06-17 16:29:28'),
(34, 1, 1, 93, 'Sawai Singh', '2026-03-01', NULL, 1.0000, 'finalised', 'inProgress', NULL, 0, 1, 1, '2026-03-13 16:56:37', '2026-06-13 15:04:39'),
(35, 1, 1, 94, 'Narendra', '2026-03-12', NULL, 1.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-03-13 19:10:29', '2026-03-13 19:45:17'),
(36, 1, 1, 96, 'Mittal', '2026-03-21', NULL, 0.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-03-21 19:35:11', '2026-03-21 19:38:51'),
(37, 1, 1, 96, 'Lohiya Mittal', '2026-03-21', NULL, 0.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-03-21 19:52:38', '2026-03-23 21:13:16'),
(38, 1, 1, 101, 'Lohiya Mittal', '2026-03-21', NULL, 100.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-03-23 21:19:00', '2026-06-17 16:29:35'),
(39, 3, 3, 80, 'Health service', '2026-03-01', NULL, 2.0000, 'finalised', 'created', NULL, 0, 47, 47, '2026-03-31 13:29:48', '2026-03-31 13:30:04'),
(40, 3, 3, 64, 'lead 1', '2026-04-01', NULL, 11.0000, 'draft', 'created', NULL, 0, 47, 47, '2026-04-23 09:58:56', '2026-04-23 10:02:44'),
(41, 3, 3, 64, 'lead 2', '2026-04-01', NULL, 44.0000, 'finalised', 'created', NULL, 0, 47, NULL, '2026-04-23 10:03:19', '2026-04-23 10:03:19'),
(42, 3, 3, 64, 'lead 3', '2026-04-01', NULL, 10.0000, 'finalised', 'created', NULL, 0, 47, 47, '2026-04-23 10:37:46', '2026-04-23 12:33:47'),
(43, 3, 3, 80, 'Health service', '2026-05-20', NULL, 0.0000, 'finalised', 'created', NULL, 0, 47, 47, '2026-05-19 07:24:46', '2026-05-19 07:25:08'),
(44, 1, 1, 103, 'Nursing service', '2026-05-19', '2026-06-01', 100.0000, 'finalised', 'completed', NULL, 1, 1, 1, '2026-05-19 07:43:30', '2026-05-19 19:13:53'),
(45, 3, 3, 105, 'lead new', '2026-05-19', NULL, 0.0000, 'finalised', 'created', NULL, 0, 47, 47, '2026-05-19 11:31:00', '2026-05-19 11:31:23'),
(46, 3, 3, 105, 'lead new', '2026-05-18', NULL, 0.0000, 'finalised', 'created', NULL, 0, 47, 47, '2026-05-19 11:59:47', '2026-05-19 12:00:27'),
(47, 3, 3, 105, 'new lead', '2026-05-01', NULL, 0.0000, 'finalised', 'inProgress', NULL, 0, 47, 47, '2026-05-19 12:05:12', '2026-05-19 12:09:21'),
(48, 1, 1, 108, 'Prbha Sister', '2026-05-31', NULL, 50000.0000, 'draft', 'created', NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43'),
(49, 1, 1, 108, 'Prbha Sister', '2026-05-31', NULL, 50000.0000, 'finalised', 'created', NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31'),
(50, 3, 3, 80, 'Nursing service', '2026-06-24', NULL, 2342.0000, 'finalised', 'created', NULL, 0, 47, NULL, '2026-06-24 12:13:57', '2026-06-24 12:13:56'),
(51, 1, 1, 111, 'Prbha sister', '2026-05-31', NULL, 50000.0000, 'finalised', 'inProgress', NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(52, 1, 1, 111, 'Prbha Sister', '2026-05-31', '2026-07-17', 50000.0000, 'finalised', 'completed', NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-07-19 08:04:14'),
(53, 1, 1, 112, 'Suction Machine', '2026-06-01', NULL, 5000.0000, 'finalised', 'inProgress', NULL, 0, 1, 1, '2026-06-27 07:30:44', '2026-06-27 07:33:44'),
(54, 1, 1, 113, 'Prbha Sister', '2026-06-20', NULL, 0.0000, 'finalised', 'inProgress', NULL, 0, 1, 1, '2026-07-04 15:57:08', '2026-07-19 08:08:52'),
(55, 1, 1, 113, 'Health service', '2026-07-07', NULL, 100.0000, 'finalised', 'created', 'test', 1, 1, 1, '2026-07-07 06:27:06', '2026-07-07 06:27:25'),
(56, 1, 1, 115, 'Arshad', '2026-09-04', NULL, 0.0000, 'draft', 'created', NULL, 0, 1, NULL, '2026-09-04 18:53:07', '2026-09-04 18:53:06');

-- --------------------------------------------------------

--
-- Table structure for table `lead_items`
--

CREATE TABLE `lead_items` (
  `id` int NOT NULL,
  `lead_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `item_type` enum('product','service','payslip') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deal_type` enum('rent','sell') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` decimal(10,4) DEFAULT NULL,
  `hours_per_day` decimal(10,4) DEFAULT NULL COMMENT 'Per day hours for service/product used in service',
  `notes` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` int DEFAULT NULL COMMENT '0 = count in all invoice, 1 = item ended, 2 = last invoice generated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_items`
--

INSERT INTO `lead_items` (`id`, `lead_id`, `account_id`, `branch_id`, `item_type`, `deal_type`, `item_id`, `item_name`, `quantity`, `unit_price`, `hours_per_day`, `notes`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`, `start_date`, `end_date`, `status`) VALUES
(14, 13, 3, 3, 'service', NULL, '7', 's1', 10, 50.0000, NULL, 'saasd', 0, 47, NULL, '2025-12-17 12:48:35', '2025-12-17 12:48:35', NULL, NULL, 0),
(15, 13, 3, 3, 'product', 'rent', '5', 'p2', 1, 10.0000, NULL, NULL, 0, 47, NULL, '2025-12-17 12:48:35', '2025-12-17 12:48:35', NULL, NULL, 0),
(16, 14, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 10, 100.0000, NULL, NULL, 1, 1, 1, '2025-12-19 06:44:51', '2026-02-13 13:20:37', NULL, NULL, 0),
(17, 15, 1, 1, 'service', NULL, '10', 'Nursing', 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:02:03', '2026-02-13 13:20:32', NULL, NULL, 0),
(18, 16, 1, 1, 'product', 'rent', '6', '3 FUNCTION BED', 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:12:07', '2026-02-13 13:20:26', NULL, NULL, 0),
(19, 16, 1, 1, 'service', NULL, '12', 'Baby Care', 1, 1000.0000, NULL, NULL, 1, 1, 1, '2026-01-02 09:12:07', '2026-02-13 13:20:26', NULL, NULL, 0),
(20, 17, 3, 3, 'product', 'rent', '7', 'Prod 1', 2, 10.0000, NULL, NULL, 0, 47, NULL, '2026-02-06 07:06:07', '2026-02-06 07:06:06', NULL, NULL, 0),
(21, 18, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, NULL, NULL, 0, 47, NULL, '2026-02-06 07:36:00', '2026-02-06 07:35:59', NULL, NULL, 0),
(22, 18, 3, 3, 'product', 'rent', '5', 'p2', 1, 10.0000, NULL, NULL, 0, 47, NULL, '2026-02-06 09:20:46', '2026-02-06 09:20:45', NULL, NULL, 0),
(23, 19, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, NULL, NULL, 0, 47, NULL, '2026-02-10 11:39:54', '2026-02-10 11:39:53', NULL, NULL, 0),
(24, 19, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, NULL, NULL, 0, 47, NULL, '2026-02-10 11:39:54', '2026-02-10 11:39:53', NULL, NULL, 0),
(25, 20, 1, 1, 'service', NULL, '9', '3 FUNCTION BED', 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 07:56:58', '2026-02-13 13:20:10', NULL, NULL, 0),
(26, 20, 1, 1, 'product', 'rent', '6', '3 FUNCTION BED', 1, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-11 07:56:58', '2026-02-13 13:20:10', NULL, NULL, 0),
(27, 21, 1, 1, 'service', NULL, '10', 'Nursing', 1, 50.0000, NULL, NULL, 1, 1, 1, '2026-02-13 13:31:08', '2026-02-13 14:09:51', NULL, NULL, 0),
(28, 22, 1, 1, 'service', NULL, '10', 'Nursing', 1, 2500.0000, NULL, NULL, 1, 1, 1, '2026-02-13 14:33:03', '2026-02-14 11:27:40', NULL, NULL, 0),
(29, 23, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, NULL, NULL, 0, 47, NULL, '2026-02-18 08:03:31', '2026-02-18 08:03:31', NULL, NULL, 0),
(30, 24, 1, 1, 'service', NULL, '13', 'Attendant', 1, 42.0000, NULL, NULL, 1, 1, 1, '2026-02-18 08:06:07', '2026-02-18 08:10:34', NULL, NULL, 0),
(31, 25, 1, 1, 'service', NULL, '13', 'Attendant', 1, 42.0000, NULL, NULL, 1, 1, 1, '2026-02-18 08:11:23', '2026-03-13 15:58:22', NULL, NULL, 0),
(32, 26, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 1, 47, 47, '2026-03-13 06:35:54', '2026-03-13 07:10:45', NULL, NULL, 0),
(33, 26, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 1, 47, 47, '2026-03-13 06:35:54', '2026-03-13 07:10:45', NULL, NULL, 0),
(34, 26, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 1, 47, 47, '2026-03-13 06:35:54', '2026-03-13 07:10:45', NULL, NULL, 0),
(35, 27, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-13 07:05:07', '2026-03-13 07:05:07', NULL, NULL, 0),
(36, 26, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-13 07:10:45', '2026-03-13 07:10:44', NULL, NULL, 0),
(37, 26, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-13 07:10:45', '2026-03-13 07:10:44', NULL, NULL, 0),
(38, 26, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-03-13 07:10:45', '2026-03-13 07:10:44', NULL, NULL, 0),
(39, 28, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 1, 47, 47, '2026-03-13 07:24:35', '2026-03-13 07:28:53', NULL, NULL, 0),
(40, 28, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-13 07:28:53', '2026-03-13 07:28:52', NULL, NULL, 0),
(41, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1600, 24.0000, NULL, 1, 1, 1, '2026-03-13 11:48:51', '2026-03-13 16:38:35', NULL, NULL, 0),
(42, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1600, 24.0000, NULL, 1, 1, 1, '2026-03-13 11:59:17', '2026-03-13 16:38:35', NULL, NULL, 0),
(43, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 11:59:49', '2026-03-13 16:38:35', NULL, NULL, 0),
(44, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 12:00:36', '2026-03-13 16:38:35', NULL, NULL, 0),
(45, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1600, 24.0000, NULL, 1, 1, 1, '2026-03-13 12:00:56', '2026-03-13 16:38:35', NULL, NULL, 0),
(46, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 12:01:27', '2026-03-13 16:38:35', NULL, NULL, 0),
(47, 29, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 12:02:46', '2026-03-13 16:38:35', NULL, NULL, 0),
(48, 30, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:00:02', '2026-03-13 16:28:21', NULL, NULL, 0),
(49, 31, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:32:51', '2026-03-13 16:38:41', NULL, NULL, 0),
(50, 31, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:33:31', '2026-03-13 16:38:41', NULL, NULL, 0),
(51, 32, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:45:14', '2026-06-18 12:22:04', NULL, NULL, 0),
(52, 33, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:46:48', '2026-06-17 16:29:28', NULL, NULL, 0),
(53, 34, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-03-13 16:56:37', '2026-03-13 17:28:40', NULL, NULL, 0),
(54, 34, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 0, 1, 1, '2026-03-13 17:28:40', '2026-09-01 14:34:47', NULL, '2026-08-31', 2),
(55, 33, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 17:30:52', '2026-06-17 16:29:28', NULL, NULL, 0),
(56, 32, 1, 1, 'service', NULL, '10', 'Nursing', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 17:32:26', '2026-06-18 12:22:04', NULL, NULL, 0),
(57, 32, 1, 1, 'service', NULL, '10', 'Nursing', 1, 41.6700, 24.0000, NULL, 1, 1, 1, '2026-03-13 17:33:24', '2026-06-18 12:22:04', NULL, NULL, 0),
(58, 35, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6600, 24.0000, NULL, 1, 1, 1, '2026-03-13 19:10:29', '2026-03-13 19:45:17', NULL, NULL, 0),
(59, 36, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-03-21 19:35:11', '2026-03-21 19:38:51', NULL, NULL, 0),
(60, 36, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-03-21 19:36:18', '2026-03-21 19:38:51', NULL, NULL, 0),
(61, 37, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-03-21 19:52:38', '2026-03-23 21:13:16', NULL, NULL, 0),
(62, 38, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 12.0000, 'well trend ICU staff', 1, 1, 1, '2026-03-23 21:19:00', '2026-06-17 16:29:35', NULL, NULL, 0),
(63, 38, 1, 1, 'service', NULL, '14', 'Nursing 2', 1, 125.0000, 12.0000, NULL, 1, 1, 1, '2026-03-23 21:19:00', '2026-06-17 16:29:35', NULL, NULL, 0),
(64, 38, 1, 1, 'service', NULL, '13', 'Attendant', 1, 50.0000, 24.0000, NULL, 1, 1, 1, '2026-03-23 21:19:00', '2026-06-17 16:29:35', NULL, NULL, 0),
(65, 38, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 12.0000, 'well trend ICU staff', 1, 1, 1, '2026-03-23 21:27:34', '2026-06-17 16:29:35', NULL, '2026-05-19', 1),
(66, 38, 1, 1, 'service', NULL, '14', 'Nursing 2', 1, 125.0000, 12.0000, NULL, 1, 1, 1, '2026-03-23 21:27:34', '2026-06-17 16:29:35', NULL, '2026-05-19', 1),
(67, 38, 1, 1, 'service', NULL, '13', 'Attendant', 1, 50.0000, 24.0000, NULL, 1, 1, 1, '2026-03-23 21:27:34', '2026-06-17 16:29:35', NULL, '2026-05-19', 1),
(68, 39, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 1, 47, 47, '2026-03-31 13:29:48', '2026-03-31 13:30:04', NULL, NULL, 0),
(69, 39, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 1, 47, 47, '2026-03-31 13:29:48', '2026-03-31 13:30:04', NULL, NULL, 0),
(70, 39, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 1, 47, 47, '2026-03-31 13:29:48', '2026-03-31 13:30:04', NULL, NULL, 0),
(71, 39, 3, 3, 'product', 'rent', '7', 'Prod 1', 2, 10.0000, 1.0000, NULL, 1, 47, 47, '2026-03-31 13:29:48', '2026-03-31 13:30:04', NULL, NULL, 0),
(72, 39, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-31 13:30:04', '2026-03-31 13:30:03', NULL, NULL, 0),
(73, 39, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, NULL, '2026-03-31 13:30:04', '2026-03-31 13:30:03', NULL, NULL, 0),
(74, 39, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-03-31 13:30:04', '2026-03-31 13:30:03', NULL, NULL, 0),
(75, 39, 3, 3, 'product', 'rent', '7', 'Prod 1', 2, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-03-31 13:30:04', '2026-03-31 13:30:03', NULL, NULL, 0),
(76, 40, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-04-23 09:58:56', '2026-07-06 06:58:12', '2026-04-02', '2026-04-02', 1),
(77, 40, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, 47, '2026-04-23 10:02:26', '2026-07-06 06:58:25', '2026-04-01', '2026-04-01', 1),
(78, 41, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, NULL, '2026-04-23 10:03:19', '2026-04-23 10:03:19', '2026-04-06', NULL, 0),
(79, 42, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, 47, '2026-04-23 10:37:46', '2026-04-23 12:33:46', '2026-04-02', NULL, 0),
(80, 42, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-04-23 12:34:11', '2026-04-23 12:34:11', '2026-04-09', NULL, 0),
(81, 43, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, 47, '2026-05-19 07:24:46', '2026-05-19 07:25:08', '2026-05-20', NULL, 0),
(82, 44, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-05-19 07:43:30', '2026-05-19 19:13:53', '2026-05-19', NULL, 0),
(83, 44, 1, 1, 'service', NULL, '13', 'Attendant', 1, 41.6600, 1.0000, NULL, 1, 1, 1, '2026-05-19 07:47:36', '2026-05-19 19:13:53', '2026-05-23', '2026-05-27', 2),
(84, 45, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-05-19 11:31:00', '2026-05-19 11:31:22', '2026-05-19', '2026-05-19', 1),
(85, 46, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, 47, '2026-05-19 11:59:47', '2026-05-19 12:00:26', '2026-05-19', NULL, 0),
(86, 46, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, NULL, 0, 47, 47, '2026-05-19 11:59:47', '2026-05-19 12:00:26', '2026-05-20', NULL, 0),
(87, 47, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 24.0000, NULL, 0, 47, 47, '2026-05-19 12:05:12', '2026-05-19 12:06:03', '2026-05-03', NULL, 0),
(88, 47, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, 47, '2026-05-19 12:05:12', '2026-05-19 12:06:03', '2026-05-06', NULL, 0),
(89, 38, 1, 1, 'service', NULL, '10', 'Nursing', 1, 75.0000, 1.0000, NULL, 1, 1, 1, '2026-05-19 18:55:27', '2026-06-17 16:29:35', '2026-03-22', '2026-03-22', 1),
(90, 48, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-15', 1),
(91, 48, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-30', 1),
(92, 48, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 50.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-30', 1),
(93, 48, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 29.1666, 1.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-30', 1),
(94, 48, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-30', 1),
(95, 48, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 10:37:38', '2026-06-24 12:12:43', '2026-05-31', '2026-06-30', 1),
(96, 49, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(97, 49, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 50.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(98, 49, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(99, 49, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 29.1666, 1.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(100, 49, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(101, 49, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-18 12:15:16', '2026-06-24 15:42:31', '2026-05-31', NULL, 0),
(102, 50, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 24.0000, 'afaff', 0, 47, NULL, '2026-06-24 12:13:57', '2026-06-24 12:13:56', '2026-06-24', '2026-06-30', 1),
(103, 51, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-06-15', 2),
(104, 51, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-07-31', 2),
(105, 51, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 180.0000, 1.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-07-31', 2),
(106, 51, 1, 1, 'product', 'rent', '18', 'Nimbus Air Bed ', 2, 29.1666, 1.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-07-31', 2),
(107, 51, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 150.0000, 1.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-07-31', 2),
(108, 51, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 50.0000, 1.0000, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51', '2026-05-31', '2026-06-30', 2),
(109, 52, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 24.0000, NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-06-15', 2),
(110, 52, 1, 1, 'product', 'rent', '19', 'Bed ABS 2 Function manual C', 2, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-07-31', 2),
(111, 52, 1, 1, 'product', 'rent', '21', 'Bed ABS 3 Function Manual C', 1, 180.0000, 1.0000, NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-07-31', 2),
(112, 52, 1, 1, 'product', 'rent', '23', 'Nimbus Air Bed ', 2, 700.0000, 1.0000, NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-07-31', 2),
(113, 52, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-07-31', 2),
(114, 52, 1, 1, 'product', 'rent', '22', ' Food Tabal', 1, 50.0000, 1.0000, 'MONTHLY COUNT', 0, 1, 1, '2026-06-25 15:00:07', '2026-06-30 18:31:19', '2026-05-31', '2026-06-30', 2),
(115, 53, 1, 1, 'product', 'rent', '10', 'Suction Machine', 1, 50.0000, 1.0000, NULL, 0, 1, 1, '2026-06-27 07:30:44', '2026-06-27 07:33:44', '2026-06-01', '2026-08-31', 2),
(116, 34, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 104.1700, 1.0000, NULL, 1, 1, 1, '2026-06-30 15:41:59', '2026-06-30 16:57:47', '2026-05-10', '2026-05-31', 2),
(117, 34, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 104.1700, 24.0000, NULL, 1, 1, 1, '2026-06-30 15:43:31', '2026-07-31 09:50:39', '2026-05-10', '2026-07-18', 2),
(118, 34, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30.0000, 1.0000, NULL, 0, 1, 1, '2026-06-30 16:40:25', '2026-09-01 14:34:47', '2026-03-01', '2026-07-31', 2),
(119, 34, 1, 1, 'product', 'sell', '25', 'O2 Refilling Charge', 1, 400.0000, 1.0000, NULL, 1, 1, 1, '2026-06-30 16:45:56', '2026-07-30 09:32:21', '2026-03-01', '2026-06-30', 2),
(120, 54, 1, 1, 'service', NULL, '10', 'Nursing', 1, 125.0000, 12.0000, NULL, 0, 1, 1, '2026-07-04 15:57:08', '2026-07-31 10:11:14', '2026-06-20', '2026-07-20', 1),
(121, 47, 3, 3, 'service', NULL, '7', 's1', 1, 50.0000, 1.0000, 'Test', 0, 47, 47, '2026-07-06 07:04:59', '2026-07-06 07:05:13', '2026-05-01', '2026-07-05', 1),
(122, 52, 1, 1, 'product', 'rent', '11', 'A 2 Function Manual ABS Panels', 1, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-07 06:02:42', '2026-07-19 08:03:39', '2026-06-01', '2026-06-30', 2),
(123, 52, 1, 1, 'product', 'rent', '11', 'A 2 Function Manual ABS Panels', 1, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-07 06:06:11', '2026-07-19 08:03:39', '2026-07-01', '2026-07-17', 2),
(124, 52, 1, 1, 'product', 'rent', '20', 'Recline Wheel Chair', 1, 150.0000, 1.0000, NULL, 0, 1, 1, '2026-07-07 06:06:32', '2026-07-19 08:03:39', '2026-07-01', '2026-07-17', 2),
(125, 55, 1, 1, 'service', NULL, '10', 'Nursing', 1, 83.3300, 11.5000, NULL, 1, 1, 1, '2026-07-07 06:27:06', '2026-07-07 06:27:25', '2026-07-07', NULL, 0),
(126, 55, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 63.8800, 11.5000, NULL, 1, 1, 1, '2026-07-07 06:27:06', '2026-07-07 06:27:25', '2026-07-07', NULL, 0),
(127, 53, 1, 1, 'product', 'rent', '10', 'Suction Machine', 1, 50.0000, 1.0000, NULL, 0, 1, NULL, '2026-07-31 09:55:14', '2026-07-31 09:55:14', '2026-07-01', NULL, 0),
(128, 47, 3, 3, 'service', NULL, '8', 's2', 1, 100.0000, 1.0000, NULL, 0, 47, 47, '2026-08-03 06:52:26', '2026-08-03 06:52:45', '2026-08-03', '2026-08-03', 1),
(129, 47, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-08-03 06:54:06', '2026-08-03 06:54:06', '2026-05-01', NULL, 0),
(130, 47, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-08-03 06:54:50', '2026-08-03 06:54:49', NULL, NULL, 0),
(131, 47, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-08-03 10:41:59', '2026-08-03 10:41:58', '2026-05-01', NULL, 0),
(132, 47, 3, 3, 'product', 'rent', '7', 'Prod 1', 1, 10.0000, 1.0000, NULL, 0, 47, NULL, '2026-08-03 10:42:54', '2026-08-03 10:42:53', '2026-08-03', NULL, 0),
(133, 34, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30.0000, 1.0000, NULL, 1, 1, 1, '2026-09-01 08:24:27', '2026-09-01 09:02:09', '2026-08-01', '2026-08-01', 1),
(134, 34, 1, 1, 'service', NULL, '16', 'Nursing.', 1, 104.1700, 1.0000, NULL, 1, 1, 1, '2026-09-01 08:26:02', '2026-09-01 09:01:51', '2026-08-01', '2026-08-01', 1),
(135, 34, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 1.0000, NULL, 1, 1, 1, '2026-09-01 09:08:27', '2026-09-01 09:08:38', '2026-03-01', '2026-07-31', 1),
(136, 34, 1, 1, 'service', NULL, '10', 'Nursing', 1, 104.1700, 1.0000, NULL, 1, 1, NULL, '2026-09-01 09:09:50', '2026-09-01 09:09:50', '2026-08-01', NULL, 0),
(137, 34, 1, 1, 'product', 'rent', '24', 'B-type Oxygen Cylinder ', 1, 30.0000, 1.0000, NULL, 1, 1, NULL, '2026-09-01 09:10:37', '2026-09-01 09:10:36', '2026-08-01', NULL, 0),
(138, 34, 1, 1, 'service', NULL, '15', 'Nursing 2', 1, 104.1700, 1.0000, NULL, 0, 1, NULL, '2026-09-01 14:32:08', '2026-09-01 14:32:08', '2026-03-31', NULL, 0),
(139, 56, 1, 1, 'service', NULL, '16', 'Nursing.', 1, 91.6700, 1.0000, NULL, 0, 1, NULL, '2026-09-04 18:53:07', '2026-09-04 18:53:07', '2026-09-04', NULL, 0),
(140, 56, 1, 1, 'service', NULL, '13', 'Attendant', 1, 33.3300, 1.0000, NULL, 0, 1, NULL, '2026-09-04 18:53:07', '2026-09-04 18:53:07', '2026-09-04', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token`, `expires_at`, `used`, `created_at`) VALUES
(6, 48, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJlbWFpbCI6Inlhc2guc2Nvcm93QGdtYWlsLmNvbSIsInR5cGUiOiJwYXNzd29yZF9yZXNldCIsImlhdCI6MTc2Nzc2NTQ0NSwiZXhwIjoxNzY3NzY5MDQ1fQ.GbdbUi4rBeTdFgkD7d-qZkDepaXYT19oxHK2aZyRk2c', '2026-01-07 06:57:26', 0, '2026-01-07 05:57:25'),
(9, 71, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcxLCJlbWFpbCI6InNhbmFuZGl5YXlhc2gxMTY2QGdtYWlsLmNvbSIsInR5cGUiOiJwYXNzd29yZF9yZXNldCIsImlhdCI6MTc3MDgxNDExNCwiZXhwIjoxNzcwODE3NzE0fQ.XSikG0e6z0mTeuNhuvD4SMsbjQjQiCP-TFgpzIt9fbA', '2026-02-11 13:48:34', 1, '2026-02-11 12:48:34');

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

CREATE TABLE `payment_history` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(10,4) DEFAULT NULL,
  `payment_method` enum('cash','card','bank_transfer','other','carry-forward','cheque','upi') COLLATE utf8mb4_general_ci DEFAULT 'cash',
  `other_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `notes` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `payment_history`
--

INSERT INTO `payment_history` (`id`, `invoice_id`, `account_id`, `branch_id`, `payment_date`, `amount`, `payment_method`, `other_details`, `notes`, `is_deleted`, `created_at`) VALUES
(20, 15, 3, 3, '2025-12-18', 100.0000, 'bank_transfer', '{\"bank_name\":\"SBi\",\"transaction_id\":\"89797979889\"}', 'sd', 0, '2025-12-18 05:11:04'),
(21, 15, 3, 3, '2025-07-10', 410.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_P_18_12_2025_0002.', 0, '2025-12-18 05:33:37'),
(22, 16, 3, 3, '2025-07-10', -4080.0000, 'cash', NULL, NULL, 0, '2025-12-18 05:33:37'),
(23, 17, 1, 1, '2025-12-19', 500.0000, 'cash', NULL, '', 0, '2025-12-19 09:51:53'),
(24, 17, 1, 1, '2025-12-02', 500.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_20_12_2025_0002', 0, '2025-12-20 08:42:02'),
(25, 19, 1, 1, '2026-01-02', 1100.0000, 'cash', NULL, '', 0, '2026-01-02 09:16:58'),
(26, 18, 1, 1, '2026-01-02', 1500.0000, 'cash', NULL, '1500', 0, '2026-01-02 09:19:22'),
(27, 23, 3, 3, '2026-02-10', 2160.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_P_10_02_2026_0006.', 0, '2026-02-10 12:32:48'),
(28, 24, 3, 3, '2026-02-10', 2540.0000, 'cash', NULL, NULL, 0, '2026-02-10 12:32:48'),
(29, 25, 1, 1, '2026-02-11', 100.0000, 'cash', NULL, '', 0, '2026-02-11 08:08:45'),
(30, 25, 1, 1, '2026-02-11', 190.0000, 'cheque', '{\"cheque_no\":\"232323\",\"bank_name\":\"sbi\"}', '', 0, '2026-02-11 08:09:45'),
(31, 25, 1, 1, '2026-02-11', 1600.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_P_11_02_2026_0006.', 0, '2026-02-11 08:11:14'),
(32, 26, 1, 1, '2026-02-11', 1700.0000, 'cash', NULL, NULL, 0, '2026-02-11 08:11:14'),
(33, 27, 1, 1, '2026-02-18', 100.0000, 'cash', NULL, '', 0, '2026-02-18 08:40:39'),
(34, 30, 1, 1, '2026-03-13', 1999.6800, 'cash', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-03-13 19:21:19'),
(35, 31, 1, 1, '2026-03-13', 1999.6800, 'cash', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-03-13 19:21:43'),
(37, 35, 1, 1, '2026-05-19', 100.0000, 'cash', NULL, '', 0, '2026-05-19 07:45:10'),
(38, 35, 1, 1, '2026-05-25', 7410.2400, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_19_05_2026_0013.', 0, '2026-05-19 07:48:54'),
(39, 36, 1, 1, '2026-05-30', 17535.5400, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_19_05_2026_0014.', 0, '2026-05-19 07:49:43'),
(40, 37, 1, 1, '2026-06-01', 30119.2600, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_S_19_05_2026_0015.', 0, '2026-05-19 07:50:54'),
(41, 40, 1, 1, '2026-06-01', 35019.4200, 'cash', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-05-19 07:50:54'),
(42, 34, 1, 1, '2026-03-22', 5000.0000, 'cash', NULL, '', 0, '2026-05-19 19:15:24'),
(43, 42, 1, 1, '2026-03-31', 77502.4800, 'cash', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-06-13 15:04:39'),
(44, 43, 1, 1, '2026-04-30', 74999.9500, 'bank_transfer', '{\"cheque_no\":\"\",\"bank_name\":\"HDFC BANK\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-06-17 15:42:37'),
(45, 44, 1, 1, '2026-05-31', 77499.9500, 'bank_transfer', '{\"cheque_no\":\"\",\"bank_name\":\"HDFC BANK\",\"transaction_id\":\"HDFFCH01034439914\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-06-17 15:45:12'),
(46, 50, 1, 1, '2026-06-30', 75002.0000, 'upi', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 1, '2026-06-27 06:54:19'),
(47, 41, 3, 3, '2026-07-01', 100.0000, 'cash', NULL, '', 0, '2026-07-01 10:12:50'),
(48, 41, 3, 3, '2026-07-01', 14330.0000, 'cash', NULL, '', 0, '2026-07-01 10:13:17'),
(49, 58, 1, 1, '2026-07-04', 81303.0000, 'bank_transfer', '{\"bank_name\":\"HDFC\",\"transaction_id\":\"HDFCH01100608824\"}', '', 0, '2026-07-04 16:07:04'),
(50, 57, 1, 1, '2026-07-10', 55000.0000, 'cash', NULL, '', 0, '2026-07-19 07:53:29'),
(51, 57, 1, 1, '2026-07-17', 52300.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_P_19_07_2026_0032.', 0, '2026-07-19 08:03:40'),
(52, 59, 1, 1, '2026-07-17', 2300.0000, 'cash', '{\"cheque_no\":\"\",\"bank_name\":\"\",\"transaction_id\":\"\",\"card_last4\":\"\",\"upi_id\":\"\",\"utr_number\":\"\"}', NULL, 0, '2026-07-19 08:03:40'),
(53, 60, 1, 1, '2026-07-31', 46500.0000, 'cash', NULL, '', 0, '2026-07-31 09:51:10'),
(54, 51, 1, 1, '2026-07-31', 1500.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_P_31_07_2026_0035', 0, '2026-07-31 09:57:33'),
(55, 62, 1, 1, '2026-07-03', 78432.0000, 'bank_transfer', '{\"bank_name\":\"HDFC\",\"transaction_id\":\"HDFCH01165682435\"}', '', 0, '2026-09-01 09:20:27'),
(56, 63, 1, 1, '2026-08-31', 3050.0000, 'carry-forward', NULL, 'Invoice due amount carried forward to invoice RH_P_01_09_2026_0037.', 0, '2026-09-01 14:35:58');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `sku_code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `base_price` decimal(10,4) NOT NULL,
  `sale_price` decimal(10,4) DEFAULT NULL,
  `hour_rent_price` decimal(10,4) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `total_stock` int DEFAULT '0',
  `available_stock` int DEFAULT '0',
  `rented_stock` int DEFAULT '0',
  `sold_stock` int DEFAULT '0',
  `images` text COLLATE utf8mb4_general_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `sku_code`, `account_id`, `branch_id`, `name`, `description`, `base_price`, `sale_price`, `hour_rent_price`, `purchase_date`, `total_stock`, `available_stock`, `rented_stock`, `sold_stock`, `images`, `status`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, 'SKU-4', 3, 3, 'p1', 'prod.', 200.0000, 100.0000, 40.0000, NULL, 0, 0, 0, 0, NULL, 'active', 0, 47, 47, '2025-12-17 12:35:37', '2026-05-19 12:16:39'),
(5, 'SKU-5', 3, 3, 'p2', 'p22 ', 300.0000, 100.0000, 10.0000, NULL, 1, 0, 1, 0, NULL, 'active', 0, 47, 47, '2025-12-17 12:39:19', '2026-05-19 08:10:17'),
(6, 'SKU-6', 1, 1, '3 FUNCTION BED', NULL, 48000.0000, 0.0000, 100.0000, NULL, 3, 3, 0, 0, NULL, 'active', 1, 1, 1, '2025-12-19 06:28:36', '2026-02-11 08:13:19'),
(7, 'PRD_06_02_2026_0003', 3, 3, 'Prod 1', NULL, 100.0000, 200.0000, 10.0000, '2026-02-01', 20, 12, 8, 0, NULL, 'active', 0, 47, 47, '2026-02-06 07:05:06', '2026-05-19 12:06:04'),
(8, 'PRD_18_02_2026_0002', 1, 1, 'SUCTION MACHIN', '1 YEAR', 5000.0000, 1.0000, 50.0000, '2026-02-02', 3, 3, 0, 0, NULL, 'inactive', 1, 1, 1, '2026-02-18 09:14:30', '2026-02-18 09:14:30'),
(9, 'PRD_13_03_2026_0004', 3, 3, 'Product 1', NULL, 100.0000, 0.0000, NULL, NULL, 0, 0, 0, 0, NULL, 'active', 0, 47, 47, '2026-03-13 07:30:47', '2026-03-13 07:30:47'),
(10, 'PRD_15_03_2026_0001', 1, 1, 'Suction Machine', 'oxymed brand', 5000.0000, 0.0000, 50.0000, '2025-03-12', 3, 2, 1, 0, NULL, 'active', 0, 1, 1, '2026-03-15 18:49:37', '2026-06-27 07:30:44'),
(11, 'PRD_15_03_2026_0002', 1, 1, 'A 2 Function Manual ABS Panels', NULL, 42000.0000, 0.0000, 150.0000, '2025-08-01', 1, 1, 0, 0, NULL, 'active', 0, 1, 1, '2026-03-15 18:56:38', '2026-05-19 12:45:57'),
(12, 'PRD_15_03_2026_0003', 1, 1, 'Nebulizer Machine', NULL, 2000.0000, 0.0000, 30.0000, '2025-04-01', 1, 1, 0, 0, NULL, 'active', 0, 1, 1, '2026-03-15 18:58:19', '2026-05-19 12:46:37'),
(13, 'PRD_15_03_2026_0004', 1, 1, 'Wheel Chair', NULL, 5000.0000, 0.0000, 50.0000, '2025-04-01', 1, 1, 0, 0, NULL, 'active', 0, 1, 1, '2026-03-15 19:01:06', '2026-05-19 12:55:26'),
(14, 'PRD_15_03_2026_0005', 1, 1, 'Folding Walker', NULL, 2000.0000, 0.0000, 20.0000, '2025-04-01', 1, 1, 0, 0, NULL, 'active', 0, 1, 1, '2026-03-15 19:02:42', '2026-05-19 12:55:49'),
(15, 'PRD_15_03_2026_0006', 1, 1, 'IV Stand', NULL, 1500.0000, 0.0000, 20.0000, '2025-04-01', 1, 1, 0, 0, NULL, 'active', 0, 1, 1, '2026-03-15 19:04:36', '2026-05-19 12:56:05'),
(16, 'PRD_19_05_2026_0005', 3, 3, 'new product', 'product', 200.0000, 100.0000, 20.0000, NULL, 0, 0, 0, 0, NULL, 'active', 0, 47, 47, '2026-05-19 11:40:30', '2026-05-19 12:14:44'),
(17, 'PRD_19_05_2026_0007', 1, 1, 'test', 'asfd', 232.0000, 2.0000, 20.0000, NULL, 1, 1, 0, 0, NULL, 'active', 1, 1, 1, '2026-05-19 12:15:59', '2026-05-19 12:16:08'),
(18, 'PRD_18_06_2026_0007', 1, 1, 'Nimbus Air Bed ', NULL, 250000.0000, 0.0000, 29.1666, '2026-05-31', 2, 2, 0, 0, NULL, 'active', 1, 1, 1, '2026-06-18 10:11:27', '2026-06-25 14:39:51'),
(19, 'PRD_18_06_2026_0008', 1, 1, 'Bed ABS 2 Function manual C', NULL, 65000.0000, 0.0000, 150.0000, '2026-05-30', 2, 2, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-18 10:24:04', '2026-07-19 08:04:14'),
(20, 'PRD_18_06_2026_0009', 1, 1, 'Recline Wheel Chair', NULL, 18000.0000, 0.0000, 150.0000, '2026-05-30', 2, 2, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-18 10:26:36', '2026-07-19 08:04:14'),
(21, 'PRD_18_06_2026_0010', 1, 1, 'Bed ABS 3 Function Manual C', NULL, 70000.0000, 0.0000, 180.0000, '2026-05-30', 2, 2, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-18 10:27:37', '2026-07-19 08:04:14'),
(22, 'PRD_18_06_2026_0011', 1, 1, ' Food Tabal', NULL, 15000.0000, 0.0000, 50.0000, '2026-05-30', 2, 2, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-18 10:31:24', '2026-07-19 08:04:14'),
(23, 'PRD_25_06_2026_0011', 1, 1, 'Nimbus Air Bed ', NULL, 300000.0000, 0.0000, 700.0000, '2026-05-30', 3, 3, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-25 14:43:00', '2026-07-19 08:04:14'),
(24, 'PRD_30_06_2026_0012', 1, 1, 'B-type Oxygen Cylinder ', NULL, 5000.0000, 0.0000, 30.0000, '2026-06-01', 2, 2, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-30 16:35:38', '2026-06-30 16:35:38'),
(25, 'PRD_30_06_2026_0013', 1, 1, 'O2 Refilling Charge', NULL, 400.0000, 400.0000, 0.0000, '2026-06-01', 3, 3, 0, 0, NULL, 'active', 0, 1, 1, '2026-06-30 16:39:00', '2026-06-30 16:43:22');

-- --------------------------------------------------------

--
-- Table structure for table `product_tracking`
--

CREATE TABLE `product_tracking` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `lead_id` int NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `deal_type` enum('rent','sell') COLLATE utf8mb4_general_ci DEFAULT 'rent',
  `status` tinyint DEFAULT '0' COMMENT '0 = on rent, 1 = returned from rent, 3 = sold',
  `quantity` int DEFAULT '1',
  `rent_start_date` date DEFAULT NULL,
  `rent_end_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `sold_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_tracking`
--

INSERT INTO `product_tracking` (`id`, `account_id`, `branch_id`, `lead_id`, `product_id`, `customer_id`, `deal_type`, `status`, `quantity`, `rent_start_date`, `rent_end_date`, `return_date`, `sold_date`, `notes`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 3, 3, 17, 7, 50, 'rent', 0, 2, '2026-01-01', '2026-02-28', NULL, NULL, NULL, 0, 47, 47, '2026-02-06 07:06:07', '2026-02-06 07:06:07'),
(2, 3, 3, 18, 5, 50, 'rent', 0, 1, '2026-01-01', '2026-02-28', NULL, NULL, NULL, 0, 47, 47, '2026-02-06 09:20:55', '2026-02-06 09:20:55'),
(3, 3, 3, 19, 7, 66, 'rent', 1, 1, '2026-01-01', '2026-04-30', '2026-02-10', NULL, 'note this si streutrhf', 0, 47, 47, '2026-02-10 11:39:54', '2026-02-10 12:36:19'),
(4, 1, 1, 20, 6, 70, 'rent', 1, 1, '2026-02-01', '2026-03-31', '2026-02-11', NULL, 'notwsat', 1, 1, 1, '2026-02-11 07:56:58', '2026-02-13 13:20:10'),
(5, 3, 3, 26, 7, 64, 'rent', 0, 1, '2026-03-04', NULL, NULL, NULL, NULL, 0, 47, 47, '2026-03-13 07:10:45', '2026-03-13 07:10:45'),
(6, 3, 3, 39, 7, 80, 'rent', 0, 1, '2026-03-01', NULL, NULL, NULL, NULL, 0, 47, 47, '2026-03-31 13:30:04', '2026-03-31 13:30:04'),
(7, 3, 3, 39, 7, 80, 'rent', 0, 2, '2026-03-01', NULL, NULL, NULL, NULL, 0, 47, 47, '2026-03-31 13:30:04', '2026-03-31 13:30:04'),
(8, 3, 3, 46, 7, 105, 'rent', 0, 1, '2026-05-18', NULL, NULL, NULL, NULL, 0, 47, 47, '2026-05-19 12:00:27', '2026-05-19 12:00:27'),
(9, 3, 3, 47, 7, 105, 'rent', 0, 1, '2026-05-01', NULL, NULL, NULL, NULL, 0, 47, 47, '2026-05-19 12:06:04', '2026-05-19 12:06:04'),
(10, 1, 1, 49, 22, 108, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-18 12:15:17', '2026-06-24 15:42:31'),
(11, 1, 1, 49, 19, 108, 'rent', 0, 2, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-18 12:15:17', '2026-06-24 15:42:31'),
(12, 1, 1, 49, 18, 108, 'rent', 0, 2, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-18 12:15:17', '2026-06-24 15:42:31'),
(13, 1, 1, 49, 20, 108, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-18 12:15:17', '2026-06-24 15:42:31'),
(14, 1, 1, 49, 21, 108, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-18 12:15:17', '2026-06-24 15:42:31'),
(15, 1, 1, 51, 19, 111, 'rent', 0, 2, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(16, 1, 1, 51, 21, 111, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(17, 1, 1, 51, 18, 111, 'rent', 0, 2, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(18, 1, 1, 51, 20, 111, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(19, 1, 1, 51, 22, 111, 'rent', 0, 1, '2026-05-31', NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-24 15:56:09', '2026-06-25 14:39:51'),
(20, 1, 1, 52, 19, 111, 'rent', 1, 2, '2026-05-31', '2026-07-17', '2026-07-17', NULL, '', 0, 1, 1, '2026-06-25 15:00:29', '2026-07-19 08:04:14'),
(21, 1, 1, 52, 21, 111, 'rent', 1, 1, '2026-05-31', '2026-07-17', '2026-07-17', NULL, '', 0, 1, 1, '2026-06-25 15:00:29', '2026-07-19 08:04:14'),
(22, 1, 1, 52, 23, 111, 'rent', 1, 2, '2026-05-31', '2026-07-17', '2026-07-17', NULL, '', 0, 1, 1, '2026-06-25 15:00:29', '2026-07-19 08:04:14'),
(23, 1, 1, 52, 20, 111, 'rent', 1, 1, '2026-05-31', '2026-07-17', '2026-07-17', NULL, '', 0, 1, 1, '2026-06-25 15:00:29', '2026-07-19 08:04:14'),
(24, 1, 1, 52, 22, 111, 'rent', 1, 1, '2026-05-31', '2026-07-17', '2026-07-17', NULL, '', 0, 1, 1, '2026-06-25 15:00:29', '2026-07-19 08:04:14'),
(25, 1, 1, 53, 10, 112, 'rent', 0, 1, '2026-06-01', NULL, NULL, NULL, NULL, 0, 1, 1, '2026-06-27 07:30:44', '2026-06-27 07:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alias` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `menu_map` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `account_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `is_default` int DEFAULT '0',
  `isDeleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `alias`, `menu_map`, `account_id`, `branch_id`, `is_default`, `isDeleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'superAdmin', 'superAdmin', '{\"user-management/user\": \"rwd\",\"user-management/role\": \"rwd\",\"product-management/product\":\"rwd\",\"product-management/service\":\"rwd\", \"invoice-management/invoice\":\"rwd\", \"accountSetting-management/accountSetting\": \"rwd\",\"user-management/staff-task\": \"rwd\", \"user-management/staff-pay-slip\": \"rwd\", \"lead-management/lead\" : \"rwd\", \"user-management/staff-experience-category\":\"rwd\", \"user-management/profile\" :\"rwd\"}', 0, 0, 1, 0, 0, 0, '2025-06-28 10:45:15', '2025-11-19 18:25:53'),
(2, 'customer', 'customer', NULL, 0, 0, 1, 0, 0, 0, '2025-06-28 10:45:15', '2025-11-03 10:39:31'),
(3, 'Staff', 'Staff', '{\"user-management/staff-task\": \"rw\",\"user-management/staff-pay-slip\": \"r\", \"user-management/profile\": \"rw\"}', 0, 0, 1, 0, 1, 1, '2025-09-08 12:48:47', '2025-11-19 18:06:06');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `hour_price` decimal(10,4) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `account_id`, `branch_id`, `name`, `description`, `hour_price`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(7, 3, 3, 's1', 's1 50', 50.0000, 0, 47, 47, '2025-12-17 12:43:08', '2025-12-17 12:43:08'),
(8, 3, 3, 's2', NULL, 100.0000, 0, 47, 47, '2025-12-17 12:43:36', '2025-12-17 12:43:36'),
(9, 1, 1, '3 FUNCTION BED', NULL, 100.0000, 1, 1, 1, '2025-12-19 06:41:16', '2025-12-19 06:41:16'),
(10, 1, 1, 'Nursing', '01. Identify patients’ care requirements, focus on their needs, and act on them\n02. Nurture a compassionate environment by providing psychological support.\n03. Resolve or report on patients’ needs or problems\n04. Prepare patients for examinations and perform routine diagnostic checks (monitor pulse, blood pressure, and temperature,    provide drugs and injections, etc)\n05. Monitor and record patient’s condition and document provided care services;\n06. Treat medical emergencies\n07. Administer workloads\n08. Follow care regulations and standards\n09. Work within and cooperate with a multidisciplinary team\n10. Requirements and skills\n11. Proven nursing experience\n12. Familiarity with professional and technical emerging knowledge\n13. Problem-solving skills and ability to multi-task\n14. Compassionate with good communication skills\n15. Excellent teamwork skills', 69.4100, 0, 1, 1, '2025-12-19 09:28:28', '2026-09-01 16:39:27'),
(11, 1, 1, 'Visitor', NULL, 10.0000, 1, 1, 1, '2025-12-19 09:37:51', '2025-12-19 09:37:51'),
(12, 1, 1, 'Baby Care', NULL, 1000.0000, 1, 1, 1, '2026-01-02 09:10:07', '2026-01-02 09:10:07'),
(13, 1, 1, 'Attendant', 'Duties & Responsibilities\nThe Duties and responsibilities of a caregiver are enumerated below:\n\nTo provide the following practical care to patients in a variety of settings at home.\n01. General home care\n02. Bath and Skin Care\n03. Feeding (oral)\n04. Mouth and hair care\n05. Making a bed (bedding)\n06. Toilet aid and emptying urine bags.\n07. Taking vital signs (temperature, pulse, blood pressure, etc.)\n08. Helping patients walk with gait belts, walkers, canes, and other equipment\n09. Assisting in motion-motion exercises\n10. Transfer patients arriving by wheelchair using secure patient-handle devices\n11. Regular rotating bedridden patients\n12. Reporting all changes to the nurse, Alertness with regard to the patient\n\n', 41.6600, 0, 1, 1, '2026-02-14 13:21:57', '2026-02-14 13:21:57'),
(14, 1, 1, 'Nursing 24hrs', NULL, 125.0000, 1, 1, 1, '2026-03-23 21:16:08', '2026-06-18 10:05:25'),
(15, 1, 1, 'Nursing 2', NULL, 69.4100, 0, 1, 1, '2026-06-30 10:20:07', '2026-09-01 16:39:43'),
(16, 1, 1, 'Nursing.', NULL, 66.6600, 0, 1, 1, '2026-07-19 07:04:17', '2026-09-04 18:28:45');

-- --------------------------------------------------------

--
-- Table structure for table `staff_activity`
--

CREATE TABLE `staff_activity` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `from_date_time` datetime NOT NULL,
  `to_date_time` datetime NOT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `total_hour` decimal(10,4) DEFAULT NULL COMMENT 'staff worked',
  `staff_working_hours` decimal(10,4) DEFAULT NULL COMMENT 'assigned hours to staff for work',
  `status` enum('todo','inProgress','done','onHold') COLLATE utf8mb4_general_ci DEFAULT 'todo',
  `payment_status` enum('0','1') COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '0 = unpaid, 1 = paid',
  `service_id` int NOT NULL,
  `service_price` decimal(10,4) NOT NULL,
  `staff_invoice_id` int DEFAULT NULL,
  `note_by_staff` longtext COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_activity`
--

INSERT INTO `staff_activity` (`id`, `user_id`, `account_id`, `branch_id`, `customer_id`, `from_date_time`, `to_date_time`, `start_date_time`, `end_date_time`, `total_hour`, `staff_working_hours`, `status`, `payment_status`, `service_id`, `service_price`, `staff_invoice_id`, `note_by_staff`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(11, 48, 3, 3, 50, '2025-12-18 07:30:00', '2025-12-18 15:30:00', '2025-12-18 07:37:46', '2025-12-18 08:50:16', 1.2100, 8.0000, 'done', '0', 8, 100.0000, 4, 'dwdwdw', 1, 47, 47, '2025-12-18 07:12:43', '2026-05-19 08:29:32'),
(12, 48, 3, 3, 50, '2025-12-19 06:30:00', '2025-12-19 07:00:00', NULL, '2026-04-24 02:30:01', 493610.5002, NULL, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2025-12-18 10:25:25', '2026-04-24 02:30:01'),
(13, 56, 1, 1, 55, '2025-12-19 09:35:00', '2025-12-19 13:35:00', NULL, NULL, NULL, 4.0000, 'todo', '0', 10, 100.0000, NULL, NULL, 1, 1, 1, '2025-12-19 09:29:21', '2026-02-18 08:25:35'),
(14, 54, 1, 1, 55, '2025-12-19 09:30:00', '2025-12-19 13:30:00', '2025-12-19 09:32:59', '2025-12-19 09:33:30', 0.0100, 4.0000, 'done', '0', 10, 100.0000, NULL, 'tn', 1, 1, 1, '2025-12-19 09:32:48', '2026-02-18 08:25:47'),
(15, 48, 3, 3, 50, '2026-02-07 06:30:00', '2026-02-07 08:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 2.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-02-06 06:04:30', '2026-04-24 02:30:01'),
(16, 48, 3, 3, 50, '2026-02-06 19:30:00', '2026-02-06 21:30:00', '2026-02-06 07:02:12', '2026-02-06 09:48:24', 2.7700, 2.0000, 'done', '0', 7, 50.0000, NULL, 'noreason', 0, 47, 48, '2026-02-06 06:06:02', '2026-02-06 09:48:24'),
(17, 52, 3, 3, 51, '2026-02-07 06:30:00', '2026-02-07 08:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 2.0000, 'done', '0', 8, 100.0000, NULL, NULL, 0, 47, NULL, '2026-02-06 06:06:21', '2026-04-24 02:30:01'),
(18, 68, 3, 3, 67, '2026-02-10 13:30:00', '2026-02-10 21:30:00', '2026-02-10 12:49:22', '2026-02-10 12:54:03', 0.0800, 8.0000, 'done', '0', 7, 50.0000, 5, 'some reason', 0, 47, 68, '2026-02-10 12:48:46', '2026-02-10 12:54:03'),
(19, 71, 1, 1, 70, '2026-02-11 08:30:00', '2026-02-11 16:30:00', '2026-02-11 08:22:54', '2026-02-11 08:23:51', 0.0200, 8.0000, 'done', '0', 9, 100.0000, 6, 'res', 1, 1, 1, '2026-02-11 08:18:29', '2026-02-18 08:25:55'),
(20, 72, 1, 1, 55, '2026-02-13 13:30:00', '2026-02-14 13:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 50.0000, NULL, NULL, 1, 1, 1, '2026-02-13 13:35:37', '2026-02-14 13:12:48'),
(21, 73, 1, 1, 74, '2026-02-13 14:40:00', '2026-02-14 02:40:00', '2026-02-13 15:20:34', NULL, NULL, 12.0000, 'inProgress', '0', 10, 100.0000, NULL, NULL, 1, 1, 1, '2026-02-13 14:35:15', '2026-02-14 13:12:56'),
(22, 77, 1, 1, 78, '2026-02-16 07:30:00', '2026-02-17 02:30:00', '2026-02-16 08:50:36', '2026-02-17 08:51:46', 1.0000, 24.0000, 'done', '0', 13, 42.0000, NULL, 'CALL END', 1, 1, 1, '2026-02-18 08:21:05', '2026-03-13 16:03:18'),
(23, 77, 1, 1, 78, '2026-02-19 02:30:00', '2026-02-20 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 42.0000, NULL, NULL, 1, 1, 1, '2026-02-18 08:24:37', '2026-03-13 16:03:28'),
(24, 76, 1, 1, 78, '2026-02-18 08:30:00', '2026-02-19 08:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 33.0000, NULL, NULL, 1, 1, 1, '2026-02-18 09:11:57', '2026-03-13 16:12:40'),
(25, 68, 3, 3, 67, '2026-03-11 07:30:00', '2026-03-11 15:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-03-11 04:53:13', '2026-04-24 02:30:01'),
(26, 82, 3, 3, 67, '2026-03-12 18:30:00', '2026-03-13 02:30:00', '2026-03-12 18:30:00', '2026-03-13 02:30:00', 8.0000, 8.0000, 'done', '0', 8, 100.0000, NULL, NULL, 0, 47, 47, '2026-03-13 08:02:27', '2026-03-13 08:02:37'),
(27, 82, 3, 3, 80, '2026-03-11 18:30:00', '2026-03-12 02:30:00', '2026-03-11 18:30:00', '2026-03-13 02:30:01', 32.0000, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, 47, '2026-03-13 08:03:40', '2026-05-20 04:42:50'),
(28, 81, 3, 3, 80, '2026-03-12 18:30:00', '2026-03-13 02:30:00', '2026-03-12 18:30:00', '2026-03-13 02:30:00', 8.0000, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, 47, '2026-03-13 08:04:32', '2026-03-23 04:58:37'),
(29, 91, 1, 1, 83, '2026-03-09 14:30:00', '2026-03-10 02:30:00', '2026-03-09 14:30:00', '2026-03-10 02:30:00', 12.0000, 24.0000, 'done', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 12:10:53', '2026-06-18 09:47:12'),
(30, 91, 1, 1, 83, '2026-03-10 02:30:00', '2026-03-11 02:30:00', '2026-03-10 02:30:00', '2026-03-11 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 12:12:38', '2026-06-18 09:47:20'),
(31, 91, 1, 1, 83, '2026-03-11 02:30:00', '2026-03-12 02:30:00', '2026-03-11 02:30:00', '2026-03-12 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 12:13:28', '2026-06-18 09:47:29'),
(32, 91, 1, 1, 83, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-13 12:19:24', NULL, NULL, 24.0000, 'inProgress', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 12:14:12', '2026-03-13 17:22:47'),
(33, 77, 1, 1, 78, '2026-03-05 02:30:00', '2026-03-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 41.6600, NULL, NULL, 1, 1, 1, '2026-03-13 15:56:11', '2026-03-13 16:02:46'),
(34, 77, 1, 1, 78, '2026-02-05 05:30:00', '2026-02-06 02:30:00', NULL, NULL, NULL, 21.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:02:15', '2026-03-13 16:12:17'),
(35, 77, 1, 1, 78, '2026-02-06 02:30:00', '2026-02-07 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:05:02', '2026-03-13 16:12:07'),
(36, 77, 1, 1, 78, '2026-02-07 02:30:00', '2026-02-08 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:05:34', '2026-03-13 16:11:34'),
(37, 77, 1, 1, 78, '2026-02-08 02:30:00', '2026-02-09 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:06:43', '2026-03-13 16:11:26'),
(38, 77, 1, 1, 78, '2026-02-09 02:30:00', '2026-02-10 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:07:20', '2026-03-13 16:11:06'),
(39, 77, 1, 1, 78, '2026-02-10 02:30:00', '2026-02-11 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 33.3400, NULL, NULL, 1, 1, 1, '2026-03-13 16:07:55', '2026-03-13 16:10:58'),
(40, 92, 1, 1, 78, '2026-03-01 02:30:00', '2026-03-02 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:14:48', '2026-03-13 17:42:23'),
(41, 92, 1, 1, 78, '2026-03-02 02:30:00', '2026-03-03 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:16:05', '2026-03-13 17:42:18'),
(42, 92, 1, 1, 78, '2026-03-03 02:30:00', '2026-03-04 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:19:10', '2026-03-13 17:42:12'),
(43, 92, 1, 1, 78, '2026-03-04 02:30:00', '2026-03-05 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:20:19', '2026-03-13 17:42:07'),
(44, 92, 1, 1, 78, '2026-03-05 02:30:00', '2026-03-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:21:15', '2026-03-13 17:42:02'),
(45, 92, 1, 1, 78, '2026-03-06 02:30:00', '2026-03-07 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:21:53', '2026-03-13 17:41:51'),
(46, 92, 1, 1, 78, '2026-03-07 02:30:00', '2026-03-08 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:22:32', '2026-03-13 17:41:24'),
(47, 92, 1, 1, 78, '2026-03-08 02:30:00', '2026-03-09 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:23:06', '2026-03-13 17:41:32'),
(48, 92, 1, 1, 78, '2026-03-10 02:30:00', '2026-03-11 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:23:51', '2026-03-13 17:41:39'),
(49, 92, 1, 1, 78, '2026-03-11 02:30:00', '2026-03-12 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:24:28', '2026-03-13 17:41:45'),
(50, 92, 1, 1, 78, '2026-03-12 02:30:00', '2026-03-13 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:25:07', '2026-03-13 17:23:02'),
(51, 92, 1, 1, 78, '2026-03-13 02:30:00', '2026-03-14 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 13, 30.5600, NULL, NULL, 1, 1, 1, '2026-03-13 16:26:11', '2026-03-13 17:22:55'),
(52, 76, 1, 1, 93, '2026-03-01 02:30:00', '2026-03-02 02:30:00', '2026-03-13 17:37:14', NULL, NULL, 24.0000, 'inProgress', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:03:57', '2026-03-13 17:38:58'),
(53, 76, 1, 1, 93, '2026-03-02 02:30:00', '2026-03-03 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:04:54', '2026-03-13 17:39:12'),
(54, 76, 1, 1, 93, '2026-03-03 02:30:00', '2026-03-04 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:05:40', '2026-03-13 17:39:22'),
(55, 76, 1, 1, 93, '2026-03-04 02:30:00', '2026-03-05 02:30:00', NULL, NULL, NULL, 24.0000, 'onHold', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:06:19', '2026-03-13 17:41:02'),
(56, 76, 1, 1, 93, '2026-03-05 02:30:00', '2026-03-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:06:52', '2026-03-13 17:39:35'),
(57, 76, 1, 1, 93, '2026-03-06 02:30:00', '2026-03-07 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:07:31', '2026-03-13 17:40:52'),
(58, 76, 1, 1, 93, '2026-03-07 02:30:00', '2026-03-08 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:07:59', '2026-03-13 17:40:44'),
(59, 76, 1, 1, 93, '2026-03-08 02:30:00', '2026-03-09 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:08:29', '2026-03-13 17:40:39'),
(60, 76, 1, 1, 93, '2026-03-09 02:30:00', '2026-03-10 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:09:04', '2026-03-13 17:40:33'),
(61, 76, 1, 1, 93, '2026-03-10 02:30:00', '2026-03-11 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:09:49', '2026-03-13 17:40:23'),
(62, 76, 1, 1, 93, '2026-03-11 02:30:00', '2026-03-12 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:10:27', '2026-03-13 17:40:14'),
(63, 76, 1, 1, 93, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-13 17:17:14', NULL, NULL, 24.0000, 'inProgress', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:12:40', '2026-03-13 17:22:32'),
(64, 76, 1, 1, 93, '2026-03-13 02:30:00', '2026-03-14 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:13:27', '2026-03-13 17:21:17'),
(65, 76, 1, 1, 93, '2026-03-01 02:30:00', '2026-03-02 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:20:24', '2026-03-13 17:40:06'),
(66, 76, 1, 1, 93, '2026-03-01 02:30:00', '2026-03-02 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:23:47', '2026-03-13 17:39:56'),
(67, 76, 1, 1, 93, '2026-03-01 02:30:00', '2026-03-02 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:35:59', '2026-03-13 17:39:42'),
(68, 76, 1, 1, 93, '2026-03-01 02:30:00', '2026-03-02 02:30:00', '2026-03-02 02:30:04', '2026-03-03 02:30:04', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 17:43:23', '2026-03-13 17:51:13'),
(69, 76, 1, 1, 93, '2026-03-02 02:30:00', '2026-03-03 02:30:00', '2026-03-13 17:49:49', NULL, NULL, 24.0000, 'inProgress', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 17:45:08', '2026-03-13 18:16:52'),
(70, 76, 1, 1, 93, '2026-03-03 02:30:00', '2026-03-04 02:30:00', '2026-03-03 02:30:00', '2026-03-04 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 17:53:27', '2026-03-13 17:54:55'),
(71, 92, 1, 1, 78, '2026-03-01 02:30:00', '2026-03-02 02:30:00', '2026-03-01 02:30:00', '2026-03-02 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 17:57:52', '2026-06-18 09:47:42'),
(72, 76, 1, 1, 93, '2026-03-04 02:30:00', '2026-03-05 02:30:00', '2026-03-04 02:30:00', '2026-03-05 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 17:59:35', '2026-03-13 17:59:55'),
(73, 76, 1, 1, 93, '2026-03-05 02:30:00', '2026-03-06 02:30:00', '2026-03-05 02:30:00', '2026-03-06 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:01:13', '2026-03-13 18:01:30'),
(74, 76, 1, 1, 93, '2026-03-06 02:30:00', '2026-03-07 02:30:00', '2026-03-06 02:30:00', '2026-03-07 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:02:14', '2026-03-13 18:02:27'),
(75, 76, 1, 1, 93, '2026-03-07 02:30:00', '2026-03-08 02:30:00', '2026-03-07 02:30:00', '2026-03-08 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 104.1700, 19, NULL, 0, 1, 1, '2026-03-13 18:02:58', '2026-03-13 18:05:35'),
(76, 76, 1, 1, 93, '2026-03-07 02:30:00', '2026-03-08 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-03-13 18:04:26', '2026-03-13 18:05:24'),
(77, 76, 1, 1, 93, '2026-03-08 02:30:00', '2026-03-09 02:30:00', '2026-03-08 02:30:00', '2026-03-09 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:06:21', '2026-03-13 18:06:40'),
(78, 76, 1, 1, 93, '2026-03-09 02:30:00', '2026-03-10 02:30:00', '2026-03-09 02:30:00', '2026-03-10 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:07:17', '2026-03-13 18:07:34'),
(79, 76, 1, 1, 93, '2026-03-10 02:30:00', '2026-03-11 02:30:00', '2026-03-10 02:30:00', '2026-03-11 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:08:09', '2026-03-13 18:08:28'),
(80, 76, 1, 1, 93, '2026-03-10 02:30:00', '2026-03-11 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 18:09:07', '2026-03-13 18:09:28'),
(81, 76, 1, 1, 93, '2026-03-11 02:30:00', '2026-03-12 02:30:00', '2026-03-11 02:30:00', '2026-03-12 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:10:12', '2026-03-13 18:10:38'),
(82, 76, 1, 1, 93, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-12 02:30:00', '2026-03-13 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:12:12', '2026-03-13 18:12:25'),
(83, 76, 1, 1, 93, '2026-03-13 02:30:00', '2026-03-14 02:30:00', '2026-03-13 02:30:00', '2026-03-14 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:13:08', '2026-03-13 18:13:18'),
(84, 76, 1, 1, 93, '2026-03-14 02:30:00', '2026-03-15 02:30:00', '2026-03-14 02:30:00', '2026-03-15 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:14:16', '2026-03-15 16:26:40'),
(85, 76, 1, 1, 93, '2026-03-02 02:30:00', '2026-03-03 02:30:00', '2026-03-02 02:30:00', '2026-03-03 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-13 18:15:16', '2026-03-13 18:16:17'),
(86, 92, 1, 1, 78, '2026-03-02 02:30:00', '2026-03-03 02:30:00', '2026-03-02 02:30:00', '2026-03-03 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:19:41', '2026-06-18 09:48:16'),
(87, 92, 1, 1, 78, '2026-03-03 02:30:00', '2026-03-04 02:30:00', '2026-03-03 02:30:00', '2026-03-04 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:20:51', '2026-06-18 09:48:22'),
(88, 92, 1, 1, 78, '2026-03-04 02:30:00', '2026-03-05 02:30:00', '2026-03-04 02:30:00', '2026-03-05 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:22:09', '2026-06-18 09:48:30'),
(89, 92, 1, 1, 78, '2026-03-05 02:30:00', '2026-03-06 02:30:00', '2026-03-05 02:30:00', '2026-03-06 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:23:15', '2026-06-18 09:48:48'),
(90, 92, 1, 1, 78, '2026-03-06 02:30:00', '2026-03-07 02:30:00', '2026-03-06 02:30:00', '2026-03-07 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:24:13', '2026-06-18 09:48:57'),
(91, 92, 1, 1, 78, '2026-03-07 02:30:00', '2026-03-08 02:30:00', '2026-03-07 02:30:00', '2026-03-08 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:25:02', '2026-06-18 09:49:05'),
(92, 92, 1, 1, 78, '2026-03-08 02:30:00', '2026-03-09 02:30:00', '2026-03-08 02:30:00', '2026-03-09 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:25:57', '2026-06-18 09:49:12'),
(93, 92, 1, 1, 78, '2026-03-09 02:30:00', '2026-03-10 02:30:00', '2026-03-09 02:30:00', '2026-03-10 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:26:48', '2026-06-18 09:48:41'),
(94, 92, 1, 1, 78, '2026-03-10 02:30:00', '2026-03-11 02:30:00', '2026-03-10 02:30:00', '2026-03-11 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:27:43', '2026-06-18 09:49:18'),
(95, 92, 1, 1, 78, '2026-03-11 02:30:00', '2026-03-12 02:30:00', '2026-03-11 02:30:00', '2026-03-12 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:28:37', '2026-06-18 09:49:25'),
(96, 92, 1, 1, 78, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-12 02:30:00', '2026-03-13 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:29:30', '2026-06-18 09:49:31'),
(97, 92, 1, 1, 78, '2026-03-13 02:30:00', '2026-03-14 02:30:00', '2026-03-13 02:30:00', '2026-03-14 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:30:28', '2026-06-18 09:49:41'),
(98, 92, 1, 1, 78, '2026-03-14 02:30:00', '2026-03-15 02:30:00', '2026-03-14 02:30:00', '2026-03-15 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-13 18:32:13', '2026-06-18 09:49:48'),
(99, 91, 1, 1, 83, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-12 02:30:00', '2026-03-13 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-13 18:36:59', '2026-06-18 09:49:54'),
(100, 91, 1, 1, 83, '2026-03-13 02:30:00', '2026-03-14 02:30:00', '2026-03-13 02:30:00', '2026-03-14 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-13 18:38:03', '2026-06-18 09:50:00'),
(101, 91, 1, 1, 83, '2026-03-14 02:30:00', '2026-03-15 02:30:00', '2026-03-14 02:30:00', '2026-03-15 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-13 18:39:16', '2026-06-18 09:50:06'),
(102, 77, 1, 1, 94, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-03-12 02:30:00', '2026-03-13 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-03-13 19:08:45', '2026-03-15 18:45:05'),
(103, 76, 1, 1, 93, '2026-03-15 02:30:00', '2026-03-16 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-03-15 16:46:04', '2026-03-15 16:48:19'),
(104, 76, 1, 1, 93, '2026-03-15 02:30:00', '2026-03-16 02:30:00', '2026-03-15 17:47:30', '2026-03-16 17:47:30', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-15 16:50:56', '2026-03-18 14:01:15'),
(105, 91, 1, 1, 83, '2026-03-15 02:30:00', '2026-03-16 02:30:00', '2026-03-15 17:44:14', '2026-03-16 17:44:14', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, 'Patient side work', 1, 1, 1, '2026-03-15 16:52:11', '2026-06-18 09:50:14'),
(106, 92, 1, 1, 78, '2026-03-15 02:30:00', '2026-03-16 02:30:00', '2026-03-15 18:02:52', '2026-03-16 18:02:52', 24.0000, 24.0000, 'done', '0', 13, 33.5500, NULL, 'LAST DAY MY TASKE COMLIT', 1, 1, 1, '2026-03-15 16:52:59', '2026-06-18 09:50:38'),
(107, 76, 1, 1, 93, '2026-03-16 02:30:00', '2026-03-17 02:30:00', '2026-03-16 02:34:24', '2026-03-17 02:34:24', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Due to patient ', 0, 1, 1, '2026-03-15 18:38:56', '2026-03-18 14:05:14'),
(108, 91, 1, 1, 83, '2026-03-16 02:30:00', '2026-03-17 02:30:00', '2026-03-16 03:56:40', '2026-03-17 03:56:40', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, 'Patient side work', 1, 1, 1, '2026-03-15 18:40:44', '2026-06-18 09:50:25'),
(109, 92, 1, 1, 78, '2026-03-16 02:30:00', '2026-03-17 02:30:00', '2026-03-16 07:47:47', '2026-03-16 08:14:29', 0.4400, 24.0000, 'done', '0', 13, 30.5500, NULL, 'Patient shift to hospital', 1, 1, 1, '2026-03-15 18:42:28', '2026-03-16 08:18:21'),
(110, 92, 1, 1, 78, '2026-03-15 18:30:00', '2026-03-16 18:30:00', NULL, NULL, NULL, 24.0000, 'onHold', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-16 08:14:44', '2026-03-16 08:22:04'),
(111, 92, 1, 1, 78, '2026-03-16 02:30:00', '2026-03-17 02:30:00', '2026-03-16 08:19:29', '2026-03-17 08:19:29', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-16 08:19:05', '2026-06-18 09:50:32'),
(112, 91, 1, 1, 83, '2026-03-17 02:30:00', '2026-03-18 02:30:00', '2026-03-17 02:50:39', '2026-03-18 02:50:39', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-16 22:11:14', '2026-06-18 09:50:44'),
(113, 76, 1, 1, 93, '2026-03-17 02:30:00', '2026-03-18 02:30:00', '2026-03-17 08:24:16', '2026-03-18 08:24:16', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Patient work ', 0, 1, 1, '2026-03-16 22:12:13', '2026-03-18 13:59:06'),
(114, 92, 1, 1, 78, '2026-03-17 02:30:00', '2026-03-18 02:30:00', '2026-03-17 08:51:54', '2026-03-18 08:51:54', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, 'I AM LET', 1, 1, 1, '2026-03-17 08:50:26', '2026-06-18 09:50:51'),
(115, 92, 1, 1, 78, '2026-03-18 02:30:00', '2026-03-19 02:30:00', '2026-03-18 13:41:47', '2026-03-19 19:09:28', 29.4600, 24.0000, 'done', '0', 13, 30.5500, NULL, 'LET', 1, 1, 1, '2026-03-17 17:58:14', '2026-06-18 09:51:00'),
(116, 91, 1, 1, 83, '2026-03-18 02:30:00', '2026-03-19 02:30:00', '2026-03-18 02:30:15', '2026-03-19 03:16:33', 24.7700, 24.0000, 'done', '0', 10, 66.6600, NULL, 'Network problem ', 1, 1, 1, '2026-03-17 17:59:05', '2026-06-18 09:51:06'),
(117, 76, 1, 1, 93, '2026-03-18 02:30:00', '2026-03-19 02:30:00', '2026-03-18 02:30:12', '2026-03-19 02:30:12', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'At patient side ', 0, 1, 1, '2026-03-17 17:59:53', '2026-05-19 18:26:01'),
(118, 91, 1, 1, 83, '2026-03-19 02:30:00', '2026-03-20 02:30:00', '2026-03-19 03:16:36', '2026-03-20 02:39:55', 23.3900, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-18 22:27:20', '2026-06-18 09:51:13'),
(119, 76, 1, 1, 93, '2026-03-19 02:30:00', '2026-03-20 02:30:00', '2026-03-19 02:30:49', '2026-03-20 02:30:49', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Patient side', 0, 1, 1, '2026-03-18 22:28:24', '2026-05-19 18:27:16'),
(120, 92, 1, 1, 78, '2026-03-19 02:30:00', '2026-03-20 02:30:00', '2026-03-19 19:09:38', '2026-03-21 20:17:39', 49.1300, 24.0000, 'done', '0', 13, 30.5500, NULL, 'for let', 1, 1, 1, '2026-03-18 22:29:38', '2026-06-18 09:51:18'),
(121, 92, 1, 1, 78, '2026-03-20 02:30:00', '2026-03-21 02:30:00', '2026-03-20 02:30:00', '2026-03-21 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-19 19:05:44', '2026-06-18 09:51:24'),
(122, 91, 1, 1, 83, '2026-03-20 02:30:00', '2026-03-21 02:30:00', '2026-03-20 02:39:58', '2026-03-21 02:39:58', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-19 19:06:31', '2026-06-18 09:51:30'),
(123, 76, 1, 1, 93, '2026-03-20 02:30:00', '2026-03-21 02:30:00', '2026-03-20 03:58:22', '2026-03-21 03:58:22', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-19 19:07:13', '2026-03-21 13:03:40'),
(124, 92, 1, 1, 78, '2026-03-21 02:30:00', '2026-03-22 02:30:00', '2026-03-21 02:30:45', '2026-03-22 02:30:45', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-21 13:04:53', '2026-06-18 09:51:37'),
(125, 91, 1, 1, 83, '2026-03-21 02:30:00', '2026-03-22 02:30:00', '2026-03-21 13:21:45', '2026-03-22 03:22:44', 14.0200, 24.0000, 'done', '0', 10, 66.6600, NULL, 'Patient side work', 1, 1, 1, '2026-03-21 13:05:35', '2026-06-18 09:51:42'),
(126, 76, 1, 1, 93, '2026-03-21 02:30:00', '2026-03-22 02:30:00', '2026-03-21 02:30:00', '2026-03-22 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-21 13:06:07', '2026-03-21 20:22:49'),
(127, 97, 1, 1, 96, '2026-03-21 02:30:00', '2026-03-21 14:30:00', '2026-03-21 02:30:14', '2026-03-21 14:30:26', 12.0000, 12.0000, 'done', '0', 10, 75.0000, NULL, 'Duty is over', 1, 1, 1, '2026-03-21 16:35:03', '2026-03-21 19:39:18'),
(128, 97, 1, 1, 96, '2026-03-21 02:30:00', '2026-03-21 14:30:00', '2026-03-21 02:30:00', '2026-03-21 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-03-21 20:15:26', '2026-03-23 21:07:11'),
(129, 99, 1, 1, 96, '2026-03-21 14:30:00', '2026-03-22 02:30:00', '2026-03-21 14:30:00', '2026-03-22 02:30:00', 12.0000, 12.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-03-21 20:16:08', '2026-03-23 21:07:25'),
(130, 92, 1, 1, 78, '2026-03-22 02:30:00', '2026-03-23 02:30:00', '2026-03-22 02:30:00', '2026-03-23 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-21 20:19:02', '2026-06-18 09:51:51'),
(131, 97, 1, 1, 96, '2026-03-22 02:30:00', '2026-03-22 14:30:00', '2026-03-22 03:25:19', '2026-03-22 12:27:39', 9.0400, 12.0000, 'done', '0', 10, 75.0000, NULL, 'Due to death', 1, 1, 1, '2026-03-21 20:24:33', '2026-03-23 21:07:36'),
(132, 76, 1, 1, 93, '2026-03-22 02:30:00', '2026-03-23 02:30:00', '2026-03-23 02:30:04', '2026-03-24 02:30:04', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Patient work', 0, 1, 1, '2026-03-21 20:25:09', '2026-05-19 18:28:36'),
(133, 91, 1, 1, 83, '2026-03-22 02:30:00', '2026-03-23 02:30:00', '2026-03-22 03:22:49', '2026-03-23 03:22:49', 24.0000, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-21 20:25:51', '2026-06-18 09:51:59'),
(134, 92, 1, 1, 78, '2026-03-23 02:30:00', '2026-03-24 02:30:00', '2026-03-23 02:30:00', '2026-03-24 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-22 17:31:35', '2026-06-18 09:52:04'),
(135, 91, 1, 1, 83, '2026-03-23 02:30:00', '2026-03-24 02:30:00', '2026-03-23 02:34:16', '2026-03-24 02:40:50', 24.1100, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-22 17:32:04', '2026-06-18 09:52:17'),
(136, 76, 1, 1, 93, '2026-03-23 02:30:00', '2026-03-24 02:30:00', '2026-03-23 02:30:33', '2026-03-24 02:30:33', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Patient work', 0, 1, 1, '2026-03-22 17:32:37', '2026-05-19 18:29:30'),
(137, 88, 3, 3, 66, '2026-03-07 18:30:00', '2026-03-08 02:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-03-23 04:57:52', '2026-04-24 02:30:01'),
(138, 76, 1, 1, 93, '2026-03-24 02:30:00', '2026-03-25 02:30:00', '2026-03-24 02:30:10', '2026-03-25 02:30:10', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, 'Patient side', 0, 1, 1, '2026-03-23 20:19:21', '2026-05-19 18:30:21'),
(139, 91, 1, 1, 83, '2026-03-24 02:30:00', '2026-03-25 02:30:00', '2026-03-24 02:40:52', '2026-03-25 02:17:18', 23.6100, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-23 20:19:47', '2026-06-18 09:52:11'),
(140, 92, 1, 1, 78, '2026-03-24 02:30:00', '2026-03-25 02:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-03-23 20:20:17', '2026-06-18 09:52:35'),
(141, 100, 1, 1, 96, '2026-03-21 02:30:00', '2026-03-22 02:30:00', '2026-03-21 02:30:00', '2026-03-22 02:30:00', 24.0000, 24.0000, 'done', '0', 13, 33.3300, NULL, NULL, 1, 1, 1, '2026-03-23 20:47:03', '2026-03-23 21:07:49'),
(142, 100, 1, 1, 96, '2026-03-22 02:30:00', '2026-03-22 14:30:00', '2026-03-22 02:30:00', '2026-03-22 14:30:00', 12.0000, 12.0000, 'done', '0', 13, 33.3300, NULL, NULL, 1, 1, 1, '2026-03-23 20:48:24', '2026-03-23 21:07:56'),
(143, 97, 1, 1, 101, '2026-03-21 02:30:00', '2026-03-21 14:30:00', '2026-03-21 02:30:00', '2026-03-21 14:30:00', 12.0000, 12.0000, 'done', '1', 10, 75.0000, 14, NULL, 0, 1, 1, '2026-03-23 21:20:05', '2026-03-23 21:20:33'),
(144, 99, 1, 1, 101, '2026-03-21 14:30:00', '2026-03-22 02:30:00', '2026-03-21 14:30:00', '2026-03-22 02:30:00', 12.0000, 12.0000, 'done', '1', 14, 75.0000, 15, NULL, 0, 1, 1, '2026-03-23 21:21:27', '2026-03-23 21:21:58'),
(145, 97, 1, 1, 101, '2026-03-22 02:30:00', '2026-03-22 14:30:00', '2026-03-22 02:30:00', '2026-03-22 14:30:00', 12.0000, 12.0000, 'done', '1', 10, 75.0000, 14, NULL, 0, 1, 1, '2026-03-23 21:22:45', '2026-05-19 17:26:35'),
(146, 100, 1, 1, 101, '2026-03-21 02:30:00', '2026-03-22 02:30:00', '2026-03-20 22:30:00', '2026-03-21 22:30:00', 24.0000, 24.0000, 'done', '0', 13, 33.3300, NULL, NULL, 1, 1, 1, '2026-03-23 21:24:30', '2026-06-18 09:52:28'),
(147, 76, 1, 1, 93, '2026-03-25 02:30:00', '2026-03-26 02:30:00', '2026-03-25 02:30:54', '2026-03-26 02:30:54', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 19, NULL, 0, 1, 1, '2026-03-25 06:30:52', '2026-05-19 18:31:18'),
(148, 91, 1, 1, 83, '2026-03-25 02:30:00', '2026-03-26 02:30:00', '2026-03-26 04:54:19', '2026-04-24 02:30:01', 693.5949, 24.0000, 'done', '0', 10, 66.6600, NULL, NULL, 1, 1, 1, '2026-03-25 06:31:28', '2026-06-18 09:52:42'),
(149, 92, 1, 1, 78, '2026-03-25 02:30:00', '2026-03-26 02:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 24.0000, 'done', '0', 13, 41.6600, NULL, NULL, 1, 1, 1, '2026-03-25 07:06:52', '2026-06-18 09:52:49'),
(150, 88, 3, 3, 67, '2026-03-31 18:30:00', '2026-04-01 02:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-04-01 07:24:31', '2026-04-24 02:30:02'),
(151, 88, 3, 3, 80, '2026-04-02 18:30:00', '2026-04-03 02:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-04-03 06:06:45', '2026-04-24 02:30:02'),
(152, 91, 1, 1, 83, '2026-04-03 11:30:00', '2026-04-04 11:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-04-03 12:04:29', '2026-06-18 09:52:55'),
(153, 76, 1, 1, 83, '2026-04-03 11:30:00', '2026-04-04 11:30:00', '2026-03-12 02:30:00', '2026-03-13 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-04-03 12:05:12', '2026-05-19 18:11:51'),
(154, 92, 1, 1, 83, '2026-04-03 11:30:00', '2026-04-04 11:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 24.0000, 'done', '0', 13, 30.5500, NULL, NULL, 1, 1, 1, '2026-04-03 12:05:48', '2026-06-18 09:53:02'),
(155, 100, 1, 1, 83, '2026-04-03 11:30:00', '2026-04-04 11:30:00', NULL, '2026-04-24 02:30:01', 493610.5002, 24.0000, 'done', '0', 13, 30.5555, NULL, NULL, 1, 1, 1, '2026-04-03 12:09:35', '2026-06-18 09:53:10'),
(156, 49, 3, 3, 64, '2026-04-22 18:30:00', '2026-04-23 02:30:00', '2026-04-23 09:52:14', '2026-04-23 09:55:47', 0.0400, 8.0000, 'done', '0', 7, 50.0000, NULL, 'end', 0, 47, 47, '2026-04-23 09:52:06', '2026-04-23 09:55:47'),
(157, 79, 3, 3, 67, '2026-05-18 18:30:00', '2026-05-19 02:30:00', '2026-05-19 07:26:30', '2026-05-19 07:27:14', 0.0100, 8.0000, 'done', '0', 7, 50.0000, NULL, 'r', 0, 47, 47, '2026-05-19 07:26:11', '2026-05-19 07:27:14'),
(158, 104, 1, 1, 103, '2026-05-18 18:30:00', '2026-05-19 02:30:00', '2026-05-19 07:54:09', '2026-05-19 07:55:51', 0.0300, 8.0000, 'done', '1', 10, 104.1700, 13, 're', 1, 1, 1, '2026-05-19 07:53:56', '2026-05-19 17:23:54'),
(159, 82, 3, 3, 80, '2026-05-18 18:30:00', '2026-05-19 02:30:00', '2026-05-19 08:01:49', '2026-05-20 02:30:01', 18.4699, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 0, 47, NULL, '2026-05-19 08:01:47', '2026-05-20 02:30:00'),
(160, 88, 3, 3, 67, '2026-05-18 18:30:00', '2026-05-19 02:30:00', '2026-05-19 08:00:07', '2026-05-19 08:15:07', 0.2000, 8.0000, 'done', '0', 7, 50.0000, NULL, 'twertw', 0, 47, 47, '2026-05-19 08:05:03', '2026-05-19 08:12:04'),
(161, 88, 3, 3, 80, '2026-05-17 19:35:00', '2026-05-18 03:35:00', NULL, '2026-05-20 02:30:01', 494234.5001, 8.0000, 'done', '0', 8, 100.0000, NULL, NULL, 0, 47, NULL, '2026-05-19 08:28:19', '2026-05-20 02:30:01'),
(162, 88, 3, 3, 80, '2026-05-17 18:30:00', '2026-05-18 02:30:00', '2026-05-19 08:30:40', '2026-05-19 08:32:36', 0.0167, 8.0000, 'done', '0', 7, 50.0000, NULL, 'asda', 0, 47, 47, '2026-05-19 08:29:58', '2026-05-19 08:33:16'),
(163, 82, 3, 3, 80, '2026-05-18 18:30:00', '2026-05-19 02:30:00', '2026-05-19 11:40:18', '2026-05-19 11:49:18', 0.1333, 8.0000, 'done', '0', 7, 50.0000, NULL, 'end', 0, 47, 47, '2026-05-19 11:41:42', '2026-05-19 11:44:14'),
(164, 97, 1, 1, 101, '2026-05-21 02:30:00', '2026-05-21 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:30:45', '2026-05-19 17:33:30'),
(165, 76, 1, 1, 93, '2026-03-12 02:30:00', '2026-03-13 02:30:00', '2026-05-19 18:05:51', '2026-05-19 18:08:09', 0.0400, 24.0000, 'done', '0', 10, 1666.0000, NULL, 'done', 1, 1, 1, '2026-05-19 17:52:55', '2026-05-19 18:20:45'),
(166, 76, 1, 1, 93, '2026-03-13 02:30:00', '2026-03-14 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:53:28', '2026-05-19 18:19:51'),
(167, 76, 1, 1, 93, '2026-03-14 02:30:00', '2026-03-15 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:53:56', '2026-05-19 18:19:37'),
(168, 76, 1, 1, 93, '2026-03-15 02:30:00', '2026-03-16 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:54:28', '2026-05-19 18:19:23'),
(169, 76, 1, 1, 93, '2026-03-16 02:30:00', '2026-03-17 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-05-19 17:54:51', '2026-05-19 18:19:06'),
(170, 76, 1, 1, 93, '2026-03-17 02:30:00', '2026-03-18 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:56:05', '2026-05-19 18:18:56'),
(171, 76, 1, 1, 93, '2026-03-18 02:30:00', '2026-03-19 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:56:36', '2026-05-19 18:18:48'),
(172, 76, 1, 1, 93, '2026-03-19 02:30:00', '2026-03-20 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-05-19 17:57:00', '2026-05-19 18:18:37'),
(173, 76, 1, 1, 93, '2026-03-20 02:30:00', '2026-03-21 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:57:36', '2026-05-19 18:18:18'),
(174, 76, 1, 1, 93, '2026-03-21 02:30:00', '2026-03-22 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 17:58:03', '2026-05-19 18:18:08'),
(175, 76, 1, 1, 93, '2026-03-22 02:30:00', '2026-03-23 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-05-19 17:58:28', '2026-05-19 18:17:59'),
(176, 76, 1, 1, 93, '2026-03-23 02:30:00', '2026-03-24 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 18:00:05', '2026-05-19 18:17:50'),
(177, 76, 1, 1, 93, '2026-03-24 02:30:00', '2026-03-25 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 18:01:07', '2026-05-19 18:17:26'),
(178, 76, 1, 1, 93, '2026-03-25 02:30:00', '2026-03-26 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 1666.0000, NULL, NULL, 1, 1, 1, '2026-05-19 18:01:32', '2026-05-19 18:17:15'),
(179, 76, 1, 1, 93, '2026-03-26 02:30:00', '2026-03-27 02:30:00', '2026-03-26 02:30:00', '2026-03-27 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:02:21', '2026-05-19 18:31:58'),
(180, 76, 1, 1, 93, '2026-03-27 02:30:00', '2026-03-28 02:30:00', '2026-03-27 02:30:00', '2026-03-28 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:02:53', '2026-05-19 18:32:26'),
(181, 76, 1, 1, 93, '2026-03-28 02:30:00', '2026-03-29 02:30:00', '2026-03-28 02:30:00', '2026-03-29 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:03:21', '2026-05-19 18:33:00'),
(182, 76, 1, 1, 93, '2026-03-29 02:30:00', '2026-03-30 02:30:00', '2026-03-29 02:30:00', '2026-03-30 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:03:54', '2026-05-19 18:33:22'),
(183, 76, 1, 1, 93, '2026-05-30 02:30:00', '2026-05-31 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-05-19 18:05:12', '2026-05-19 18:11:04'),
(184, 76, 1, 1, 93, '2026-03-30 02:30:00', '2026-03-31 02:30:00', '2026-03-30 02:30:00', '2026-03-31 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:24:21', '2026-05-19 18:34:16'),
(185, 76, 1, 1, 93, '2026-03-31 02:30:00', '2026-04-01 02:30:00', '2026-03-31 02:30:00', '2026-04-01 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 1666.0000, 19, NULL, 0, 1, 1, '2026-05-19 18:37:27', '2026-05-19 18:37:52'),
(186, 76, 1, 1, 93, '2026-04-01 02:30:00', '2026-04-02 02:30:00', '2026-04-01 02:30:00', '2026-04-02 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:05:24', '2026-06-13 14:29:09'),
(187, 76, 1, 1, 93, '2026-04-02 02:30:00', '2026-04-03 02:30:00', '2026-04-02 02:30:00', '2026-04-03 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:06:30', '2026-06-13 14:31:14'),
(188, 76, 1, 1, 93, '2026-04-03 02:30:00', '2026-04-04 02:30:00', '2026-04-03 02:30:00', '2026-04-04 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:07:05', '2026-06-13 14:32:15'),
(189, 76, 1, 1, 93, '2026-04-04 02:30:00', '2026-04-05 02:30:00', '2026-04-04 02:30:00', '2026-04-05 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:08:35', '2026-06-13 14:32:58'),
(190, 76, 1, 1, 93, '2026-04-05 02:30:00', '2026-04-06 02:30:00', '2026-04-05 02:30:00', '2026-04-06 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:10:01', '2026-06-13 14:33:45'),
(191, 76, 1, 1, 93, '2026-04-06 02:30:00', '2026-04-07 02:30:00', '2026-04-06 02:30:00', '2026-04-07 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:11:23', '2026-06-13 14:34:21'),
(192, 76, 1, 1, 93, '2026-04-07 02:30:00', '2026-04-08 02:30:00', '2026-04-07 02:30:00', '2026-04-08 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:12:01', '2026-06-13 14:34:57'),
(193, 76, 1, 1, 93, '2026-04-08 02:30:00', '2026-04-09 02:30:00', '2026-04-08 02:30:00', '2026-04-09 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:12:31', '2026-06-13 14:35:32'),
(194, 76, 1, 1, 93, '2026-04-09 02:30:00', '2026-04-10 02:30:00', '2026-04-09 02:30:00', '2026-04-10 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:13:03', '2026-06-13 14:36:02'),
(195, 76, 1, 1, 93, '2026-04-10 02:30:00', '2026-04-11 02:30:00', '2026-04-10 02:30:00', '2026-04-11 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:14:04', '2026-06-13 14:37:08'),
(196, 76, 1, 1, 93, '2026-04-11 02:30:00', '2026-04-12 02:30:00', '2026-04-11 02:30:00', '2026-04-12 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:15:14', '2026-06-13 14:37:50'),
(197, 76, 1, 1, 93, '2026-04-12 02:30:00', '2026-04-13 02:30:00', '2026-04-12 02:30:00', '2026-04-13 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:15:43', '2026-06-13 14:38:54'),
(198, 76, 1, 1, 93, '2026-04-13 02:30:00', '2026-04-14 02:30:00', '2026-04-13 02:30:00', '2026-04-14 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:16:10', '2026-06-13 14:39:40'),
(199, 76, 1, 1, 93, '2026-04-14 02:30:00', '2026-04-15 02:30:00', '2026-04-14 02:30:00', '2026-04-15 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:16:50', '2026-06-13 14:40:13'),
(200, 76, 1, 1, 93, '2026-04-15 02:30:00', '2026-04-16 02:30:00', '2026-04-15 02:30:00', '2026-04-16 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:17:33', '2026-06-13 14:40:41'),
(201, 76, 1, 1, 93, '2026-04-16 02:30:00', '2026-04-17 02:30:00', '2026-04-16 02:30:00', '2026-04-17 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:18:04', '2026-06-13 14:41:20'),
(202, 76, 1, 1, 93, '2026-04-17 02:30:00', '2026-04-18 02:30:00', '2026-04-17 02:30:00', '2026-04-18 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:18:36', '2026-06-13 14:42:25'),
(203, 76, 1, 1, 93, '2026-04-18 02:30:00', '2026-04-19 02:30:00', '2026-04-18 02:30:00', '2026-04-19 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:19:05', '2026-06-13 14:43:16'),
(204, 76, 1, 1, 93, '2026-04-19 02:30:00', '2026-04-20 02:30:00', '2026-04-19 02:30:00', '2026-04-20 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:19:33', '2026-06-13 14:44:10'),
(205, 76, 1, 1, 93, '2026-04-20 02:30:00', '2026-04-21 02:30:00', '2026-04-20 02:30:00', '2026-04-21 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:20:15', '2026-06-13 14:44:39'),
(206, 76, 1, 1, 93, '2026-04-21 02:30:00', '2026-04-22 02:30:00', '2026-04-21 02:30:00', '2026-04-22 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:20:56', '2026-06-13 14:46:00'),
(207, 76, 1, 1, 93, '2026-04-22 02:30:00', '2026-04-23 02:30:00', '2026-04-22 02:30:00', '2026-04-23 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:21:44', '2026-06-13 14:47:10'),
(208, 76, 1, 1, 93, '2026-04-23 02:30:00', '2026-04-24 02:30:00', '2026-04-23 02:30:00', '2026-04-24 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:22:17', '2026-06-13 14:48:24'),
(209, 76, 1, 1, 93, '2026-04-24 02:30:00', '2026-04-25 02:30:00', '2026-04-24 02:30:00', '2026-04-25 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:23:09', '2026-06-13 14:49:03'),
(210, 76, 1, 1, 93, '2026-04-25 02:30:00', '2026-04-26 02:30:00', '2026-04-25 02:30:00', '2026-04-26 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:23:49', '2026-06-13 14:49:30'),
(211, 76, 1, 1, 93, '2026-04-26 02:30:00', '2026-04-27 02:30:00', '2026-04-26 02:30:00', '2026-04-27 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 104.1700, 20, NULL, 0, 1, 1, '2026-06-13 14:24:20', '2026-06-13 14:50:04'),
(212, 76, 1, 1, 93, '2026-04-27 02:30:00', '2026-04-28 02:30:00', '2026-04-27 02:30:00', '2026-04-28 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:24:59', '2026-06-13 14:50:29'),
(213, 76, 1, 1, 93, '2026-04-28 02:30:00', '2026-04-29 02:30:00', '2026-04-28 02:30:00', '2026-04-29 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:25:40', '2026-06-13 14:50:57'),
(214, 76, 1, 1, 93, '2026-04-29 02:30:00', '2026-04-30 02:30:00', '2026-04-29 02:30:00', '2026-04-30 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:26:22', '2026-06-13 14:51:27'),
(215, 76, 1, 1, 93, '2026-04-30 02:30:00', '2026-05-01 02:30:00', '2026-04-30 02:30:00', '2026-05-01 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 20, NULL, 0, 1, 1, '2026-06-13 14:26:56', '2026-06-13 14:52:26'),
(216, 76, 1, 1, 93, '2026-05-01 02:30:00', '2026-05-02 02:30:00', '2026-05-01 02:30:00', '2026-05-02 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:34:46', '2026-06-17 15:04:09'),
(217, 76, 1, 1, 93, '2026-05-02 02:30:00', '2026-05-03 02:30:00', '2026-05-02 02:30:00', '2026-05-03 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 64.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:35:22', '2026-06-17 15:05:17'),
(218, 76, 1, 1, 93, '2026-05-03 02:30:00', '2026-05-04 02:30:00', '2026-05-03 02:30:00', '2026-05-04 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:36:15', '2026-06-17 15:06:01'),
(219, 76, 1, 1, 93, '2026-05-04 02:30:00', '2026-05-05 02:30:00', '2026-05-04 02:30:00', '2026-05-05 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:36:56', '2026-06-17 15:06:32'),
(220, 76, 1, 1, 93, '2026-05-05 02:30:00', '2026-05-06 02:30:00', '2026-05-05 02:30:00', '2026-05-06 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:37:49', '2026-06-17 15:06:58'),
(221, 76, 1, 1, 93, '2026-05-06 02:30:00', '2026-05-07 02:30:00', '2026-05-06 02:30:00', '2026-05-07 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:38:29', '2026-06-17 15:07:36'),
(222, 76, 1, 1, 93, '2026-05-07 02:30:00', '2026-05-08 02:30:00', '2026-05-07 02:30:00', '2026-05-08 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:39:00', '2026-06-17 15:07:56'),
(223, 76, 1, 1, 93, '2026-05-08 02:30:00', '2026-05-09 02:30:00', '2026-05-08 02:30:00', '2026-05-09 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:45:25', '2026-06-17 15:08:18'),
(224, 76, 1, 1, 93, '2026-05-09 02:30:00', '2026-05-10 02:30:00', '2026-05-09 02:30:00', '2026-05-10 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:46:13', '2026-06-17 15:08:46'),
(225, 76, 1, 1, 93, '2026-05-10 02:30:00', '2026-05-11 02:30:00', '2026-05-10 02:30:00', '2026-05-11 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:47:07', '2026-06-17 15:09:19'),
(226, 76, 1, 1, 93, '2026-05-11 02:30:00', '2026-05-12 02:30:00', '2026-05-11 02:30:00', '2026-05-12 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:48:06', '2026-06-17 15:09:39'),
(227, 76, 1, 1, 93, '2026-05-12 02:30:00', '2026-05-13 02:30:00', '2026-05-12 02:30:00', '2026-05-13 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:48:51', '2026-06-17 15:10:17'),
(228, 76, 1, 1, 93, '2026-05-13 02:30:00', '2026-05-14 02:30:00', '2026-05-13 02:30:00', '2026-05-14 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:49:24', '2026-06-17 15:10:42'),
(229, 76, 1, 1, 93, '2026-05-15 02:30:00', '2026-05-16 02:30:00', '2026-05-15 02:30:00', '2026-05-16 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:50:27', '2026-06-17 15:11:11'),
(230, 76, 1, 1, 93, '2026-05-16 02:30:00', '2026-05-17 02:30:00', '2026-05-16 02:30:00', '2026-05-17 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:50:58', '2026-06-17 15:11:42'),
(231, 76, 1, 1, 93, '2026-05-17 02:30:00', '2026-05-18 02:30:00', '2026-05-17 02:30:00', '2026-05-18 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:51:41', '2026-06-17 15:12:06'),
(232, 76, 1, 1, 93, '2026-05-18 02:30:00', '2026-05-19 02:30:00', '2026-05-18 02:30:00', '2026-05-19 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:52:07', '2026-06-17 15:12:32'),
(233, 76, 1, 1, 93, '2026-05-19 02:30:00', '2026-05-20 02:30:00', '2026-05-19 02:30:00', '2026-05-20 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:52:43', '2026-06-17 15:13:24'),
(234, 76, 1, 1, 93, '2026-05-25 02:30:00', '2026-05-26 02:30:00', '2026-05-25 02:30:00', '2026-05-26 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:53:17', '2026-06-17 15:12:57'),
(235, 76, 1, 1, 93, '2026-05-26 02:30:00', '2026-05-27 02:30:00', '2026-05-26 02:30:00', '2026-05-27 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:53:47', '2026-06-17 15:13:50'),
(236, 76, 1, 1, 93, '2026-05-27 02:30:00', '2026-05-28 02:30:00', '2026-05-27 02:30:00', '2026-05-28 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:54:19', '2026-06-17 15:14:13'),
(237, 76, 1, 1, 93, '2026-05-28 02:30:00', '2026-05-29 02:30:00', '2026-05-28 02:30:00', '2026-05-29 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:54:50', '2026-06-17 15:14:40'),
(238, 76, 1, 1, 93, '2026-05-29 02:30:00', '2026-05-30 02:30:00', '2026-05-29 02:30:00', '2026-05-30 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:55:22', '2026-06-17 15:15:07'),
(239, 76, 1, 1, 93, '2026-05-30 02:30:00', '2026-05-31 02:30:00', '2026-05-30 02:30:00', '2026-05-31 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:55:52', '2026-06-17 15:15:40'),
(240, 76, 1, 1, 93, '2026-05-31 02:30:00', '2026-06-01 02:30:00', '2026-05-31 02:30:00', '2026-06-01 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:56:21', '2026-06-17 15:16:02'),
(241, 76, 1, 1, 93, '2026-05-14 02:30:00', '2026-05-15 02:30:00', '2026-05-14 02:30:00', '2026-05-15 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:58:38', '2026-06-17 15:16:23'),
(242, 76, 1, 1, 93, '2026-05-20 02:30:00', '2026-05-21 02:30:00', '2026-05-20 02:30:00', '2026-05-21 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:59:11', '2026-06-17 15:17:08'),
(243, 76, 1, 1, 93, '2026-05-21 02:30:00', '2026-05-22 02:30:00', '2026-05-21 02:30:00', '2026-05-22 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 14:59:42', '2026-06-17 15:17:33');
INSERT INTO `staff_activity` (`id`, `user_id`, `account_id`, `branch_id`, `customer_id`, `from_date_time`, `to_date_time`, `start_date_time`, `end_date_time`, `total_hour`, `staff_working_hours`, `status`, `payment_status`, `service_id`, `service_price`, `staff_invoice_id`, `note_by_staff`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(244, 76, 1, 1, 93, '2026-05-22 02:30:00', '2026-05-23 02:30:00', '2026-05-22 02:30:00', '2026-05-23 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 15:00:13', '2026-06-17 15:18:02'),
(245, 76, 1, 1, 93, '2026-05-23 02:30:00', '2026-05-24 02:30:00', '2026-05-23 02:30:00', '2026-05-24 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 15:00:42', '2026-06-17 15:18:27'),
(246, 76, 1, 1, 93, '2026-05-24 02:30:00', '2026-05-25 02:30:00', '2026-05-24 02:30:00', '2026-05-25 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 21, NULL, 0, 1, 1, '2026-06-17 15:01:10', '2026-06-17 15:19:01'),
(247, 76, 1, 1, 93, '2026-06-01 02:30:00', '2026-06-02 02:30:00', '2026-06-01 02:30:00', '2026-06-02 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:46:20', '2026-06-18 09:54:35'),
(248, 76, 1, 1, 93, '2026-06-02 02:30:00', '2026-06-03 02:30:00', '2026-06-02 02:30:00', '2026-06-03 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:46:48', '2026-06-17 15:56:40'),
(249, 76, 1, 1, 93, '2026-06-03 02:30:00', '2026-06-04 02:30:00', '2026-06-03 02:30:00', '2026-06-04 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:47:17', '2026-06-17 15:57:04'),
(250, 76, 1, 1, 93, '2026-06-04 02:30:00', '2026-06-05 02:30:00', '2026-06-04 02:30:00', '2026-06-05 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:47:46', '2026-06-17 15:57:28'),
(251, 76, 1, 1, 93, '2026-06-05 02:30:00', '2026-06-06 02:30:00', '2026-06-05 02:30:00', '2026-06-06 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:48:09', '2026-06-17 15:58:01'),
(252, 76, 1, 1, 93, '2026-06-06 02:30:00', '2026-06-07 02:30:00', '2026-06-06 02:30:00', '2026-06-07 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:48:38', '2026-06-17 15:58:40'),
(253, 76, 1, 1, 93, '2026-06-07 02:30:00', '2026-06-08 02:30:00', '2026-06-07 02:30:00', '2026-06-08 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:49:17', '2026-06-17 15:59:15'),
(254, 76, 1, 1, 93, '2026-06-08 02:30:00', '2026-06-09 02:30:00', '2026-06-08 02:30:00', '2026-06-09 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:49:49', '2026-06-17 15:59:42'),
(255, 76, 1, 1, 93, '2026-06-09 02:30:00', '2026-06-10 02:30:00', '2026-06-09 02:30:00', '2026-06-10 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:51:16', '2026-06-17 15:55:46'),
(256, 76, 1, 1, 93, '2026-06-10 02:30:00', '2026-06-11 02:30:00', '2026-06-10 02:30:00', '2026-06-11 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:52:17', '2026-06-17 15:55:16'),
(257, 76, 1, 1, 93, '2026-06-11 02:30:00', '2026-06-11 12:30:00', '2026-06-11 02:30:00', '2026-06-12 02:30:00', 24.0000, 10.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 15:54:05', '2026-06-17 16:17:18'),
(258, 76, 1, 1, 93, '2026-06-12 02:30:00', '2026-06-12 12:30:00', '2026-06-12 02:30:00', '2026-06-12 12:30:00', 10.0000, 10.0000, 'done', '1', 10, 69.4100, 22, NULL, 0, 1, 1, '2026-06-17 16:19:00', '2026-06-17 16:19:31'),
(259, 110, 1, 1, 108, '2026-05-31 08:30:00', '2026-06-01 08:30:00', '2026-05-31 08:30:00', '2026-06-01 02:30:00', 18.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:07:48', '2026-06-18 12:16:50'),
(260, 110, 1, 1, 108, '2026-06-01 02:30:00', '2026-06-02 02:30:00', '2026-06-01 02:30:00', '2026-06-02 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:10:37', '2026-06-18 12:19:11'),
(261, 110, 1, 1, 108, '2026-06-02 02:30:00', '2026-06-03 02:30:00', '2026-06-02 02:30:00', '2026-06-03 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:11:02', '2026-06-18 12:19:05'),
(262, 110, 1, 1, 108, '2026-06-03 02:30:00', '2026-06-04 02:30:00', '2026-06-03 02:30:00', '2026-06-04 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:11:24', '2026-06-18 12:18:59'),
(263, 110, 1, 1, 108, '2026-06-04 02:30:00', '2026-06-05 02:30:00', '2026-06-04 02:30:00', '2026-06-05 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:11:52', '2026-06-18 12:18:53'),
(264, 110, 1, 1, 108, '2026-06-05 02:30:00', '2026-06-06 02:30:00', '2026-06-05 02:30:00', '2026-06-06 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:12:19', '2026-06-18 12:18:31'),
(265, 110, 1, 1, 108, '2026-06-06 02:30:00', '2026-06-07 02:30:00', '2026-06-06 02:30:00', '2026-06-07 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:14:43', '2026-06-18 12:18:25'),
(266, 110, 1, 1, 108, '2026-06-07 02:30:00', '2026-06-08 02:30:00', '2026-06-07 02:30:00', '2026-06-08 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:15:10', '2026-06-18 12:18:18'),
(267, 110, 1, 1, 108, '2026-06-08 02:30:00', '2026-06-09 02:30:00', '2026-06-08 02:30:00', '2026-06-09 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:15:36', '2026-06-18 12:18:11'),
(268, 110, 1, 1, 108, '2026-06-09 02:30:00', '2026-06-10 02:30:00', '2026-06-09 02:30:00', '2026-06-10 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:16:09', '2026-06-18 12:18:05'),
(269, 110, 1, 1, 108, '2026-06-10 02:30:00', '2026-06-11 02:30:00', '2026-06-10 02:30:00', '2026-06-11 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:16:37', '2026-06-18 12:17:38'),
(270, 110, 1, 1, 108, '2026-06-11 02:30:00', '2026-06-12 02:30:00', '2026-06-11 02:30:00', '2026-06-12 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:17:40', '2026-06-18 12:17:56'),
(271, 110, 1, 1, 108, '2026-06-12 02:30:00', '2026-06-12 08:30:00', '2026-06-12 02:30:00', '2026-06-12 08:30:00', 6.0000, 6.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-18 09:18:35', '2026-06-18 12:17:46'),
(272, 106, 1, 1, 108, '2026-06-12 08:30:00', '2026-06-13 02:30:00', '2026-06-12 08:30:00', '2026-06-13 02:30:00', 18.0000, 18.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-06-18 09:20:07', '2026-06-18 12:17:32'),
(273, 106, 1, 1, 108, '2026-06-13 02:30:00', '2026-06-14 02:30:00', '2026-06-13 02:30:00', '2026-06-14 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-06-18 09:20:37', '2026-06-18 12:17:25'),
(274, 106, 1, 1, 108, '2026-06-14 02:30:00', '2026-06-15 02:30:00', '2026-06-14 02:30:00', '2026-06-15 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-06-18 09:21:04', '2026-06-18 12:17:19'),
(275, 106, 1, 1, 108, '2026-06-15 02:30:00', '2026-06-16 02:30:00', '2026-06-15 02:30:00', '2026-06-16 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 75.0000, NULL, NULL, 1, 1, 1, '2026-06-18 09:23:59', '2026-06-18 12:17:11'),
(276, 110, 1, 1, 111, '2026-05-31 08:30:00', '2026-06-01 08:30:00', '2026-05-31 08:30:00', '2026-06-01 02:30:00', 18.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 15:58:17', '2026-06-24 16:01:53'),
(277, 110, 1, 1, 111, '2026-06-01 02:30:00', '2026-06-02 02:30:00', '2026-06-01 02:30:00', '2026-06-02 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 15:58:49', '2026-06-24 16:02:35'),
(278, 110, 1, 1, 111, '2026-06-02 02:30:00', '2026-06-03 02:30:00', '2026-06-02 02:30:00', '2026-06-03 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 15:59:16', '2026-06-24 16:02:52'),
(279, 110, 1, 1, 111, '2026-06-03 02:30:00', '2026-06-04 02:30:00', '2026-06-03 02:30:00', '2026-06-04 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 15:59:40', '2026-06-24 16:03:18'),
(280, 110, 1, 1, 111, '2026-06-04 02:30:00', '2026-06-05 02:30:00', '2026-06-04 02:30:00', '2026-06-05 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:00:05', '2026-06-24 16:03:45'),
(281, 110, 1, 1, 111, '2026-06-05 02:30:00', '2026-06-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 104.1700, NULL, NULL, 1, 1, 1, '2026-06-24 16:00:23', '2026-06-24 16:04:27'),
(282, 110, 1, 1, 111, '2026-06-05 02:30:00', '2026-06-06 02:30:00', '2026-06-05 02:30:00', '2026-06-06 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:04:59', '2026-06-24 16:11:14'),
(283, 110, 1, 1, 111, '2026-06-06 02:30:00', '2026-06-07 02:30:00', '2026-06-06 02:30:00', '2026-06-07 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:05:30', '2026-06-24 16:11:34'),
(284, 110, 1, 1, 111, '2026-06-07 02:30:00', '2026-06-08 02:30:00', '2026-06-07 02:30:00', '2026-06-08 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:05:54', '2026-06-24 16:12:22'),
(285, 110, 1, 1, 111, '2026-06-08 02:30:00', '2026-06-09 02:30:00', '2026-06-08 02:30:00', '2026-06-09 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:06:18', '2026-06-24 16:12:42'),
(286, 110, 1, 1, 111, '2026-06-09 03:30:00', '2026-06-10 03:30:00', '2026-06-09 03:30:00', '2026-06-10 03:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:06:46', '2026-06-24 16:13:21'),
(287, 110, 1, 1, 111, '2026-06-10 02:30:00', '2026-06-11 02:30:00', '2026-06-10 02:30:00', '2026-06-11 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:07:16', '2026-06-24 16:14:02'),
(288, 110, 1, 1, 111, '2026-06-11 02:30:00', '2026-06-12 08:30:00', '2026-06-11 02:30:00', '2026-06-12 08:30:00', 30.0000, 24.0000, 'done', '0', 10, 69.4400, NULL, NULL, 1, 1, 1, '2026-06-24 16:10:06', '2026-06-24 16:29:15'),
(289, 106, 1, 1, 111, '2026-06-12 08:30:00', '2026-06-13 02:30:00', '2026-06-12 08:30:00', '2026-06-13 02:30:00', 18.0000, 24.0000, 'done', '1', 10, 75.0000, 24, NULL, 0, 1, 1, '2026-06-24 16:16:09', '2026-06-24 16:19:26'),
(290, 106, 1, 1, 111, '2026-06-13 02:30:00', '2026-06-14 02:30:00', '2026-06-13 02:30:00', '2026-06-14 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 75.0000, 24, NULL, 0, 1, 1, '2026-06-24 16:16:37', '2026-06-24 16:20:28'),
(291, 106, 1, 1, 111, '2026-06-14 02:30:00', '2026-06-15 02:30:00', '2026-06-14 02:30:00', '2026-06-15 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 75.0000, 24, NULL, 0, 1, 1, '2026-06-24 16:17:05', '2026-06-24 16:20:59'),
(292, 106, 1, 1, 111, '2026-06-15 02:30:00', '2026-06-16 02:30:00', '2026-06-15 02:30:00', '2026-06-16 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 75.0000, 24, NULL, 0, 1, 1, '2026-06-24 16:17:55', '2026-06-24 16:21:19'),
(293, 110, 1, 1, 111, '2026-06-11 02:30:00', '2026-06-12 02:30:00', '2026-06-11 02:30:00', '2026-06-12 02:30:00', 24.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:27:47', '2026-06-24 16:29:24'),
(294, 110, 1, 1, 111, '2026-06-12 02:30:00', '2026-06-12 08:30:00', '2026-06-12 02:30:00', '2026-06-12 08:30:00', 6.0000, 24.0000, 'done', '1', 10, 69.4400, 25, NULL, 0, 1, 1, '2026-06-24 16:28:42', '2026-06-24 16:29:47'),
(295, 109, 1, 1, 93, '2026-06-10 14:30:00', '2026-06-11 02:30:20', '2026-06-10 14:30:00', '2026-06-11 02:30:20', 12.0000, 63.8888, 'done', '0', 10, 24.0000, NULL, NULL, 1, 1, 1, '2026-06-27 05:50:35', '2026-06-30 15:35:35'),
(296, 109, 1, 1, 93, '2026-06-11 02:30:00', '2026-06-12 02:30:00', '2026-06-11 02:30:00', '2026-06-12 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:52:28', '2026-06-30 15:35:28'),
(297, 109, 1, 1, 93, '2026-06-12 02:30:00', '2026-06-13 02:30:00', '2026-06-12 02:30:00', '2026-06-13 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:53:49', '2026-06-30 15:35:22'),
(298, 109, 1, 1, 93, '2026-06-13 02:30:00', '2026-06-14 02:30:00', '2026-06-13 02:30:00', '2026-06-14 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:54:51', '2026-06-30 15:34:50'),
(299, 109, 1, 1, 93, '2026-06-14 02:30:00', '2026-06-15 02:30:00', '2026-06-14 02:30:00', '2026-06-15 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:55:33', '2026-06-30 15:34:42'),
(300, 109, 1, 1, 93, '2026-06-15 02:30:00', '2026-06-16 02:30:00', '2026-06-15 02:30:00', '2026-06-16 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:56:03', '2026-06-30 15:34:34'),
(301, 109, 1, 1, 93, '2026-06-16 02:30:00', '2026-06-17 02:30:00', '2026-06-16 02:30:00', '2026-06-17 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:57:40', '2026-06-30 15:34:29'),
(302, 109, 1, 1, 93, '2026-06-17 02:30:00', '2026-06-18 02:30:00', '2026-06-17 02:30:00', '2026-06-18 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:58:09', '2026-06-30 15:34:24'),
(303, 109, 1, 1, 93, '2026-06-18 02:30:00', '2026-06-19 02:30:00', '2026-06-18 02:30:00', '2026-06-19 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:58:39', '2026-06-30 15:34:18'),
(304, 109, 1, 1, 93, '2026-06-19 02:30:00', '2026-06-20 02:30:00', '2026-06-19 02:30:00', '2026-06-20 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 05:59:10', '2026-06-30 15:34:12'),
(305, 109, 1, 1, 93, '2026-06-21 02:30:00', '2026-06-22 02:30:00', '2026-06-21 02:30:00', '2026-06-22 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:09:06', '2026-06-30 15:34:07'),
(306, 109, 1, 1, 93, '2026-06-22 02:30:00', '2026-06-23 02:30:00', '2026-06-22 02:30:00', '2026-06-23 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:09:32', '2026-06-30 15:34:02'),
(307, 109, 1, 1, 93, '2026-06-23 02:30:00', '2026-06-24 02:30:00', '2026-06-23 02:30:00', '2026-06-24 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:10:02', '2026-06-30 15:33:56'),
(308, 109, 1, 1, 93, '2026-06-24 02:30:00', '2026-06-25 02:30:00', '2026-06-24 02:30:00', '2026-06-25 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:10:30', '2026-06-30 15:33:51'),
(309, 109, 1, 1, 93, '2026-06-25 02:30:00', '2026-06-26 02:30:00', '2026-06-25 02:30:00', '2026-06-26 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:10:57', '2026-06-30 15:33:46'),
(310, 109, 1, 1, 93, '2026-06-26 02:30:00', '2026-06-27 02:30:00', '2026-06-26 02:30:00', '2026-06-27 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:11:21', '2026-06-30 15:33:41'),
(311, 109, 1, 1, 93, '2026-06-27 02:30:00', '2026-06-28 02:30:00', '2026-06-27 02:30:00', '2026-06-28 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:11:58', '2026-06-30 15:33:35'),
(312, 109, 1, 1, 93, '2026-06-28 02:30:00', '2026-06-29 02:30:00', '2026-06-28 02:30:00', '2026-06-29 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:12:26', '2026-06-30 15:33:30'),
(313, 109, 1, 1, 93, '2026-06-29 02:30:00', '2026-06-30 02:30:00', '2026-06-29 02:30:00', '2026-06-30 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:13:03', '2026-06-30 15:32:57'),
(314, 109, 1, 1, 93, '2026-06-30 02:30:00', '2026-07-01 02:30:00', '2026-06-30 02:30:00', '2026-07-01 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:13:30', '2026-06-30 15:32:52'),
(315, 109, 1, 1, 93, '2026-06-20 02:30:00', '2026-06-21 02:30:00', '2026-06-20 02:30:00', '2026-06-21 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 63.8800, NULL, NULL, 1, 1, 1, '2026-06-27 06:41:34', '2026-06-30 15:33:23'),
(316, 109, 1, 1, 93, '2026-06-10 14:30:00', '2026-06-11 02:30:00', '2026-06-10 14:30:00', '2026-06-11 02:30:00', 12.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:48:39', '2026-06-30 15:50:38'),
(317, 109, 1, 1, 93, '2026-06-11 02:30:00', '2026-06-12 02:30:00', '2026-06-11 02:30:00', '2026-06-12 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:51:26', '2026-06-30 15:51:49'),
(318, 109, 1, 1, 93, '2026-06-12 02:30:00', '2026-06-13 02:30:00', '2026-06-12 02:30:00', '2026-06-13 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:52:27', '2026-06-30 15:52:42'),
(319, 109, 1, 1, 93, '2026-06-13 02:30:00', '2026-06-14 02:30:00', '2026-06-13 02:30:00', '2026-06-14 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:53:20', '2026-06-30 15:53:39'),
(320, 109, 1, 1, 93, '2026-06-14 02:30:00', '2026-06-15 02:30:00', '2026-06-14 02:30:00', '2026-06-15 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:54:20', '2026-06-30 15:54:41'),
(321, 109, 1, 1, 93, '2026-06-15 02:30:00', '2026-06-16 02:30:00', '2026-06-15 02:30:00', '2026-06-16 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:55:15', '2026-06-30 15:56:11'),
(322, 109, 1, 1, 93, '2026-06-16 02:30:00', '2026-06-17 02:30:00', '2026-06-16 02:30:00', '2026-06-17 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:55:49', '2026-06-30 15:56:28'),
(323, 109, 1, 1, 93, '2026-06-17 02:30:00', '2026-06-18 02:30:00', '2026-06-17 02:30:00', '2026-06-18 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:58:04', '2026-06-30 15:58:35'),
(324, 109, 1, 1, 93, '2026-06-18 02:30:00', '2026-06-19 02:30:00', '2026-06-18 02:30:00', '2026-06-19 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:58:59', '2026-06-30 15:59:17'),
(325, 109, 1, 1, 93, '2026-06-19 02:30:00', '2026-06-20 02:30:00', '2026-06-19 02:30:00', '2026-06-20 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 15:59:46', '2026-06-30 16:00:17'),
(326, 109, 1, 1, 93, '2026-06-20 02:30:00', '2026-06-21 02:30:00', '2026-06-20 02:30:00', '2026-06-21 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:00:53', '2026-06-30 16:01:07'),
(327, 109, 1, 1, 93, '2026-06-21 02:30:00', '2026-06-22 02:30:00', '2026-06-21 02:30:00', '2026-06-22 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 104.1700, 26, NULL, 0, 1, 1, '2026-06-30 16:02:33', '2026-06-30 16:03:15'),
(328, 109, 1, 1, 93, '2026-06-22 02:30:00', '2026-06-23 02:30:00', '2026-06-22 02:30:00', '2026-06-23 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:03:50', '2026-06-30 16:04:08'),
(329, 109, 1, 1, 93, '2026-06-23 02:30:00', '2026-06-24 02:30:00', '2026-06-23 02:30:00', '2026-06-24 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:04:54', '2026-06-30 16:05:12'),
(330, 109, 1, 1, 93, '2026-06-24 02:30:00', '2026-06-25 02:30:00', '2026-06-24 02:30:00', '2026-06-25 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:05:44', '2026-06-30 16:06:02'),
(331, 109, 1, 1, 93, '2026-06-25 02:30:00', '2026-06-26 02:30:00', '2026-06-25 02:30:00', '2026-06-26 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:06:56', '2026-06-30 16:07:14'),
(332, 109, 1, 1, 93, '2026-06-26 02:30:00', '2026-06-27 02:30:00', '2026-06-26 02:30:00', '2026-06-27 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:07:52', '2026-06-30 16:08:38'),
(333, 109, 1, 1, 93, '2026-06-27 02:30:00', '2026-06-28 02:30:00', '2026-06-27 02:30:00', '2026-06-28 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:09:14', '2026-06-30 16:09:36'),
(334, 109, 1, 1, 93, '2026-06-28 02:30:00', '2026-06-29 02:30:00', '2026-06-28 02:30:00', '2026-06-29 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:10:25', '2026-06-30 16:10:52'),
(335, 109, 1, 1, 93, '2026-06-29 02:30:00', '2026-06-30 02:30:00', '2026-06-29 02:30:00', '2026-06-30 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:11:31', '2026-06-30 16:12:02'),
(336, 109, 1, 1, 93, '2026-06-30 02:30:00', '2026-07-01 02:30:00', '2026-06-30 02:30:00', '2026-07-01 02:30:00', 24.0000, 24.0000, 'done', '1', 15, 63.8888, 26, NULL, 0, 1, 1, '2026-06-30 16:12:31', '2026-06-30 16:12:39'),
(337, 109, 1, 1, 93, '2026-07-01 02:30:00', '2026-07-02 02:30:00', '2026-07-01 02:30:00', '2026-07-02 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-04 15:19:02', '2026-07-04 15:24:19'),
(338, 109, 1, 1, 93, '2026-07-02 02:30:00', '2026-07-03 02:30:00', '2026-07-02 02:30:00', '2026-07-03 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-04 15:19:56', '2026-07-04 15:24:44'),
(339, 109, 1, 1, 93, '2026-07-03 02:30:00', '2026-07-04 02:30:00', '2026-07-03 02:30:00', '2026-07-04 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-04 15:21:06', '2026-07-04 15:25:24'),
(340, 109, 1, 1, 93, '2026-07-04 02:30:00', '2026-07-05 02:30:00', '2026-07-04 02:30:00', '2026-07-05 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-04 15:21:44', '2026-07-05 06:07:59'),
(341, 109, 1, 1, 93, '2026-07-05 02:30:00', '2026-07-06 02:30:00', '2026-07-05 02:30:00', '2026-07-06 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-04 15:22:42', '2026-07-19 06:48:33'),
(342, 110, 1, 1, 113, '2026-06-20 08:30:00', '2026-06-21 02:30:00', '2026-06-20 08:30:00', '2026-06-20 14:30:00', 6.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:38:17', '2026-07-05 06:28:18'),
(343, 110, 1, 1, 113, '2026-06-21 02:30:00', '2026-06-21 14:30:00', '2026-06-21 02:30:00', '2026-06-21 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:40:07', '2026-07-05 06:30:52'),
(344, 110, 1, 1, 113, '2026-06-22 02:30:00', '2026-06-22 14:30:00', '2026-06-22 02:30:00', '2026-06-22 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:40:32', '2026-07-05 06:32:19'),
(345, 110, 1, 1, 113, '2026-06-23 02:30:00', '2026-06-23 14:30:00', '2026-06-23 02:30:00', '2026-06-23 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:40:54', '2026-07-05 06:33:12'),
(346, 110, 1, 1, 113, '2026-06-24 02:30:00', '2026-06-24 14:30:00', '2026-06-24 02:30:00', '2026-06-24 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:41:20', '2026-07-05 06:33:55'),
(347, 110, 1, 1, 113, '2026-06-25 02:30:00', '2026-06-25 14:30:00', '2026-06-25 02:30:00', '2026-06-25 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:41:42', '2026-07-05 06:34:58'),
(348, 110, 1, 1, 113, '2026-07-25 02:30:00', '2026-07-25 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:42:49', '2026-07-04 16:52:56'),
(349, 110, 1, 1, 113, '2026-07-26 02:30:00', '2026-07-26 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:43:18', '2026-07-04 16:53:24'),
(350, 110, 1, 1, 113, '2026-07-27 02:30:00', '2026-07-27 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:43:57', '2026-07-04 16:53:39'),
(351, 110, 1, 1, 113, '2026-07-28 02:30:00', '2026-07-28 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:44:18', '2026-07-04 16:54:02'),
(352, 110, 1, 1, 113, '2026-07-29 02:30:00', '2026-07-29 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:44:39', '2026-07-04 16:54:26'),
(353, 110, 1, 1, 113, '2026-07-30 02:30:00', '2026-07-30 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:45:07', '2026-07-04 16:54:40'),
(354, 110, 1, 1, 113, '2026-07-31 02:30:00', '2026-07-31 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-04 16:45:47', '2026-07-04 16:54:53'),
(355, 110, 1, 1, 113, '2026-07-01 02:30:00', '2026-07-01 14:30:00', '2026-07-01 02:30:00', '2026-07-01 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:46:08', '2026-07-05 06:40:06'),
(356, 110, 1, 1, 113, '2026-07-02 02:30:00', '2026-07-02 14:30:00', '2026-07-02 02:30:00', '2026-07-02 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:46:30', '2026-07-05 06:41:06'),
(357, 110, 1, 1, 113, '2026-07-03 02:30:00', '2026-07-03 14:30:00', '2026-07-03 02:30:00', '2026-07-03 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:47:02', '2026-07-05 06:41:56'),
(358, 110, 1, 1, 113, '2026-07-04 02:30:00', '2026-07-04 14:30:00', '2026-07-04 02:30:00', '2026-07-04 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:47:25', '2026-07-05 06:42:38'),
(359, 110, 1, 1, 113, '2026-07-05 02:30:00', '2026-07-05 14:30:00', '2026-07-05 02:30:00', '2026-07-05 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:47:42', '2026-07-05 06:29:09'),
(360, 110, 1, 1, 113, '2026-06-26 02:30:00', '2026-06-26 14:30:00', '2026-06-26 02:30:00', '2026-06-26 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:55:48', '2026-07-05 06:35:41'),
(361, 110, 1, 1, 113, '2026-06-27 02:30:00', '2026-06-27 14:30:00', '2026-06-27 02:30:00', '2026-06-27 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:56:16', '2026-07-05 06:36:14'),
(362, 110, 1, 1, 113, '2026-06-28 02:30:00', '2026-06-28 14:30:00', '2026-06-28 02:30:00', '2026-06-28 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:56:38', '2026-07-05 06:36:56'),
(363, 110, 1, 1, 113, '2026-06-29 02:30:00', '2026-06-29 14:30:00', '2026-06-29 02:30:00', '2026-06-29 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:56:59', '2026-07-05 06:38:29'),
(364, 110, 1, 1, 113, '2026-06-30 02:30:00', '2026-06-30 14:30:00', '2026-06-30 02:30:00', '2026-06-30 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-04 16:57:20', '2026-07-05 06:39:38'),
(365, 110, 1, 1, 113, '2026-07-06 02:30:00', '2026-07-06 14:30:00', '2026-07-06 02:30:00', '2026-07-06 14:30:01', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-05 16:04:29', '2026-07-19 06:44:14'),
(366, 109, 1, 1, 93, '2026-07-06 02:30:00', '2026-07-07 02:30:00', '2026-07-05 02:30:00', '2026-07-06 02:30:01', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-05 16:05:28', '2026-07-07 06:14:01'),
(367, 109, 1, 1, 113, '2026-07-07 18:30:00', '2026-07-10 10:22:48', '2026-07-07 18:30:00', '2026-07-10 10:22:48', 63.8667, 63.8800, 'done', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-07 06:17:42', '2026-07-07 06:20:32'),
(368, 109, 1, 1, 93, '2026-07-07 02:30:00', '2026-07-08 02:30:00', '2026-07-07 02:30:00', '2026-07-08 02:30:01', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-07 09:18:30', '2026-07-19 06:43:14'),
(369, 110, 1, 1, 113, '2026-07-07 02:30:00', '2026-07-07 14:30:00', '2026-07-07 02:30:00', '2026-07-07 14:30:01', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-07 09:18:59', '2026-07-19 06:57:16'),
(370, 109, 1, 1, 93, '2026-07-08 02:30:00', '2026-07-09 02:30:00', '2026-07-08 02:30:00', '2026-07-09 02:30:01', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-07 09:19:40', '2026-07-19 06:54:43'),
(371, 110, 1, 1, 113, '2026-07-08 02:30:00', '2026-07-08 14:30:00', '2026-07-08 02:30:00', '2026-07-08 14:30:01', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-07 09:20:19', '2026-07-19 06:58:07'),
(372, 110, 1, 1, 113, '2026-07-09 02:30:00', '2026-07-09 14:30:00', '2026-07-09 02:30:00', '2026-07-09 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:03:09', '2026-07-19 07:26:31'),
(373, 110, 1, 1, 113, '2026-07-10 02:30:00', '2026-07-10 14:30:00', '2026-07-10 02:30:00', '2026-07-10 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:05:10', '2026-07-19 07:26:56'),
(374, 110, 1, 1, 113, '2026-07-10 02:30:00', '2026-07-10 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-19 07:05:59', '2026-07-19 07:13:14'),
(375, 110, 1, 1, 113, '2026-07-11 02:30:00', '2026-07-11 14:30:00', '2026-07-11 02:30:00', '2026-07-11 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:07:02', '2026-07-19 07:27:22'),
(376, 110, 1, 1, 113, '2026-07-12 02:30:00', '2026-07-12 14:30:00', '2026-07-12 02:30:00', '2026-07-12 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:07:41', '2026-07-19 07:27:50'),
(377, 110, 1, 1, 113, '2026-07-13 02:30:00', '2026-07-13 14:30:00', '2026-07-13 02:30:00', '2026-07-13 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:08:10', '2026-07-19 07:28:18'),
(378, 110, 1, 1, 113, '2026-07-14 02:30:00', '2026-07-14 14:30:00', '2026-07-14 02:30:00', '2026-07-14 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:08:40', '2026-07-19 07:28:55'),
(379, 110, 1, 1, 113, '2026-07-15 02:30:00', '2026-07-15 14:30:00', '2026-07-15 02:30:00', '2026-07-15 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:09:12', '2026-07-19 07:29:24'),
(380, 110, 1, 1, 113, '2026-07-16 02:30:00', '2026-07-16 14:30:00', '2026-07-16 02:30:00', '2026-07-16 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:09:44', '2026-07-19 07:29:54'),
(381, 110, 1, 1, 113, '2026-07-17 02:30:00', '2026-07-17 14:30:00', '2026-07-17 02:30:00', '2026-07-17 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:10:16', '2026-07-19 07:30:27'),
(382, 110, 1, 1, 113, '2026-07-18 02:30:00', '2026-07-18 14:30:00', '2026-07-18 02:30:00', '2026-07-18 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:10:44', '2026-07-19 07:30:55'),
(383, 110, 1, 1, 113, '2026-07-18 02:30:00', '2026-07-18 14:30:00', NULL, NULL, NULL, 12.0000, 'todo', '0', 10, 83.3300, NULL, NULL, 1, 1, 1, '2026-07-19 07:11:13', '2026-07-19 07:13:35'),
(384, 110, 1, 1, 113, '2026-07-19 02:30:00', '2026-07-19 14:30:00', '2026-07-19 02:30:00', '2026-07-19 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:11:45', '2026-07-19 07:25:52'),
(385, 110, 1, 1, 113, '2026-07-20 02:30:00', '2026-07-20 14:30:00', '2026-07-20 02:30:00', '2026-07-20 14:30:00', 12.0000, 12.0000, 'done', '0', 10, 83.3300, NULL, NULL, 0, 1, 1, '2026-07-19 07:12:17', '2026-07-19 07:25:28'),
(386, 109, 1, 1, 93, '2026-07-09 02:30:00', '2026-07-10 02:30:00', '2026-07-09 02:30:00', '2026-07-10 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:18:10', '2026-07-19 07:32:18'),
(387, 109, 1, 1, 93, '2026-07-10 02:30:00', '2026-07-11 02:30:00', '2026-07-10 02:30:00', '2026-07-11 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:18:49', '2026-07-19 07:32:44'),
(388, 109, 1, 1, 93, '2026-07-11 02:30:00', '2026-07-12 02:30:00', '2026-07-11 02:30:00', '2026-07-12 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:20:35', '2026-07-19 07:33:12'),
(389, 109, 1, 1, 93, '2026-07-12 02:30:00', '2026-07-13 02:30:00', '2026-07-12 02:30:00', '2026-07-13 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:21:05', '2026-07-19 07:33:49'),
(390, 109, 1, 1, 93, '2026-07-13 02:30:00', '2026-07-14 02:30:00', '2026-07-13 02:30:00', '2026-07-14 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:21:41', '2026-07-19 07:34:17'),
(391, 109, 1, 1, 93, '2026-07-14 02:30:00', '2026-07-15 02:30:00', '2026-07-14 02:30:00', '2026-07-15 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:22:17', '2026-07-19 07:34:45'),
(392, 109, 1, 1, 93, '2026-07-15 02:30:00', '2026-07-16 02:30:00', '2026-07-15 02:30:00', '2026-07-16 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:22:56', '2026-07-19 07:35:16'),
(393, 109, 1, 1, 93, '2026-07-16 02:30:00', '2026-07-17 02:30:00', '2026-07-16 02:30:00', '2026-07-17 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:23:26', '2026-07-19 07:35:53'),
(394, 109, 1, 1, 93, '2026-07-16 18:30:00', '2026-07-17 18:30:00', '2026-07-16 18:30:00', '2026-07-17 18:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:23:53', '2026-07-19 07:36:24'),
(395, 109, 1, 1, 93, '2026-07-18 02:30:00', '2026-07-19 02:30:00', '2026-07-18 02:30:00', '2026-07-19 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 63.8800, NULL, NULL, 0, 1, 1, '2026-07-19 07:24:45', '2026-07-19 07:25:41'),
(396, 76, 1, 1, 93, '2026-07-19 02:30:00', '2026-07-20 02:30:00', '2026-07-19 02:30:00', '2026-07-20 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-19 07:50:33', '2026-07-29 15:07:30'),
(397, 76, 1, 1, 93, '2026-07-20 02:30:00', '2026-07-21 02:30:00', '2026-07-20 02:30:00', '2026-07-21 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:21:06', '2026-07-29 16:15:40'),
(398, 76, 1, 1, 93, '2026-07-21 02:30:00', '2026-07-22 02:30:00', '2026-07-21 02:30:00', '2026-07-22 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:21:51', '2026-07-29 16:14:35'),
(399, 76, 1, 1, 93, '2026-07-22 02:30:00', '2026-07-23 02:30:00', '2026-07-22 02:30:00', '2026-07-23 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:24:09', '2026-07-29 16:13:49'),
(400, 76, 1, 1, 93, '2026-07-23 02:30:00', '2026-07-24 02:30:00', '2026-07-23 02:30:00', '2026-07-24 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:26:37', '2026-07-29 16:12:20'),
(401, 76, 1, 1, 93, '2026-07-24 02:30:00', '2026-07-25 02:30:00', '2026-07-24 02:30:00', '2026-07-25 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:31:08', '2026-07-29 16:09:02'),
(402, 76, 1, 1, 93, '2026-07-25 02:30:00', '2026-07-26 02:30:00', '2026-07-25 02:30:00', '2026-07-26 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:38:04', '2026-07-29 16:04:53'),
(403, 76, 1, 1, 93, '2026-07-26 02:30:00', '2026-07-27 02:30:00', '2026-07-26 02:30:00', '2026-07-27 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:43:31', '2026-07-29 16:04:30'),
(404, 76, 1, 1, 93, '2026-07-27 02:30:00', '2026-07-28 02:30:00', '2026-07-27 02:30:00', '2026-07-28 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:44:29', '2026-07-29 16:02:09'),
(405, 76, 1, 1, 93, '2026-07-28 02:30:00', '2026-07-29 02:30:00', '2026-07-28 02:30:00', '2026-07-29 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:45:38', '2026-07-29 15:52:40'),
(406, 76, 1, 1, 93, '2026-07-30 02:30:00', '2026-07-31 02:30:00', '2026-07-30 02:30:00', '2026-07-31 02:30:01', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:46:28', '2026-07-30 09:10:06'),
(407, 76, 1, 1, 93, '2026-07-31 02:30:00', '2026-08-01 02:30:00', '2026-07-31 02:30:00', '2026-08-01 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:50:11', '2026-07-30 09:17:47'),
(408, 76, 1, 1, 93, '2026-07-29 02:30:00', '2026-07-30 02:30:00', '2026-07-29 02:30:00', '2026-07-30 02:30:00', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-29 15:55:24', '2026-07-29 15:58:31'),
(409, 76, 1, 1, 93, '2026-08-01 02:30:00', '2026-08-02 02:30:00', '2026-08-01 02:30:00', '2026-08-02 02:30:01', 24.0000, 24.0000, 'done', '0', 16, 69.4100, NULL, NULL, 0, 1, 1, '2026-07-30 09:12:13', '2026-08-04 04:57:01'),
(410, 107, 3, 3, 67, '2026-08-03 18:30:00', '2026-08-04 02:30:00', '2026-08-03 18:30:00', '2026-08-04 02:30:00', 8.0000, 8.0000, 'done', '0', 7, 50.0000, NULL, NULL, 1, 47, 47, '2026-08-03 10:21:23', '2026-08-03 10:22:36'),
(411, 107, 3, 3, 80, '2026-08-02 18:30:00', '2026-08-03 02:30:00', NULL, NULL, NULL, 8.0000, 'todo', '0', 8, 100.0000, NULL, NULL, 0, 47, NULL, '2026-08-03 10:23:01', '2026-08-03 10:23:00'),
(412, 76, 1, 1, 93, '2026-08-02 02:30:00', '2026-08-03 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 16, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 08:15:52', '2026-09-01 09:01:22'),
(413, 76, 1, 1, 93, '2026-08-03 02:30:00', '2026-08-04 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 16, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 08:16:32', '2026-09-01 09:01:16'),
(414, 76, 1, 1, 93, '2026-08-04 02:30:00', '2026-08-05 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 16, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 08:17:11', '2026-09-01 09:01:10'),
(415, 76, 1, 1, 93, '2026-08-05 02:30:00', '2026-08-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 16, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 08:17:44', '2026-09-01 09:01:05'),
(416, 76, 1, 1, 93, '2026-08-02 02:30:00', '2026-08-03 02:30:00', '2026-08-02 02:30:00', '2026-08-03 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:26:40', '2026-09-01 14:26:34'),
(417, 76, 1, 1, 93, '2026-08-03 02:30:00', '2026-08-04 02:30:00', '2026-08-03 02:30:00', '2026-08-04 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:27:25', '2026-09-01 14:26:55'),
(418, 76, 1, 1, 93, '2026-08-04 02:30:00', '2026-08-05 02:30:00', '2026-08-04 02:30:00', '2026-08-05 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:28:28', '2026-09-01 14:27:31'),
(419, 76, 1, 1, 93, '2026-08-05 02:30:00', '2026-08-06 02:30:00', '2026-08-05 02:30:00', '2026-08-06 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:29:11', '2026-09-01 14:27:44'),
(420, 76, 1, 1, 93, '2026-08-06 02:30:00', '2026-08-07 02:30:00', '2026-08-06 02:30:00', '2026-08-07 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:29:58', '2026-09-01 14:27:57'),
(421, 76, 1, 1, 93, '2026-08-07 02:30:00', '2026-08-08 02:30:00', '2026-08-07 02:30:00', '2026-08-08 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:30:34', '2026-09-01 14:28:14'),
(422, 76, 1, 1, 93, '2026-08-08 02:30:00', '2026-08-09 02:30:00', '2026-08-08 02:30:00', '2026-08-09 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:31:09', '2026-09-01 14:28:28'),
(423, 76, 1, 1, 93, '2026-08-09 02:30:00', '2026-08-10 02:30:00', '2026-08-09 02:30:00', '2026-08-10 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:31:48', '2026-09-01 14:28:41'),
(424, 76, 1, 1, 93, '2026-08-10 02:30:00', '2026-08-11 02:30:00', '2026-08-10 02:30:00', '2026-08-11 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 09:32:31', '2026-09-01 14:28:59'),
(425, 76, 1, 1, 93, '2026-08-02 02:30:00', '2026-08-03 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 14:21:07', '2026-09-01 14:26:04'),
(426, 76, 1, 1, 93, '2026-08-03 02:30:00', '2026-08-04 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 14:21:41', '2026-09-01 14:25:58'),
(427, 76, 1, 1, 93, '2026-08-04 02:30:00', '2026-08-05 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 14:22:12', '2026-09-01 14:25:53'),
(428, 76, 1, 1, 93, '2026-08-05 02:30:00', '2026-08-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 14:22:46', '2026-09-01 14:25:47'),
(429, 76, 1, 1, 93, '2026-08-11 02:30:00', '2026-08-12 02:30:00', '2026-08-11 02:30:00', '2026-08-12 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:44:36', '2026-09-01 15:52:35'),
(430, 76, 1, 1, 93, '2026-08-12 02:30:00', '2026-08-13 02:30:00', '2026-08-12 02:30:00', '2026-08-13 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:45:11', '2026-09-01 15:53:58'),
(431, 76, 1, 1, 93, '2026-08-13 02:30:00', '2026-08-14 02:30:00', '2026-08-13 02:30:00', '2026-08-14 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:45:39', '2026-09-01 15:54:12'),
(432, 76, 1, 1, 93, '2026-09-15 02:30:00', '2026-09-16 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 10, 69.4100, NULL, NULL, 1, 1, 1, '2026-09-01 14:46:25', '2026-09-01 15:51:33'),
(433, 76, 1, 1, 93, '2026-08-14 02:30:00', '2026-08-15 02:30:00', '2026-08-14 02:30:00', '2026-08-15 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:47:09', '2026-09-01 15:54:24'),
(434, 76, 1, 1, 93, '2026-08-16 02:30:00', '2026-08-17 02:30:00', '2026-08-16 02:30:00', '2026-08-17 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:48:32', '2026-09-01 15:54:37'),
(435, 76, 1, 1, 93, '2026-08-17 02:30:00', '2026-08-18 02:30:00', '2026-08-17 02:30:00', '2026-08-18 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:49:06', '2026-09-01 15:54:52'),
(436, 76, 1, 1, 93, '2026-08-18 02:30:00', '2026-08-19 02:30:00', '2026-08-18 02:30:00', '2026-08-19 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:49:35', '2026-09-01 15:55:16'),
(437, 76, 1, 1, 93, '2026-08-19 02:30:00', '2026-08-20 02:30:00', '2026-08-19 02:30:00', '2026-08-20 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:50:03', '2026-09-01 15:55:30'),
(438, 76, 1, 1, 93, '2026-08-20 02:30:00', '2026-08-21 02:30:00', '2026-08-20 02:30:00', '2026-08-21 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:50:29', '2026-09-01 15:55:44'),
(439, 76, 1, 1, 93, '2026-08-21 02:30:00', '2026-08-22 02:30:00', '2026-08-21 02:30:00', '2026-08-22 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:50:56', '2026-09-01 15:56:09'),
(440, 76, 1, 1, 93, '2026-08-22 02:30:00', '2026-08-23 02:30:00', '2026-08-22 02:30:00', '2026-08-23 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:51:27', '2026-09-01 16:02:08'),
(441, 76, 1, 1, 93, '2026-08-23 02:30:00', '2026-08-24 02:30:00', '2026-08-23 02:30:00', '2026-08-24 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:51:58', '2026-09-01 16:02:20'),
(442, 76, 1, 1, 93, '2026-08-24 02:30:00', '2026-08-25 02:30:00', '2026-08-24 02:30:00', '2026-08-25 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:52:28', '2026-09-01 16:02:34'),
(443, 76, 1, 1, 93, '2026-08-25 02:30:00', '2026-08-26 02:30:00', '2026-08-25 02:30:00', '2026-08-26 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:52:52', '2026-09-01 16:02:48'),
(444, 76, 1, 1, 93, '2026-08-26 02:30:00', '2026-08-27 02:30:00', '2026-08-26 02:30:00', '2026-08-27 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:53:54', '2026-09-01 16:03:03'),
(445, 76, 1, 1, 93, '2026-08-27 02:30:00', '2026-08-28 02:30:00', '2026-08-27 02:30:00', '2026-08-28 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:54:24', '2026-09-01 16:03:16'),
(446, 76, 1, 1, 93, '2026-08-28 02:30:00', '2026-08-29 02:30:00', '2026-08-28 02:30:00', '2026-08-29 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:55:11', '2026-09-01 16:03:29'),
(447, 76, 1, 1, 93, '2026-08-29 02:30:00', '2026-08-30 02:30:00', '2026-08-29 02:30:00', '2026-08-30 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:55:42', '2026-09-01 16:04:20'),
(448, 76, 1, 1, 93, '2026-08-30 02:30:00', '2026-08-31 02:30:00', '2026-08-30 02:30:00', '2026-08-31 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:56:21', '2026-09-01 15:50:25'),
(449, 76, 1, 1, 93, '2026-08-31 02:30:00', '2026-08-31 14:30:00', '2026-08-31 02:30:13', '2026-08-31 14:30:13', 12.0000, 12.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 14:57:21', '2026-09-01 15:48:19'),
(450, 114, 1, 1, 93, '2026-08-31 03:30:00', '2026-09-01 03:30:00', '2026-08-31 03:30:50', '2026-09-01 02:30:50', 23.0000, 24.0000, 'done', '0', 15, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 15:44:27', '2026-09-01 15:49:58'),
(451, 114, 1, 1, 93, '2026-09-01 02:30:00', '2026-09-02 02:30:00', '2026-09-01 02:30:00', '2026-09-02 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 15:45:04', '2026-09-01 15:50:39'),
(452, 114, 1, 1, 93, '2026-09-02 02:30:00', '2026-09-03 02:30:00', '2026-09-02 02:30:00', '2026-09-03 02:30:00', 24.0000, 24.0000, 'done', '0', 15, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 15:45:33', '2026-09-01 16:03:41'),
(453, 76, 1, 1, 93, '2026-08-15 02:30:00', '2026-08-16 02:30:00', '2026-08-15 02:30:00', '2026-08-16 02:30:00', 24.0000, 24.0000, 'done', '0', 10, 69.4100, NULL, NULL, 0, 1, 1, '2026-09-01 15:53:10', '2026-09-01 15:53:44'),
(454, 114, 1, 1, 93, '2026-09-03 02:30:00', '2026-09-04 02:30:00', '2026-09-03 06:19:14', '2026-09-04 01:10:27', 18.8500, 24.0000, 'done', '0', 15, 69.4100, NULL, '24 hrs complete ', 0, 1, 114, '2026-09-03 06:04:34', '2026-09-04 01:10:27'),
(455, 114, 1, 1, 93, '2026-09-04 02:30:00', '2026-09-05 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 15, 69.4100, NULL, NULL, 0, 1, NULL, '2026-09-04 06:26:24', '2026-09-04 06:26:23'),
(456, 114, 1, 1, 93, '2026-09-05 02:30:00', '2026-09-06 02:30:00', NULL, NULL, NULL, 24.0000, 'todo', '0', 15, 69.4100, NULL, NULL, 0, 1, NULL, '2026-09-04 18:27:31', '2026-09-04 18:27:30');

-- --------------------------------------------------------

--
-- Table structure for table `staff_experience`
--

CREATE TABLE `staff_experience` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `user_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `from_month_year` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `to_month_year` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_experience_month` int DEFAULT NULL,
  `org_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referral_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `worked_in` enum('icu','non-icu') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_currently_working` tinyint(1) DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `staff_experience`
--

INSERT INTO `staff_experience` (`id`, `account_id`, `branch_id`, `user_id`, `category_id`, `from_month_year`, `to_month_year`, `total_experience_month`, `org_name`, `referral_details`, `documents`, `worked_in`, `is_currently_working`, `description`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, 3, 3, 49, 2, '2014-12-17', '2016-12-17', 24, 'test 17 12 ', '{\"name\":\"yp\",\"designation\":\"dje\",\"contact_no\":\"8798799897\"}', '[{\"id\":\"a92a6597-d1eb-4769-8246-a419b11740d9\",\"name\":\"doc 1\",\"path\":\"/uploads/staff/experience/49/4/1765974389956-Screenshot 2025-11-21 173720.png\"}]', 'icu', 0, 'test n', 0, 47, NULL, '2025-12-17 12:26:29', '2025-12-17 12:26:29'),
(5, 1, 1, 56, 3, '2024-12-19', '2025-10-01', 10, 'og14-1', NULL, NULL, 'icu', 0, NULL, 0, 1, NULL, '2025-12-19 09:22:36', '2025-12-19 09:22:36'),
(6, 3, 3, 68, 2, '2017-02-10', NULL, 108, 'test 10-2', NULL, NULL, NULL, 1, NULL, 0, 47, NULL, '2026-02-10 12:47:48', '2026-02-10 12:47:48'),
(7, 1, 1, 71, 3, '2022-02-11', '2024-02-11', 24, 'abc', '{\"name\":\"yp\",\"designation\":\"Nursing\",\"contact_no\":\"8798799897\"}', '[{\"id\":\"32edaa13-7e22-484d-a44c-dac46ae6f2e1\",\"name\":\"doc 1\",\"path\":\"/uploads/staff/experience/71/7/1770797808243-payslip-5.pdf\"},{\"id\":\"00f475fb-70a0-4766-b041-899bd0f834fd\",\"name\":\"doc2 \",\"path\":\"/uploads/staff/experience/71/7/1770797808243-invoice (46).pdf\"}]', 'icu', 0, NULL, 0, 1, NULL, '2026-02-11 08:16:48', '2026-02-11 08:16:48'),
(8, 1, 1, 72, 3, '2019-02-01', '2023-02-13', 48, 'Shri Ram Hospital, jalore', NULL, '[{\"id\":\"9e78b471-e1a2-4f76-9e92-3695850531a2\",\"name\":\"GNM Registration\",\"path\":\"/uploads/staff/experience/72/8/1770992400001-Registration.jpeg\"}]', 'icu', 0, NULL, 0, 1, NULL, '2026-02-13 14:20:00', '2026-02-13 14:20:00'),
(9, 1, 1, 75, 5, '2017-10-02', '2018-10-11', 12, 'Sanjeevani hospital, Neonatal & Intensivist', NULL, '[{\"id\":\"9dfa40e2-e625-4004-aaff-d7923a55cadd\",\"name\":\"Hospital Experience\",\"path\":\"/uploads/staff/experience/75/9/1771067043098-Experience.jpeg\"}]', 'non-icu', 0, NULL, 0, 1, NULL, '2026-02-14 11:04:03', '2026-02-14 11:04:03'),
(10, 1, 1, 77, 6, '2025-02-06', '2026-02-18', 12, 'Shri Ram Hospital, jalore', '{\"name\":\"Ravindra singh\",\"designation\":\"ATTEDANT\",\"contact_no\":\"7044392039\"}', '[{\"id\":\"38fe580a-047a-4ec5-9ef5-74d81c0aed57\",\"name\":\"Hospital Experience\",\"path\":\"/uploads/staff/experience/77/10/1771403540668-Experience.jpeg\"}]', 'non-icu', 0, NULL, 0, 1, NULL, '2026-02-18 08:32:20', '2026-02-18 08:32:20'),
(11, 1, 1, 91, 3, '2021-03-01', '2026-02-27', 60, 'AASHKA HOSPITAL GANDHINAGAR', NULL, NULL, 'icu', 0, NULL, 0, 1, NULL, '2026-03-13 14:47:11', '2026-03-13 14:47:11'),
(12, 1, 1, 76, 3, '2023-03-02', '2026-02-28', 36, 'SATYAMEV HOSPITAL CHANDHKHEDA', NULL, NULL, 'icu', 0, NULL, 0, 1, NULL, '2026-03-13 14:50:22', '2026-03-13 14:50:22'),
(13, 1, 1, 95, 3, '2019-03-17', NULL, 84, 'Devan Home Health Care', NULL, '[{\"id\":\"7a4aa7e0-c7ea-4ee0-adbe-77da6fe819d4\",\"name\":\"GNM, RNC, Registration\",\"path\":\"/uploads/staff/experience/95/13/1773740593555-GNM RNC Registration.pdf\"}]', NULL, 1, NULL, 0, 1, NULL, '2026-03-17 09:43:13', '2026-03-17 09:43:13'),
(14, 1, 1, 109, 3, '2012-06-18', '2016-05-16', 47, 'RNC', NULL, NULL, 'icu', 0, NULL, 0, 1, NULL, '2026-06-18 06:43:08', '2026-06-18 06:43:08');

-- --------------------------------------------------------

--
-- Table structure for table `staff_experience_category`
--

CREATE TABLE `staff_experience_category` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_experience_category`
--

INSERT INTO `staff_experience_category` (`id`, `account_id`, `branch_id`, `name`, `description`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 3, 3, 'Test cat 1', 'test desc 1', 0, 47, 47, '2025-12-17 12:25:02', '2025-12-17 12:25:02'),
(3, 1, 1, 'ICU STAFF', NULL, 0, 1, 1, '2025-12-19 09:20:48', '2026-02-13 14:11:34'),
(4, 3, 3, '10-2-cet1', NULL, 0, 47, 47, '2026-02-10 12:40:41', '2026-02-10 12:40:41'),
(5, 1, 1, 'ANM Staff', NULL, 0, 1, 1, '2026-02-14 10:52:52', '2026-02-14 10:52:52'),
(6, 1, 1, 'Attendant', NULL, 0, 1, 1, '2026-02-18 08:29:59', '2026-02-18 08:29:59'),
(7, 3, 3, 'Category 1', NULL, 0, 47, 47, '2026-03-13 08:07:00', '2026-03-13 08:07:00'),
(8, 1, 1, 'Himanshu Upadhyay', NULL, 0, 1, 1, '2026-09-01 15:40:59', '2026-09-01 15:40:59'),
(9, 1, 1, 'Bsc Nurse', NULL, 0, 1, 1, '2026-09-01 16:32:29', '2026-09-01 16:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice`
--

CREATE TABLE `staff_invoice` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `total_hours` decimal(10,4) DEFAULT NULL,
  `hour_price` decimal(10,4) DEFAULT NULL,
  `deduct_price` decimal(10,4) DEFAULT NULL,
  `total_price` decimal(10,4) DEFAULT NULL,
  `invoice_status` enum('draft','finalised') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_invoice`
--

INSERT INTO `staff_invoice` (`id`, `user_id`, `account_id`, `branch_id`, `from_date`, `to_date`, `total_hours`, `hour_price`, `deduct_price`, `total_price`, `invoice_status`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, 48, 3, 3, '2025-12-01', '2025-12-18', 1.2100, 200.0000, 0.0000, 242.0000, 'finalised', 0, 47, 47, '2025-12-18 08:53:16', '2025-12-18 08:53:26'),
(5, 68, 3, 3, '2026-02-01', '2026-02-10', 0.0800, 100.0000, 0.0000, 8.0000, 'finalised', 0, 47, NULL, '2026-02-10 12:59:24', '2026-02-10 12:59:23'),
(6, 71, 1, 1, '2026-02-01', '2026-02-11', 0.0200, 100.0000, 0.0000, 2.0000, 'finalised', 1, 1, 1, '2026-02-11 08:25:01', '2026-03-13 12:33:44'),
(7, 72, 1, 1, '2026-02-11', '2026-02-13', 0.0000, 0.0000, 0.0000, 0.0000, 'finalised', 1, 1, 1, '2026-02-13 13:23:52', '2026-03-13 14:22:07'),
(8, 77, 1, 1, '2026-02-05', '2026-02-09', 0.0000, 33.3300, 0.0000, 0.0000, 'finalised', 1, 1, 1, '2026-02-18 08:43:00', '2026-03-13 14:22:04'),
(9, 77, 1, 1, '2026-02-05', '2026-02-18', 0.0000, 33.3300, 0.0000, 0.0000, 'finalised', 1, 1, 1, '2026-02-18 08:53:24', '2026-03-13 14:22:01'),
(10, 77, 1, 1, '2026-02-01', '2026-02-18', 0.0000, 0.0000, 0.0000, 0.0000, 'finalised', 1, 1, 1, '2026-02-18 09:05:47', '2026-03-13 14:21:58'),
(11, 77, 1, 1, '2026-02-02', '2026-02-18', 1.0000, 33.0000, 10.0000, 23.0000, 'finalised', 1, 1, 1, '2026-02-18 09:07:32', '2026-03-13 14:21:55'),
(12, 82, 3, 3, '2026-03-13', '2026-03-13', 0.0000, 0.0000, 0.0000, 0.0000, 'finalised', 0, 47, 47, '2026-03-13 08:02:58', '2026-03-13 08:06:31'),
(13, 104, 1, 1, '2026-05-01', '2026-05-19', 0.0300, 200.0000, 0.0000, 6.0000, 'finalised', 1, 1, 1, '2026-05-19 07:56:50', '2026-05-19 17:27:27'),
(14, 97, 1, 1, '2026-03-21', '2026-03-22', 24.0000, 75.0000, 1800.0000, 0.0000, 'finalised', 0, 1, NULL, '2026-05-19 17:38:16', '2026-05-19 17:38:15'),
(15, 99, 1, 1, '2026-03-21', '2026-03-22', 12.0000, 75.0000, 0.0000, 900.0000, 'finalised', 0, 1, 1, '2026-05-19 17:44:29', '2026-05-19 17:46:15'),
(16, 76, 1, 1, '2026-03-01', '2026-04-01', 744.0000, 69.4100, 0.0000, 51641.0400, 'finalised', 1, 1, 1, '2026-05-19 18:41:12', '2026-05-20 05:36:59'),
(17, 82, 3, 3, '2026-03-14', '2026-05-19', 18.6000, 100.0000, 100.0000, 1760.3200, 'finalised', 1, 47, 47, '2026-05-20 04:44:07', '2026-05-20 04:45:55'),
(18, 76, 1, 1, '2026-03-01', '2026-03-31', 744.0000, 69.4400, 0.0000, 51663.3600, 'draft', 1, 1, 1, '2026-06-12 10:47:15', '2026-06-12 10:47:27'),
(19, 76, 1, 1, '2026-03-01', '2026-03-31', 744.0000, 69.4400, 0.0000, 51663.3600, 'finalised', 0, 1, NULL, '2026-06-13 13:51:43', '2026-06-13 13:51:42'),
(20, 76, 1, 1, '2026-04-01', '2026-04-30', 720.0000, 69.4400, 0.0000, 49996.8000, 'finalised', 0, 1, NULL, '2026-06-13 14:59:52', '2026-06-13 14:59:52'),
(21, 76, 1, 1, '2026-05-01', '2026-05-31', 744.0000, 69.4100, 0.0000, 51641.0400, 'finalised', 0, 1, NULL, '2026-06-17 15:23:58', '2026-06-17 15:23:57'),
(22, 76, 1, 1, '2026-06-01', '2026-06-12', 274.0000, 69.4100, 0.0000, 19018.0000, 'finalised', 0, 1, 1, '2026-06-17 16:10:52', '2026-07-04 17:02:24'),
(23, 107, 3, 3, '2026-06-17', '2026-06-18', 0.0000, 0.0000, 0.0000, 0.0000, 'finalised', 0, 47, NULL, '2026-06-24 12:15:17', '2026-06-24 12:15:16'),
(24, 106, 1, 1, '2026-06-12', '2026-06-15', 90.0000, 75.0000, 0.0000, 6750.0000, 'finalised', 0, 1, NULL, '2026-06-25 15:21:17', '2026-06-25 15:21:17'),
(25, 110, 1, 1, '2026-05-31', '2026-06-12', 288.0000, 69.4400, 5200.0000, 14799.0000, 'finalised', 0, 1, 1, '2026-06-25 15:22:54', '2026-07-05 07:46:20'),
(26, 109, 1, 1, '2026-06-10', '2026-06-30', 492.0000, 63.8800, 0.0000, 31429.0000, 'finalised', 0, 1, 1, '2026-06-30 18:46:09', '2026-07-05 05:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice_draft_meta`
--

CREATE TABLE `staff_invoice_draft_meta` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `staff_invoice_id` int NOT NULL,
  `activity_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `quickpay_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `hour_rate` decimal(10,4) DEFAULT NULL,
  `total_amount` decimal(10,4) DEFAULT NULL,
  `quickpay_total_amount` decimal(10,4) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `staff_invoice_draft_meta`
--

INSERT INTO `staff_invoice_draft_meta` (`id`, `account_id`, `branch_id`, `staff_invoice_id`, `activity_ids`, `quickpay_ids`, `hour_rate`, `total_amount`, `quickpay_total_amount`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, 3, 3, 4, '[11]', NULL, 200.0000, 242.0000, 0.0000, 0, NULL, 47, '2025-12-18 08:53:16', '2025-12-18 08:53:25'),
(5, 3, 3, 5, '[18]', NULL, 100.0000, 8.0000, 0.0000, 0, NULL, NULL, '2026-02-10 12:59:23', '2026-02-10 12:59:23'),
(6, 1, 1, 6, '[19]', NULL, 100.0000, 2.0000, 0.0000, 1, NULL, 1, '2026-02-11 08:25:00', '2026-03-13 12:33:44'),
(7, 1, 1, 7, NULL, NULL, 0.0000, 0.0000, 0.0000, 1, NULL, 1, '2026-02-13 13:23:51', '2026-03-13 14:22:07'),
(8, 1, 1, 8, NULL, NULL, 33.3300, 0.0000, 0.0000, 1, NULL, 1, '2026-02-18 08:42:59', '2026-03-13 14:22:04'),
(9, 1, 1, 9, NULL, NULL, 33.3300, 0.0000, 0.0000, 1, NULL, 1, '2026-02-18 08:53:23', '2026-03-13 14:22:01'),
(10, 1, 1, 10, NULL, NULL, 0.0000, 0.0000, 0.0000, 1, NULL, 1, '2026-02-18 09:05:47', '2026-03-13 14:21:58'),
(11, 1, 1, 11, '[22]', '[15]', 33.0000, 23.0000, 10.0000, 1, NULL, 1, '2026-02-18 09:07:31', '2026-03-13 14:21:55'),
(12, 3, 3, 12, NULL, NULL, 0.0000, 0.0000, 0.0000, 0, NULL, 47, '2026-03-13 08:02:58', '2026-03-13 08:06:30'),
(13, 1, 1, 13, '[158]', NULL, 200.0000, 6.0000, 0.0000, 1, NULL, 1, '2026-05-19 07:56:49', '2026-05-19 17:27:27'),
(14, 1, 1, 14, '[143,145]', '[22,23]', 75.0000, 0.0000, 1800.0000, 0, NULL, NULL, '2026-05-19 17:38:15', '2026-05-19 17:38:15'),
(15, 1, 1, 15, '[144]', NULL, 75.0000, 900.0000, 0.0000, 0, NULL, 1, '2026-05-19 17:44:29', '2026-05-19 17:46:15'),
(16, 1, 1, 16, '[68,70,72,73,74,75,77,78,79,81,82,83,84,85,104,107,113,117,119,123,126,132,136,138,147,179,180,181,182,184,185]', NULL, 69.4100, 51641.0400, 0.0000, 1, NULL, 1, '2026-05-19 18:41:11', '2026-05-20 05:36:59'),
(17, 3, 3, 17, '[159,163]', '[21]', 100.0000, 1760.3200, 100.0000, 1, NULL, 47, '2026-05-20 04:44:07', '2026-05-20 04:45:55'),
(18, 1, 1, 18, '[68,70,72,73,74,75,77,78,79,81,82,83,84,85,104,107,113,117,119,123,126,132,136,138,147,179,180,181,182,184,185]', NULL, 69.4400, 51663.3600, 0.0000, 1, NULL, 1, '2026-06-12 10:47:15', '2026-06-12 10:47:27'),
(19, 1, 1, 19, '[68,70,72,73,74,75,77,78,79,81,82,83,84,85,104,107,113,117,119,123,126,132,136,138,147,179,180,181,182,184,185]', NULL, 69.4400, 51663.3600, 0.0000, 0, NULL, NULL, '2026-06-13 13:51:42', '2026-06-13 13:51:42'),
(20, 1, 1, 20, '[186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215]', NULL, 69.4400, 49996.8000, 0.0000, 0, NULL, NULL, '2026-06-13 14:59:52', '2026-06-13 14:59:52'),
(21, 1, 1, 21, '[216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246]', NULL, 69.4100, 51641.0400, 0.0000, 0, NULL, NULL, '2026-06-17 15:23:57', '2026-06-17 15:23:57'),
(22, 1, 1, 22, '[247,248,249,250,251,252,253,254,255,256,257,258]', NULL, 69.4100, 19018.0000, 0.0000, 0, NULL, 1, '2026-06-17 16:10:52', '2026-07-04 17:02:23'),
(23, 3, 3, 23, NULL, NULL, 0.0000, 0.0000, 0.0000, 0, NULL, NULL, '2026-06-24 12:15:16', '2026-06-24 12:15:16'),
(24, 1, 1, 24, '[289,290,291,292]', NULL, 75.0000, 6750.0000, 0.0000, 0, NULL, NULL, '2026-06-25 15:21:17', '2026-06-25 15:21:17'),
(25, 1, 1, 25, '[276,277,278,279,280,282,283,284,285,286,287,293,294]', '[24,25]', 69.4400, 14799.0000, 5200.0000, 0, NULL, 1, '2026-06-25 15:22:54', '2026-07-05 07:46:19'),
(26, 1, 1, 26, '[316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336]', NULL, 63.8800, 31429.0000, 0.0000, 0, NULL, 1, '2026-06-30 18:46:09', '2026-07-05 05:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice_items`
--

CREATE TABLE `staff_invoice_items` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `staff_invoice_id` int NOT NULL,
  `service_id` int NOT NULL,
  `hour_price` decimal(10,4) DEFAULT NULL,
  `quantity` int NOT NULL,
  `staff_activity_id` int NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_invoice_items`
--

INSERT INTO `staff_invoice_items` (`id`, `account_id`, `branch_id`, `staff_invoice_id`, `service_id`, `hour_price`, `quantity`, `staff_activity_id`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(6, 3, 3, 4, 8, 200.0000, 1, 11, 0, 47, NULL, '2025-12-18 08:53:26', '2025-12-18 08:53:25'),
(7, 3, 3, 5, 7, 100.0000, 0, 18, 0, 47, NULL, '2026-02-10 12:59:24', '2026-02-10 12:59:23'),
(8, 1, 1, 6, 9, 100.0000, 0, 19, 0, 1, NULL, '2026-02-11 08:25:01', '2026-02-11 08:25:00'),
(9, 1, 1, 11, 13, 33.0000, 1, 22, 0, 1, NULL, '2026-02-18 09:07:32', '2026-02-18 09:07:31');

-- --------------------------------------------------------

--
-- Table structure for table `staff_qualifications`
--

CREATE TABLE `staff_qualifications` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `qualification_type` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `qualification_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `registration_no` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year_of_passout` year NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_qualifications`
--

INSERT INTO `staff_qualifications` (`id`, `account_id`, `branch_id`, `staff_id`, `qualification_type`, `qualification_name`, `registration_no`, `year_of_passout`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(12, 3, 3, 49, 'SSC', '12', '9879789', '2009', 0, 47, 47, '2025-12-17 12:27:47', '2025-12-17 12:27:47'),
(13, 1, 1, 54, 'GNM', 'NURSE', 'RJ2453772', '2022', 0, 1, 1, '2025-12-19 06:12:18', '2025-12-19 06:13:33'),
(14, 3, 3, 68, 'sss', '12', '1221', '2004', 0, 47, 47, '2026-02-10 12:47:15', '2026-02-10 12:47:15'),
(15, 1, 1, 71, 'HSC', '12', '1212', '2010', 0, 1, 1, '2026-02-11 08:14:55', '2026-02-11 08:14:55'),
(16, 1, 1, 72, 'RNC', 'GNM', '209149', '2024', 0, 1, 1, '2026-02-13 12:29:36', '2026-02-13 12:29:36'),
(17, 1, 1, 77, '12TH', 'GSSC', '209149', '2022', 0, 1, 1, '2026-02-18 08:28:05', '2026-02-18 08:28:05'),
(18, 1, 1, 91, 'NURSE', 'GNM', '195294', '2023', 0, 1, 1, '2026-03-13 11:44:58', '2026-03-13 11:44:58'),
(19, 3, 3, 88, 'sss', '21', NULL, '2013', 0, 47, 47, '2026-05-20 10:12:41', '2026-05-20 10:12:41'),
(20, 1, 1, 109, 'NURSE', 'GNM', '67314', '2016', 0, 1, 1, '2026-06-18 06:39:18', '2026-06-18 06:39:18'),
(21, 1, 1, 114, 'RNC', 'Bsc', '183325', '2022', 0, 1, 1, '2026-09-01 16:20:55', '2026-09-01 16:27:41');

-- --------------------------------------------------------

--
-- Table structure for table `staff_quick_pay`
--

CREATE TABLE `staff_quick_pay` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `date` datetime DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `amount` decimal(10,4) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_quick_pay`
--

INSERT INTO `staff_quick_pay` (`id`, `user_id`, `account_id`, `branch_id`, `date`, `description`, `amount`, `status`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(9, 49, 3, 3, '2025-12-01 00:00:00', 'test 1 12 25', 100.0000, 0, 0, 47, NULL, '2025-12-17 12:23:05', '2025-12-17 12:23:05'),
(10, 48, 3, 3, '2025-12-03 00:00:00', 'safadad', 23.0000, 1, 1, 47, 47, '2025-12-18 07:10:46', '2025-12-18 07:10:56'),
(11, 54, 1, 1, '2025-12-19 00:00:00', NULL, 10000.0000, 0, 0, 1, NULL, '2025-12-19 06:08:43', '2025-12-19 06:08:43'),
(12, 54, 1, 1, '2025-12-19 00:00:00', NULL, 9899.0000, 0, 0, 1, NULL, '2025-12-19 07:00:07', '2025-12-19 07:00:07'),
(13, 72, 1, 1, '2026-02-13 00:00:00', 'repido', 100.0000, 1, 1, 1, 1, '2026-02-13 13:21:43', '2026-02-13 13:40:06'),
(14, 77, 1, 1, '2026-02-17 00:00:00', 'P', 100.0000, 1, 0, 1, 1, '2026-02-18 08:59:24', '2026-02-18 08:59:57'),
(15, 77, 1, 1, '2026-02-05 00:00:00', 'P', 10.0000, 0, 0, 1, NULL, '2026-02-18 09:05:16', '2026-02-18 09:05:16'),
(16, 68, 3, 3, '2026-03-01 00:00:00', NULL, 100.0000, 0, 0, 47, NULL, '2026-03-11 04:51:38', '2026-03-11 04:51:38'),
(17, 91, 1, 1, '2026-03-09 00:00:00', 'ADVANCE', 500.0000, 0, 0, 1, NULL, '2026-03-13 12:33:25', '2026-03-13 12:33:24'),
(18, 91, 1, 1, '2026-03-15 00:00:00', 'KHANE KE', 400.0000, 0, 0, 1, NULL, '2026-03-15 17:12:19', '2026-03-15 17:12:18'),
(19, 91, 1, 1, '2026-03-13 00:00:00', 'KHANE KE', 400.0000, 0, 0, 1, NULL, '2026-03-15 17:16:06', '2026-03-15 17:16:06'),
(20, 91, 1, 1, '2026-03-17 00:00:00', 'KHANE KE', 400.0000, 0, 0, 1, NULL, '2026-03-17 18:02:09', '2026-03-17 18:02:09'),
(21, 82, 3, 3, '2026-04-23 00:00:00', '100 only', 100.0000, 0, 0, 47, NULL, '2026-04-23 10:15:18', '2026-04-23 10:15:17'),
(22, 97, 1, 1, '2026-03-21 00:00:00', NULL, 900.0000, 1, 0, 1, NULL, '2026-05-19 17:34:41', '2026-05-19 17:34:41'),
(23, 97, 1, 1, '2026-03-22 00:00:00', NULL, 900.0000, 1, 0, 1, NULL, '2026-05-19 17:35:01', '2026-05-19 17:35:01'),
(24, 110, 1, 1, '2026-06-11 00:00:00', 'Personal use', 200.0000, 1, 0, 1, NULL, '2026-06-25 15:12:53', '2026-06-25 15:12:53'),
(25, 110, 1, 1, '2026-06-12 00:00:00', 'Cash on hand', 5000.0000, 1, 0, 1, NULL, '2026-06-25 15:16:13', '2026-06-25 15:16:12'),
(26, 106, 1, 1, '2026-06-20 00:00:00', 'Paytm ', 6750.0000, 1, 0, 1, 1, '2026-06-25 15:18:56', '2026-07-04 16:22:08');

-- --------------------------------------------------------

--
-- Table structure for table `task_holds`
--

CREATE TABLE `task_holds` (
  `id` bigint NOT NULL,
  `task_id` bigint NOT NULL,
  `account_id` bigint NOT NULL,
  `branch_id` bigint NOT NULL,
  `hold_start_at` datetime NOT NULL,
  `hold_end_at` datetime DEFAULT NULL,
  `duration_minutes` int DEFAULT '0',
  `is_carry_forward` tinyint(1) DEFAULT '0' COMMENT 'Not carried forward (0)',
  `notes` longtext COLLATE utf8mb4_general_ci,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_holds`
--

INSERT INTO `task_holds` (`id`, `task_id`, `account_id`, `branch_id`, `hold_start_at`, `hold_end_at`, `duration_minutes`, `is_carry_forward`, `notes`, `created_by`, `updated_by`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 156, 3, 3, '2026-04-23 09:54:16', '2026-04-23 09:55:38', 1, 0, NULL, 47, 47, '2026-04-23 09:54:16', '2026-04-23 09:55:37', 0),
(2, 157, 3, 3, '2026-05-19 07:26:40', '2026-05-19 07:27:07', 0, 0, 'reason', 47, 47, '2026-05-19 07:26:40', '2026-05-19 07:27:06', 0),
(3, 158, 1, 1, '2026-05-19 07:54:33', '2026-05-19 07:54:53', 0, 0, 'reson', 1, 1, '2026-05-19 07:54:33', '2026-05-19 07:54:53', 0),
(4, 158, 1, 1, '2026-05-19 07:55:20', '2026-05-19 07:55:31', 0, 0, 'res', 1, 1, '2026-05-19 07:55:20', '2026-05-19 07:55:31', 0),
(5, 159, 3, 3, '2026-05-19 08:01:54', '2026-05-19 08:01:55', 0, 0, 'rwerw', 47, 47, '2026-05-19 08:01:53', '2026-05-19 08:01:55', 0),
(6, 159, 3, 3, '2026-05-19 08:02:01', '2026-05-19 08:02:03', 0, 0, 'wereqw', 47, 47, '2026-05-19 08:02:00', '2026-05-19 08:02:03', 0),
(7, 160, 3, 3, '2026-05-19 08:05:11', '2026-05-19 08:05:12', 0, 0, 'gtw', 47, 47, '2026-05-19 08:05:10', '2026-05-19 08:11:14', 1),
(8, 160, 3, 3, '2026-05-19 08:05:00', '2026-05-19 08:05:00', 0, 0, NULL, 47, 47, '2026-05-19 08:11:14', '2026-05-19 08:12:04', 1),
(9, 160, 3, 3, '2026-05-19 08:05:00', '2026-05-19 08:05:00', 0, 0, NULL, 47, 47, '2026-05-19 08:12:04', '2026-05-19 08:12:04', 0),
(10, 160, 3, 3, '2026-05-19 08:10:00', '2026-05-19 08:13:00', 3, 0, NULL, 47, 47, '2026-05-19 08:12:04', '2026-05-19 08:12:04', 0),
(11, 162, 3, 3, '2026-05-19 08:31:28', '2026-05-19 08:31:58', 0, 0, NULL, 47, 47, '2026-05-19 08:31:27', '2026-05-19 08:33:16', 1),
(12, 162, 3, 3, '2026-05-19 08:31:00', '2026-05-19 08:31:00', 0, 0, NULL, 47, 47, '2026-05-19 08:33:16', '2026-05-19 08:33:16', 0),
(13, 163, 3, 3, '2026-05-19 11:42:27', '2026-05-19 11:43:12', 0, 0, 'hold\n', 47, 47, '2026-05-19 11:42:26', '2026-05-19 11:44:14', 1),
(14, 163, 3, 3, '2026-05-19 11:42:00', '2026-05-19 11:43:00', 1, 0, NULL, 47, 47, '2026-05-19 11:44:14', '2026-05-19 11:44:14', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mpin` char(4) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `isDeleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `username`, `password`, `mpin`, `role_id`, `isDeleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'RHHC', '7404084849', 'info@rewellness.co.in', 'RHHC', '$2b$10$gQCKetAGE83N4EecvVUxAu8jSiuVGVH6k.IwTkCExlzgaW/DuIFzS', NULL, 1, 0, 0, 0, '2025-06-28 10:47:04', '2025-11-19 17:48:54'),
(47, 'Scorow Test', '9999999999', 'scorow@gmail.com', 'Scorow Test', '$2b$10$wIzHXZmNviVpr.bntFczseRJA4b/HcTpCxbSkEAAFMnSmahpDUQDW', NULL, 1, 0, NULL, 47, '2025-12-16 13:16:04', '2026-03-13 06:36:43'),
(48, 'yash', '9337387388', 'yash.scorow@gmail.com', '', '$2b$10$wIzHXZmNviVpr.bntFczseRJA4b/HcTpCxbSkEAAFMnSmahpDUQDW', NULL, 3, 0, 47, 47, '2025-12-17 10:50:51', '2026-02-06 07:00:37'),
(49, 'staff 2', '923423424', 'staff2@gmail.com', '', '$2b$10$TGGRut4goUyAjen9prI5L.wO.XgUZAienYFgFMACTh/9yESZtUz76', NULL, 3, 0, 47, 47, '2025-12-17 12:09:36', '2025-12-17 12:09:36'),
(50, 'Cust1', '8687687684', 'cus1@gmail.com', '', '$2b$10$kczTFUFU7ow5nBmS2ATdGOVr4LM7z9/XkK19pkRzLm9fnBAFpipUm', NULL, 2, 0, 47, 47, '2025-12-17 12:31:39', '2025-12-18 11:57:45'),
(51, 'cust 2', '8687868993', 'cust2@gmail.com', '', '$2b$10$AbnTy3dY3x3nwkRH1lJbBu/pwDiruqOWvUOJf2ctKaimgDUZkXVCS', NULL, 2, 0, 47, 47, '2025-12-17 12:34:24', '2025-12-17 12:34:24'),
(52, 's3', '8487883823', 's3@gmail.com', '', '$2b$10$d3XYaeAbI9SxxIPLf2Ur5O//hFIrySYrnXG0vyjxYvaV3k/y/g8jC', NULL, 3, 0, 47, 47, '2025-12-18 07:07:51', '2025-12-18 07:07:51'),
(53, 's2', '2342423423', 's33@gmail.com', '', '$2b$10$A1MGtbfH.2kJ3R/tup5kXOI5yZ2Wd7t42/aGW2SSrD//axFNh3tl.', NULL, 3, 0, 47, 47, '2025-12-18 11:44:22', '2025-12-18 11:44:22'),
(54, 'Kishor kumar dahiya', '9116524153', 'rsvbxy9@gmail.com', '', '$2b$10$6Ke79LJwYCTRdP5WbcRKxeGpXj5YGp4YsyNVNCwFm3RsOwTgjG1Za', NULL, 3, 1, 1, 1, '2025-12-19 06:07:35', '2026-02-13 12:09:25'),
(55, 'JAGDISH DINGH', '7044392039', 'rsboxer9@gmail.com', '', '$2b$10$G.W/2A5Ojei3Q3G3WHZLPew46MNuuCmfcNmBqBj17pLWkA5HR/g5C', NULL, 2, 1, 1, 1, '2025-12-19 06:25:47', '2026-02-13 14:09:56'),
(56, 'staff1', '7978978686', 'staff1@gmail.com', '', '$2b$10$sF1nNDq6RgemBo0JkBGrPuNFPHqzvcwM3PB4nlqq6gI18xeCAHGzK', NULL, 3, 1, 1, 1, '2025-12-19 09:17:19', '2026-02-13 12:10:11'),
(57, 'Krima Patel', '7818861352', 'krima@gmail.com', '', '$2b$10$Y5fQkdHB81402QJyNh3P6.dIFbg771Yw4acqC1LV0xIzdXvnRz/Gy', NULL, 2, 1, 1, 1, '2026-01-02 09:00:35', '2026-02-13 13:33:59'),
(58, '6-2 Yash', '8989898989', 'yash6.2@gmail.com', '', '$2b$10$du7jIkkSF.Tb8xd.6RuIGuYDDK4ORIArHG5qW/I1xWl2IoZYMBgEK', NULL, 3, 0, 47, 47, '2026-02-06 04:56:28', '2026-02-06 04:56:28'),
(59, 'yash', '9337381273', 'yasrow@gmail.com', '', '$2b$10$mo2wjfe/Y0dyMcVDjf07VObwimtI9D9KrJOvJP/NxrhURtqtk8YL2', NULL, 3, 0, 47, 47, '2026-02-06 05:12:37', '2026-02-06 05:12:37'),
(63, 'yash', '9334738738', 'y3row@gmail.com', '', '$2b$10$k95P7JlLl5BF4rsiR/Bt4evFXLo0gSChco4lHwQ0RQTW5AOTKtWT.', NULL, 3, 0, 47, 47, '2026-02-06 05:45:50', '2026-02-06 05:45:50'),
(64, 'c1', '8989367844', 'c1@gmail.com', '', '$2b$10$KhEFU/v3Gj15Qdw87jybcuEqkEbny62Oz/rJ9KrhRVIbtC6muaS0G', NULL, 2, 0, 47, 47, '2026-02-06 06:02:31', '2026-02-06 06:02:31'),
(65, 't1', '9839289383', 't1@gmail.com', '', '$2b$10$N7rRd9Zmz.bfDVl93jWmBuJ2b5IttY8oFHKYq5cQUFeLaZolrRYNq', NULL, 3, 0, 47, 47, '2026-02-06 09:49:13', '2026-02-06 09:49:13'),
(66, '10-2-c1', '9202920290', 'fawave4303@homuno.com', '', '$2b$10$a1qM/xY/YWQR0VadG9Xsv.pmU.cf3cXkPx0CzjqBZdXE.0qJPrDuu', NULL, 2, 0, 47, 47, '2026-02-10 11:20:59', '2026-02-10 11:20:59'),
(67, '10-2-C2', '2323434342', 'c2@yopmail.com', '', '$2b$10$WO.RDaWlFAHAvrdoGAWy3uE8HOT3m8pkkXLnr5THmNfuj0PCBcQCW', NULL, 2, 0, 47, 47, '2026-02-10 11:26:52', '2026-02-10 11:26:52'),
(68, '10-2-st1', '8739838843', 'st1@yopmail.com', '', '$2b$10$5IcPVoZmCnqE8Ap0sxdf.e59Na.j8QpOqUGYY3rTiarQr04JtRFTi', NULL, 3, 0, 47, 47, '2026-02-10 12:45:12', '2026-02-10 12:46:33'),
(69, 'yash', '6836467444', 'fawave43903@homuno.com', '', '$2b$10$iRpqsBKPIpulhziB7GLV9.w.nl60RFo4BxKs1x/qjFw1Og0tzImSK', NULL, 3, 1, 1, 1, '2026-02-11 07:46:47', '2026-02-13 12:10:24'),
(70, 'Customer 1', '7876519864', 'cust1@gmail.com', '', '$2b$10$N974vCUQdXGNC9hautGUYOXAU6JX0sI3b3t.IgCFCvqcgZoknZog6', NULL, 2, 1, 1, 1, '2026-02-11 07:51:16', '2026-02-13 13:34:02'),
(71, '11-2 yash', '9330286453', 'sanandiyayash1166@gmail.com', '', '$2b$10$ic0qt6Yef0gSfQlfRF8MNuXDcjwvrkNvb65GGozbt5na/3JHap6OS', NULL, 3, 1, 1, 1, '2026-02-11 08:14:31', '2026-02-13 12:10:20'),
(72, 'Kishore Kumar Dahiya', '9116524153', 'dahiyakishor32@gmail.com', '', '$2b$10$gnKteuBXsFUtiAt35bYmOe9.UhQzOsOlW4M31sVkWSfNCLdwNi492', NULL, 3, 0, 1, 1, '2026-02-13 12:16:17', '2026-02-13 12:16:17'),
(73, 'Ravindra Singh', '7044392039', 'rsboxer9@gmail.com', '', '$2b$10$CisSqUMbVcZ2.lKxbFy8Oe.TwSgphdveoNwJjlJZrAp9dYUPpMm.O', NULL, 3, 1, 1, 1, '2026-02-13 14:28:04', '2026-02-14 10:08:56'),
(74, 'JAGDISH DINGH', '9602650994', 'rewellnesscare@gmail.com', '', '$2b$10$qQScm0itx.q6a/jI.wFx9uypvB4mk9MDRvA5hhL9l80vAG3OBviry', NULL, 2, 1, 1, 1, '2026-02-13 14:31:17', '2026-02-14 11:27:20'),
(75, 'Kanta Bhavnaben ', '9106074965', 'bhavna1844@gmail.com', '', '$2b$10$SzMFd99u4W9ryqlaTKe74OnuM/uMVGNq7SVDWyFWnU7dmchQF0MZ2', NULL, 3, 0, 1, 1, '2026-02-14 10:33:22', '2026-02-14 10:33:22'),
(76, 'Sawai Singh', '7568247713', 'raobhatiyan198@gmail.com', '', '$2b$10$0NSfG4cSmipDCbSrjdWhfe7WemsbiSLndq6w7Q7bzs1ap7QMLUNUe', NULL, 3, 0, 1, 1, '2026-02-14 11:26:29', '2026-09-02 17:15:28'),
(77, 'Chamar Narendrabhai Dahyabhai', '8141417033', 'rathodnarendra5320@gmail.com', '', '$2b$10$gQCKetAGE83N4EecvVUxAu8jSiuVGVH6k.IwTkCExlzgaW/DuIFzS', NULL, 3, 0, 1, 1, '2026-02-14 12:34:18', '2026-02-18 08:46:24'),
(78, 'Mr. Mohinder Singh Walia', '9929710444', 'Aumajaipur@gmail.com', '', '$2b$10$rUF6WPJ/WFzVw9AzAhLZnO2XvOQdQdDBviYzd7JMOg8WUMJMgTWTC', NULL, 2, 0, 1, 1, '2026-02-14 13:11:56', '2026-03-13 15:52:33'),
(79, 'yash', '8779798998', NULL, '', '$2b$10$Lqdd1BwAUOZepJEmxq5Lc.BiZhWSqBlTmYx4BeC7r1XRQATQuDkri', NULL, 3, 0, 47, 47, '2026-03-13 06:36:41', '2026-03-13 06:37:22'),
(80, 'C1 13-03', '8383838388', '', '', '$2b$10$l0ypvaMsR1Gi8F/Jcy0ZD.ByGzkKBA/sv2AAv.1/w.6K836lmd6li', NULL, 2, 0, 47, 47, '2026-03-13 06:39:42', '2026-03-13 06:40:01'),
(81, 's1 13-03-2026', '7988998989', '', '', '$2b$10$.iV19K.kVykC42DZJEbyBuXGFcdhZo6CG/rIRtSKlYSVutflDpMp.', NULL, 3, 0, 47, 47, '2026-03-13 07:03:54', '2026-03-13 07:04:00'),
(82, 'Vish', '3232323232', '', '', '$2b$10$/qEXvg5QLebynl0pwSltb.i6zmG0Mk1znUfj71zsUKgnSrZzid7Oe', NULL, 3, 0, 47, 47, '2026-03-13 07:34:41', '2026-03-13 07:35:04'),
(83, 'MR. TULSIDAS CHABLANI', '6353126982', '', '', '$2b$10$bk2GIn2zlwZHVHaOuolrleu85WEA/pBoWeYEpAhiQZ0.AJhJA.HZK', NULL, 2, 0, 1, 1, '2026-03-13 09:50:41', '2026-03-13 16:48:38'),
(84, '13-3 ', '4342432423', NULL, '', '$2b$10$Cye119r3shMcceAHYVzBR.eAx4RbYeiTrsxYcaZKLFTXQGzAgJzj6', NULL, 3, 1, 47, 47, '2026-03-13 10:28:32', '2026-03-13 11:13:45'),
(85, 'stagg ', '3434324242', '', '', '$2b$10$HJRP5zcKPRcbADN0T23EZ.4Bsv6Bmne0uRgBYDn7B4i4A6vG1licW', NULL, 3, 1, 47, 47, '2026-03-13 11:13:17', '2026-03-13 11:13:42'),
(86, 'staffwe', '3432342232', NULL, '', '$2b$10$Z0iUjHI26x14vWZx8gD48.MjmqppUWhHDIXKNjSI.uPvK3TaHzyAm', NULL, 3, 1, 47, 47, '2026-03-13 11:13:59', '2026-03-13 11:14:04'),
(87, 'stafffffs', '3432424243', 'stadfdsfs@gmail.com', '', '$2b$10$9BakbMKfbBLXTS7Sjs8F6OfLWQQoMAwodRQXmcobK59xKJ8.arbUO', NULL, 3, 1, 47, 47, '2026-03-13 11:15:07', '2026-03-13 11:15:36'),
(88, 'fasfsaf', '8932749274', 'sadgfa@gmail.com', '', '$2b$10$JmSE5hSD3gCVkaefxOtpwesXUiEj6.aSC6fzi1j2Hu5IIdMgjCCom', NULL, 3, 0, 47, 47, '2026-03-13 11:16:53', '2026-03-13 11:16:53'),
(89, 'werwerwr', '3534534353', 'werw@gmail.com', '', '$2b$10$le9JDQkJB7JlUMuNtWGy3uCWnj4ZJfwQ0JUnKqVWjn.V9sVJ2Gn5m', NULL, 3, 1, 1, 1, '2026-03-13 11:18:31', '2026-03-13 11:18:42'),
(90, 'DILIP KUMAR', '3453435343', 'dilipkimar8237438@gmail.com', '', '$2b$10$jw9YbbIN5dEjJOC7lSafZ.d0ju0oSaNkBCyTN3m6iwrTzJsyYRQ.2', NULL, 3, 1, 1, 1, '2026-03-13 11:24:20', '2026-03-13 11:24:38'),
(91, 'DILIP KUMAR', '9680361876', 'dilipkumar20051999@gmail.com', '', '$2b$10$RiBy79fRqpZ07weBf4dhm.7kCon8W9Sz54sr3D6hQ2pLuI52zKFh6', NULL, 3, 0, 1, 1, '2026-03-13 11:34:21', '2026-05-19 17:49:21'),
(92, 'Kishan Yadav', '7990619378', 'ky280928@gmail.com', '', '$2b$10$KJaMiOMDp4B49GIT9L9ap.4TmEdxCEvwbj4OwP.ihZAYkPA7e7dA.', NULL, 3, 0, 1, 1, '2026-03-13 15:49:32', '2026-05-19 17:07:53'),
(93, 'Mr.Murli Ranghanathan', '8141296350', '', '', '$2b$10$Z8QCaRM2Wr5mhdM/K3c5e.kBiidlB3q6q2PkCK8UQPyK.aGLnWztC', NULL, 2, 0, 1, 1, '2026-03-13 16:48:11', '2026-03-13 16:55:20'),
(94, 'RAVINDRA', '9602650994', NULL, '', '$2b$10$Ar9frOmscs11p3w/ebRi3eAttRX/RMwmz3upaY3DFMS55N2jCOEQ2', NULL, 2, 1, 1, 1, '2026-03-13 19:07:46', '2026-03-13 19:45:31'),
(95, 'Jayanti Lal', '8866426345', 'jaymeghwal81@gmail.com', '', '$2b$10$zAOjkY3gsRGrVSPiAFCTIO24Yt9L55qfQzQkhduMrylFik8STs7.K', NULL, 3, 0, 1, 1, '2026-03-17 09:40:44', '2026-03-17 09:40:44'),
(96, 'Sadhwi Falgunchandra', '8849533630', NULL, '', '$2b$10$ReW4HDpoKhwpJDRWGNzxYu6.9/NHffxizEZ9QWvRqPP8JeH9hwL4i', NULL, 2, 1, 1, 1, '2026-03-21 13:49:54', '2026-03-23 21:06:20'),
(97, 'Lohiya Mittal', '9265349293', 'mittallohiya95@gmail.com', '', '$2b$10$soKS.gSbcjAKDj80QZLqg.weZWjXEr606xO85HAtGFQ1WkgIDoGGy', NULL, 3, 0, 1, 1, '2026-03-21 16:25:40', '2026-05-19 17:12:42'),
(98, 'Sadhwi Falgunchandra', '7600207067', NULL, '', '$2b$10$frnD17nIQOlX3x3u3QrZvu8farSd67fDjopf37D8G9QnGvRn9jSpi', NULL, 2, 1, 1, 1, '2026-03-21 16:32:38', '2026-03-21 16:33:19'),
(99, ' Sejal Parmar', '9316436379', 'sejalparmar444@gmail.com', '', '$2b$10$DTUlIoMcWT/02f.BLAsoeO4zawoPdj.fxDROne9WkbxSdGeUJ8DAa', NULL, 3, 0, 1, 1, '2026-03-21 20:13:15', '2026-05-19 17:42:38'),
(100, 'Vimala Kumari Roat', '9725874771', '', '', '$2b$10$VbddPFtZ97qJT442uW4SR.v29YoAAa8y201S2CVlwgT./wsO3mJM2', NULL, 3, 0, 1, 1, '2026-03-23 20:43:53', '2026-05-19 17:03:58'),
(101, 'Sadhwi Falgunchandra Maharajsaheb', '8849533630', '', '', '$2b$10$pEgVKbqIXTQ5VcLibS.LyOsqhba1RIzPz5oTQcuDDBjS4wfYq1wmi', NULL, 2, 0, 1, 1, '2026-03-23 21:10:34', '2026-03-23 21:12:42'),
(102, 'Yash', '9658756558', 'yash@yopmail.com', '', '$2b$10$L0EW32IYTrd6KYhuxrsDuesV8yp5Lg2sl0uUxjlO9.63.MaXF89qK', NULL, 2, 1, 1, 1, '2026-05-19 07:40:07', '2026-05-19 07:40:35'),
(103, 'Yash', '8854887547', NULL, '', '$2b$10$bBWp4.9xR/s5c2RQYNSBp.9M8tjZPUC6pobzjSFARWT1KKuQI7a6.', NULL, 2, 1, 1, 1, '2026-05-19 07:40:31', '2026-05-19 08:00:10'),
(104, 'New staff 19-may', '6666666666', '', '', '$2b$10$gPbetyzUTCeOhHG5cbVkFOeTiE941HH8Rs9QLWevoQV1KfnGcD0ku', NULL, 3, 1, 1, 1, '2026-05-19 07:52:50', '2026-05-19 18:58:35'),
(105, 'Neel', '7575757575', NULL, '', '$2b$10$svGUkt6M4rUR0dhjthOMh.avDeoRD0H69C5dgLU4tQeCoi0d5u52S', NULL, 2, 0, 47, 47, '2026-05-19 11:26:30', '2026-05-19 11:26:30'),
(106, 'Dimpal Solanki Jayanti Bhai', '8200543986', 'dimpalsolanki1234@gmail.com', '', '$2b$10$STBqV4u1bQeSYcyiLjLDTOWxEfoXjiSG3honXUyDhGEh3Wx5hagwO', NULL, 3, 0, 1, 1, '2026-06-13 15:37:05', '2026-06-13 16:01:38'),
(107, 'yasd', '9665555555', NULL, '', '$2b$10$xvVkceoDVaXEEEX9zRFel./sHu3LX7xrgMBZM5dSbD3xBmBhcLcvG', NULL, 3, 0, 47, 47, '2026-06-15 06:54:14', '2026-06-15 06:54:14'),
(108, 'Jashraj ji Rajpurohit', '7502262000', NULL, '', '$2b$10$2Iosja/Yh.RYZE7ZZD6rWu8O9hw6S64T1pW8vFe1R4AQ4aGP5cNB.', NULL, 2, 1, 1, 1, '2026-06-17 16:36:42', '2026-06-18 12:21:21'),
(109, 'Jitendra Singh', '8502873662', 'jeetgnm9988@gmail.com', '', '$2b$10$9.TneuwwShz3YiQ1TiKdZ.5P80.oZ3RDaM4iQDl17N36W/D.jq/hy', NULL, 3, 0, 1, 1, '2026-06-18 06:32:12', '2026-07-07 06:19:14'),
(110, 'Prabha Kumari A', '7736500691', '1974@gmail.com', '', '$2b$10$upOVOy.VmYT1I9JjVuxLoO3na7dCh7npWUU4m/ryAcTvhe2AZhhXW', NULL, 3, 0, 1, 1, '2026-06-18 09:06:29', '2026-06-24 16:34:41'),
(111, 'Jashraj ji Rajpurohit', '7502262000', '', '', '$2b$10$kW6tuHdpPEVbticvJmZHT.h5B8l2LszhIBafkMdUN2imgHI.6x9SG', NULL, 2, 0, 1, 1, '2026-06-24 15:50:21', '2026-06-25 14:40:25'),
(112, 'Mr. Maganlal Shivprasad Prajapati', '8849003108', NULL, '', '$2b$10$.YOBOO4F/EXZE2FaCIgb..MmhHBi8RSahIno2.bOcWQsIBeJMGTPe', NULL, 2, 0, 1, 1, '2026-06-27 07:24:57', '2026-06-27 07:24:57'),
(113, 'Mrs. Asha Pandian', '9825000981', NULL, '', '$2b$10$Fe39feWrhCAYbTwTgstWbu0nRNbWt6.i7Pyog2vZtwbi9bRZt/POq', NULL, 2, 0, 1, 1, '2026-07-04 15:49:53', '2026-07-04 15:49:53'),
(114, 'Himanshu Upadhyay', '7023093807', 'upadhyayh064@gmail.com', '', '$2b$10$ueQFid7zKRzwzFag5Vz4gej9bfB1bwkIG3wcLiQy7KQDgh6zBVWkC', NULL, 3, 0, 1, 114, '2026-09-01 15:40:27', '2026-09-01 16:57:59'),
(115, 'Mr. Ashwin Trivedi', '9327614338', '', '', '$2b$10$l5O9bvARGDDelRUlywPInujz5qgVjSyVYxLJOAZACUjgmvHM0L8xm', NULL, 2, 0, 1, 1, '2026-09-04 18:26:11', '2026-09-04 19:47:07'),
(116, 'Parag Jyotindrakumar', '6353004893', '', '', '$2b$10$tatV2jX6KVdx5OmNsfoah.I4rdBA8CRj.4mkFtWYve9uwwWMyIqDm', NULL, 3, 0, 1, 1, '2026-09-04 18:48:25', '2026-09-04 19:13:07'),
(117, 'Arshad Ali', '7500595558', 'Arshadkhan7598@gmail.com', '', '$2b$10$wLz9jpFje/UrTiHPvTSN5eBimmGZkwogKYHNKHESupJE.uX3pCTf6', NULL, 3, 0, 1, 1, '2026-09-04 19:11:12', '2026-09-04 19:11:12');

-- --------------------------------------------------------

--
-- Table structure for table `user_account_mappings`
--

CREATE TABLE `user_account_mappings` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account_mappings`
--

INSERT INTO `user_account_mappings` (`id`, `user_id`, `account_id`, `branch_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 1, '2025-09-08 11:52:06', '2025-09-08 11:52:06'),
(47, 47, 3, 3, 1, 1, '2025-09-08 11:52:06', '2025-09-08 11:52:06'),
(48, 48, 3, 3, 47, 47, '2025-12-17 10:50:51', '2025-12-17 10:50:51'),
(49, 49, 3, 3, 47, 47, '2025-12-17 12:09:36', '2025-12-17 12:09:36'),
(50, 50, 3, 3, 47, 47, '2025-12-17 12:31:39', '2025-12-17 12:31:39'),
(51, 51, 3, 3, 47, 47, '2025-12-17 12:34:24', '2025-12-17 12:34:24'),
(52, 52, 3, 3, 47, 47, '2025-12-18 07:07:51', '2025-12-18 07:07:51'),
(53, 53, 3, 3, 47, 47, '2025-12-18 11:44:22', '2025-12-18 11:44:22'),
(54, 54, 1, 1, 1, 1, '2025-12-19 06:07:35', '2025-12-19 06:07:35'),
(55, 55, 1, 1, 1, 1, '2025-12-19 06:25:47', '2025-12-19 06:25:47'),
(56, 56, 1, 1, 1, 1, '2025-12-19 09:17:19', '2025-12-19 09:17:19'),
(57, 57, 1, 1, 1, 1, '2026-01-02 09:00:35', '2026-01-02 09:00:35'),
(58, 58, 3, 3, 47, 47, '2026-02-06 04:56:28', '2026-02-06 04:56:28'),
(59, 59, 3, 3, 47, 47, '2026-02-06 05:12:37', '2026-02-06 05:12:37'),
(63, 63, 3, 3, 47, 47, '2026-02-06 05:45:50', '2026-02-06 05:45:50'),
(64, 64, 3, 3, 47, 47, '2026-02-06 06:02:30', '2026-02-06 06:02:30'),
(65, 65, 3, 3, 47, 47, '2026-02-06 09:49:13', '2026-02-06 09:49:13'),
(66, 66, 3, 3, 47, 47, '2026-02-10 11:20:58', '2026-02-10 11:20:58'),
(67, 67, 3, 3, 47, 47, '2026-02-10 11:26:52', '2026-02-10 11:26:52'),
(68, 68, 3, 3, 47, 47, '2026-02-10 12:45:12', '2026-02-10 12:45:12'),
(69, 69, 1, 1, 1, 1, '2026-02-11 07:46:46', '2026-02-11 07:46:46'),
(70, 70, 1, 1, 1, 1, '2026-02-11 07:51:16', '2026-02-11 07:51:16'),
(71, 71, 1, 1, 1, 1, '2026-02-11 08:14:31', '2026-02-11 08:14:31'),
(72, 72, 1, 1, 1, 1, '2026-02-13 12:16:17', '2026-02-13 12:16:17'),
(73, 73, 1, 1, 1, 1, '2026-02-13 14:28:04', '2026-02-13 14:28:04'),
(74, 74, 1, 1, 1, 1, '2026-02-13 14:31:17', '2026-02-13 14:31:17'),
(75, 75, 1, 1, 1, 1, '2026-02-14 10:33:22', '2026-02-14 10:33:22'),
(76, 76, 1, 1, 1, 1, '2026-02-14 11:26:29', '2026-02-14 11:26:29'),
(77, 77, 1, 1, 1, 1, '2026-02-14 12:34:18', '2026-02-14 12:34:18'),
(78, 78, 1, 1, 1, 1, '2026-02-14 13:11:56', '2026-02-14 13:11:56'),
(79, 79, 3, 3, 47, 47, '2026-03-13 06:36:40', '2026-03-13 06:36:40'),
(80, 80, 3, 3, 47, 47, '2026-03-13 06:39:42', '2026-03-13 06:39:42'),
(81, 81, 3, 3, 47, 47, '2026-03-13 07:03:54', '2026-03-13 07:03:54'),
(82, 82, 3, 3, 47, 47, '2026-03-13 07:34:41', '2026-03-13 07:34:41'),
(83, 83, 1, 1, 1, 1, '2026-03-13 09:50:41', '2026-03-13 09:50:41'),
(84, 84, 3, 3, 47, 47, '2026-03-13 10:28:32', '2026-03-13 10:28:32'),
(85, 85, 3, 3, 47, 47, '2026-03-13 11:13:17', '2026-03-13 11:13:17'),
(86, 86, 3, 3, 47, 47, '2026-03-13 11:13:59', '2026-03-13 11:13:59'),
(87, 87, 3, 3, 47, 47, '2026-03-13 11:15:07', '2026-03-13 11:15:07'),
(88, 88, 3, 3, 47, 47, '2026-03-13 11:16:52', '2026-03-13 11:16:52'),
(89, 89, 1, 1, 1, 1, '2026-03-13 11:18:31', '2026-03-13 11:18:31'),
(90, 90, 1, 1, 1, 1, '2026-03-13 11:24:20', '2026-03-13 11:24:20'),
(91, 91, 1, 1, 1, 1, '2026-03-13 11:34:21', '2026-03-13 11:34:21'),
(92, 92, 1, 1, 1, 1, '2026-03-13 15:49:32', '2026-03-13 15:49:32'),
(93, 93, 1, 1, 1, 1, '2026-03-13 16:48:11', '2026-03-13 16:48:11'),
(94, 94, 1, 1, 1, 1, '2026-03-13 19:07:45', '2026-03-13 19:07:45'),
(95, 95, 1, 1, 1, 1, '2026-03-17 09:40:44', '2026-03-17 09:40:44'),
(96, 96, 1, 1, 1, 1, '2026-03-21 13:49:54', '2026-03-21 13:49:54'),
(97, 97, 1, 1, 1, 1, '2026-03-21 16:25:40', '2026-03-21 16:25:40'),
(98, 98, 1, 1, 1, 1, '2026-03-21 16:32:38', '2026-03-21 16:32:38'),
(99, 99, 1, 1, 1, 1, '2026-03-21 20:13:15', '2026-03-21 20:13:15'),
(100, 100, 1, 1, 1, 1, '2026-03-23 20:43:53', '2026-03-23 20:43:53'),
(101, 101, 1, 1, 1, 1, '2026-03-23 21:10:34', '2026-03-23 21:10:34'),
(102, 102, 1, 1, 1, 1, '2026-05-19 07:40:07', '2026-05-19 07:40:07'),
(103, 103, 1, 1, 1, 1, '2026-05-19 07:40:31', '2026-05-19 07:40:31'),
(104, 104, 1, 1, 1, 1, '2026-05-19 07:52:50', '2026-05-19 07:52:50'),
(105, 105, 3, 3, 47, 47, '2026-05-19 11:26:30', '2026-05-19 11:26:30'),
(106, 106, 1, 1, 1, 1, '2026-06-13 15:37:05', '2026-06-13 15:37:05'),
(107, 107, 3, 3, 47, 47, '2026-06-15 06:54:14', '2026-06-15 06:54:14'),
(108, 108, 1, 1, 1, 1, '2026-06-17 16:36:42', '2026-06-17 16:36:42'),
(109, 109, 1, 1, 1, 1, '2026-06-18 06:32:12', '2026-06-18 06:32:12'),
(110, 110, 1, 1, 1, 1, '2026-06-18 09:06:28', '2026-06-18 09:06:28'),
(111, 111, 1, 1, 1, 1, '2026-06-24 15:50:21', '2026-06-24 15:50:21'),
(112, 112, 1, 1, 1, 1, '2026-06-27 07:24:57', '2026-06-27 07:24:57'),
(113, 113, 1, 1, 1, 1, '2026-07-04 15:49:52', '2026-07-04 15:49:52'),
(114, 114, 1, 1, 1, 1, '2026-09-01 15:40:27', '2026-09-01 15:40:27'),
(115, 115, 1, 1, 1, 1, '2026-09-04 18:26:11', '2026-09-04 18:26:11'),
(116, 116, 1, 1, 1, 1, '2026-09-04 18:48:25', '2026-09-04 18:48:25'),
(117, 117, 1, 1, 1, 1, '2026-09-04 19:11:12', '2026-09-04 19:11:12');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `user_id` int NOT NULL,
  `hour_price` decimal(10,4) DEFAULT NULL,
  `working_hours` decimal(10,4) DEFAULT NULL,
  `permanent_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `temporary_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `age` int DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `marital_status` enum('married','unmarried') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `police_verification` tinyint DEFAULT '0',
  `medical_verification` tinyint DEFAULT '0',
  `gender` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `document` text COLLATE utf8mb4_general_ci,
  `aadhar_card_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photo_url` longtext COLLATE utf8mb4_general_ci,
  `pan_card_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driving_license_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `has_vehicle` tinyint(1) DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'active',
  `block_reason` text COLLATE utf8mb4_general_ci,
  `reference_relationship` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_mobile_1` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_mobile_2` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_aadhar_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `has_driving_license` tinyint(1) DEFAULT '0',
  `aadhar_number` varchar(12) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driving_license_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pan_number` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`id`, `account_id`, `branch_id`, `user_id`, `hour_price`, `working_hours`, `permanent_address`, `temporary_address`, `age`, `date_of_birth`, `marital_status`, `designation`, `police_verification`, `medical_verification`, `gender`, `document`, `aadhar_card_url`, `photo_url`, `pan_card_url`, `driving_license_url`, `has_vehicle`, `status`, `block_reason`, `reference_relationship`, `reference_mobile_1`, `reference_mobile_2`, `reference_aadhar_url`, `has_driving_license`, `aadhar_number`, `driving_license_number`, `pan_number`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(39, 3, 3, 48, 200.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2004-12-17', 'married', 'a', 1, 1, '', NULL, '/uploads/staff/documents/48/aadhar_card_screenshot_2025_11_21_173720_1765968651408.png', '/uploads/staff/documents/48/photo_download_1765968651409.jpeg', '/uploads/staff/documents/48/pan_card_table_1765968651409.jpeg', NULL, 1, 'block', 'asdf', '', '', '', NULL, 0, '251825626727', '', 'AAAPA1234A', 0, 47, 47, '2025-12-17 10:50:51', '2026-02-06 06:00:39'),
(40, 3, 3, 49, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"asfd\",\"line2\":\"\",\"pinCode\":\"3452342\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Assam\",\"value\":\"AS\"},\"city\":{\"label\":\"Baksa\",\"value\":\"Baksa\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"asfd\",\"line2\":\"\",\"pinCode\":\"3452342\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Assam\",\"value\":\"AS\"},\"city\":{\"label\":\"Baksa\",\"value\":\"Baksa\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2005-12-17', 'unmarried', 'nurse', 1, 1, NULL, NULL, '/uploads/staff/documents/49/aadhar_card_photo_1706999131259_33d9417c7524_1765973376143.avif', '/uploads/staff/documents/49/photo_photo_1521136492500_e18f107709f7_1765973376253.jpeg', '/uploads/staff/documents/49/pan_card_premium_photo_1686050416689_1b1f64fd5000_1765973376144.avif', '/uploads/staff/documents/49/driving_license_photo_1521136492500_e18f107709f7_1765973376249.jpeg', 1, 'active', NULL, NULL, NULL, NULL, NULL, 1, '251825626727', '2121212122222212', 'AAAPA1234A', 0, 47, 47, '2025-12-17 12:09:36', '2025-12-17 12:09:37'),
(41, 3, 3, 50, NULL, NULL, '{\"title\":\"\",\"line1\":\"AS\",\"line2\":\"\",\"pinCode\":\"231222\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Rajkot\",\"value\":\"Rajkot\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 28, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Father ', '9337387384', '', '/uploads/customer/documents/50/reference_aadhar_2_sign_1770357773840.png', NULL, '', NULL, NULL, 0, 47, 47, '2025-12-17 12:31:39', '2026-02-06 06:02:54'),
(42, 3, 3, 51, NULL, NULL, '{\"line1\":\"AD\",\"line2\":\"\",\"pinCode\":\"968708\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Jetpur\",\"value\":\"Jetpur\"}}', NULL, 23, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 47, 47, '2025-12-17 12:34:24', '2025-12-17 12:34:24'),
(43, 3, 3, 52, 200.0000, 8.0000, '{\"title\":\"\",\"line1\":\"ahm\",\"line2\":\"\",\"pinCode\":\"231232\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Babra\",\"value\":\"Babra\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"ahm\",\"line2\":\"\",\"pinCode\":\"231232\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Babra\",\"value\":\"Babra\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2000-12-18', 'unmarried', 'nurse', 0, 0, NULL, NULL, '/uploads/staff/documents/52/aadhar_card_table_1766041671249.jpeg', '/uploads/staff/documents/52/photo_table_1766041671250.jpeg', '/uploads/staff/documents/52/pan_card_photo_1706999131259_33d9417c7524_1766041671250.avif', NULL, 1, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '251825626727', NULL, 'AAAPA1234A', 0, 47, 47, '2025-12-18 07:07:51', '2025-12-18 07:07:52'),
(44, 3, 3, 53, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahm\",\"line2\":\"\",\"pinCode\":\"309399\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Chuda\",\"value\":\"Chuda\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Ahm\",\"line2\":\"\",\"pinCode\":\"309399\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Chuda\",\"value\":\"Chuda\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2001-12-13', 'unmarried', 'attendant', 0, 1, NULL, NULL, '/uploads/staff/documents/53/aadhar_card_table_1766058261607.jpeg', '/uploads/staff/documents/53/photo_photo_1521136492500_e18f107709f7_1766058261607.jpeg', '/uploads/staff/documents/53/pan_card_skill_swap_system_design_1766058261607.pdf', NULL, 1, 'active', NULL, NULL, NULL, NULL, NULL, 0, '251825626727', '', 'AAAPA1234A', 0, 47, 47, '2025-12-18 11:44:22', '2025-12-18 11:44:52'),
(45, 1, 1, 54, 83.3300, 22.0000, '{\"title\":\"\",\"line1\":\"out side suraj pol\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalore\",\"value\":\"Jalore\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"kabir appartment\",\"line2\":\"\",\"pinCode\":\"380059\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1993-01-01', 'married', 'nurse', 1, 1, NULL, NULL, '/uploads/staff/documents/54/aadhar_card_whatsapp_image_2025_12_19_at_11_32_44_fb17cb8a_1766124454496.jpg', '/uploads/staff/documents/54/photo_whatsapp_image_2025_12_19_at_11_32_44_fb17cb8a_1766124454539.jpg', '/uploads/staff/documents/54/pan_card_whatsapp_image_2025_12_19_at_11_32_44_fb17cb8a_1766124454497.jpg', '/uploads/staff/documents/54/driving_license_whatsapp_image_2025_12_19_at_11_36_27_c5565f9e_1766124454503.jpg', 1, 'inactive', NULL, NULL, NULL, NULL, NULL, 1, '656589879988', '2030004720', 'eunps6151m', 1, 1, 1, '2025-12-19 06:07:35', '2025-12-19 09:44:11'),
(46, 1, 1, 55, NULL, NULL, '{\"title\":\"\",\"line1\":\"RAMNAGAR\",\"line2\":\"\",\"pinCode\":\"380046\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 35, NULL, NULL, NULL, 0, 0, 'male', NULL, '/uploads/customer/documents/55/aadhar_card_aadhar_care_1770989552343.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, 'son', '7404084849', NULL, NULL, NULL, '233300591532', NULL, NULL, 1, 1, 1, '2025-12-19 06:25:47', '2026-02-13 13:32:47'),
(47, 1, 1, 56, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahdd\",\"line2\":\"\",\"pinCode\":\"382937\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Ahdd\",\"line2\":\"\",\"pinCode\":\"382937\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2005-12-06', 'married', 'attendant', 0, 0, '', NULL, '/uploads/staff/documents/56/aadhar_card_logo_no_bg_1766135839310.png', '/uploads/staff/documents/56/photo_logo_no_bg_1766135839310.png', '/uploads/staff/documents/56/pan_card_logo_no_bg_1766135839310.png', NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, '251825626727', NULL, 'AAAPA1234A', 1, 1, 1, '2025-12-19 09:17:19', '2026-02-13 12:10:03'),
(48, 1, 1, 57, NULL, NULL, '{\"line1\":\"C39 Umiya Bungalow\",\"line2\":\"\",\"pinCode\":\"382475\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, 30, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-01-02 09:00:35', '2026-01-02 09:00:35'),
(49, 3, 3, 58, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"add 1\",\"line2\":\"\",\"pinCode\":\"792700\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Agol\",\"value\":\"Agol\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"add 1\",\"line2\":\"\",\"pinCode\":\"792700\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Agol\",\"value\":\"Agol\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2002-02-06', 'unmarried', 'New deg', 0, 0, 'male', NULL, NULL, '/uploads/staff/documents/58/photo_2_sign_1770353787436.png', NULL, NULL, 1, 'active', NULL, 'F', '9838288988', NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-02-06 04:56:28', '2026-02-06 04:56:28'),
(50, 3, 3, 59, 2.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, 'married', 'othj', 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, 0, 'active', '', '', '', '', '/uploads/staff/documents/59/reference_aadhar_adobe_express___file_1770355085878.png', 0, '', '', '', 0, 47, 47, '2026-02-06 05:12:37', '2026-02-06 05:18:06'),
(51, 3, 3, 63, 0.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"Algeria\",\"value\":\"DZ\"},\"state\":{\"label\":\"Blida\",\"value\":\"09\"},\"city\":{\"label\":\"Blida\",\"value\":\"Blida\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, 'a', 0, 1, NULL, NULL, NULL, '/uploads/staff/documents/63/photo_chatgpt_image_nov_25__2025__11_43_51_am_removebg_preview_1770356750260.png', NULL, NULL, 1, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-02-06 05:45:50', '2026-02-06 05:45:51'),
(52, 3, 3, 64, NULL, NULL, '{\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 47, 47, '2026-02-06 06:02:31', '2026-02-06 06:02:31'),
(53, 3, 3, 65, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-02-06 09:49:13', '2026-02-06 09:49:14'),
(54, 3, 3, 66, NULL, NULL, '{\"title\":\"\",\"line1\":\"Ahmedabadin\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Andaman and Nicobar Islands\",\"value\":\"AN\"},\"city\":{\"label\":\"Nicobar\",\"value\":\"Nicobar\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 20, NULL, NULL, NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 47, 47, '2026-02-10 11:20:59', '2026-02-10 11:38:04'),
(55, 3, 3, 67, NULL, NULL, '{\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"383838\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, 30, NULL, NULL, NULL, NULL, NULL, 'male', NULL, '/uploads/customer/documents/67/aadhar_card_invoice__44__1770722811751.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 'Father ', '7473947648', '4848484848', '/uploads/customer/documents/67/reference_aadhar_payment_reciept__1__1770722811851.pdf', NULL, '728278382828', NULL, NULL, 0, 47, 47, '2026-02-10 11:26:52', '2026-02-10 11:26:52'),
(56, 3, 3, 68, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '2001-02-10', 'married', NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-02-10 12:45:12', '2026-02-10 12:46:58'),
(57, 1, 1, 69, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, 'deg 1', 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, 1, '2026-02-11 07:46:47', '2026-02-11 07:46:47'),
(58, 1, 1, 70, NULL, NULL, '{\"line1\":\"ahmdabad\",\"line2\":\"\",\"pinCode\":\"309874\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, '/uploads/customer/documents/70/aadhar_card_payslip_5_1770796276080.pdf', NULL, NULL, NULL, NULL, NULL, NULL, 'Father ', '9898747455', NULL, '/uploads/customer/documents/70/reference_aadhar_invoice__46__1770796276081.pdf', NULL, '251825626727', NULL, NULL, 1, 1, 1, '2026-02-11 07:51:16', '2026-02-11 07:51:17'),
(59, 1, 1, 71, 100.0000, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, 'nurse', 0, 0, '', NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, 1, '2026-02-11 08:14:31', '2026-02-11 08:17:45'),
(60, 1, 1, 72, NULL, 12.0000, '{\"title\":\"\",\"line1\":\"s/o Suresh Kumar Dahiya, Shanti Nagar Colany,\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"s/o Suresh Kumar Dahiya, Shanti Nagar Colany,\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1993-09-11', 'married', 'nurse', 0, 0, 'male', NULL, '/uploads/staff/documents/72/aadhar_card_aadhar_care_1770985116012.jpeg', '/uploads/staff/documents/72/photo_photo_1770984977109.jpeg', '/uploads/staff/documents/72/pan_card_pan_cared_1770985116013.jpeg', NULL, 0, 'inactive', NULL, 'Father ', '7851887710', NULL, NULL, 0, '233300591532', NULL, 'JZZPD8063H', 0, 1, 1, '2026-02-13 12:16:17', '2026-05-19 18:50:45'),
(61, 1, 1, 73, NULL, NULL, '{\"title\":\"\",\"line1\":\"KABIR APARTMENT\",\"line2\":\"PUNCHAMRUT BUNGALOW\",\"pinCode\":\"380060\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"KABIR APARTMENT\",\"line2\":\"PUNCHAMRUT BUNGALOW\",\"pinCode\":\"380060\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1988-12-02', 'married', 'nurse', 1, 1, 'male', NULL, NULL, NULL, NULL, NULL, 1, 'active', NULL, NULL, NULL, NULL, NULL, 1, '274583516778', '20130004720', 'EUNPS6151M', 1, 1, 1, '2026-02-13 14:28:04', '2026-02-13 14:28:04'),
(62, 1, 1, 74, NULL, NULL, '{\"line1\":\"out side suraj pol\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"}}', NULL, 32, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-02-13 14:31:17', '2026-02-13 14:31:18'),
(63, 1, 1, 75, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"C/O: Ranvirsingh Khant, 110, Khant Vas, Jalamkhantna Muvada, po: Bhempoda, Dist: Aravalli\",\"line2\":\"\",\"pinCode\":\"383335\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Sabar Kantha\",\"value\":\"Sabar Kantha\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"C/O: Ranvirsingh Khant, 110, Khant Vas, Jalamkhantna Muvada, po: Bhempoda, Dist: Aravalli\",\"line2\":\"\",\"pinCode\":\"383335\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Sabar Kantha\",\"value\":\"Sabar Kantha\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1998-01-02', 'married', 'ANM', 0, 0, 'female', NULL, '/uploads/staff/documents/75/aadhar_card_aadhar_1_1771065201734.jpeg', '/uploads/staff/documents/75/photo_photo_1771066259352.jpeg', NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '570464422517', NULL, NULL, 0, 1, 1, '2026-02-14 10:33:22', '2026-02-14 12:37:11'),
(64, 1, 1, 76, 69.4400, 24.0000, '{\"title\":\"\",\"line1\":\"Near Railway Colony, Pokran,Dist. Jaisalmer\",\"line2\":\"\",\"pinCode\":\"345021\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Pokaran\",\"value\":\"Pokaran\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1994-08-15', 'married', 'nurse', 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '701184522060', NULL, 'EOWPR8325K', 0, 1, 1, '2026-02-14 11:26:29', '2026-09-01 16:11:07'),
(65, 1, 1, 77, 33.0000, 24.0000, '{\"title\":\"\",\"line1\":\"s/o Dahyabhai, 240, Ubharan ,Ubharan\",\"line2\":\"\",\"pinCode\":\"383335\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Sabar Kantha\",\"value\":\"Sabar Kantha\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1995-07-01', 'married', 'attendant', 0, 0, 'male', NULL, '/uploads/staff/documents/77/aadhar_card_aadhar_care_1_1771072457763.jpeg', '/uploads/staff/documents/77/photo_photo_1771072457775.jpeg', '/uploads/staff/documents/77/pan_card_pan_card_1771072457767.jpeg', NULL, 0, 'inactive', NULL, 'Father ', '6351133438', NULL, NULL, 0, '595025527739', NULL, 'CTFPC7657B', 0, 1, 1, '2026-02-14 12:34:18', '2026-03-13 12:42:16'),
(66, 1, 1, 78, NULL, NULL, '{\"title\":\"\",\"line1\":\"56-58 , Rangeen Park Society In Lane Of Kiran Motors ,Near BJP Office, SG Highway\",\"line2\":\"\",\"pinCode\":\"380015\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 80, NULL, NULL, NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-02-14 13:11:56', '2026-03-13 15:52:33'),
(67, 3, 3, 79, 1.2200, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-03-13 06:36:41', '2026-03-13 06:36:41'),
(68, 3, 3, 80, NULL, NULL, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 47, 47, '2026-03-13 06:39:42', '2026-03-13 08:11:16'),
(69, 3, 3, 81, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, '', NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-03-13 07:03:54', '2026-03-13 07:04:01'),
(70, 3, 3, 82, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":{\"label\":\"Algeria\",\"value\":\"DZ\"},\"state\":{\"label\":\"Aïn Témouchent\",\"value\":\"46\"},\"city\":{\"label\":\"Beni Saf\",\"value\":\"Beni Saf\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":{\"label\":\"Algeria\",\"value\":\"DZ\"},\"state\":{\"label\":\"Aïn Témouchent\",\"value\":\"46\"},\"city\":{\"label\":\"Beni Saf\",\"value\":\"Beni Saf\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1989-06-05', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-03-13 07:34:41', '2026-06-17 05:43:22'),
(71, 1, 1, 83, NULL, NULL, '{\"title\":\"\",\"line1\":\"NEAR35, SWASTIK TENAMENT ROAD, SARDAR NAGAR, HANSOL,\",\"line2\":\"\",\"pinCode\":\"382475\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 70, NULL, NULL, NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-03-13 09:50:41', '2026-03-13 16:48:39'),
(72, 3, 3, 84, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 47, 47, '2026-03-13 10:28:32', '2026-03-13 10:28:33'),
(73, 3, 3, 85, 333.0000, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 47, 47, '2026-03-13 11:13:17', '2026-03-13 11:13:36'),
(74, 3, 3, 86, 234.0000, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 47, 47, '2026-03-13 11:13:59', '2026-03-13 11:14:00'),
(75, 3, 3, 87, 2342.0000, 8.0000, '{\"title\":\"\",\"line1\":\"sdasdfas\",\"line2\":\"\",\"pinCode\":\"\",\"country\":{\"label\":\"Afghanistan\",\"value\":\"AF\"},\"state\":{\"label\":\"Badakhshan\",\"value\":\"BDS\"},\"city\":{\"label\":\"Ashkāsham\",\"value\":\"Ashkāsham\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '2026-03-01', 'married', 'nurse', 0, 0, 'male', NULL, NULL, '/uploads/staff/documents/87/photo_invoice__1__1773400506938.pdf', NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 47, 47, '2026-03-13 11:15:07', '2026-03-13 11:15:07'),
(76, 3, 3, 88, 878.0000, 8.0000, '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"Afghanistan\",\"value\":\"AF\"},\"state\":{\"label\":\"Badakhshan\",\"value\":\"BDS\"},\"city\":{\"label\":\"Ashkāsham\",\"value\":\"Ashkāsham\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Ahmedabad\",\"line2\":\"\",\"pinCode\":\"360670\",\"country\":{\"label\":\"Afghanistan\",\"value\":\"AF\"},\"state\":{\"label\":\"Badakhshan\",\"value\":\"BDS\"},\"city\":{\"label\":\"Ashkāsham\",\"value\":\"Ashkāsham\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2026-03-10', 'married', 'nurse', 1, 1, 'male', NULL, '/uploads/staff/documents/88/aadhar_card_invoice__1__1773400612535.pdf', '/uploads/staff/documents/88/photo_invoice__1__1773400612537.pdf', '/uploads/staff/documents/88/pan_card_payslip_6__12__1773400612537.pdf', NULL, 1, 'active', NULL, 'Father ', '9337387384', '9337387382', '/uploads/staff/documents/88/reference_aadhar_invoice__1__1773400612539.pdf', 0, '111111111111', NULL, 'eunps6151m', 0, 47, 47, '2026-03-13 11:16:53', '2026-06-15 05:57:28'),
(77, 1, 1, 89, 34.0000, 8.0000, '{\"title\":\"\",\"line1\":\"345345434\",\"line2\":\"53453\",\"pinCode\":\"35345\",\"country\":{\"label\":\"Afghanistan\",\"value\":\"AF\"},\"state\":{\"label\":\"Badakhshan\",\"value\":\"BDS\"},\"city\":{\"label\":\"Ashkāsham\",\"value\":\"Ashkāsham\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"345345434\",\"line2\":\"53453\",\"pinCode\":\"35345\",\"country\":{\"label\":\"Afghanistan\",\"value\":\"AF\"},\"state\":{\"label\":\"Badakhshan\",\"value\":\"BDS\"},\"city\":{\"label\":\"Ashkāsham\",\"value\":\"Ashkāsham\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2026-03-01', 'married', 'nurse', 1, 1, 'male', NULL, '/uploads/staff/documents/89/aadhar_card_invoice__1__1773400711418.pdf', '/uploads/staff/documents/89/photo_invoice__1__1773400711421.pdf', '/uploads/staff/documents/89/pan_card_invoice__1__1773400711420.pdf', NULL, 1, 'active', NULL, 'Father ', NULL, NULL, '/uploads/staff/documents/89/reference_aadhar_invoice__1__1773400711423.pdf', 0, '111111111111', NULL, 'eunps6151m', 1, 1, 1, '2026-03-13 11:18:31', '2026-03-13 11:18:32'),
(78, 1, 1, 90, 66.6600, 24.0000, '{\"title\":\"\",\"line1\":\"s/o abdhfsdeuwer wehkfioiwe wewerh hwe \",\"line2\":\"\",\"pinCode\":\"340001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"s/o abdhfsdeuwer wehkfioiwe wewerh hwe \",\"line2\":\"\",\"pinCode\":\"340001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1999-03-25', 'unmarried', 'nurse', 0, 0, 'male', NULL, '/uploads/staff/documents/90/aadhar_card_screenshot_2026_02_09_143124_1773401060183.png', '/uploads/staff/documents/90/photo_screenshot_2026_02_12_151310_1773401060183.png', '/uploads/staff/documents/90/pan_card_screenshot_2026_02_09_143124_1773401060183.png', NULL, 0, 'active', NULL, 'SISTER', '3242342342', NULL, NULL, 0, '111111111111', NULL, 'eunps6151m', 1, 1, 1, '2026-03-13 11:24:20', '2026-03-13 11:24:20'),
(79, 1, 1, 91, 66.6600, 24.0000, '{\"title\":\"\",\"line1\":\"s/o LASA RAM JI, RAMPURA COLONY, GODIJI\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalore\",\"value\":\"Jalore\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"s/o LASA RAM JI, RAMPURA COLONY, GODIJI\",\"line2\":\"\",\"pinCode\":\"343001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalore\",\"value\":\"Jalore\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1999-03-25', 'unmarried', 'nurse', 0, 0, NULL, NULL, '/uploads/staff/documents/91/aadhar_card_aadhar_card_1773401661472.pdf', '/uploads/staff/documents/91/photo_dilip_jalore_photo_1782312467273.jpeg', '/uploads/staff/documents/91/pan_card_pan_card_1773401661472.pdf', NULL, 0, 'inactive', NULL, 'SISTER  ANITA', '9256454646', NULL, NULL, 0, '994104221478', NULL, 'JYIPK5584K', 0, 1, 1, '2026-03-13 11:34:21', '2026-06-24 14:50:03'),
(80, 1, 1, 92, 30.5500, 24.0000, '{\"title\":\"\",\"line1\":\"S/O PUNJI RAM, NAI BASTI, RAMGARH\",\"line2\":\"\",\"pinCode\":\"314034\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Dungarpur\",\"value\":\"Dungarpur\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"S/O PUNJI RAM, NAI BASTI, RAMGARH\",\"line2\":\"\",\"pinCode\":\"314034\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Dungarpur\",\"value\":\"Dungarpur\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2000-01-01', 'unmarried', 'attendant', 0, 0, 'male', NULL, '/uploads/staff/documents/92/aadhar_card_kishan_aadhar_card_1773416971865.pdf', '/uploads/staff/documents/92/photo_kishan_photo_1773416971866.jpg', NULL, NULL, 0, 'inactive', NULL, 'Sister Chanda', '8890228700', NULL, NULL, 0, '514589158790', NULL, NULL, 0, 1, 1, '2026-03-13 15:49:32', '2026-05-19 17:07:53'),
(81, 1, 1, 93, NULL, NULL, '{\"title\":\"\",\"line1\":\"Opp. Rosewood Estate, 9, Prerna Tirth Road, Satellite, Jodhpur Ahmedabad,\",\"line2\":\"\",\"pinCode\":\"380015\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 71, NULL, NULL, NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-03-13 16:48:11', '2026-07-04 15:37:15'),
(82, 1, 1, 94, NULL, NULL, '{\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"34001\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"}}', NULL, 37, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-03-13 19:07:46', '2026-03-13 19:07:46'),
(83, 1, 1, 95, 66.6600, 24.0000, '{\"title\":\"\",\"line1\":\"S/o Deva Ram, Charan Was,Jakhri,Raniwara\",\"line2\":\"\",\"pinCode\":\"343040\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"S/o Deva Ram, Charan Was,Jakhri,Raniwara\",\"line2\":\"\",\"pinCode\":\"343040\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1996-01-20', 'unmarried', 'nurse', 0, 0, 'male', NULL, '/uploads/staff/documents/95/aadhar_card_aadhar_1773740443451.pdf', '/uploads/staff/documents/95/photo_bro_jayanti_lal_raniwada_photo_1773740443454.jpeg', NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '779280769563', NULL, NULL, 0, 1, 1, '2026-03-17 09:40:44', '2026-03-17 09:40:44'),
(84, 1, 1, 96, NULL, NULL, '{\"line1\":\"4, Shetranjaya Society, Nr. Shantivan Bus Stop, Narayan Nagar Road, Paldi\",\"line2\":\"\",\"pinCode\":\"380007\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, 80, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '7600207067', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-03-21 13:49:54', '2026-03-21 13:49:55'),
(85, 1, 1, 97, 75.0000, 12.0000, '{\"title\":\"\",\"line1\":\"Tulsinagr Society Juna , Wadaj, \",\"line2\":\"\",\"pinCode\":\"380013\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Tulsinagr Society Juna , Wadaj, \",\"line2\":\"\",\"pinCode\":\"380013\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1995-05-09', 'unmarried', 'nurse', 0, 0, NULL, NULL, '/uploads/staff/documents/97/aadhar_card_photo_1774110339825.jpeg', '/uploads/staff/documents/97/photo_mittal_lohiya_photo_1782312290192.jpeg', '/uploads/staff/documents/97/pan_card_pan_1774110339831.jpeg', NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '412134532251', NULL, 'BCPPL9323M', 0, 1, 1, '2026-03-21 16:25:40', '2026-06-24 14:44:50'),
(86, 1, 1, 98, NULL, NULL, '{\"line1\":\"4, Shetranjaya Society, Nr. Shantivan Bus Stop, Narayan Nagar Road, Paldi\",\"line2\":\"\",\"pinCode\":\"380007\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, 80, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-03-21 16:32:38', '2026-03-21 16:32:38'),
(87, 1, 1, 99, 75.0000, 12.0000, '{\"title\":\"\",\"line1\":\"D/O Laxmanbhai, 9999, Indira Nagar, Ranipur Gam, Shahwadi, Narol\",\"line2\":\"\",\"pinCode\":\"382405\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"D/O Laxmanbhai, 9999, Indira Nagar, Ranipur Gam, Shahwadi, Narol\",\"line2\":\"Narol Sarkhej Highway Road, Cozy Hotal Opp. Ranipur Gam Indiranagar\",\"pinCode\":\"382405\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '2000-10-30', 'unmarried', 'nurse', 0, 0, 'female', NULL, '/uploads/staff/documents/99/aadhar_card_aadhar_sejal_parmar_1774123994849.pdf', '/uploads/staff/documents/99/photo_sejal_paramar_photo_1774123994851.jpeg', NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '963945081664', NULL, NULL, 0, 1, 1, '2026-03-21 20:13:15', '2026-05-19 17:04:18'),
(88, 1, 1, 100, 33.3300, 24.0000, '{\"title\":\"\",\"line1\":\"D/O: Sukhdev Roat, Dholka, Sansarpur,PO: Sansarpu\",\"line2\":\"\",\"pinCode\":\"314404\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Dungarpur\",\"value\":\"Dungarpur\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"D/O: Sukhdev Roat, Dholka, Sansarpur,PO: Sansarpu\",\"line2\":\"\",\"pinCode\":\"314404\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Dungarpur\",\"value\":\"Dungarpur\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1993-01-20', NULL, 'attendant', 0, 0, 'female', NULL, '/uploads/staff/documents/100/aadhar_card_aadhar_card_at__vimala_kumari_roat_1774298633384.pdf', '/uploads/staff/documents/100/photo_photo_at__vimala_kumari_1774298633388.jpeg', NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '544880260183', NULL, NULL, 0, 1, 1, '2026-03-23 20:43:53', '2026-05-20 08:52:59'),
(89, 1, 1, 101, NULL, NULL, '{\"title\":\"\",\"line1\":\"4, Shetranjaya Society, Nr. Shantivan Bus Stop, Narayan Nagar Road, Paldi\",\"line2\":\"\",\"pinCode\":\"380007\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 80, NULL, NULL, NULL, 0, 0, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-03-23 21:10:34', '2026-03-23 21:12:43'),
(90, 1, 1, 102, NULL, NULL, '{\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null}', NULL, 50, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-05-19 07:40:07', '2026-05-19 07:40:07'),
(91, 1, 1, 103, NULL, NULL, '{\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-05-19 07:40:31', '2026-05-19 07:40:32'),
(92, 1, 1, 104, 200.0000, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, 1, '2026-05-19 07:52:50', '2026-05-19 17:03:35'),
(93, 3, 3, 105, NULL, NULL, '{\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 47, 47, '2026-05-19 11:26:30', '2026-05-19 11:26:30'),
(94, 1, 1, 106, 75.0000, 24.0000, '{\"title\":\"\",\"line1\":\"Jayantibhai Solanki, Near Water Tenk, Bhadraniya, Bhadran\",\"line2\":\"\",\"pinCode\":\"388530\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Anand\",\"value\":\"Anand\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"Jayantibhai Solanki, Near Water Tenk, Bhadraniya, Bhadran\",\"line2\":\"\",\"pinCode\":\"388530\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Anand\",\"value\":\"Anand\"},\"default_shipping\":false,\"default_billing\":false}', NULL, '1996-01-08', 'married', 'nurse', 0, 0, 'female', NULL, '/uploads/staff/documents/106/aadhar_card_dimpal_sister_bsc_aadhaar_card__1781365024722.pdf', '/uploads/staff/documents/106/photo_whatsapp_image_2026_06_10_at_2_38_05_pm_1781365024725.jpeg', NULL, NULL, 0, 'inactive', NULL, NULL, NULL, NULL, NULL, 0, '665365175775', NULL, NULL, 0, 1, 1, '2026-06-13 15:37:05', '2026-07-04 16:22:03'),
(95, 3, 3, 107, NULL, 8.0000, '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":\"\",\"city\":null,\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":\"\",\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '2026-06-01', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 47, 47, '2026-06-15 06:54:14', '2026-06-15 06:54:14'),
(96, 1, 1, 108, NULL, NULL, '{\"line1\":\"Raithal, Jalore\",\"line2\":\"\",\"pinCode\":\"343042\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"}}', NULL, 52, NULL, NULL, NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 1, '2026-06-17 16:36:42', '2026-06-17 16:36:43'),
(97, 1, 1, 109, 24.0000, 63.8800, '{\"title\":\"\",\"line1\":\"Bijali Ghar ke Pass Pahadganj Second Lal Sagar Mandore Jodhpur\",\"line2\":\"\",\"pinCode\":\"342026\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jodhpur\",\"value\":\"Jodhpur\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1993-09-29', 'married', 'nurse', 0, 0, 'male', NULL, '/uploads/staff/documents/109/aadhar_card_aadhar_card_jitendra_singh_jodhpur_1781764331594.pdf', '/uploads/staff/documents/109/photo_photo_jitendra_singh_1782311676319.jpeg', '/uploads/staff/documents/109/pan_card_pan_card_jitendra_singh_1781764331607.jpeg', '/uploads/staff/documents/109/driving_license_driving_licence_jitendra_singh_jodhpur_1781764331794.pdf', 0, 'inactive', NULL, 'Sawai Singh Pokran- Friend', '7568247713', NULL, '/uploads/staff/documents/109/reference_aadhar_sawai_singh_pokran_1781764331796.jpeg', 1, '397985917889', '20150002180', 'HWDPS0664E', 0, 1, 1, '2026-06-18 06:32:12', '2026-09-01 16:09:54'),
(98, 1, 1, 110, 83.3300, 12.0000, '{\"title\":\"\",\"line1\":\"Shree Sarkareswari, Kuttum Vathukal, Chirayinkeezh, Sarkara-Chirayinkeezhu,\",\"line2\":\"PO:- Chirayinkeezhu,\",\"pinCode\":\"695304\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Kerala\",\"value\":\"KL\"},\"city\":{\"label\":\"Thiruvananthapuram\",\"value\":\"Thiruvananthapuram\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Kerala\",\"value\":\"KL\"},\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1974-10-23', 'married', 'nurse', 0, 0, 'female', NULL, '/uploads/staff/documents/110/aadhar_card_prbha_sister_aadhar_card_1781773588483.pdf', '/uploads/staff/documents/110/photo_prbha_sister_kerla_1781773588486.jpeg', '/uploads/staff/documents/110/pan_card_prbha_sister_pan_1781773588485.pdf', NULL, 0, 'inactive', NULL, 'Dr. KM Ramchandra', '9825010001', NULL, NULL, 0, '409480577619', NULL, 'APLPN7147P', 0, 1, 1, '2026-06-18 09:06:29', '2026-09-01 16:10:10'),
(99, 1, 1, 111, NULL, NULL, '{\"title\":\"\",\"line1\":\"Aakhriya Purohitan, Raythal, Jalore\",\"line2\":\"\",\"pinCode\":\"343042\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Jalor\",\"value\":\"Jalor\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 52, NULL, NULL, NULL, 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pankaj Bhai', '7048284878', NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-06-24 15:50:21', '2026-06-25 14:40:25'),
(100, 1, 1, 112, NULL, NULL, '{\"line1\":\"House No. 2  Lal kaka Hall , Behind Ganesh Society Shahpur Ahmedabad City 380004\",\"line2\":\"\",\"pinCode\":\"380004\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"}}', NULL, 65, NULL, NULL, NULL, NULL, NULL, 'male', NULL, '/uploads/customer/documents/112/aadhar_card_whatsapp_image_2026_06_27_at_12_51_55_pm_1782545097338.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, 'Jitu Bhai Prjapati', '7383333212', NULL, '/uploads/customer/documents/112/reference_aadhar_whatsapp_image_2026_06_27_at_12_51_55_pm_1782545097341.jpeg', NULL, '480950775867', NULL, NULL, 0, 1, 1, '2026-06-27 07:24:57', '2026-06-27 07:24:58'),
(101, 1, 1, 113, NULL, NULL, '{\"line1\":\"Sector 19, Gandhinagar\",\"line2\":\"\",\"pinCode\":\"382021\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Gandhinagar\",\"value\":\"Gandhinagar\"}}', NULL, 63, NULL, NULL, NULL, NULL, NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Deven sir PDEU Gandhinagar', '9825400381', NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-07-04 15:49:53', '2026-07-04 15:49:53'),
(102, 1, 1, 114, 69.4100, 24.0000, '{\"title\":\"\",\"line1\":\"s/o Nilesh Upadhyay, Nai Aabadi, Village Biloda\",\"line2\":\"\",\"pinCode\":\"327032\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Rajasthan\",\"value\":\"RJ\"},\"city\":{\"label\":\"Baswa\",\"value\":\"Baswa\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '2000-01-21', 'married', 'nurse', 0, 0, 'male', NULL, '/uploads/staff/documents/114/aadhar_card_himanshu_upadhyay_aadhar_card_1788277226547.pdf', '/uploads/staff/documents/114/photo_whatsapp_image_2026_09_01_at_9_05_20_pm_1788277226550.jpeg', NULL, NULL, 0, 'active', NULL, 'Gajendra patidar ', '6376882974', NULL, NULL, 0, '847767772838', NULL, NULL, 0, 1, 1, '2026-09-01 15:40:27', '2026-09-01 16:17:58'),
(103, 1, 1, 115, NULL, NULL, '{\"title\":\"\",\"line1\":\"A/104 DEVRAJ RECIDENCY, NEAR SHRREJI BUN, NAVA NARODA\",\"line2\":\"\",\"pinCode\":\"382330\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', NULL, 63, NULL, NULL, NULL, 0, 0, 'male', NULL, '/uploads/customer/documents/115/aadhar_card_rushik_adhar_card__4__1788546371107.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '868259071807', NULL, NULL, 0, 1, 1, '2026-09-04 18:26:11', '2026-09-04 19:47:07');
INSERT INTO `user_details` (`id`, `account_id`, `branch_id`, `user_id`, `hour_price`, `working_hours`, `permanent_address`, `temporary_address`, `age`, `date_of_birth`, `marital_status`, `designation`, `police_verification`, `medical_verification`, `gender`, `document`, `aadhar_card_url`, `photo_url`, `pan_card_url`, `driving_license_url`, `has_vehicle`, `status`, `block_reason`, `reference_relationship`, `reference_mobile_1`, `reference_mobile_2`, `reference_aadhar_url`, `has_driving_license`, `aadhar_number`, `driving_license_number`, `pan_number`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(104, 1, 1, 116, 33.3300, 24.0000, '{\"title\":\"\",\"line1\":\"G-101, Ashirwad Dreams, Near Madhav Homes, Vastral\",\"line2\":\"\",\"pinCode\":\"382418\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Gujarat\",\"value\":\"GJ\"},\"city\":{\"label\":\"Ahmedabad\",\"value\":\"Ahmedabad\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1976-01-22', 'married', 'attendant', 0, 0, 'male', NULL, '/uploads/staff/documents/116/aadhar_card_at_jyotindrakumar_1788547705444.pdf', '/uploads/staff/documents/116/photo_whatsapp_image_2026_09_03_at_9_29_49_pm_1788547705445.jpeg', '/uploads/staff/documents/116/pan_card_at_jyotindrakumar_pan_1788547705444.pdf', NULL, 0, 'active', NULL, 'Vipul Pandiya Home Care', '7600240098', NULL, NULL, 0, '886401637435', NULL, 'AHDPT8534C', 0, 1, 1, '2026-09-04 18:48:25', '2026-09-04 19:13:08'),
(105, 1, 1, 117, NULL, 24.0000, '{\"title\":\"\",\"line1\":\"Chadharpur\",\"line2\":\"\",\"pinCode\":\"244102\",\"country\":{\"label\":\"India\",\"value\":\"IN\"},\"state\":{\"label\":\"Uttar Pradesh\",\"value\":\"UP\"},\"city\":{\"label\":\"Amroha\",\"value\":\"Amroha\"},\"default_shipping\":false,\"default_billing\":false}', '{\"title\":\"\",\"line1\":\"\",\"line2\":\"\",\"pinCode\":\"\",\"country\":null,\"state\":null,\"city\":null,\"default_shipping\":false,\"default_billing\":false}', NULL, '1998-10-02', 'unmarried', 'nurse', 0, 0, 'male', NULL, NULL, NULL, NULL, NULL, 0, 'active', NULL, NULL, NULL, NULL, NULL, 0, '491646490860', NULL, 'CKQPA9838Q', 0, 1, 1, '2026-09-04 19:11:12', '2026-09-04 19:11:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `account_settings`
--
ALTER TABLE `account_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_invoice_per_account_branch` (`account_id`,`branch_id`,`invoice_number`);

--
-- Indexes for table `invoice_carry_forward`
--
ALTER TABLE `invoice_carry_forward`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lead_generate`
--
ALTER TABLE `lead_generate`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lead_items`
--
ALTER TABLE `lead_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_password_reset_user` (`user_id`);

--
-- Indexes for table `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku_code` (`sku_code`);

--
-- Indexes for table `product_tracking`
--
ALTER TABLE `product_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_status` (`product_id`,`status`,`is_deleted`),
  ADD KEY `idx_customer` (`customer_id`,`is_deleted`),
  ADD KEY `idx_lead` (`lead_id`,`is_deleted`),
  ADD KEY `idx_active_rentals` (`product_id`,`status`,`is_deleted`),
  ADD KEY `idx_account_branch` (`account_id`,`branch_id`,`is_deleted`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_activity`
--
ALTER TABLE `staff_activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_experience`
--
ALTER TABLE `staff_experience`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_experience_category`
--
ALTER TABLE `staff_experience_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_invoice`
--
ALTER TABLE `staff_invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_invoice_draft_meta`
--
ALTER TABLE `staff_invoice_draft_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_staff_invoice_meta` (`staff_invoice_id`);

--
-- Indexes for table `staff_invoice_items`
--
ALTER TABLE `staff_invoice_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_qualifications`
--
ALTER TABLE `staff_qualifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff_quick_pay`
--
ALTER TABLE `staff_quick_pay`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_holds`
--
ALTER TABLE `task_holds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_account_mappings`
--
ALTER TABLE `user_account_mappings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_branch` (`user_id`,`account_id`,`branch_id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `account_settings`
--
ALTER TABLE `account_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `invoice_carry_forward`
--
ALTER TABLE `invoice_carry_forward`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `lead_generate`
--
ALTER TABLE `lead_generate`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `lead_items`
--
ALTER TABLE `lead_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `product_tracking`
--
ALTER TABLE `product_tracking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `staff_activity`
--
ALTER TABLE `staff_activity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=457;

--
-- AUTO_INCREMENT for table `staff_experience`
--
ALTER TABLE `staff_experience`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_experience_category`
--
ALTER TABLE `staff_experience_category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `staff_invoice`
--
ALTER TABLE `staff_invoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `staff_invoice_draft_meta`
--
ALTER TABLE `staff_invoice_draft_meta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_invoice_items`
--
ALTER TABLE `staff_invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `staff_qualifications`
--
ALTER TABLE `staff_qualifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `staff_quick_pay`
--
ALTER TABLE `staff_quick_pay`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `task_holds`
--
ALTER TABLE `task_holds`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `user_account_mappings`
--
ALTER TABLE `user_account_mappings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
