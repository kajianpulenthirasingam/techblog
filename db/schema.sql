DROP DATABASE IF EXISTS tech_blog_db;
CREATE DATABASE tech_blog_db;
USE tech_blog_db;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
ALTER USER 'root'@'localhost' IDENTIFIED BY '3239';