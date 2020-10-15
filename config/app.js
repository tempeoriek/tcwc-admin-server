/*** App Init ***/
const express = require('express'),
bodyParser = require('body-parser'),
cors = require('cors'),
morgan = require('morgan'),
mongoose = require('mongoose'),
config = require('./database'),
fileUpload = require('express-fileupload'),
app = express();

app.use(express.static('files'))
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.options('*', cors());
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

/*** Global Variable ***/
require(`./global`)(global);

/*** Database Connection ***/


mongoose.connect(config.database, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function() {
  console.log('\n\n\n\n');
  console.log(`Server successfully compiled on ${moment().format(`YYYY-MM-DDTHH:mm:ss.SSSZ`)} \nDatabase connection Success!\n\n\n\n\n`);
});

/*** FOR CREATE NEW ROUTES ***/
require(`./routes`)(app);


/*** Start Server ***/
/* app.listen(process.env.PORT || 8081, function() {
  console.log('Server started on port 8081');
}); */

module.exports = app;