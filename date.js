//jshint esversion:6

exports.getDate=getDate;

function getDate(){
var options={ 
    day:"numeric",
    month:"long",
    weekday:"long"
};

var t=new Date();
var c=t.toLocaleDateString("en-US",options);
 
return c;

}

exports.getDay=getDay;

function getDay(){
var options={ 
    
    weekday:"long"
};

var t=new Date();
var c=t.toLocaleDateString("en-US",options);
 
return c;

}