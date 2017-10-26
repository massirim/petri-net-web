'use strict';

var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static(__dirname + '/app/build'));

app.use('*',function(req,res,next){
	var indexFile = __dirname + '/app/build/index.html';
	res.sendFile(indexFile);
})

app.listen(port, function(){
    console.log("Server running on port "+ port +"...");
});
