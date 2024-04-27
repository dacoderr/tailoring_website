var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csit128"
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }

  console.log('Connected to MySQL server');

  // Create the 'accounts' table
  const createAccountsTable = `
    CREATE TABLE accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createAccountsTable, (error, results) => {
    if (error) {
      console.error('Error creating accounts table:', error);
    } else {
      console.log('Created accounts table');
    }
  });

  // Create the 'services' table
  const createServicesTable = `
    CREATE TABLE services (
      service_id INT AUTO_INCREMENT PRIMARY KEY,
      service VARCHAR(255),
      price DECIMAL(10, 2)
    )
  `;

  connection.query(createServicesTable, (error, results) => {
    if (error) {
      console.error('Error creating services table:', error);
    } else {
      console.log('Created services table');
    }
  });

  // Create the 'orders' table
  const createOrdersTable = `
    CREATE TABLE orders (
      account_name VARCHAR(255),
      service_id INT,
      quantity INT,
      FOREIGN KEY (service_id) REFERENCES services(service_id)
    )
  `;

  connection.query(createOrdersTable, (error, results) => {
    if (error) {
      console.error('Error creating orders table:', error);
    } else {
      console.log('Created orders table');
    }

    // Close the MySQL connection
    connection.end((error) => {
      if (error) {
        console.error('Error closing MySQL connection:', error);
      } else {
        console.log('Closed MySQL connection');
      }
    });
  });
});