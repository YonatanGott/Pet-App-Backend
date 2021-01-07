const express = require('express')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
require('dotenv/config')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

const usersRoute = require('./routes/users')
const petsRoute = require('./routes/pets')
const actionsRoute = require('./routes/actions')

app.use(cookieParser())
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }));
app.use('/api/users', usersRoute)
app.use('/api/pets', petsRoute)
app.use('/api/actions', actionsRoute)

mongoose.connect(
    process.env.DB_KEY,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to mongoDB'))

app.get('/', (req, res) => {
    res.send('Hello')
});


app.listen(process.env.PORT || 5000)