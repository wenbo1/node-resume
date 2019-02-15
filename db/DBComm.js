var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/';

var MongoCom = {
  insert (DBcof, data, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DBcof.db);
      dbo.collection(DBcof.site).insertOne(data, function(err, res) {
          if (err) throw err;
          callback(res);
          db.close();
      });
    });
  },
  find (DBcof, whereStr, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DBcof.db);
      dbo.collection(DBcof.site).find(whereStr).toArray(function(err, res) {
          if (err) throw err;
          callback(res);
          db.close();
      });
    });
  },
  update (DBcof, whereStr, data, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DBcof.db);
      var updateStr = {$set: data};
      dbo.collection(DBcof.site).updateOne(whereStr, updateStr, function(err, res) {
          if (err) throw err;
          callback(res);
          db.close();
      });
    });
  },
  delete (DBcof, whereStr, callback) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DBcof.db);
      dbo.collection(DBcof.site).deleteOne(whereStr, function(err, res) {
          if (err) throw err;
          callback(res);
          db.close();
      });
  });
  }
}

module.exports = MongoCom;