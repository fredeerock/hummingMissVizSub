var express = require('express');
var app = express();
var favicon = require('serve-favicon');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var logger = require('morgan');

var redis = require('redis');
var url = require('url');


redisConnect();
var client;
function redisConnect() {

    if (typeof(process.env.REDISCLOUD_URL) != 'undefined') {

        var redisURL = url.parse(process.env.REDISCLOUD_URL);
        client = redis.createClient(redisURL.port, redisURL.hostname, {
            no_ready_check: true
        });

        client.auth(redisURL.auth.split(":")[1]);
        client.on("error", function(err) {
            console.log("Error " + err);
        });

    } else {
        client = redis.createClient();
        client.on("error", function(err) {
            console.log("Error " + err);
        });
    }
}

var usgsdata = require("./data.js");

app.use(favicon(__dirname + '/public/favicon.ico'));

// client.on('error', function(err) {
//     console.log('Error ' + err);
// });

// client.on('connect', runSample);

getTemp();
getHeight();
getTurb();
getCond();
getNit();
getDis();
getPhval();


server.listen(process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));

io.on('connection', function(socket) {

    socket.on('userConnect', function(data) {

        getTemp();
        getHeight();
        getTurb();
        getCond();
        getNit();
        getDis();
        getPhval();

        socket.emit('graphTempData', temp);
        socket.emit('graphHeightData', height);
        socket.emit('graphNitData', nit);
        socket.emit('graphCondData', cond);
        socket.emit('graphPhvalData', phval);
        socket.emit('graphDisData', dis);
        socket.emit('graphTurbData', turb);




    });

    setInterval(function() {

        getTemp();
        getHeight();
        getTurb();
        getCond();
        getNit();
        getDis();
        getPhval();

        socket.emit('graphTempData', temp);
        socket.emit('graphHeightData', height);
        socket.emit('graphNitData', nit);
        socket.emit('graphCondData', cond);
        socket.emit('graphPhvalData', phval);
        socket.emit('graphDisData', dis);
        socket.emit('graphTurbData', turb);



        // console.log(temp);
        // console.log(height);
        // console.log(nit);
        // console.log(cond);
        // console.log(phval);
        // console.log(dis);
        // console.log(turb);

    }, 50000);

    socket.on('userClick', function(data) {
        console.log(data);

        client.hset(data.prop, data.lat, data.val, redis.print);

        getTemp();
        getHeight();
        getTurb();
        getCond();
        getNit();
        getDis();
        getPhval();

        socket.broadcast.emit('graphTempData', temp);
        socket.broadcast.emit('graphHeightData', height);
        socket.broadcast.emit('graphNitData', nit);
        socket.broadcast.emit('graphCondData', cond);
        socket.broadcast.emit('graphPhvalData', phval);
        socket.broadcast.emit('graphDisData', dis);
        socket.broadcast.emit('graphTurbData', turb);


    });

});

var temp, nit, dis, cond, height, phval, turb;

function getTemp() {
    client.hgetall("temp", function(err, reply) {
        temp = reply;
    });
}

function getHeight() {
    client.hgetall("height", function(err, reply) {
        height = reply;
    });
}

function getDis() {
    client.hgetall("dis", function(err, reply) {
        dis = reply;
    });
}

function getNit() {
    client.hgetall("nit", function(err, reply) {
        nit = reply;
    });
}

function getCond() {
    client.hgetall("cond", function(err, reply) {
        cond = reply;
    });
}

function getPhval() {
    client.hgetall("phval", function(err, reply) {
        phval = reply;
    });
}

function getTurb() {
    client.hgetall("turb", function(err, reply) {
        turb = reply;
    });
}

// client.quit();
