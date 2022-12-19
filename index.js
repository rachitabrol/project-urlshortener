require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
var dns = require('dns');
const URL = require('url').URL;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//middleware
app.use(bodyParser.urlencoded({extended:false})) //contains more than strings i.e. here it accepts objects otherwise won't be found
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let hashmap = new Map();
let counter = 1;
app.post('/api/shorturl',(req,res)=>{
  const og = req.body.url;
  const oog = new URL(og);
  //check whether url is valid
  dns.lookup(oog.hostname,function (err, addresses, family) {
    if(err){
    console.log("TIME : ",new Date()," ERROR : ",err);
    res.json({ error: 'invalid url' });
    }else{
      //shortern it
      hashmap.set(counter,og);
      res.json({original_url:og,short_url:counter++});
    }
  });
  
  
})

app.get('/api/shorturl/:surl',(req,res)=>{
  res.redirect(hashmap.get(parseInt(req.params.surl)));
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
