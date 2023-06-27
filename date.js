module.exports.getdate=getdate;


function getdate(){
var today=new Date();
    var currday=today.getDay();
var options={
    day:"numeric",
    month:'long',
    weekday:"long"
}

var days=today.toLocaleDateString("en-us",options);
return days;

}

module.exports.getday=getday;
    function getday(){
    var today=new Date();
        var currday=today.getDay();
    var options={
       
        weekday:"long"
    }
    
    var days=today.toLocaleDateString("en-us",options);
    return days;}
    
    