function getToken(username, password){
  axios.post('http://localhost:8000/api/members/auth-token',{
  username: username,
  password: password,
})
.then(function(response){
  var token = response.data.token;
  // console.log(token);
  // 성공시 쿠키에 토큰 넣어놓겠다.
  setCookie('token',token,10);
})
.catch(function (error){
  console.log(error);
});
}

function authTest() {
  axios({
    method: 'get',
    url: 'http://localhost:8000/api/members/auth-test',
    headers: {
      'Authorization': 'Token ' + getCookie('token')
    }
  })
  .then(function (response){
    console.log(response);
  })
  .catch(function(error){
    console.log(error);
  })
}
