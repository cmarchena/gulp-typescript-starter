import idb from "idb";
// CREATE DATABASE
const dbPromise = idb.open('test', 1, (upgradeDb) => {
    const keyValStore = upgradeDb.createObjectStore('keyval');
    keyValStore.put('world', 'hello')
})
//READ VALUE
dbPromise.then((db) => {
    const tx = db.transaction('keyval');
    var keyValStore = tx.objectStore('keyval');
    return keyValStore.get('hello');
}).then((val) => {
    console.log("The value of hello is " + val)
}).catch(err => console.log(err))
//CREATE KEYVALUE
dbPromise.then((db) => {
    const tx = db.transaction('keyval', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('Caracola', 'Hola');
    return tx.complete;
}).then(() => {
    console.log('Added to Object Store')
})