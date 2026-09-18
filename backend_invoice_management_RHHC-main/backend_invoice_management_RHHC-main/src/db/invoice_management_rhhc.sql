-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2026 at 01:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rhhc`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'RHHC', 1, 1, '2025-09-08 11:51:12', '2025-10-31 18:10:03'),
(2, 'Avita Health', 2, 2, '2025-10-31 18:09:41', '2025-10-31 18:09:41');

-- --------------------------------------------------------

--
-- Table structure for table `account_settings`
--

CREATE TABLE `account_settings` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(250) DEFAULT NULL,
  `address_lines` longtext NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `bank_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bank_details`)),
  `qr_scanner` varchar(100) DEFAULT NULL,
  `stamp` varchar(100) DEFAULT NULL,
  `stamp_signature` varchar(250) DEFAULT NULL,
  `use_stamp_image` int(11) DEFAULT 0 COMMENT 'which stamp image to use in invoice pdf, 0 =  only stamp, 1 =  stamp_signature image',
  `extra_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_ids`)),
  `service_type` varchar(100) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_settings`
--

INSERT INTO `account_settings` (`id`, `account_id`, `branch_id`, `name`, `logo`, `address_lines`, `mobile`, `email`, `website`, `bank_details`, `qr_scanner`, `stamp`, `stamp_signature`, `use_stamp_image`, `extra_ids`, `service_type`, `is_deleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'REWELLNESS HOME HEALTH CARE', '/uploads/accountSettings/1-1/logo_logo_no_bg_1770033534164.png', '4/204, KABIR APARTMENT, NR. PUNCHAMRUT BUNGALOW 2, CIMS HOSPITAL ROAD, THALTEJ, AHMEDABAD 380060', '7404084849', 'info@rewellness.co.in', NULL, '{\"bank_name\":\"CSB BANK LTD\",\"account_holder_name\":\"REWELLNESS HOME HEALTH CARE\",\"account_number\":\"083505004053195001\",\"ifsc\":\"CSBK0000835\"}', '/uploads/accountSettings/1-1/qr_scanner_screenshot_2026_02_03_111911_1770097784966.png', '/uploads/accountSettings/1-1/stamp_adobe_express___file_1770279985783.png', '/uploads/accountSettings/1-1/stamp_signature_2_sign_1770286834829.png', 1, '{\"PAN\":\"PANNUMBER\"}', 'NURSING', 0, 1, 1, '2025-08-29 13:29:15', '2026-02-05 10:20:34'),
(2, 2, 2, 'Avita Health', '/uploads/accountSettings/2-2/logo_avita_health_1761917424491.png', 'Ahmedabad', '8824247365', 'avitahealth@gmail.com', NULL, '{\"bank_name\":\"\",\"account_holder_name\":\"\",\"account_number\":\"\",\"ifsc\":\"\"}', NULL, NULL, NULL, 0, '{}', 'Nursing', 0, 0, 32, '2025-10-31 13:14:31', '2025-10-31 13:30:24');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `account_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `settings`, `account_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'RHHC', NULL, 1, 1, 1, '2025-09-08 11:51:48', '2025-10-31 18:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `last_invoice_due` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `due_amount` decimal(10,2) DEFAULT NULL,
  `other_charges` decimal(10,2) DEFAULT NULL,
  `transportation_charge` decimal(10,2) DEFAULT NULL,
  `settlement_amount` decimal(10,2) DEFAULT NULL,
  `lead_id` int(11) NOT NULL,
  `is_deposit_counted` tinyint(1) DEFAULT 0,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  `sub_total` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('unpaid','partial','paid','carry-forward') DEFAULT 'unpaid',
  `invoice_status` enum('draft','published') DEFAULT 'draft',
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_carry_forward`
--

CREATE TABLE `invoice_carry_forward` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `from_invoice_id` int(11) NOT NULL,
  `to_invoice_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','applied','cancelled') DEFAULT 'pending',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `item_type` enum('product','service','payslip') DEFAULT NULL,
  `deal_type` enum('rent','sell') DEFAULT NULL,
  `item_id` varchar(100) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lead_generate`
--

CREATE TABLE `lead_generate` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `lead_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT 0.00,
  `status` enum('draft','finalised','invalid','onhold') DEFAULT 'draft',
  `lead_status` enum('created','inProgress','productReturnPending','completed') DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `lead_items`
--

CREATE TABLE `lead_items` (
  `id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `item_type` enum('product','service','payslip') DEFAULT NULL,
  `deal_type` enum('rent','sell') DEFAULT NULL,
  `item_id` varchar(100) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_history`
--

CREATE TABLE `payment_history` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('cash','card','bank_transfer','other','carry-forward','cheque','upi') DEFAULT 'cash',
  `other_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`other_details`)),
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku_code` varchar(100) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `day_rent_price` decimal(10,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `total_stock` int(11) DEFAULT 0,
  `available_stock` int(11) DEFAULT 0,
  `rented_stock` int(11) DEFAULT 0,
  `sold_stock` int(11) DEFAULT 0,
  `images` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_tracking`
--

CREATE TABLE `product_tracking` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL COMMENT 'Primary relationship - product lifecycle tied to lead',
  `product_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `deal_type` enum('rent','sell') DEFAULT 'rent',
  `status` tinyint(4) DEFAULT 0 COMMENT '0 = on rent, 1 = returned from rent,  3 = sold',
  `quantity` int(11) DEFAULT 1,
  `rent_start_date` date DEFAULT NULL,
  `rent_end_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `sold_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `menu_map` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`menu_map`)),
  `account_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `is_default` int(11) DEFAULT 0,
  `isDeleted` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `day_price` decimal(10,2) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_activity`
--

CREATE TABLE `staff_activity` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `from_date_time` datetime NOT NULL,
  `to_date_time` datetime NOT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `total_hour` decimal(10,2) DEFAULT NULL COMMENT 'staff worked',
  `staff_working_hours` int(11) DEFAULT NULL COMMENT 'assigned hours to staff for work',
  `status` enum('todo','inProgress','done','onHold') DEFAULT 'todo',
  `payment_status` enum('0','1') DEFAULT '0' COMMENT '0 = unpaid, 1 = paid',
  `service_id` int(11) NOT NULL,
  `service_price` decimal(10,2) NOT NULL,
  `staff_invoice_id` int(11) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `note_by_staff` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_experience`
--

CREATE TABLE `staff_experience` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `from_month_year` varchar(10) DEFAULT NULL,
  `to_month_year` varchar(10) DEFAULT NULL,
  `total_experience_month` int(11) DEFAULT NULL,
  `org_name` varchar(255) DEFAULT NULL,
  `referral_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`referral_details`)),
  `documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents`)),
  `worked_in` enum('icu','non-icu') DEFAULT NULL,
  `is_currently_working` tinyint(1) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_experience_category`
--

CREATE TABLE `staff_experience_category` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice`
--

CREATE TABLE `staff_invoice` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `total_hours` decimal(10,2) DEFAULT NULL,
  `hour_price` decimal(10,2) DEFAULT NULL,
  `deduct_price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `invoice_status` enum('draft','finalised') DEFAULT 'draft',
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice_draft_meta`
--

CREATE TABLE `staff_invoice_draft_meta` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `staff_invoice_id` int(11) NOT NULL,
  `activity_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`activity_ids`)),
  `quickpay_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`quickpay_ids`)),
  `hour_rate` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `quickpay_total_amount` decimal(10,2) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_invoice_items`
--

CREATE TABLE `staff_invoice_items` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `staff_invoice_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `hour_price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `staff_activity_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_qualifications`
--

CREATE TABLE `staff_qualifications` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `qualification_type` varchar(100) NOT NULL,
  `qualification_name` varchar(255) NOT NULL,
  `registration_no` varchar(100) DEFAULT NULL,
  `year_of_passout` year(4) NOT NULL,
  `is_deleted` tinyint(4) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_quick_pay`
--

CREATE TABLE `staff_quick_pay` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mpin` char(4) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `isDeleted` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `username`, `password`, `mpin`, `role_id`, `isDeleted`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Yash Sanandiya', '9662028643', 'harshwadhwani.scorow@gmail.com', 'Harsh', '$2b$10$gQCKetAGE83N4EecvVUxAu8jSiuVGVH6k.IwTkCExlzgaW/DuIFzS', '1191', 1, 0, 0, 1, '2025-06-28 10:47:04', '2025-11-19 17:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `user_account_mappings`
--

CREATE TABLE `user_account_mappings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account_mappings`
--

INSERT INTO `user_account_mappings` (`id`, `user_id`, `account_id`, `branch_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 1, '2025-09-08 11:52:06', '2025-09-08 11:52:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hour_price` decimal(10,2) DEFAULT NULL,
  `working_hours` int(11) DEFAULT NULL,
  `permanent_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permanent_address`)),
  `temporary_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`temporary_address`)),
  `age` int(3) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `marital_status` enum('married','unmarried') DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `police_verification` tinyint(4) DEFAULT 0,
  `medical_verification` tinyint(4) DEFAULT 0,
  `gender` varchar(100) DEFAULT NULL,
  `document` text DEFAULT NULL,
  `aadhar_card_url` varchar(255) DEFAULT NULL,
  `photo_url` longtext DEFAULT NULL,
  `pan_card_url` varchar(255) DEFAULT NULL,
  `driving_license_url` varchar(255) DEFAULT NULL,
  `has_vehicle` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'active',
  `block_reason` text DEFAULT NULL,
  `reference_relationship` varchar(255) DEFAULT NULL,
  `reference_mobile_1` varchar(20) DEFAULT NULL,
  `reference_mobile_2` varchar(20) DEFAULT NULL,
  `reference_aadhar_url` varchar(255) DEFAULT NULL,
  `has_driving_license` tinyint(1) DEFAULT 0,
  `aadhar_number` varchar(12) DEFAULT NULL,
  `driving_license_number` varchar(20) DEFAULT NULL,
  `pan_number` varchar(10) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `account_settings`
--
ALTER TABLE `account_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `invoice_carry_forward`
--
ALTER TABLE `invoice_carry_forward`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `lead_generate`
--
ALTER TABLE `lead_generate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `lead_items`
--
ALTER TABLE `lead_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_tracking`
--
ALTER TABLE `product_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `staff_activity`
--
ALTER TABLE `staff_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `staff_experience`
--
ALTER TABLE `staff_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff_experience_category`
--
ALTER TABLE `staff_experience_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff_invoice`
--
ALTER TABLE `staff_invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff_invoice_draft_meta`
--
ALTER TABLE `staff_invoice_draft_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff_invoice_items`
--
ALTER TABLE `staff_invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff_qualifications`
--
ALTER TABLE `staff_qualifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `staff_quick_pay`
--
ALTER TABLE `staff_quick_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `user_account_mappings`
--
ALTER TABLE `user_account_mappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

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
