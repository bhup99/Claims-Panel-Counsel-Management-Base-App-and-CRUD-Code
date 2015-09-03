//server.js
//set up ===============================
//

var express = require('express');
var app = express();
var morgan = require('morgan'); 					//log requests to the console(express4)
var bodyParser = require('body-parser'); 	//pull info from HTML POST
var methodOverride = require('method-override'); //simulate DELETE & PUT

// configuration ====================
//

app.use(express.static(__dirname)); 	//set the static files location
app.use(morgan('dev')); 		//log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); //parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 		//parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); //parse application/vnd.api+json as json
app.use(methodOverride());

mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Villa#25',
	database: 'Topcoder'
});

connection.connect();

/*app.get('*', function(req, res) {
	var getList = "Select * from DataList";
	connection.query(getList, function(err, rows, fields) {
		if(!err) {
			console.log("Returned values are", rows.length );
			return res.json(rows) ;
		}
		else {
			console.log("Error while performing the query", err);
			return {};
		}
	});
});*/

app.get('/api/list', function(req, res) {
	var getList = "Select * from DataList where id<15";
	connection.query(getList, function(err, rows, fields) {
		if(!err) {
			console.log("Succesfully Returned values " + rows) ;
			return res.json(rows) ;
		}
		else {
			console.log("Error while performing the query", err);
			return {};
		}
	});
});

app.get('/api/list/:row_id', function(req, res) {
	var getRow = "SELECT * FROM DataList where id=" + req.params.row_id;
	console.log("execute the query " + getRow) ;
	connection.query(getRow, function(err, row, fields) {
		if(!err) {
			console.log("GOT The row " + JSON.stringify(row));
			return res.json(row);
		} else {
			console.log("COuld not get the row " + err);
		}

	})
})

app.delete('/api/list/:list_id', function(req, res) {
	var removeRow = "UPDATE DataList set Status=\"Inactive\" where id="+req.params.list_id ;
	console.log("Going to execute query " + removeRow) ;
	connection.query(removeRow, function(err, rows, fields) {
		if(!err) {
			console.log("Successfully deleted row");
		} else {
			console.log("Error while deleting row: " + err) ;
		}
	})
});

app.post('/api/list', function(req, res) {
	var columns = "" ;
	var values = "" ;
	for(var k in req.body) {
		if(k=="DefenceType")	{
			console.log(req.body[k]);
			for(var t in req.body[k])	{
				columns = columns + req.body[k][t] + "," ;
				values = values + '"' + req.body[k][t] + '",';
			}
		}
		else 
			columns = columns + k + ",";

		if(req.body[k] == null)
			values = values + 'NULL,';
		else if(k!="DefenceType")
			values = values + '"' + req.body[k] + '",';
	};
	columns = columns.substring(0, columns.length-1) ;
	values = values.substring(0, values.length-1) ;
	var insertRow = "INSERT INTO DataList (" + columns +  ") VALUES (" + values + ")";
	console.log("Query is " + insertRow);
	connection.query(insertRow, function(err, rows, fields) {
		if(!err) {
			console.log("Successfully added row ") ;
		} else {
			console.log("Could not add row" + err);
			insertRow = "UPDATE DataList SET " ;
			for(var k in req.body) {

				if(req.body[k] == null && k!="DefenceType")
					insertRow = insertRow + k + '=NULL,';
				else if(k=="DefenceType")	{
					for(t in req.body[k])
						insertRow = insertRow + req.body[k][t] + '="' + req.body[k][t] + '",';
				}
				else 
					insertRow = insertRow + k + "=" + '"' + req.body[k] + '",';
			}
			insertRow = insertRow.substring(0, insertRow.length-1);
			insertRow = insertRow + " WHERE id=" + req.body.id ;

			console.log("Query is " + insertRow);
			connection.query(insertRow, function(err, rows, fields) {
				if(!err) {
					console.log("Successfully updated row ");
				}
				else {
					console.log("Could not even update the row " + err) ;
				}
			});
		};

	});
	console.log("Recieved Data: " + req.body.id);
});

app.listen(3000);
console.log("App listening on port 3000");

