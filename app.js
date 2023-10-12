const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Create an SQLite database in memory
const db = new sqlite3.Database(':memory:');

// Serialize the database operations
db.serialize(function () {
    // Create a 'user' table with columns: username, password, title
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");

    // Insert record keeping into the 'user' table
    db.run("INSERT INTO user (username, password, title) VALUES ('privilegedUser', 'privilegedUser1', 'Administrator'), ('2privilegedUser', 'privilegedUser2', 'Administrator')");
});

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// POST route for handling log-in form submissions
app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

	console.log("username: " + username);
	console.log("password: " + password);
	console.log('query: ' + query);

	db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
		}
	});

});



// Start the server
const port = process.env.PORT || 3000; // Use the specified port or 3000 as a default
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
