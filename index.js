'use strict';

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4600;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Ndidia Ibibio server!');
});

app.listen(port, () => {
  console.log('Server is listening on port', port);
});