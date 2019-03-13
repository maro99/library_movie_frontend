
      var username = ""
      var password = ""
      var phone_number = ""
      var email = ""

      var token = getCookie('token');
      // var change_password_token ="";


      //  해당 자바 스크립트 파일 호출한 html 문서 명으로 케이스 분류해서 함수 재사용 하겠다.
      var path = window.location.pathname;
      var page = path.split("/").pop();
      alert(page);

      // 호출한 html문서명 따라 변수값들 지정.
      var pre_insert_value = ""
      var button_letter = ""
      var url_part = ""
      var input_type = ""

      if (page=="my_page_info_password_change.html"){
        pre_insert_value = "****"
        button_letter = "인증 메일 전송"
        h5_letter = "새 비밀번호"
        url_part = "password-change"
        input_type = "password"

      } else if(page=="my_page_info_email_change.html"){
        pre_insert_value = "example@google.com"
        button_letter = "인증 메일 전송"
        h5_letter = "새 이메일"
        url_part = "email-change"
        input_type = "email"

      } else if(page=="my_page_info_phonenumber_change.html"){
        pre_insert_value = "01011112222"
        button_letter = "인증 문자 전송"
        h5_letter = "새 휴대전화번호"
        url_part = "phone-number-change"
        input_type = "phone_number"
      }


      // 최초 html 랜더해주는 코드
      axios({
          method: 'get'
          ,url: 'http://localhost:8000/api/members/auth-test'
          // ,async:false
          ,headers: {
            'Authorization': 'Token ' + token
          }
        })
        .then(function (response) {

          // alert(JSON.stringify(response.data))
          var curElement = `<div>
                              <h5>${h5_letter}</h5>
                              <form id ="insert_info" name = "info_form">
                                <input id = "info_input" type=${input_type} name = "info" value=${pre_insert_value}>
                                <button type="submit" class="btn btn-primary" onclick="info_change(event)" >${button_letter} </button>
                              </form>
                            </div>


                          <div>
                              <h5>인증번호</h5>
                              <form id = "send_auth_code" name = "auth_code_form">
                                  <input id = "auth_code_input" type="send_number" name = "send_number"  >
                                  <button type="submit" class="btn btn-primary" onclick="send_auth_code(event)" >인증번호 인증 </button>
                              </form>
                          </div>`


          $('.info_change').append(curElement);

        })
        .catch(function (error) {

        });


        // 정보 수정 요청 보내는 함수 (이함수는 변수값만 바꿔 할당해서 재사용)
        function info_change(e){
          alert("정보 변경 요청 함수 호출 ");

          // html에 렌더된 input 에 입력된 정보 가져옴
          var info_input = document.getElementById('info_input').value;
          var data_input = {}

          // post요청 보낼때 같이 보낼 data생성.
          if (input_type=="password"){
            data_input = { password:info_input, password2:info_input }
          } else if(input_type=="email"){
            data_input = { email:info_input }
          } else if(input_type=="phone_number"){
            data_input = { phone_number:info_input }
          }

          if(token){
            var headers = {};
            headers["Authorization"] = "Token " + token;
           e.preventDefault();
           $.ajax({
             type: "POST"
            ,url: "http://localhost:8000/api/members/user-info-change-page/"+url_part
            // ,async:false
            ,data:data_input
            ,dataType: "json"
            ,headers : headers
            ,success: function(response){ // 통신 성공시 - 동적으로 좋아요 갯수 변경, 유저 목록 변경
                    alert("정보 변경 요청 보내짐");

                // 정상적으로 전달 됬으면
                  var return_message = JSON.stringify(response.detail)
                  alert(return_message);
                // change_info_token 토큰 을 쿠키로 저장
                  var change_info_token =""

                  // input종류따라 토큰이름 다르게 반환되서 이런식으로 저장.
                  if (input_type=="password"){
                    change_info_token = JSON.stringify(response.change_password_token)
                  } else if(input_type=="email"){
                    change_info_token = JSON.stringify(response.change_email_token)
                  } else if(input_type=="phone_number"){
                    change_info_token = JSON.stringify(response.change_phone_number_token)
                  }





                  setCookie('change_info_token',change_info_token,1);
                  alert(return_message);
              }

             ,error: function(response){
                alert("정보 변경 요청 실패");
                // 정상적으로 전달안됬으면 애러 출력
                var return_message = ""

                // input종류따라 정보 응답 받는 애러정보 변수 달라서 이렇게 판별
                if (input_type=="password"){
                  return_message = JSON.stringify(response.responseJSON.password)
                } else if(input_type=="email"){
                  return_message = JSON.stringify(response)
                } else if(input_type=="phone_number"){
                  return_message = JSON.stringify(response)
                }

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

          var info_input = document.getElementById('info_input').value;
          var auth_code_input = document.getElementById('auth_code_input').value;
          var change_info_token = getCookie('change_info_token').replace(/"/gi, '')
          var data_input  ={}

          // patch요청 보낼때 같이 보낼 data생성.
          if (input_type=="password"){
            data_input = { password:info_input, password2:info_input, change_password_token:change_info_token, random_number:auth_code_input}
          } else if(input_type=="email"){
            data_input = { email:info_input, change_email_token:change_info_token, random_number:auth_code_input  }
          } else if(input_type=="phone_number"){
            data_input = { phone_number:info_input, change_phone_number_token:change_info_token, random_number:auth_code_input }
          }

          if(token){
            var headers = {};
            headers["Authorization"] = "Token " + token;
           e.preventDefault();
           $.ajax({
             type: "PATCH"
            ,url: "http://localhost:8000/api/members/user-info-change-page/" + url_part
            // ,async:false
            ,data:data_input
            ,dataType: "json"
            ,headers : headers
            ,success: function(response){ // 통신 성공시 - 동적으로 좋아요 갯수 변경, 유저 목록 변경
                    alert("인증번호 인증 요청 보내짐.");

                // 정상적으로 전달 됬으면
                  var return_message = JSON.stringify(response.detail)
                  alert(return_message);

                // change_password_token 토큰 을 쿠키에서 삭제
                  deleteCookie('change_info_token')
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
