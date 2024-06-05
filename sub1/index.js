const express = require('C:/Users/h_ade/node_modules/express');
// const express = require('C:/Users/Qi Zhang/node_modules/express');
// Uncomment for your work
// const express = require('C:/Users/YourUserName/node_modules/express');
const app = express();
app.listen(3000, ()=> console.log('listening at 3000'))
app.use(express.static('public'))
