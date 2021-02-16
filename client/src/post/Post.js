import React, {Component} from 'react'
import {likePost, unlikePost, deletePost} from './apiPost'
import Cookies from 'js-cookie'

class Post extends Component {

  constructor(props) {
	console.log(props);
    super();
	this.state = {
	  postId: props.post.postId,
	  authorName: props.post.authorName,
	  authorId: props.post.authorId,
	  description: props.post.description,
	  date: props.post.date,
	  photo: props.post.photo,
	  likes: props.post.likes,
	  like: props.post.like,
	  redirect: false,
	}
	
	this.onLike = this.onLike.bind(this);
	this.onUnlike = this.onUnlike.bind(this);
	this.onDelete = this.onDelete.bind(this);
  }
  
  onLike(e) {
    e.preventDefault();
	
	if (this.state.like) {
	  return;
	}
	
	likePost(this.state.postId)
	  .then(response => {
	    this.setState({
		  likes: response.likes,
		  like: response.like,
		});
	  });
  }

  onUnlike(e) {
    e.preventDefault();

	if (!this.state.like) {
		return;
	}

	unlikePost(this.state.postId)
	  .then(response => {
		  this.setState({
			  likes: response.likes,
			  like: response.like
		  })
	  });
  }

  onDelete(e) {
    e.preventDefault();
    
    deletePost(this.state.postId)
	  .then(() => {
	    this.setState({redirect: true});
	  })
  }
  
  render() {
	let userId = Cookies.get('userId').split('"')[1];
	let {authorName, description, date, likes, photo} = this.state;
	const buttonLike = <button className="button-like" onClick={this.onLike}>Likes {likes}</button>;
	const buttonUnlike = <button className="button-unlike" onClick={this.onUnlike}>Likes {likes}</button>;
	const buttonDelete = <button onClick={this.onDelete}>Удалить</button>;
	let objDate = new Date(date);
	const body = <div className="post">
					<p><h3>{authorName}</h3></p>
					<p>{description}</p>
					<p>{`${objDate.getDate()}-${objDate.getMonth() + 1}-${objDate.getFullYear()}`}</p>
					<img className ="post-image" src={photo} width="480" height="320" />
					<p>
						{this.state.like ? buttonUnlike : buttonLike}
						{userId == this.state.authorId ? buttonDelete : ''}
					</p>
				</div>;
    return (
      <div>
		  {this.state.redirect ? '' : body}
	  </div>
    );
  }
  
}

export default Post;