function validate() {
       var re = /^[a-zA-Z0-9]{4,12}$/; // 아이디와 패스워드가 적합한지 검사할 정규식
       var re2 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;// 이메일이 적합한지 검사할 정규식
       var re3= /^[0-9]*$/;// 이메일이 적합한지 검사할 정규식


       var username = document.getElementById("username")
       var password = document.getElementById("password")
       var password2 = document.getElementById("password2")
       var email = document.getElementById("email")
       var phone_number = document.getElementById("phone_number")


       // ajax 로 요청 보내기 위해 .value값으로 다시 받아봄.
       var username_re = document.getElementById("username").value;
       var password_re = document.getElementById("password").value;
       var password2_re = document.getElementById("password2").value;
       var email_re = document.getElementById("email").value;
       var phone_number_re = document.getElementById("phone_number").value;


       // ------------ 이메일 까지 -----------

       if(!check(re,username,"아이디는 4~12자의 영문 대소문자와 숫자로만 입력")) {
           return false;
       }

       if(!check(re,password,"패스워드는 4~12자의 영문 대소문자와 숫자로만 입력")) {
           return false;
       }

       if(join.password.value != join.password2.value) {
           alert("비밀번호가 다릅니다. 다시 확인해 주세요.");
           join.password2.value = "";
           join.password2.focus();
           return false;
       }

       if(email.value=="") {
           alert("이메일을 입력해 주세요");
           email.focus();
           return false;
       }

       if(!check(re2, email, "적합하지 않은 이메일 형식입니다.")) {
           return false;
       }

       if(phone_number.value=="") {
           alert("핸드폰 번호를 입력해 주세요 ");
           phone_number.focus();
           return false;
       }

       if(!check(re3, phone_number, "적합하지 않은 핸드폰 번호 형식입니다. - 없이 숫자만 입력해 주세요")){
           return false;
       }


            var bool = false;
            var message = ""

            $.ajax({
                url: root_address + "/api/members/signup-server-test", // 클라이언트가 요청을 보낼 서버의 URL 주소
                data: {
                          username:username_re,
                          email:email_re,
                          password:password_re,
                          password2:password2_re,
                          phone_number:phone_number_re
                          },                // HTTP 요청과 함께 서버로 보낼 데이터
                async:false,
                type: "POST",                             // HTTP 요청 방식(GET, POST)
                dataType: "json" ,                        // 서버에서 보내줄 데이터의 타입

                success: function (data) {
                    bool=true
                },
                error: function (data) {
                    bool = false;

                      if (data.responseJSON.username)
                        alert("아이디: " + JSON.stringify(data.responseJSON.username[0]));

                      if (data.responseJSON.email)
                        alert("email: " + JSON.stringify(data.responseJSON.email[0]));

                      if (data.responseJSON.phone_number)
                        alert("phone_number: " + JSON.stringify(data.responseJSON.phone_number[0]));
                      else
                        alert(JSON.stringify(data.responseJSON));
                        console.log(JSON.stringify(data.responseJSON));
                        console.log(data.responseJSON)

                },

            })

              return bool;

   //      });
   //  });
   }

   function check(re, what, message) {
       if(re.test(what.value)) {
           return true;
       }
       alert(message);
       what.value = "";
       what.focus();
       //return false;
   }





// 이하에서는 form의 submit버튼 누르면 일어나는 동작 ~ validate()호출 및 post 하는것 작성 하겠다.

 $(function(){
   $('#join').ajaxForm({
     beforeSubmit : function() {
       // alert('서브밋 직전입니다!');
       return validate()
     },
     success : function() {
       // alert('전송 성공!');
       window.location.href = 'email_sent_succeed.html';
     }
   });
 });
