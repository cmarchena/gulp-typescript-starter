import idb from "idb";
// CREATE DATABASE, ADD KEY-VALUE AND CREATE INDEX
const dbPromise = idb.open('test', 3, (upgradeDb) => {
    switch (upgradeDb.oldVersion) {
        case 0:
            const keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put('world', 'hello');
        case 1:
            upgradeDb.createObjectStore('people', { keyPath: 'id' });
        case 2: const peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('cuisine', 'cuisine_type');

    }
})
//READ VALUE
dbPromise.then((db) => {
    const tx = db.transaction('keyval');
    var keyValStore = tx.objectStore('keyval');
    return keyValStore.get('hello');
}).then((val) => {
    console.log("The value of hello is " + val)
}).catch(err => console.log(err))
//CREATE KEY VALUES
dbPromise.then((db) => {
    const tx = db.transaction('keyval', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('Caracola', 'Hola');
    return tx.complete;
}).then(() => {
    console.log('Added to Object Store')
})
dbPromise.then((db) => {
    const tx = db.transaction('people', 'readwrite');
    const peopleStore = tx.objectStore('people');
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
    peopleStore.put({
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

}).then(() => console.log("People ObjectStore created and items added"))
//GET NEW VALUES
dbPromise.then((db) => {
    const tx = db.transaction('people');
    var peopleStore = tx.objectStore('people');
    const peopleIndex = peopleStore.index('cuisine')
    return peopleIndex.getAll('Pizza');
}).then((people) => {
    console.log("The value of people", people)
}).catch(err => console.log(err))