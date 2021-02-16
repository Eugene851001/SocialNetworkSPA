
export const signin = (user) => {
  return fetch('/signin', {
    method: 'POST',
	headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
	body: JSON.stringify(user)
  }).then(res => res.json())
  .catch(err => console.log(err));
}

export const signup = (user) => {
  return fetch('/signup', {
    method: 'POST',
    headers: {
      headers: 'Application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then(res => res.json())
  .catch(err => console.log(err));
}