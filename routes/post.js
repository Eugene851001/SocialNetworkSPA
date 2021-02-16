const express = require('express');
const post = require('../controllers/post');

const postRouter = express.Router();

postRouter.post('/create', function(request, response){
  post.createPost(request, response);
})

postRouter.get('/posts', function(request, response){
  post.showPosts(request, response);
})

postRouter.put('/like', function(request, response){
  post.like(request, response);
});

postRouter.put('/unlike', function(request, response) {
  post.unlike(request, response);
});

postRouter.delete('/:postId/delete', function(request, response) {
  post.delete(request, response);
})

module.exports = postRouter;