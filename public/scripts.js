//Get file ID if on register page
if (document.getElementById('file')) {
  let file = document.getElementById('file');
  let avatar = document.getElementById('avatar');

  file.addEventListener('change', (e) => {
    avatar.src = URL.createObjectURL(e.target.files[0]);
  });
}

//Remove cookie
function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
}
function deleteCookie(name) {
  setCookie(name, '', -1);
}

//function redirect
function Redirect() {
  window.location = `${window.location.origin}/loader/index`;
}

//Will work only on login page where logout button exists
if (document.getElementById('logout')) {
  let logout = document.getElementById('logout');

  logout.addEventListener('click', (e) => {
    e.preventDefault();
    deleteCookie('x-auth-token');

    //Redirect to landing page
    Redirect();
  });
}
