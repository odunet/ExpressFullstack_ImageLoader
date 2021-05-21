//Get file ID if on register page
if (document.getElementById('file')) {
  let file = document.getElementById('file');
  let avatar = document.getElementById('avatar');

  file.addEventListener('change', (e) => {
    avatar.src = URL.createObjectURL(e.target.files[0]);
  });
}

/*
A function to remove cookie [Not Implemented in application]
function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
}
function deleteCookie(name) {
  setCookie(name, '', -1);
}
*/

/*
Function to redirect to specified page
function Redirect() {
  window.location = `${window.location.origin}/loader/index`;
}
*/

//Will work on admin page - To get user's list
async function getUser(url) {
  try {
    let data = await fetch(url);
    let response = await data.json();
    return response.data;
  } catch (err) {
    throw err;
  }
}
if (document.getElementById('viewUser')) {
  let viewUser = document.getElementById('viewUser');
  let loading = document.getElementById('loading');
  let userList = document.getElementById('userList');
  viewUser.addEventListener('click', async () => {
    try {
      loading.style.display = '';
      let data = await getUser(
        `${window.location.origin}/loader/auth/userList`
      );
      loading.style.display = 'none';
      let ul = document.createElement('ul');
      ul.innerHTML = '';
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          let li = document.createElement('li');
          li.innerHTML = `User ${i + 1} is ${data[i].firstName} ${
            data[i].lastName
          }, with Username: <strong>${data[i].userName}</strong>`;
          ul.appendChild(li);
        }
        userList.innerHTML = '';
        userList.style.display = '';
        userList.appendChild(ul);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

//Submitting login form
if (document.getElementById('submitLogin')) {
  let usr = document.getElementById('usr');
  let pwd = document.getElementById('pwd');
  let submitLogin = document.getElementById('submitLogin');
  submitLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`loader/../auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          userName: usr.value,
          password: pwd.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //Store token in local storage || server also stores this in cookie
      if (response.headers.get('x-auth-token')) {
        localStorage.setItem(
          'x-auth-token',
          response.headers.get('x-auth-token')
        );
      }

      let result = await response.json();
      console.log(result);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });
}
