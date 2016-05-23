var express=require("express");
var app=express();
 
var app = express(); 

app.get('/',function(req,res){
    res.send('Hello ');
});

app.listen(3000,function(){
    console.log("Running at PORT 3000");
});