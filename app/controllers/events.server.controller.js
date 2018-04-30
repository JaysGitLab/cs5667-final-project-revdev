const Event = require('mongoose').model('Event');

function getErrorMessage(err) {
  let message = '';

  if (err.code) {
    switch (err.code) {
        case 11000:
        case 11001: 
          message = 'Event already exists';
          break;
        default: 
          message = 'Something went wrong';
     }
   } else {
     for (var errName in err.errors) {
       if (err.errors[errName].message) {
         message = err.errors[errName].message;
       }
     }
   }
   return message;
};

exports.createEvent = function(req, res) {
    const event = new Event(req.body);
    event.creator = req.user;
    event.save((err) => {
        if (err) {
            req.flash('error', getErrorMessage(err));
			return res.redirect('/createEvent');
        } else {
            req.flash('info', 'Event Created');
			return res.redirect('/');
        }
    });
};

exports.listEvents = function(req, res) {
    Event.find().sort('-created').populate('creator', 'firstName lastName fullName').exec((err, event) => {
        if (err) {
            req.flash('error', getErrorMessage(err));
			return res.redirect('/createEvent');
        } else {
            req.flash('info', 'Event lsit requested');
			return res.redirect('/');
        }
    });
};

exports.eventByID = function(req, res, next, id) {  
    Event.findById(id).populate('creator', 'firstName lastName fullName').exec((err, event) => {
        if (err) 
            return next(err);    
            if (!event) 
                return next(new Error('Failed to load event ' + id));
            req.event = event;    
            next();  
    }); 
};

exports.read = function(req, res) {  
    req.flash('info', 'Event Read');
	return res.redirect('/'); 
};

exports.updateEvents = function(req, res) {  
    const event = req.event;
    event.title = req.body.title;
    event.content = req.body.content;
    event.save((err) => {    
        if (err) {      
            req.flash('error', getErrorMessage(err));
			return res.redirect('/createEvent');    
        } else {      
            req.flash('info', 'Event updated');
			return res.redirect('/');    
        }  
    }); 
};

exports.deleteEvent = function(req, res) { 
    const event = req.event;
    event.remove((err) => {
        if (err) {
            req.flash('error', getErrorMessage(err));
			return res.redirect('/createEvent');
        } else {
            req.flash('info', 'Event deleted');
			return res.redirect('/');
        }
    });
};

exports.hasAuthorization = function(req, res, next) {    
    if (req.event.creator.id !== req.user.id) {                   
        req.flash('error', 'User is not authorized');    
        return res.redirect('/createEvent');
    next(); 
};

exports.renderEvent = function(req, res) {
	if (req.user) {
		if (err) {
			res.redirect('/');
		}
		res.render('eventCreate',{
			title: 'Create an Event',
			user: req.user,
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
}; 
