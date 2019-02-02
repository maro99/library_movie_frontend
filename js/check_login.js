// 로긴상태 먼저 확인
//(이거 하면 요청 오고가는데 시간 걸려셔 is_true전환전에 화면페이지 띄울지 판별해서 오류생기는듯.)
var token = getCookie('token');
if (token) {
  // User정보는 Profile API에서 받아옴
  axios({
    method: 'get',
    url: 'http://localhost:8000/api/members/auth-test',
    headers: {
      'Authorization': 'Token ' + getCookie('token')
    }
  })
  .then(function (response) {
  })
  .catch(function (error) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login_page.html';
  });
}
else{
  alert('로그인이 필요합니다.');
  window.location.href = 'login_page.html';
}
