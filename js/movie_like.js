// 로긴상태 먼저 확인
  var is_login = false;
  var movie_list = [];
  var token = getCookie('token');
  if (token) {
      init_function_if_login();
      is_login = true;
  }
  else{
    await_show_movie_page();
  }


  // update_user_movie_list() +  movie_show_detail_page 된건데 일단 이렇게 써주겠슴.
  async function init_function_if_login(){
    // alert('1')
    await await_update_user_movie_list()
    // alert('2')
    await await_show_movie_page()
    // alert('3')
  }


  function await_update_user_movie_list(){
    return new Promise(function(resolve, reject){
        axios({
            method: 'get'
            ,url: 'http://localhost:8000/api/members/auth-test'
            // ,async:false
            ,headers: {
              'Authorization': 'Token ' + token
            }
          })
          .then(function (response) {
            is_login = true;

            // 어떤 영화 찜했는지 pk 목록 빼서 movie_list변수에 저장.
            for (var i=0; i< response.data.movie.length; i++) {
                // alert(JSON.stringify(response.data.movie[i].pk));
                movie_list[i]= response.data.movie[i].pk;
              }

            // alert("1. 사용자 찜목록 최신화 됨.");
            resolve("async는 Promise방식을 사용합니다.");
          })
          .catch(function (error) {
            is_login = false;
            resolve("async는 Promise방식을 사용합니다.");
          });
      });
  }


  // 찜하는 부분 관련 ajax
  // header추가 위해 이렇게 빼줌.
  function movie_like(pk,e){

    if(token){
      var headers = {};
      headers["Authorization"] = "Token " + token;
     e.preventDefault();
     $.ajax({
       type: "POST"
      ,url: "http://localhost:8000/api/members/movie-like/" + pk
      // ,async:false
      ,dataType: "json"
      ,headers : headers
      ,success: function(response){ // 통신 성공시 - 동적으로 좋아요 갯수 변경, 유저 목록 변경
              // alert("좋아요버튼 클릭 됨");
              await_update_user_movie_list();

                // alert(JSON.stringify(response)
              // window.location.href = "www.google.com";
            // 서버로 부터 받은 값 비교해서 삭제인지 ~ 추가인지 판단해서 맞게 a테그 업데이트 해주겠다.
            var return_message = JSON.stringify(response.detail)
            if (return_message=='"찜목록에서 삭제 되었습니다. "'){
              // alert('deleted')
              // $("#like_area-"+pk).html(response);
              $("#like_area-"+pk).html(`<button id="like_area-${pk}" type="submit" onclick="movie_like(${pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`);
              }
            else{
              // $("#like_area-"+pk).html(response);
              $("#like_area-"+pk).html(`<button id="like_area-${pk}" type="submit"  onclick="movie_like(${pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`);
              }
            }
       ,error: function(response){ // 통신 실패시 - 로그인 페이지 리다이렉트
        // alert("좋아요버튼 클릭 됨");
        // alert(JSON.stringify(response))
        // window.location.replace("/accounts/login/")
        //  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      },
      complete: function (response) {

        },
      });
    }
    else{
      e.preventDefault();
        alert(`찜 하기 위해 로그인이 필요합니다.
      찜을 하시면 상영 2시간 전  알람을 받을 수 있습니다.`)

      window.location.href = 'login_page.html';
    }
  }

  // function movie_like_without_login(){
  //
  //
  // }
