import React, {Component} from 'react'
import {getUsers} from './apiUser'
import User from './User'
import Nav from '../Nav'
import Header from '../Header'
import Footer from '../Footer'

class Users extends Component {
  	
  constructor() {
    super();
	this.state = {
	  users: []
	}
  }	  
  
  
  componentDidMount() {
    getUsers()
	  .then(response => {
		console.log(response);
	    this.setState({users: response.users});
	  })
  }
  
  render() {
	return (
      <div className="grid-container">
	    <Header title={{name: "Пользователи"}}/>
	    <Nav/>
	    <article>
			{this.state.users.map((user) => {return <User user={user} ket={user.userId}/>})}
		</article>
		<Footer/>
	  </div>
    );
  }
}

export default Users