const cors = require('cors');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const RoleModel = require('./model_helpers/RoleHelper');

const app = express();
const routes = require('./routes/routes.js');
const port = 3000;

const dev_db_url = 'mongodb://127.0.0.1:27017/mean_stack_test_db';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

RoleModel.writeDefaults().then(() => {
    app.listen(port, () => {
        console.log(`App started at port -> ${port}`);
    });
});

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routes);

app.get('*', (request, response) => {
    response.sendfile('./public/index.html')
});
