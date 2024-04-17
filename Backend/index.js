//mongodb
require('./config/db')

const app = require('express')();
const port = 3001;

const UserRouter = require('./api/User');

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)

const registerRouter = require('./api/User')
app.use('/api', registerRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})