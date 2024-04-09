const mongoose = require('mongoose');
const config = require('./config')
const MONGO_URI = config.mongoose.url;
const OPTIONS = config.mongoose.options;


mongoose.connect(MONGO_URI, OPTIONS).then(() => {
    console.log("Mongoose Connected");
});
