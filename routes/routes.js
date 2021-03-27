const express = require('express');
const Router = express.Router();


 /**
 * Application routes
 */
Router.use('/api',require('./consumer_routes'));

Router.use('*', (req, res) => {
    res.status(404).json({
        message: "You might be lost"
    });
})

// export all application routes
 module.exports = Router;