import { FindAndModifyWriteOpResultObject, InsertOneWriteOpResult, MongoClient } from 'mongodb';
export class Repository {
    private connectionPromise;

    constructor(documentName) {
        // TODO open close wrapper --> not in constructor
        this.connectionPromise = new Promise(function (resolve, reject) {
            let url = 'mongodb://localhost:27017/hls';
            MongoClient.connect(url, (err, db) => {
                console.log('Error: ', err);
                let collection = db.collection(documentName);
                resolve(collection);
            });
        });

    }

    add(document) {
        return this.connectionPromise
            .then(collection => collection.insertOne(document))
            .then((result: InsertOneWriteOpResult) => result.ops[0])
            .then(this.removeId);
    }

    update(filter, document, options = null) {
        return this.connectionPromise
            .then(collection => collection.findOneAndUpdate(filter, document, options))
            .then((result: FindAndModifyWriteOpResultObject) => result.value)
            .then(this.removeId);
    }

    get(document) {
        return this.connectionPromise
            .then(collection => collection.findOne(document))
            .then(this.removeId);
    }

    getAll(document = {}) {
        return this.connectionPromise
            .then(collection => collection.find(document).toArray())
            .then(this.removeId);
    }

    removeId(doc) {
        if (Array.isArray(doc)) {
            doc.forEach(item => delete item._id)
        }
        else if (doc && doc._id) {
            delete doc._id;
        }
        return Promise.resolve(doc);
    }
}