CREATE USER "sandeep"@"localhost" IDENTIFIED BY "sandeep123";
GRANT ALL PRIVILEGES ON *.* TO 'sandeep'@'localhost';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
SELECT * FROM userdb.user_entity;