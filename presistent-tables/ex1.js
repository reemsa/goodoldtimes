var fs = require('fs'); //used to open files
var sw = require('stopword');
var mysql = require('mysql');
var express = require('express');
var app = express();
var body_parser = require('body-parser');
app.use(body_parser.json());
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    name: 'root',
    database: 'chapter_25',
    port: 3306
});
function create_db_schema(mysqlConnection) {
    mysqlConnection.connect(function (erro) {
        var x = "CREATE TABLE documents(ID int NOT NULL AUTO_INCREMENT,Name varchar(255),PRIMARY KEY (ID));";
        var y = "CREATE TABLE words(id int ,doc_id int,value varchar(255));";
        var z = "CREATE TABLE characters(id int ,word_id int,value varchar(255));";
        if (!erro) {
            console.log("done");
            mysqlConnection.query(x, function (err, rows, fields) {
                if (!err) {
                    console.log("x table done");
                    load_file_into_database("inputFile.txt", mysqlConnection);
                }
                else
                    load_file_into_database("inputFile.txt", mysqlConnection);
                console.log("contnie");
            });
            mysqlConnection.query(y, function (err, rows, fields) {
                if (!err)
                    console.log("y table done");
                else
                    //console.log(err);
                    console.log("contnie");
            });
            mysqlConnection.query(z, function (err, rows, fields) {
                if (!err)
                    console.log("z table done");
                else
                    console.log("contnie");
                //console.log(err);
            });
        }
        else {
            console.log(erro);
        }
    });
}
function load_file_into_database(path_to_file, connection) {
    var word_id;
    var doc_id;
    function _extract_words(path_to_file) {
        var data = sw.removeStopwords(fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' '));
        return data;
    }
    var word_list = _extract_words(path_to_file);
    var x = "INSERT INTO documents (Name) VALUES (" + path_to_file + ");";
    connection.query("INSERT INTO documents (Name) VALUES (?)", [path_to_file], function (err, rows, fields) {
        if (!err)
            console.log("x table done");
        else
            console.log("insert =" + err);
    });
    x = "SELECT ID FROM documents WHERE Name = " + path_to_file + ";";
    connection.query('SELECT ID FROM documents WHERE Name = ?', [path_to_file], function (err, rows, fields) {
        if (!err) {
            doc_id = rows[0].ID;
            console.log(rows[0].ID);
            console.log("x table done");
            connection.query("SELECT MAX(ID) AS LargestPrice FROM words", function (err, rows, fields) {
                if (!err) {
                    if (rows[0].LargestPrice == null) {
                        word_id = 0;
                        console.log(rows[0].LargestPrice);
                    }
                    console.log("x table done");
                    for (var i = word_id; i < word_list.length; i++) {
                        connection.query("INSERT INTO words (id,doc_id,value) VALUES (?,?,?)", [i, doc_id, word_list[i]], function (err, rows, fields) {
                            if (!err) {
                            }
                            else
                                console.log("insert =" + err);
                        });
                        if (i == word_list.length - 1) {
                            connection.query("SELECT value, COUNT(*) as C FROM words GROUP BY value ORDER BY C DESC", function (err, rows, fields) {
                                if (!err)
                                    console.log('top25=', rows);
                                else
                                    console.log("insert =" + err);
                            });
                        }
                    }
                }
                else
                    console.log("select =" + err);
            });
        }
        else
            console.log("select =" + err);
    });
}
create_db_schema(mysqlConnection);
