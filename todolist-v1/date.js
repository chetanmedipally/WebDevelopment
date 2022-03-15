exports.getDate = function() {
    const options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    
    const d = new Date();
    const day = d.toLocaleDateString("en-US",options);
    return day;
}

exports.getDay = function() {
    const options = {
        weekday:"long",
    };
    
    const d = new Date();
    const day = d.toLocaleDateString("en-US",options);
    return day;
}