import React, {Component} from 'react'
import Post from './Post'
import Nav from '../Nav'
import Header from '../Header'
import Footer from '../Footer'
import {getPosts, createPost} from './apiPost'
import {Redirect} from 'react-router-dom'

class Posts extends Component {

    constructor() {
        super();

        this.state = {
            posts: [],
			redirect: false,
        }
		
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
    }
	
	onSubmit(e) {
	  e.preventDefault();
	  createPost(this.postData)
	    .then(response => {
		  if (response.err) {
            this.setState({redirect: true});   
			return;
		  }

		  this.setState({posts: response.posts});
		});
	}
	
	onChangeFile(e) {
	  	this.postData.set('filedata', e.target.files[0]);
	}
	
	onChangeText(e) {
	  this.postData.set('description', e.target.value);
	}

    componentDidMount() {
	  this.postData = new FormData();
      getPosts()
        .then(response => {
            console.log(response);
            if (!response) {
                console.log('Can not get response');
                return;
            }

			if (response.err) {
				this.setState({redirect: true});
				return;
			} 
            
			console.log(response.posts);
            this.setState({posts: response.posts});
        })
    }

    render(){
      return (
        <div className="grid-container">
			{this.state.redirect ? <Redirect to="/Logination"/> : ''}
			<Header title={{name: "Посты"}}/>
			<Nav/>
			<article>
				<form action="create" encType="multipart/form-data" className="add-post-form">
					<input type="text" name="description" onChange={this.onChangeText}/><br/>
					<input type="file" name="filedata" onChange={this.onChangeFile} required/><br/>
					<input type="submit" value="Добавить" onClick={this.onSubmit}/>
				</form>
				{this.state.posts.map((post) => {return <div><Post post={post} key={post.postId}/></div>})}
			</article>
			<Footer />
        </div>
      );    
    }
}

export default Posts;