"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
// CREATE DATABASE
var dbPromise = idb_1.default.open('test', 1, function (upgradeDb) {
    var keyValStore = upgradeDb.createObjectStore('keyval');
    keyValStore.put('world', 'hello');
});
//READ VALUE
dbPromise.then(function (db) {
    var tx = db.transaction('keyval');
    var keyValStore = tx.objectStore('keyval');
    return keyValStore.get('hello');
}).then(function (val) {
    console.log("The value of hello is " + val);
}).catch(function (err) { return console.log(err); });
//CREATE KEYVALUE
dbPromise.then(function (db) {
    var tx = db.transaction('keyval', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('Caracola', 'Hola');
    return tx.complete;
}).then(function () {
    console.log('Added to Object Store');
}).catch(function (err) {
    console.log(err);
});
