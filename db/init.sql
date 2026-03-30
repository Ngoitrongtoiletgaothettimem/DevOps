CREATE DATABASE IF NOT EXISTS devops;

USE devops;

CREATE TABLE IF NOT EXISTS tasks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_done TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  mssv VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gpa DECIMAL(3,2) NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_students_mssv (mssv),
  UNIQUE KEY uq_students_email (email)
);

INSERT IGNORE INTO students (full_name, mssv, email, gpa, status) VALUES
('Nguyen Van A', '20240001', 'a@student.devops.local', 3.20, 'active'),
('Tran Thi B',   '20240002', 'b@student.devops.local', 3.80, 'active'),
('Le Van C',     '20240003', 'c@student.devops.local', 2.50, 'inactive');
