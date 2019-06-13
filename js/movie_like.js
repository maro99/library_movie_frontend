 // 스크롤 위치 기억하는 함수
$(window).scroll(function () {
    //set scroll position in session storage
    sessionStorage.scrollPos = $(window).scrollTop();
});
var init = function () {
    //get scroll position in session storage
    $(window).scrollTop(sessionStorage.scrollPos || 0)
};
//문서에 포함된 모든 콘텐츠가 로드된 후에 실행
window.onload = init;


// 좀 했갈리는데..
// 현제 이 js 호출한 html  이 movie_main_by_distance.html 인 경우 와 그렇지 않은 경우 구분해서
// init_function_if_login, init_function_if_not_login 각각 만들어 놓았다.
// (mobvie_main_by_distance에서 쓰이는 현 위경도 구하는 함수의 함수안에서 페이지 렌더해주는 함수를 콜백하고있어서 이렇게 안하면 중복 해서 띄워주는것이 문제 되었다.).
  var path = window.location.pathname;
  var page = path.split("/").pop();
  // console.log( page);

// 로긴상태 먼저 확인
  var is_login = false;
  var movie_list = [];

  var token = getCookie('token');
  if ((token)&&(page != "movie_main_by_distance.html")){      // 로긴 됬고 ~인경우
      init_function_if_login1();
      is_login = true;
  }
  else if ((token)&&(page == "movie_main_by_distance.html")){  // 로긴 됬고 ~인경우
      init_function_if_login2();
      is_login = true;
 }
  else if ((token=="")&&(page != "movie_main_by_distance.html")){
      init_function_if_not_login1();
  }
  else if ((token=="")&&(page == "movie_main_by_distance.html")){
      init_function_if_not_login2();
  }

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@  현제 이 js 호출한 html  이 movie_main_by_distance.html 아닌 경우
   // 로긴시 동기적으로 순서대로 함수 처리 하기 위함.(유저가 좋아요한 영화 리스트등을 받고 페이지 랜더해줘야해서 )
   // update_user_movie_list() +  movie_show_detail_page 된건데 일단 이렇게 써주겠슴.
   async function init_function_if_login1(){
     // alert('1')
     await await_update_user_movie_list();
     // alert('2')
     await await_show_movie_page();      //각 genre,distance,등의 main page 의 js에 선언되 있음.
     // alert('3')
   }
    // 로긴 안되있을시 동기적으로 함수 처리해 주기 위함
   async function init_function_if_not_login1(){
     await await_show_movie_page();
     // alert('22')
   }

   //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   현제 이 js 호출한 html  이 movie_main_by_distance.html 인 경우
   async function init_function_if_login2(){
     // alert('1')
     await await_update_user_movie_list();
     // alert('2')
     await get_distance_var();//await_show_movie_page() 를 이 함수 가 호출하는 함수 내부에서 호출하고 있음.
     // alert('3')
     // await await_show_movie_page();
     // alert('4')
   }
    // 로긴 안되있을시 동기적으로 함수 처리해 주기 위함
    // (movie_main_by_distance에서 현위치 위경도 얻고페이지 띄워주기위함 -> genre, index,rate따른 mainpage는 딱히 필요 없지만
    // 일괄 적으로 여기서 처리해주고 싶어서 빈 함수 각 js에 선언해 놓긴 했음. )
   async function init_function_if_not_login2(){

     await get_distance_var();
     // alert('11')
     // await await_show_movie_page();  //await_show_movie_page() 를 이 함수 가 호출하는 함수 내부에서 호출하고 있음.
     // alert('22')
   }


  // 유저 가 좋아요 한 것들 업데이트
  function await_update_user_movie_list(){
    return new Promise(function(resolve, reject){
        axios({
            method: 'get'
            ,url: root_address + '/api/members/auth-test'
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
      ,url: root_address + "/api/members/movie-like/" + pk
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
      찜을 하시면 상영 3시간 전, 24시간전 알람을 받을 수 있습니다.`)

      window.location.href = 'login_page.html';
    }
  }

  // function movie_like_without_login(){
  //
  //
  // }
