const mongoose = require('mongoose');
const logger = require('../logger/logger');
try {
    mongoose.connect(process.env.MONGO_URI, {})
        .then(() => logger.info("Database Connected"));
}
catch (err) {
    console.log(err);
    logger.err("some error in connecting to database");
}