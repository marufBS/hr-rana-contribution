const express  = require('express');
const router = require('../Routes/Routes');
const app = express();
const cors = require('cors');

const path = require('path')




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static(path.join(__dirname, 'public')));

// Serve the index.html file directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});



app.use("", router)




module.exports = app;
