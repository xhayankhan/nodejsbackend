// const express = require('express')
// const mongoose = require('mongoose')
// const url = 'mongodb://localhost/MeditationsDBX'

// const app = express()

// mongoose.connect(url, {useNewUrlParser:true})
// const con = mongoose.connection

// con.on('open', () => {
//     console.log('connected...')
// })

// app.use(express.json())

// const meditationRouter = require('./routes/meditations')
// app.use('/meditation',meditationRouter)

// app.listen(9000, () => {
//     console.log('Server started')
// })
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const db = require('./db');
const connection = db.connect();
let PORT =process.env.PORT||3000;
// Parse JSON bodies
app.use(bodyParser.json());

const DataSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    meditations: [{
        dateTime: { type: String, required: true },
        meditationTime: { type: String, required: true },
    }],
});
const mailingSchema = new mongoose.Schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
});
const feedbackSchema = new mongoose.Schema({
        comment:{type:String,required:true},
        email:{type:String,required:true},    
});
const Data = mongoose.model('Data', DataSchema);
const mailings = mongoose.model('Mailing', mailingSchema);
const feedbacks = mongoose.model('Feedback', feedbackSchema);
connection.once('open', () => {
async function storeData(data) {
    // Connect to MongoDB
    //     await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });

    // Create a new data object and save it to the database
    const dataToStore = new Data(data);
    await dataToStore.save();

    // Close the connection
   // await mongoose.connection.close();
}
async function storeFeedback(data) {
    // Connect to MongoDB
    //     await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });

    // Create a new data object and save it to the database
    const dataToStore = new feedbacks(data);
    await dataToStore.save();

    // Close the connection
   // await mongoose.connection.close();
}
async function storeMailing(data) {
    // Connect to MongoDB
    //     await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });

    // Create a new data object and save it to the database
    const dataToStore = new mailings(data);
    await dataToStore.save();

    // Close the connection
   // await mongoose.connection.close();
}
passport.use(new GoogleStrategy({
    clientID: '373766077119-0opquoutepu3urckf1gkmtvefg05dcqb.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://192.168.1.7:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile}, (err, user) => {
        return cb(err, user);
    });
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
(req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/');
});

const User = mongoose.model('users', new mongoose.Schema({
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
}));

// mongoose.connect('mongodb://localhost/MeditationsDBX', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
app.post('/meditation', async (req, res) => {
    try{
    console.log('request coming');
    // Store the data in MongoDB
    await storeData(req.body);
    res.send('Data stored successfully');}
    catch(e){
        console.log(e);
        res.status(500).send(error);
    }
    finally{
        //await mongoose.connection.close();

    }
});
app.post('/feedback', async (req, res) => {
    try{
    console.log('request coming');
    // Store the data in MongoDB
    await storeFeedback(req.body);
    res.send('Data stored successfully');}
    catch(e){
        console.log(e);
        res.status(500).send(error);
    }
    finally{
        //await mongoose.connection.close();

    }
});
app.post('/mailing', async (req, res) => {
    try{
    console.log('request coming');
    // Store the data in MongoDB
    await storeMailing(req.body);
    res.send('Data stored successfully');}
    catch(e){
        console.log(e);
        res.status(500).send(error);
    }
    finally{
        //await mongoose.connection.close();

    }
});
app.get('/feedback', async (req, res) => {
    try {
    //    var connection= await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
        const allData = await feedbacks.find();
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } finally {
       // await mongoose.connection.close();
    }
});
app.get('/mailing', async (req, res) => {
    try {
    //    var connection= await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
        const allData = await mailings.find();
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } finally {
       // await mongoose.connection.close();
    }
});
app.get('/meditation', async (req, res) => {
    try {
    //    var connection= await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     });
        const allData = await Data.find();
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } finally {
       // await mongoose.connection.close();
    }
});
app.get('/meditation/:id', (req, res) => {
    const connection = db._connection;
    if (!connection) {
        return res.status(500).send({ message: 'MongoDB connection is not established' });
    }
    Data.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (!doc) {
            return res.status(404).send({ message: `Document not found with id: ${req.params.id}` });
        }
        res.send(doc);
    });
});
app.post('/meditation/:id', async (req, res) => {
    try {
        // await mongoose.connect('mongodb+srv://shayan:Nidonido1@cluster0.zsgopc1.mongodb.net/?retryWrites=true&w=majority', {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });
        const existingData = await Data.findById(req.params.id);
        if(existingData){
            existingData.meditations.push(req.body.meditations);
            await existingData.save();
            res.send('Data updated successfully');
        }else{
            res.status(404).send('Data not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } finally {
       // await mongoose.connection.close();
    }
});
app.listen(PORT, () => {
    console.log('Server running on http://localhost:3000');
});});
