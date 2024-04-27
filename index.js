const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const session = require('express-session');

// Create connection to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'csit128'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});

app.use(
    session({
        secret: 'aVeryS3cr3tK3y123123',
        resave: false,
        saveUninitialized: true
    })
);

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for handling form data
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        next(); // User is logged in, proceed to the next middleware or route handler
    } else {
        res.redirect('/'); // User is not logged in, redirect to the registration page
    }
};

// Routes
app.get('/', (req, res) => {
    res.render('register', { loggedIn: req.session.loggedIn });
});

app.get('/login', (req, res) => {
    res.render('login');
});



app.get('/home', checkLoggedIn, (req, res) => {
    const { name } = req.session;
    res.render('project', { name });
});
// Helper function to get service label

app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy the session on logout
    res.redirect('/');
});

app.get('/contact', checkLoggedIn, (req, res) => {
    const { name } = req.session;
    res.render('contact', { name });
});

app.get('/profile', checkLoggedIn, (req, res) => {
    const name = req.session.name; // Retrieve the user's name from the session

    const sql = `
    SELECT services.service, orders.quantity, services.price
    FROM orders
    INNER JOIN services ON orders.service_id = services.service_id
    WHERE orders.account_name = ?
  `;
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Error retrieving services: ', err);
            res.send('Error retrieving services');
            return;
        }

        const services = results;
        let totalCost = 0;
        services.forEach((service) => {
            totalCost += service.quantity * service.price;
        });

        res.render('profile', { name, services, totalCost });
    });
});

app.get('/services', checkLoggedIn, (req, res) => {
    const sql = 'SELECT * FROM services';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving services: ', err);
            res.send('Error retrieving services');
            return;
        }

        const services = results;
        res.render('services', { services });
    });
});

app.get('/thankyou', checkLoggedIn, (req, res) => {
    const name = req.session.name; // Retrieve the user's name from the session

    // Delete all orders associated with the user's account_name
    const sql = 'DELETE FROM orders WHERE account_name = ?';
    connection.query(sql, [name], (err) => {
        if (err) {
            console.error('Error deleting orders: ', err);
            res.send('Error deleting orders');
            return;
        }

        // Render the thankyou page
        res.render('thankyou');
    });
});


app.get('/addToCart', checkLoggedIn, (req, res) => {
    const { serviceId, quantity } = req.query;
    const name = req.session.name; // Retrieve the user's name from the session

    const order = {
        account_name: name,
        service_id: serviceId,
        quantity: quantity
    };

    // Check if the order already exists for the given service and user
    const selectSql = 'SELECT * FROM orders WHERE account_name = ? AND service_id = ?';
    connection.query(selectSql, [name, serviceId], (selectErr, rows) => {
        if (selectErr) {
            console.error('Error selecting order: ', selectErr);
            res.send('Error selecting order');
            return;
        }

        if (rows.length === 0) {
            // If the order doesn't exist, insert a new row
            const insertSql = 'INSERT INTO orders SET ?';
            connection.query(insertSql, order, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting order: ', insertErr);
                    res.send('Error inserting order');
                    return;
                }
                res.redirect('/services');
            });
        } else {
            // If the order exists, update the quantity
            const existingOrder = rows[0];
            const newQuantity = existingOrder.quantity + parseInt(quantity);
            const updateSql = 'UPDATE orders SET quantity = ? WHERE account_name = ? AND service_id = ?';
            connection.query(updateSql, [newQuantity, name, serviceId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating order: ', updateErr);
                    res.send('Error updating order');
                    return;
                }
                res.redirect('/services');
            });
        }
    });
});


app.get('/checkout', checkLoggedIn, (req, res) => {
    const name = req.session.name; // Retrieve the user's name from the session

    // Retrieve the user's services with prices from the database
    const sql = `
        SELECT orders.service_id, orders.quantity, services.service, services.price
        FROM orders
        JOIN services ON orders.service_id = services.service_id
        WHERE orders.account_name = ?`;
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Error fetching services: ', err);
            res.send('Error fetching services');
            return;
        }

        const services = results;
        let totalCost = 0;

        // Calculate the total cost of selected services
        services.forEach((service) => {
            totalCost += service.quantity * service.price;
        });

        res.render('checkout', { name, services, totalCost });
    });
});


// Routes end

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM accounts WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error fetching user: ', err);
            const errorMessage = 'Error fetching user';
            // This code below sends a javascript alert with the error and then refreshes the page
            res.send(`<script>alert('${errorMessage}'); window.history.back();</script>`);
            return;
        }
        if (results.length > 0) {
            req.session.loggedIn = true;
            req.session.name = results[0].name;
            res.redirect('/home');
        } else {
            const errorMessage = 'Invalid credentials';
            // This code below also sends a javascript alert with the error and then refreshes the page
            res.send(`<script>alert('${errorMessage}'); window.history.back();</script>`);
        }
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, password], (err) => {
        if (err) {
            console.error('Error saving data: ', err);
            res.send('Error saving data');
            return;
        }
        res.redirect('/login');
    });
});

// Route to update the quantity of a service
app.post('/updateService', checkLoggedIn, (req, res) => {
    const { serviceId, quantity } = req.body;
    const name = req.session.name; // Retrieve the user's name from the session

    // Update the quantity in the database
    const sql = 'UPDATE orders SET quantity = ? WHERE account_name = ? AND service_id = ?';
    connection.query(sql, [quantity, name, serviceId], (err, results) => {
        if (err) {
            console.error('Error updating service: ', err);
            res.send('Error updating service');
            return;
        }
        res.redirect('/checkout');
    });
});

// Route to remove a service
app.post('/removeService', checkLoggedIn, (req, res) => {
    const { serviceId } = req.body;
    const name = req.session.name; // Retrieve the user's name from the session

    // Delete the service from the database
    const sql = 'DELETE FROM orders WHERE account_name = ? AND service_id = ?';
    connection.query(sql, [name, serviceId], (err, results) => {
        if (err) {
            console.error('Error removing service: ', err);
            res.send('Error removing service');
            return;
        }
        res.redirect('/checkout');
    });
});



// POST route for updating account information
app.post('/update-account', checkLoggedIn, (req, res) => {
    const { password, email, username } = req.body;
    const name = req.session.name; // Retrieve the user's name from the session

    if (password) {
        // Update password
        const sql = 'UPDATE accounts SET password = ? WHERE name = ?';
        connection.query(sql, [password, name], (err) => {
            if (err) {
                console.error('Error updating password: ', err);
                res.send('Error updating password');
                return;
            }
            console.log('Password updated successfully');
        });
    }

    if (email) {
        // Update email
        const sql = 'UPDATE accounts SET email = ? WHERE name = ?';
        connection.query(sql, [email, name], (err) => {
            if (err) {
                console.error('Error updating email: ', err);
                res.send('Error updating email');
                return;
            }
            console.log('Email updated successfully');
        });
    }

    if (username) {
        // Update username
        const sql = 'UPDATE accounts SET name = ? WHERE name = ?';
        connection.query(sql, [username, name], (err) => {
            if (err) {
                console.error('Error updating username: ', err);
                res.send('Error updating username');
                return;
            }
            console.log('Username updated successfully');
        });
    }

    res.redirect('/profile');
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});