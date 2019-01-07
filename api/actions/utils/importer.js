/**
 * Created by isaac on 1/22/16.
 */

const sqlite3 = require('sqlite3');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const {assign, forIn} = require('lodash');

/**
 *
 * @param sqliteDbPath
 * @param mongoUrl
 * @param cb - Callback that will be called when both databases are connected
 * @constructor
 */
var SqliteToMongo = module.exports = function SqliteToMongo(sqliteDbPath, mongoUrl) {

  this.callbacks = [];
  if (typeof sqliteDbPath !== 'string' || typeof mongoUrl !== 'string')
    throw new Error('Illegal parameter was given. Please provide a path to sqlite file and a MongoDB url');

  this.sqliteDb = new sqlite3.Database(sqliteDbPath);
  var self = this;
  this.sqliteDb.once('open', function (error) {

    MongoClient.connect(mongoUrl, {native_parser: true}, function (error, db) {
      self.mongoDb = db;

      if (error) {
        cosnole.log(error);
      } else {
        for (var i = 0; i < self.callbacks.length; ++i) {
          var callback = self.callbacks[i];
          if (typeof callback === 'function') {
            callback();
          }
        }
        self.callbacks = [];
      }
    });
  });

  this.sqliteDb.on('error', function (error) {
    throw new Error(error);
  });
};

/**
 * A handler motod for each row selected from the sqlite DB
 * @param err - Error with getting the row selected.
 * @param row - A row selected from sqlite
 * @param collectionName - The name of the collection that we would like to import to.
 * @param tableMapping - An object that maps the sqlite table to a insert document.
 * @private
 */
SqliteToMongo.prototype._handleSqliteRow = function (collectionName, tableMapping, err, row) {
  if (err) throw new Error('There was a problem retrieving a row for the given query \n' + err);

  var collection = this.mongoDb.collection(collectionName);
  var newDoc = {};
  var columnNames = Object.keys(row);

  // Building the new object based on the mapping file
  columnNames.forEach(function (columnName) {
    if (row[columnName] !== null) {
      var key = tableMapping.columns[columnName];
      if (!key) {
        // console.log('undefined: ', columnName);
      } else {
        newDoc[key] = row[columnName];
      }
    }
  });

  if (tableMapping.presets) {

    var preset = {};

    forIn(tableMapping.presets, function (value, key) {
      preset[key] = typeof value === 'function' ? value() : value;
    });

    assign(newDoc, preset);
  }


  if (tableMapping.selector) {
    var selector = {};

    // Building selector from the current row
    Object.keys(tableMapping.seletor).forEach(function (key) {
      selector[key] = row[tableMapping.selector[key]];
    });

    collection.update(selector, newDoc, {upsert: true});
  } else {
    collection.insert(newDoc, function (err) {
      if (err) console.log(err);
    });
  }

};

/**
 *
 * This function will import into a collection all the results of a given query based
 * on a given mapping object.
 * Suggestion: If you are going to import sqlite databases on a regular basis into
 *             your MongoDB, you should save mapping files in a source control.
 *             then read those files and call this function for import of every table.
 *
 * @param collectionName - The name of the collection that we would like to import to.
 * @param tableMapping - An object that maps the sqlite table to a insert document.
 * @param completeCallback - Accepts a function which is called after the conversion has ended.
 *                           The callback function accepts an error parameter first, the number of operations second.
 *
 * @example:
 * {
 *   (tableName : "USERS_TABLE" | query: "select USERNAME from USERS_TABLE"),
 *   columns: {
 *     ID: '_id',
 *     USERNAME: 'username',
 *     EMAIL : 'profile.email'
 *   },
 *   presets (optional) : {
 *     'verified' : false,
 *     'profile.gender' : female
 *   },
 *   selector (optional) : {
 *     '_id': ID
 *   }
 * }
 */
SqliteToMongo.prototype.importCollection = function (collectionName, tableMapping, completeCallback) {
  if (typeof collectionName !== 'string')
    throw new Error('collection provided was is undefined or not a string');
  if ((!tableMapping) ||
    ((typeof tableMapping.tableName === 'undefined') && (typeof tableMapping.query === 'undefined')))
    throw new Error('tableName or query field must be specified on a tableMapping');

  var query = tableMapping.query;

  if (!(query)) {
    var tableName = tableMapping.tableName;
    var columnNames = Object.keys(tableMapping.columns);

    query = 'select ';
    columnNames.forEach(function (column, index) {
      query += column + ((index < columnNames.length - 1) ? ', ' : ' ');
    });
    query += 'from ' + tableName;
  }

  var where = tableMapping.where;
  if (where) {
    query += where;
  }

  if (!tableMapping.query) {
    query += ' limit 100';
  }

  if (typeof completeCallback !== 'function') {
    completeCallback = function (err, num) {
      if (err) throw new Error(err);
      if (0 === num) {
        console.log(query);
      } else {
        console.log('Number of operations:', num);
      }
    }
  }
  this.sqliteDb.each(query, this._handleSqliteRow.bind(this, collectionName, tableMapping), completeCallback);
};

SqliteToMongo.prototype.exec = function (callback) {
  if (this.mongoDb) {
    callback();
  } else {
    this.callbacks.push(callback);
  }
};
