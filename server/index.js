const express = require('express');
const app = express();
const colors = require('colors');
const dotenv = require('dotenv');
var cors = require('cors');
const cookieParser = require('cookie-parser');

const User = require('./models/User');

dotenv.config(); //To access/config the DB connection token

//Import Routes
const authRoute = require('./routes/auth');
const matchRoute = require('./routes/match');
const scoreboardRoute = require('./routes/scoreboard');
//Connect to DB
const connectDB = require('./config/db');
connectDB();
const port = process.env.PORT;

//Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());


//Route Middlewares
app.use('/api/users', authRoute);
app.use('/api/match', matchRoute);
app.use('/api/scoreboard', scoreboardRoute);

app.listen(port, () => console.log(`Server is running on port ${port}`.yellow.bold));
