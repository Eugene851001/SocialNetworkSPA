const User = require('../models/user');
const mongoose = require('mongoose');

const NEED_LOG_IN = 'You need to log in';

exports.editPhoto = function(request, response) {
  if (request.cookies === undefined || request.cookies.userId === undefined) {
    response.send(NEED_LOG_IN);
	return;
  }
  
  if (!request.file.filename) {
    response.send('Please, check the file');
	return;
  }
  
  User.updateOne({_id: request.cookies.userId}, {photo: request.file.filename}, function(err, result){
    if (err) {
	  console.log(err);
	  response.status(500).json({err: 'Error'});
	} else {
	  console.log(result);
	  User.find({_id: request.cookies.userId}, function(err, user){
		if (err) {
		  console.log('Error');
		  response.status(500).json({err: 'Error'});
		  return;
		}
		
		if (!user) {
		  console.log('User not found');
		  response.status(404).json({err: 'User not found'});
		  return;
		}
		
		console.log(user);
		response.json({photo: '../uploads/' + request.file.filename});
	  });
	}
  });
}

exports.getUser = function(request, response) {
  console.log('Getting user');
  console.log(request.params);
  let userId = request.params['userId'];
  if (userId === 'me') {
	  userId = request.cookies.userId;
  }
  User.findById(userId)
	.exec(function(err, user){
      if (err) {
	    console.log(err);
	    response.status(500).json({err: 'Error'});
	    return;
	  }
	
	  if (!user) {
	    response.status(404).json({err: 'Can not find user'});
	    return;
	  }
	
	  if (request.cookies === undefined && request.cookies.userId === undefined) {
	    response.status(401).json({err: NEED_LOG_IN });
	    return;
	  }
	
      let signed = user.followers.indexOf(mongoose.Types.ObjectId(request.cookies.userId)) != -1;
	  console.log(signed);
	  let myProfile = request.cookies.userId === userId;
	  response.json({
		myProfile: myProfile,
		signed: signed,
		photo: '../uploads/' + user.photo,
		name: user.name
	  });
  });
}

exports.showUsers = function(request, response) {
  User.find({}, function(err, users){
	if (err) {
	  console.log(err);
	  response.status(500).json({err: 'Error'});
	  return;
	}
	
	let usersToSend = users.map((user) => {
	  return {
	    name: user.name,
        photo: "uploads/" + user.photo,
        userId: user._id		
	  }
	});
	response.json({users: usersToSend});
  });
}

exports.getFollowing = function(request, response) {
  let userId = request.params['userId'];
  if (userId == 'me') {
    userId = request.cookies.userId;
  }

  console.log('Try get following');
  User.findOne({_id: userId}, function(err, user){
	if (err) {
	  console.log(err);
	  response.status(500).json();
	  return;
	}
	
    User.find({_id: { $in: user.following}}, function(err, users){
	  let usersToSend = users.map((user) => {
	    return {
		  name: user.name,
		  photo: "../uploads/" + user.photo,
		  userId: user._id
		}
	  });
      console.log(usersToSend);
	  response.json({users: usersToSend});   
	});
  });
}

exports.getFollowers = function(request, response) {
  let userId = request.params['userId'];  
  if (userId == 'me') {
    userId = request.cookies.userId;
  }

  console.log('Try get followers');
  console.log(request);
  User.findById(userId, function(err, user){
	if (!user) {
		response.status(404).json({err: 'User not found'});
		return;
	}

    User.find({_id: { $in: user.followers}}, function(err, users){
	  let usersToSend = users.map((user) => {
	    return {
		  name: user.name,
		  photo: "../uploads/" + user.photo,
		  userId: user._id
		}
	  });
	  console.log(usersToSend);
	  response.json({users: usersToSend});
	});
  });
}

exports.addFollowing = function(request, response) {

  let userId = request.body.userId;
  
  User.findOne({_id: request.cookies.userId}, function(err, user){
    if (err) {
	  console.log(err);
	  response.status(500).json();
	  return;
	}
	
	if (!user) {
	  response.send(404).json('Not found');
	  return;
	}
	
	if (user.following.indexOf(mongoose.Types.ObjectId(userId)) != -1) {
	  response.status(400).json({err: 'Already follow'});
	  return;
	}
	
	let following = user.following;
	console.log(userId);
	following.push(userId);
	User.findOneAndUpdate({_id: request.cookies.userId}, {following: following}, {new: true}, function(err, user){
	  if (err) {
	    console.log(err);
		response.status(500).json();
		return;
	  }
	  
	  response.json({follow: true});
	});
  });
}

exports.removeFollowing = function(request, response) {
  if (!request?.cookies.userId) {
    response.status(401).json({err: NEED_LOG_IN});
	return;
  }

  let userId = request.body.userId;
  User.findByIdAndUpdate(request.cookies.userId, {$pull: {following: userId}}, {new: true})
    .exec(function(err, user){
	  response.json({follow: false});
	});  
}

exports.addFollower = function(request, response, next) {
  if (!request?.cookies.userId) {
    response.status(401).json({err: NEED_LOG_IN});
	return;
  }
  
  let userId = request.body.userId;
  User.findByIdAndUpdate(userId, {$push: {followers: request.cookies.userId}})
    .exec(function(err, user){
	  if (err) {
	    console.log(err);
	    response.status(500).send();
		return;
	  }
	  
	  next();
	});
}

exports.removeFollower = function(request, response, next) {
  if (!request?.cookies.userId) {
    response.status(401).send();
	return;
  }
  
  let userId = request.body.userId;
  User.findByIdAndUpdate(userId, {$pull: {followers: request.cookies.userId}})
    .exec(function(err, user){
	  if (err) {
	    console.log(err);
		response.status(500).send();
		return;
	  }
	  
	  next();
	});
}
