const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(
  '/public/uploads',
  express.static(path.join(__dirname + '/public/uploads'))
);
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, 'build/index.html'))
// );
app.use(errorHandler);

///Routes
const categoriesRoutes = require('./routes/categories');
const doctorsRoutes = require('./routes/doctor');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const bannersRoutes = require('./routes/banners');
const appointsRoutes = require('./routes/appointments');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/doctor`, doctorsRoutes);
app.get(`${api}/users`, usersRoutes);
app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/banners`, bannersRoutes);
app.use(`${api}/appointments`, appointsRoutes);
app.get('/', function (res, req) {
  res.status(200).json({ message: 'hello' });
});

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'doctor-appointment',
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

//Server
// app.listen(3000, () => {
//   console.log('server is running http://localhost:3000');
// });
//Production
var server = app.listen(process.env.Port || 3000, function () {
  var port = server.address().port;
  console.log('Express is working on port' + port);
});
