ALTER TABLE lead_items
ADD COLUMN hours_per_day DECIMAL(10,2)
COMMENT 'Per day hours for service/product used in service'
AFTER unit_price;


ALTER TABLE invoice_items
ADD COLUMN hours_per_day DECIMAL(10,2)
COMMENT 'Per day hours for service/product used in service'
AFTER unit_price;

ALTER TABLE `products` CHANGE `day_rent_price` `hour_rent_price` DECIMAL(10,2) NULL DEFAULT NULL;

ALTER TABLE `services` CHANGE `day_price` `hour_price` DECIMAL(10,2) NOT NULL;