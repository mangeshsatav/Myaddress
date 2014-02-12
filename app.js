
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect("mongodb://localhost/Myaddress");

var UserSchema = new mongoose.Schema({

    name:{

    fname: String,
    mname : String,
    lname : String
    },

    email: String,

    prefix: String,
    mobile: Number,

    address:{
    addline1: String,
    addline2: String
    },

    latlong:{
        longitude: Number,
        latitude: Number
    }

});
Users = mongoose.model('Users', UserSchema);

app.get('/', function(req, res){

    res.render('index.html');
});

app.post('/users',function(req,res){
    var b=req.body;
    new Users({
        name:{

            fname: b.fname,
            mname : b.mname,
            lname : b.lname
        },

        email: b.email,

        prefix: b.prefix,
        mobile: b.mobile,

        address:{
            addline1: b.addline1,
            addline2: b.addline2
        },

        latlong:{
            longitude: b.longitude,
            latitude: b.latitude
        }
    }).save(function(err,user){
            if(err) res.json(err);
            res.redirect('/');
        });
});

app.param( 'name',function(req,res,next,name){
    Users.find({name:name},function(err,docs){
        req.user=docs[0];
        next();

    });
});
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
