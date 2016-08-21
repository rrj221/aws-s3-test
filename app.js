const express = require('express');
const aws = require('aws-sdk');

//set up and run express app
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

//Load the S3 info from the environment variables
const S3_BUCKET = process.env.S3_BUCKET;

app.get('/', function (req, res) {
	console.log('hi');
	res.render('account.html');
})

app.get('/account', function(req, res) {
	res.render('account.html');
});

app.get('/sign-s3', function(req, res) {
  var s3 = new aws.S3();
  var fileName = req.query['file-name'];
  var fileType = req.query['file-type'];
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function (err, data) {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});


