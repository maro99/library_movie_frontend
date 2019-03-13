
      // 최초 html 랜더해주는 코드
      var username = ""
      var password = ""
      var phone_number = ""
      var email = ""

      var token = getCookie('token');
      // var change_password_token ="";

      axios({
          method: 'get'
          ,url: 'http://localhost:8000/api/members/auth-test'
          // ,async:false
          ,headers: {
            'Authorization': 'Token ' + token
          }
        })
        .then(function (response) {

          if(response.data.password){
            password = response.data.password
          }

          // alert(JSON.stringify(response.data))
          var curElement = `<div>
                              <h5>새 비밀번호</h5>
                              <form id ="insert_password" name = "password_form">
                                <input id = "password_input" type="password" name = "password" value="****">
                                <button type="submit" class="btn btn-primary" onclick="password_change(event)" >인증 메일 전송 </button>
                              </form>
                            </div>


                          <div>
                              <h5>인증번호</h5>
                              <form id = "send_auth_code" name = "auth_code_form">
                                  <input id = "auth_code_input" type="send_number" name = "send_number"  >
                                  <button type="submit" class="btn btn-primary" onclick="send_auth_code(event)" >인증번호 인증 </button>
                              </form>
                          </div>`


          $('.password_change').append(curElement);

        })
        .catch(function (error) {

        });

        // 패스워드 수정 요청 보내는 함수
        function password_change(e){
          alert("비번 변경 요청 함수 호출 ");

          var password_input = document.getElementById('password_input').value;

          if(token){
            var headers = {};
            headers["Authorization"] = "Token " + token;
           e.preventDefault();
           $.ajax({
             type: "POST"
            ,url: "http://localhost:8000/api/members/user-info-change-page/password-change"
            // ,async:false
            ,data:{ password:password_input, password2:password_input }
            ,dataType: "json"
            ,headers : headers
            ,success: function(response){ // 통신 성공시 - 동적으로 좋아요 갯수 변경, 유저 목록 변경
                    alert("비번 변경 요청 보내짐");

                // 정상적으로 전달 됬으면
                  var return_message = JSON.stringify(response.detail)
                  alert(return_message);
                // change_password_token 토큰 을 쿠키로 저장
                  change_password_token = JSON.stringify(response.change_password_token)
                  setCookie('change_password_token',change_password_token,1);




              }

             ,error: function(response){
                alert("비번 변경 요청 실패");
                // 정상적으로 전달안됬으면 애러 출력
                var return_message = JSON.stringify(response.responseJSON.password)
                alert(return_message);
            },
            complete: function (response) {

              },
            });
          }
          else{
            e.preventDefault();
              alert(` 로그인이 필요합니다.`)
            window.location.href = 'login_page.html';
          }
        }



        // 인증번호 인증 보내는 함수
        function send_auth_code(e){
          alert("인증번호 인증 요청 함수 호출됨.");

          var password_input = document.getElementById('password_input').value;
          var auth_code_input = document.getElementById('auth_code_input').value;
          var change_password_token = getCookie('change_password_token').replace(/"/gi, '')

          if (change_password_token){
            alert(typeof change_password_token );
            }

          if(token){
            var headers = {};
            headers["Authorization"] = "Token " + token;
           e.preventDefault();
           $.ajax({
             type: "PATCH"
            ,url: "http://localhost:8000/api/members/user-info-change-page/password-change"
            // ,async:false
            ,data:{ password:password_input, password2:password_input, change_password_token:change_password_token, random_number:auth_code_input}
            ,dataType: "json"
            ,headers : headers
            ,success: function(response){ // 통신 성공시 - 동적으로 좋아요 갯수 변경, 유저 목록 변경
                    alert("인증번호 인증 요청 보내짐.");

                // 정상적으로 전달 됬으면
                  var return_message = JSON.stringify(response.detail)
                  alert(return_message);

                // change_password_token 토큰 을 쿠키에서 삭제
                  deleteCookie('change_password_token')
                  window.location.href = 'my_page_info_chage_page.html';
              }

             ,error: function(response){
                alert("인증번호 인증 요청 실패");
                // 정상적으로 전달안됬으면 애러 출력
                var return_message = JSON.stringify(response)
                alert(return_message);
            },
            complete: function (response) {

              },
            });
          }
          else{
            e.preventDefault();
              alert(` 로그인이 필요합니다.`)
            window.location.href = 'login_page.html';
          }
        }
