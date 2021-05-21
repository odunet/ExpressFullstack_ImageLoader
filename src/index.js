//Common JS import
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//This use of ESM module is possible with the dependency 'ESM'
import hbs from 'hbs';
import path from 'path';

//Get env variable
require('dotenv').config();
const { PORT } = process.env;

//Get routes
const userRoutes = require('./routes/userRoutes');
const loaderRoutes = require('./routes/loaderRoutes');

//Seeders
const { seedAdmin } = require('./seeders/admin');
seedAdmin();

//initialize express
const app = express();

// Define router
let router = express.Router();

//Use cors
const corsConfig = {
  origin: [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5000',
    'https://localhost:5000',
    'http://localhost:5500',
    'odunet.github.io/',
    'https://odunet.github.io',
    'https://odunet.github.io/CookieClientTest/',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  allowedHeaders: [
    'Content-Type',
    'set-cookie',
    'Access-Control-Allow-Credentials',
    'x-auth-token',
    'Authorization',
    'XX-Requested-With',
  ],
};
app.use(cors(corsConfig));

//intialize middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie parser
app.use(cookieParser());

//Set static folder
app.use(express.static(__dirname + '/../public'));

//Set views and register partials
let viewPath = path.join(__dirname, '/views');
app.set('views', viewPath);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

//Connect to DB
connectDB();

//Use routes
app.use('/api', userRoutes);
app.use('/loader', loaderRoutes);

//Error Handler 404
app.use((req, res) => {
  res
    .status(404)
    .render('error.hbs', { errorCode: 404, errorMessage: 'Page not found' });
});

//Error Handler 500
app.use(function (error, req, res, next) {
  res
    .status(500)
    .render('error.hbs', {
      errorCode: 500,
      errorMessage: 'Internal Server Error',
    });
});

app.listen(PORT, () => {
  `Listening on ${PORT}`;
});
