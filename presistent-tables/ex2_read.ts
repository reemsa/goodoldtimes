//
var db = require('mysql2-promise')();
const fs = require('fs');//used to open files
const sw = require('stopword');
db.configure({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "chapter_25"
});

function create_db_schema(db) {
    db.execute("CREATE TABLE document(ID int NOT NULL AUTO_INCREMENT,Name varchar(255),PRIMARY KEY (ID));").spread(function (users) {
        console.log("table document create");
        db.execute("CREATE TABLE words(id int ,doc_id int,value varchar(255));").spread(function (users) {
            console.log("table words create");
            db.execute("CREATE TABLE characters(id int ,word_id int,value varchar(255));").spread(function (users) {
                console.log("table characters create");
            });
        });
    });
  
 

}
function load_file_into_database(path_to_file: string, db) {
    console.log("inside function ")
    function _extract_words(path_to_file) {
        let data= sw.removeStopwords(fs.readFileSync(path_to_file, 'utf8').replace(/[^A-Za-z0-9]+/g, " ").toLowerCase().split(' ') ) 
        return data
      }
    let word_list = _extract_words(path_to_file)
    let doc_id
    let word_id
    try {
        db.execute(`INSERT INTO documents (Name) VALUES (?)`, [path_to_file]).spread(function (users) {
        
            console.log('insert =', users);
            db.execute('SELECT ID FROM documents WHERE Name = ?', [path_to_file]).spread(function (users) {
                // console.log('Hello users',Object.keys(users));
                  doc_id= users['0'].ID
                 console.log('ID = ', doc_id);
                
                db.execute("SELECT MAX(ID) AS LargestPrice FROM words").spread(function (users) {
                word_id=users['0'].LargestPrice
                console.log('MAX ID =', users['0'].LargestPrice );
                if (word_id == null) {
                    word_id = 0
                }
                console.log("doc_id="+doc_id)
                console.log("word_id=" + word_id)  
                console.log("length="+word_list.length)
                for (let i = word_id; i < word_list.length; i++){
                    db.execute(`INSERT INTO words (id,doc_id,value) VALUES (?,?,?)`,[i,doc_id,word_list[i]]).spread(function (users) {
                        console.log('Hello users', word_list[i] + i);
                    }); 
                }
        }); 
        }); 
        });
    }
    catch (error) {
        console.log("error")
    }
}
//create_db_schema(db)
load_file_into_database("inputFile.txt",db)



 


