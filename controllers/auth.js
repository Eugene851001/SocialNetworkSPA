const NOT_READY = 'Not ready';
const User = require('../models/user');

exports.signout = (request, response) => {
  response.clearCookie('userId');
  response.json();
}

exports.postSignup = (request, response) => {
  console.log(request.body);
  User.findOne({login: request.body.login}, function(err, user) {
      if (err) {
	    console.log(err);
		response.status(500).json({err: 'Error'});
		return;
	  }
	  
	  if (user) {
	    response.status(401).json({err: 'Please, choose another login'});
		return;
	  }
	  
	  user = new User(request.body);
      user.save(function(err){
      if (err) {
	    console.log(err);
	    response.status(500).json({err: 'Can not registrate'});
	  } else {
        response.cookie('userId', user._id);
		response.json({userId: user._id});
	  }
    }); 
  });
}

exports.postSignin = (request, response) => {
  let {login, password} = request.body;
  User.findOne({login, password}, function(err, user){
    if (err || !user) {
	  console.log('User not found');
	  response.status(501).json({err: 'User not found'});
	} else {
	  response.cookie('userId', user._id);
      response.status(200).json({user: user});
	}
  });
};