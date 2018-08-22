"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
// CREATE DATABASE, ADD KEY-VALUE AND CREATE INDEX
var dbPromise = idb_1.default.open('test', 4, function (upgradeDb) {
    switch (upgradeDb.oldVersion) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
        case 2:
            var restStore = upgradeDb.transaction.objectStore('restaurants');
            restStore.createIndex('cuisine', 'cuisine_type');
        case 3:
            restStore.createIndex('neighborhoods', 'neighborhood');
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
//CREATE KEY VALUES
dbPromise.then(function (db) {
    var tx = db.transaction('keyval', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('Caracola', 'Hola');
    return tx.complete;
}).then(function () {
    console.log('Added to Object Store');
});
dbPromise.then(function (db) {
    var tx = db.transaction('restaurants', 'readwrite');
    var restStore = tx.objectStore('restaurants');
    restStore.put({
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
    restStore.put({
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
    restStore.put({
        "name": "Kang Ho Dong Baekjeong",
        "neighborhood": "Manhattan",
        "photograph": "3",
        "address": "1 E 32nd St, New York, NY 10016",
        "latlng": {
            "lat": 40.747143,
            "lng": -73.985414
        },
        "cuisine_type": "Asian",
        "operating_hours": {
            "Monday": "11:30 am - 2:00 am",
            "Tuesday": "11:30 am - 2:00 am",
            "Wednesday": "11:30 am - 2:00 am",
            "Thursday": "11:30 am - 2:00 am",
            "Friday": "11:30 am - 6:00 am",
            "Saturday": "11:30 am - 6:00 am",
            "Sunday": "11:30 am - 2:00 am"
        },
        "createdAt": 1504095571434,
        "updatedAt": "2018-08-18T15:13:36.454Z",
        "id": 3,
        "is_favorite": "false"
    });
    return tx.complete;
}).then(function () { return console.log("Restaurant ObjectStore created and items added"); });
//GET NEW VALUES
dbPromise.then(function (db) {
    var tx = db.transaction('restaurants');
    var restStore = tx.objectStore('restaurants');
    var restIndex = restStore.index('cuisine');
    return restIndex.getAll('Pizza');
}).then(function (restaurants) {
    console.log("The value of restaurants", restaurants);
}).catch(function (err) { return console.log(err); });
dbPromise.then(function (db) {
    var tx = db.transaction('restaurants');
    var restStore = tx.objectStore('restaurants');
    var restIndex = restStore.index('neighborhoods');
    return restIndex.getAll();
}).then(function (restaurants) {
    console.log("The value of restaurants", restaurants);
}).catch(function (err) { return console.log(err); });
//CURSORS
dbPromise.then(function (db) {
    var tx = db.transaction('restaurants');
    var restStore = tx.objectStore('restaurants');
    var restIndex = restStore.index('neighborhoods');
    return restIndex.openCursor();
}).then(function (cursor) {
    if (!cursor)
        return;
    return cursor.advance(1);
})
    .then(function logRestaurant(cursor) {
    if (!cursor)
        return;
    console.log("Cursored at ", cursor.value.name);
    return cursor.continue().then(logRestaurant);
}).then(function () {
    console.log("Done Cursoring!");
});
