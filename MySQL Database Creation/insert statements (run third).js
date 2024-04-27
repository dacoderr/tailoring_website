var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "csit128testing"
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  
    var sql = "INSERT INTO services (service_id, service, price) VALUES " +
      "(1, 'Patching up torn garments', 10.00), " +
      "(2, 'Fixing broken zippers', 5.00), " +
      "(3, 'Replacing buttons', 3.00), " +
      "(4, 'Mending ripped seams', 3.00), " +
      "(5, 'Restoring damaged hems', 9.00), " +
      "(6, 'Hemming pants and skirts', 7.00), " +
      "(7, 'Adjusting waistbands', 8.00), " +
      "(8, 'Adjusting sleeves', 6.00), " +
      "(9, 'Resizing garments', 15.00), " +
      "(10, 'Adjusting dresses or shirts', 12.00), " +
      "(11, 'Custom suits', 250.00), " +
      "(12, 'Custom dresses and gowns', 200.00), " +
      "(13, 'Custom trousers and skirts', 100.00), " +
      "(14, 'Custom formalwear', 100.00), " +
      "(15, 'Custom traditional clothing', 300.00), " +
      "(16, 'Logo embroidery', 50.00), " +
      "(17, 'Patchwork embroidery', 25.00), " +
      "(18, 'Embellishment embroidery', 15.00)";
  
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " records inserted into services table");
    });
  });
  





