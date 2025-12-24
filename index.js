
require('dotenv').config();
const app = require('./src/app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HMS API listening on http://localhost:${PORT}`));


/*

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // bind to all interfaces for LAN access

app.listen(PORT, HOST, () => {
  console.log(`HMS API listening on http://${HOST}:${PORT}`);
});

*/