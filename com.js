var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var logger = require('morgan');
var redis = require("redis"),
    client = redis.createClient();

// client.on('error', function(err) {
//     console.log('Error ' + err);
// });

// client.on('connect', runSample);

server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));

io.on('connection', function(socket) {

    setInterval(function() {
        socket.emit('graphTempData', temp);
        socket.emit('graphHeightData', height);
        socket.emit('graphNitData', nit);
        socket.emit('graphCondData', cond);
        socket.emit('graphPhvalData', phval);
        socket.emit('graphDisData', dis);
        socket.emit('graphTurbData', turb);

        getTemp();
        getHeight();
        getTurb();
        getCond();
        getNit();
        getDis();
        getPhval();

        // console.log(temp);
        // console.log(height);
        // console.log(nit);
        // console.log(cond);
        // console.log(phval);
        // console.log(dis);
        // console.log(turb);

    }, 5000);

    socket.on('userClick', function(data) {
        console.log(data);


        client.hset(data.prop, data.lat, data.val, redis.print);





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