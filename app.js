const express = require('express')
const app = express()
const port = 8080
const path = require('path');
const router = express.Router();
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
  });
  app.get('/getRate',function(req,res){
    res.render('mailresponse.ejs');
  });
  app.post('/getRate',function(req,res){
    var mailtype = req.body.mailtype;
    var weight = req.body.naweightme;
    var result = CalculatePostage(mailtype,weight);
    console.log(result);
    res.render('mailresponse.ejs',{ postage: result });
  });

function CalculatePostage( mailType, weight){
  var rc = 0;
  if( mailType == 0){ //then stamped letter
    rc = 0.55;  //base rate
    weight = weight - 1; //then for each once more it is $0.15
    if( weight > 0){
      rc = rc + (weight * 0.15);
    } 
  } else if ( mailType == 1){ //then metered letter
    rc = 0.50;  //base rate
    weight = weight - 1; //then for each once more it is $0.15
    if( weight > 0){
      rc = rc + (weight * 0.15);
    } 
  } else if(mailType == 2){ //then large flat envelope
    rc = 1.00;  //base rate
    weight = weight - 1; //then for each once more it is $0.15
    if( weight > 0){
      rc = rc + (weight * 0.15);
    } 
  } else {
    // assume it is a package assume Zone 1 & 2
    //see if under 1 LBS
    if( weight < 16){
      rc = 3.66;
      weight = weight - 4; // goes up every 4 ounces
      if( weight > 0)
        rc = 4.39;
      weight = weight - 4; // goes up every 4 ounces
      if( weight > 0)
        rc = 5.19;
      weight = weight - 4; // goes up every 4 ounces
      if( weight > 0)
        rc = 5.71;
    } else {
      //then convert to LBS
      weight = weight / 16; //limit it to 16 LBS
      var prices = new Array(7.35,7.85,8.30,8.75,9.80,10.55,11.50,11.85,12.30,13.20,13.95,15.20,16.10,17.10,18.30);
      if( weight > 0 && weight < 17)
        rc = prices[weight - 1];
      else 
        rc = "use Fedex";
    }
  }
  if( !isNaN(rc))
    rc = rc.toFixed(2);
  return rc;
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
