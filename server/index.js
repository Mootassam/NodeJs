const express = require("express");
const consola = require("consola");
const mongoose = require("mongoose");
// const db = require('./dbconnect');
const bodyParser = require("body-parser");
const path = require('path');
const {
  Nuxt,
  Builder
} = require("nuxt");
const app = express();
const estateRoutes = require('./routes/estate');
const adminRoutes = require('./routes/admin');

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host,
    port
  } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(3000 , ()=> { 
    console.log('Listening in the port 3000 ');
  })
}
start();

//Connect to the db
mongoose.connect('mongodb://localhost/hanen', {useUnifiedTopology : true , useNewUrlParser : true}); 


//Set the response header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../assets')));
app.use('/api/admin', adminRoutes)
app.use('/api/estate', estateRoutes);
