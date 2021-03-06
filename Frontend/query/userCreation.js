var mysql = require("mysql");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var pool = require("../db/index.js");

function createUser(user, callback) {
  console.log("User details:" + JSON.stringify(user));
  if (user.password) {
    user.hashed_password = bcrypt.hashSync(user.password, salt);
  }
  var queryString = getQuery(user);

  console.log("Query:" + queryString);

  pool.getConnection((err, con) => {
    if (err) {
      console.log("Error occurred while creating a connection ", err);
      return callback(err, "Error occured");
    } else {
      con.query(queryString, (err, rows) => {
        if (err) {
          console.log("Error occurred while executing query ", err);
          return callback(err, "Error occured");
        } else {
          return callback(null, rows);
        }
      });
    }
  });
}

var getQuery = user => {
  let queryString =
    "Insert into zkp_user(username,password,type) values ( " +
    mysql.escape(user.username) +
    " , " +
    mysql.escape(user.hashed_password) +
    " , " +
    mysql.escape(user.type) +
    ")";
  return queryString;
};

exports.createUser = createUser;
