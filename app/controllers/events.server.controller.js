const Event = require('mongoose').model('Event');

function getErrorMessage(err) {
  let message = '';

  if (err.code) {
    switch (err.code) {
        case 11000:
        case 11001: 
          message = 'Email already exists';
          break;
        default: 
          message = 'Something went wrong';
     }
   } else {
     for (var errName in err.errors) {
       if (err.errors[errName].message){
         message = err.errors[errName].message;
       }
     }
   }
   return message;
};

exports.create = function(req, res){
    const event = new Event(req.body);
    event.creator = req.user;
    event.save((err) => {
        if (err){
            return res.status(400).send({
                message: getErrorMessage(err)});
        }else{
            res.json(event);
        }
    });
};

exports.list = function(req, res) {
    Event.find().sort('-created').populate('creator', 'firstName lastName fullName').exec((err, event) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(event);
        }
    });
};

exports.eventByID = function(req, res, next, id) {  
    Event.findById(id).populate('creator', 'firstName lastName fullName').exec((err, event) => {
        if (err) 
            return next(err);    
            if (!event) 
                return next(new Error('Failed to load article ' + id));
            req.event = event;    
            next();  
    }); 
};

exports.read = function(req, res) {  
    res.status(200).json(req.event); 
};

exports.update = function(req, res) {  
    const event = req.event;
    event.title = req.body.title;
    event.content = req.body.content;
    event.save((err) => {    
        if (err) {      
            return res.status(400).send({        
                message: getErrorMessage(err)      
            });    
        } else {      
            res.status(200).json(event);    
        }  
    }); 
};

exports.delete = function(req, res) { 
    const event = req.event;
    event.remove((err) => {
        if (err) {
            return res.status(400).send({
               message: getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

exports.hasAuthorization = function(req, res, next) {    
    if (req.event.creator.id !== req.user.id) {        
        return res.status(403).send({            
            message: 'User is not authorized'});    
        }
    next(); 
}; 
