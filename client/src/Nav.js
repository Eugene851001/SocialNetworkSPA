import React from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

function Nav() {
  const userId = Cookies.get('userId').split('"')[1];
  const profileLink = <h2><Link to={"/Profile/" + userId}>Профиль</Link></h2>
  return (
    <nav>
	  {userId ? profileLink: ''}
	  <h2><Link to="/Users">Пользователи</Link></h2>
	  <h2><Link to="/Posts">Посты</Link></h2>
	  <h2><Link to="/">Выйти</Link></h2>
	</nav>
  );
}

export default Nav;