// db.js
const mongoose = require('mongoose');

class MongoDb {
    constructor() {
        this._connection = null;
    }
    connect() {
        if (this._connection) return this._connection;
        mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this._connection = mongoose.connection;
        return this._connection;
    }
}

module.exports = new MongoDb();