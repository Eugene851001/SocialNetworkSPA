
export const getPosts = (user) => {
  return fetch('/post/posts')
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));      
}

export const createPost = (post) => {
  return fetch('/post/create', {
	  method: 'POST',
	  headers: {
	    Accept: 'application/json',
	  },
	  body: post
  }).then(response => response.json());
}

export const likePost = (postId) => {
  return fetch('/post/like', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({postId: postId})
  }).then(response => response.json());
}

export const unlikePost = (postId) => {
  return fetch('/post/unlike', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({postId: postId})
  }).then(response => response.json());
}

export const deletePost = (postId) => {
  return fetch(`/post/${postId}/delete`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}