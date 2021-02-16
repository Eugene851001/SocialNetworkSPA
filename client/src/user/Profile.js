import React, {Component} from 'react'
import {getUser, editPhoto, follow, unfollow} from './apiUser'
import Nav from '../Nav'
import Header from '../Header'
import Footer from '../Footer'
import {Link} from 'react-router-dom'

class Profile extends Component {

  constructor() {
    super();
    this.state = {
      myPage: false,
      follow: false,
      photo: '',
      name: '',
	  photoToSend: undefined
    };
	
	this.onEditPhoto = this.onEditPhoto.bind(this);
	this.onSubmit = this.onSubmit.bind(this);
	this.onFollow = this.onFollow.bind(this);
	this.onUnfollow = this.onUnfollow.bind(this);
  }

  componentDidMount() {
	this.postData = new FormData();
	let userId = this.props.match.params.userId;
	this.state.userId = userId;
    getUser(userId)
      .then(response => {
        this.setState({
          myPage: response.myProfile, 
          follow: response.signed,
          photo: response.photo, 
          name: response.name
        })
      });
  }
  
  onEditPhoto(e) {
	this.postData.set('filedata', e.target.files[0]);
	this.setState({photoToSend: e.target.files[0]});
  }
  
  onSubmit(e) {
    e.preventDefault();
	editPhoto(this.postData)
	  .then(response => {
	    this.setState({photo: response.photo});
	  });
  }
  
  onFollow(e) {
    e.preventDefault();
	
	follow(this.state.userId)
	  .then(response => {
		console.log(response);
	    this.setState({follow: response.follow});
	  });
  }
  
  onUnfollow(e) {
    e.preventDefault();
	
	unfollow(this.state.userId)
	  .then(response => {
	    this.setState({follow: response.follow});
	  })
  }

  render() {
    const editPhotoForm = <div>
            <form action="editPhoto" encType="multipart/form-data">
              <input type="file" name="filedata" onChange={this.onEditPhoto} required/><br/>
              <input type="submit" value="Изменить" onClick={this.onSubmit}/>
            </form>
          </div>;
    const followButton = <p><button onClick={this.onFollow}>Подписаться</button></p>
	  const unfollowButton = <p><button onClick={this.onUnfollow}>Отписаться</button></p>
    return (
      <div className="grid-container">
		<Header title={{name: "Профиль"}}/>
	    <Nav userId="0"/>
		<article>
			<img src={this.state.photo} width="320" height="240"/><br></br>
			{this.state.myPage ? editPhotoForm : ''}<br></br>
			{this.state.myPage || this.state.follow ? '' : followButton }
			{this.state.myPage || !this.state.follow ? '' : unfollowButton} 
      <table>
        <tr>
          <td><Link to={`/Following/${this.state.userId}`}>Подписки</Link></td>
          <td><Link to={`/Followers/${this.state.userId}`}>Подписчики</Link></td>
        </tr>
      </table>
			<h2>{this.state.name}</h2>
		</article>
		<Footer />
      </div>
    );
  }
}

export default Profile;