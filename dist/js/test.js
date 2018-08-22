"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
// CREATE DATABASE AND KEY-VALUE
var dbPromise = idb_1.default.open('test', 2, function (upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('people', { keyPath: 'name' });
    }
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
});
dbPromise.then(function (db) {
    var tx = db.transaction('people', 'readwrite');
    var peopleStore = tx.objectStore('people');
    peopleStore.put({
        name: 'Mission Chinese Food',
        neighborhood: 'Manhattan',
        photograph: '1',
        address: '171 E Broadway, New York, NY 10002',
        latlng: {
            lat: 40.713829,
            lng: -73.989667
        },
        cuisine_type: 'Asian',
        operating_hours: {
            Monday: '5:30 pm - 11:00 pm',
            Tuesday: '5:30 pm - 11:00 pm',
            Wednesday: '5:30 pm - 11:00 pm',
            Thursday: '5:30 pm - 11:00 pm',
            Friday: '5:30 pm - 11:00 pm',
            Saturday: '12:00 pm - 4:00 pm, 5:30 pm - 12:00 am',
            Sunday: '12:00 pm - 4:00 pm, 5:30 pm - 11:00 pm'
        },
        createdAt: 1504095563444,
        updatedAt: '2018-08-19T11:10:04.173Z',
        id: 1,
        is_favorite: 'false'
    });
    peopleStore.put({
        name: 'Emily',
        neighborhood: 'Brooklyn',
        photograph: '2',
        address: '919 Fulton St, Brooklyn, NY 11238',
        latlng: {
            lat: 40.683555,
            lng: -73.966393
        },
        cuisine_type: 'Pizza',
        operating_hours: {
            Monday: '5:30 pm - 11:00 pm',
            Tuesday: '5:30 pm - 11:00 pm',
            Wednesday: '5:30 pm - 11:00 pm',
            Thursday: '5:30 pm - 11:00 pm',
            Friday: '5:30 pm - 11:00 pm',
            Saturday: '5:00 pm - 11:30 pm',
            Sunday: '12:00 pm - 3:00 pm, 5:00 pm - 11:00 pm'
        },
        createdAt: 1504095568414,
        updatedAt: '2018-08-19T11:10:03.163Z',
        is_favorite: 'false',
        id: 2
    });
    return tx.complete;
}).then(function () { return console.log("People ObjectStore created and items added"); });
