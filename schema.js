
var express = require('express');
var morgan = require('morgan'); 					//log requests to the console(express4)
var bodyParser = require('body-parser'); 	//pull info from HTML POST
var methodOverride = require('method-override'); //simulate DELETE & PUT

// configuration ====================
//
     // connect to mongoDB database on modulus.io

mysql = require('mysql');



var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Villa#25',
	database: 'Topcoder'
});

connection.connect();
var dropTable = "DROP TABLE if exists DataList";

var panelCounselTable = "CREATE TABLE DataList (State_Represented VARCHAR(2),Department VARCHAR(3),Status VARCHAR(30), Administrative_Defence VARCHAR(30),Coverage VARCHAR(10),Construction_Defect VARCHAR(30),Cyber VARCHAR(10),Property VARCHAR(10),Casualty VARCHAR(10),Surety VARCHAR(10),Fidelty VARCHAR(10),Subrogation VARCHAR(30),Sex_Abuse VARCHAR(30),Strategic VARCHAR(10),Firm_Name VARCHAR(30),Name VARCHAR(30),Key_Contact VARCHAR(15),Phone VARCHAR(15),Email VARCHAR(255),Address VARCHAR(255),City VARCHAR(255),State VARCHAR(2),Zip INT,ZipExtra SMALLINT,Vendor_Number INT,Rate VARCHAR(255),Partner INT,Associate INT,Paralegal INT,Notes VARCHAR(255),id int PRIMARY KEY AUTO_INCREMENT, Vendor_Type VARCHAR(30) DEFAULT \"Attorney\", Rate_Changed_By INT, FOREIGN KEY(Rate_Changed_By) REFERENCES DataList(id), Rate_Approval_Date VARCHAR(30));"
console.log(panelCounselTable + "to be executed") ;

var loadData = "LOAD DATA LOCAL INFILE '/Users/bupeshkumar/Downloads/CombinedList.tsv' INTO TABLE DataList FIELDS TERMINATED BY '\t';"

connection.query(dropTable, function(err, res, fields) {
	if(!err)
		console.log("Table Successfully dropped", res);
	else
		console.log("Could not delete the table", res+"\n"+err);
})

connection.query(panelCounselTable, function(err, rows, fields) {
	if(!err)
		console.log('After creating table, The result is ', rows);
	else
		console.log("Error while performing the query", err);
});

connection.query(loadData, function(err, res, fields) {
	if(!err)
		console.log("Successfully loaded Data", res );
	else
		console.log("Could not load data into table DataList. ",err);
})

connection.end();
