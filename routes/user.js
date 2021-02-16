const express = require('express');
const user = require('../controllers/user');

const userRouter = express.Router();

userRouter.put('/editPhoto', function(request, response){
  user.editPhoto(request, response);
});

userRouter.get('/users', function(request, response){
  user.showUsers(request, response);
});

userRouter.put('/follow', user.addFollower, user.addFollowing);

userRouter.put('/unfollow', user.removeFollower, user.removeFollowing);

userRouter.get('/:userId/following', function(request, response){
  user.getFollowing(request, response);
});

userRouter.get('/:userId/followers', function(request, response){
  user.getFollowers(request, response);
});

userRouter.get('/:userId', function(request, response){
  user.getUser(request, response);
});

module.exports = userRouter;