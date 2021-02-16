const NOT_READY = 'Not ready';
const NEED_LOG_IN = 'You need to log in';

const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = function(request, response) {
  let date = new Date();
  if (request.cookies === undefined) {
	console.log('No cookies');
    response.status(401).json({err: NEED_LOG_IN});
	return;
  }

  let userId = request.cookies.userId;
  if (userId === undefined) {
    console.log('No userId cookie');  
    response.status(401).json({err: NEED_LOG_IN});
	return;
  }
 
  if (request.file == undefined || request.file.filename === undefined) {
    response.status(400).json({err: 'Please, check the file'});
	return;
  }
  
  let post = new Post({
    date: date,
	description: request.body.description, 
    author: userId, 
    image: request.file.filename
  });
  
  post.save(function(err) {
    if (err) {
	  console.log(err);
	  response.status(500).json({err: 'Error'});
	} else {
	  showPosts(request, response);
	}
  });
}

exports.delete = function(request, response) {
  let postId = request.params['postId'];
  
  if (!request.cookies || !request.cookies.userId) {
    response.status(401).json({err: NEED_LOG_IN});
  }

  console.log(postId);
  Post.findOne({_id: postId})
    .populate('author')
	.exec(function(err, post){
	  if (err) {
		  console.log(err);
		  response.status(500).json();
		  return;
	  }

	  if (!post) {
		  console.log('Can not find post');
		  response.status(404).json({err: 'Post not found'});
		  return;
	  }
      
	  console.log(post.author);
	  if (post.author._id != request.cookies.userId) {
		console.log(`${post.author._id}-${request.cookies.userId}`);
        response.status(400).json({err: 'This is not your post'});
	    return;
	  }

      Post.deleteOne({_id: postId}, function(err, result) {
		  if (err) {
			  console.log(err);
			  response.status(500).json();
			  return;
		  }

		  console.log(result);
		  showPosts(request, response);
	  })
  })
}

exports.like = function(request, response) {
  console.log('Try to set like');
  if (request.cookies === undefined || request.cookies.userId === undefined) {
    response.send(NEED_LOG_IN);
	return;
  }
  
  console.log(request.body);
  let postId = request.body.postId;
  Post.findOne({_id: postId}, function(err, post){
    if (err || !post) {
	  response.status(404).json({err: 'Post bot found'});
	  return;
	}
	
	for (let i = 0; i < post.likes.length; i++) {
	  if (post.likes[i] == request.cookies.userId) {
	    response.status(400).json({err: 'You already liked'});
        return;
	  }		  
	}
	
	post.likes.push(request.cookies.userId);
	console.log(post.likes.length);
	Post.findOneAndUpdate({_id: postId}, {likes: post.likes}, {new: true}, function(err, post){
	  if (err) {
	    console.log(err);
	  } else {
	    console.log(post);
	  }
	  let postToSend = {
		  postId: post._id,
		  authorName: post.authorName,
		  description: post.description,
		  date: post.date,
		  photo: "uploads/" + post.image,
		  likes: post.likes.length,
		  like: post.likes.indexOf(request.cookies.userId) != -1  
		};
	  response.json(postToSend);
	});
  });
}

exports.unlike = function(request, response) {

	if (request.cookies === undefined || request.cookies.userId === undefined) {
		response.status(401).json({err: NEED_LOG_IN});
		return;
	}

	let postId = request.body.postId;
	
	Post.findById(postId, function(err, post){
		if (err) {
			console.log(err);
			response.status(500).send();
			return;
		}
 
        if (post.likes.indexOf(request.cookies.userId) === -1) {
          response.status(401).json({err: 'You did not liked this post'});
		  return;
		}       
		
		let likes = post.likes;
		likes.splice(likes.indexOf(request.cookies.userId), 1);
		Post.findOneAndUpdate({_id: postId}, {likes: likes}, {new: true}, function(err, post){
			if (err) {
				console.log(err);
				response.status(500).json();
				return;
			}
			
			let postToSend = {
				postId: post._id,
				authorName: post.authorName,
				description: post.description,
				date: post.date,
				photo: "uploads/" + post.image,
				likes: post.likes.length,
				like: post.likes.indexOf(request.cookies.userId) != -1  
			}
			response.json(postToSend);
		})
	});
}

function showPosts(request, response) {
  console.log('Try to get posts');
  if (!request.cookies?.userId) {
    response.status(401).send(NEED_LOG_IN);
	return;
  }
  
  User.findById(request.cookies.userId, function(err, user){
    if (err) {
	  console.log(err);
	  response.status(500).json('Error');
	  return;
	}
	
	user.following.push(request.cookies.userId);
	Post.find({author: { $in: user.following}}).
	  populate('author').
	  sort({date: -1}).
	  exec(function(err, posts){
	    if (err) {
	      console.log(err);
	      response.status(500).json({err: 'Error'});
        } else {
		  let postsToSend = posts.map( post => {
			  return {
				  postId: post._id,
				  authorName: post.author.name,
				  authorId: post.author._id,
				  description: post.description,
				  date: post.date,
				  photo: 'uploads/' + post.image,
				  likes: post.likes.length,
				  like: post.likes.indexOf(request.cookies.userId) != -1
				}
		  })
		  console.log(postsToSend);
		  response.json({posts: postsToSend});
	    }
	  });
  });  
}

exports.showPosts = function(request, response) {
  showPosts(request, response);
}