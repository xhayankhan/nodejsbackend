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

// Parse JSON bodies
app.use(bodyParser.json());

const DataSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    meditations: [{
        dateTime: { type: String, required: true },
        meditationTime: { type: String, required: true },
    }],
});

const Data = mongoose.model('Data', DataSchema);

async function storeData(data) {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost/MeditationsDBX', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create a new data object and save it to the database
    const dataToStore = new Data(data);
    await dataToStore.save();

    // Close the connection
    await mongoose.connection.close();
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

mongoose.connect('mongodb://localhost/MeditationsDBX', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.post('/meditation', async (req, res) => {
    console.log('request coming');
    // Store the data in MongoDB
    await storeData(req.body);
    res.send('Data stored successfully');
});
app.get('/meditation', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost/MeditationsDBX', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const allData = await Data.find();
        res.json(allData);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    } finally {
        await mongoose.connection.close();
    }
});
app.post('/meditation/:id', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost/MeditationsDBX', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
        await mongoose.connection.close();
    }
});
app.listen(3000,'0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
});