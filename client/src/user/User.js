import React from 'react'
import {Link} from 'react-router-dom'

function User(user) {
  return (
    <div>
	  <img src={user.user.photo} width="32" height="32"/>
	  <Link to={"/Profile/" + user.user.userId}>{user.user.name}</Link>
	</div>
  );
}

export default User;