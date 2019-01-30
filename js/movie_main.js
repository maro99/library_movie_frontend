// 찜버튼 보일지 말지 판별하는 부분들

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   일일이 버튼마다 요청하는것은 바보같은 짓이고
// 1. auth_test로 프로필 받을때 찜한 영화pk도 가져오자.
// https://www.django-rest-framework.org/api-guide/relations/
//serializer anoter object  many to many django rest 이렇게 구글로 찾는중.

// 2. 해당 pk와 찜하려는 영화 버튼이 있는 곳의 영화의 pk 같으면 ~으로 조건 걸자.
// (근데 이경우에는 ajax로 어떻게 해야할지 모르겠다.
// ajax의 경우 비동처리로 각 버튼 눌릴때 그 범위 대해서만 최신화 될탠데.
// 내경우 해당 유저의 무비 리스트가 페이지를 리로드 하는 과정에서 리프레시 되는것인데.
// -> 이경우에 클릭 시에도 해당유저의 무비리스트 리프레시 되도록 해주면 되지 않을까? )



// 로긴상태 먼저 확인
  var is_login = false;
  var movie_list = [];
  var token = getCookie('token');
  if (token) {
      update_user_movie_list()
  }
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


  // User 영화 좋아요 정보 최신화 하는 함수
function update_user_movie_list(){

  axios({
    method: 'get'
    ,url: 'http://localhost:8000/api/members/auth-test'
    ,async:false
    ,headers: {
      'Authorization': 'Token ' + getCookie('token')
    }
  })
  .then(function (response) {

    is_login = true;

    // 어떤 영화 찜했는지 pk 목록 빼서 movie_list변수에 저장.
    for (var i=0; i< response.data.movie.length; i++) {
        // alert(JSON.stringify(response.data.movie[i].pk));
        movie_list[i]= response.data.movie[i].pk;
      }

      alert("사용자 찜목록 최신화 됨.");
  })
  .catch(function (error) {
    // is_login = false;
  });
}


//
// $("like").click(function() {
//     $("#like_area-${curMovie.pk}").load("index.html"); // 예) .load("test/test.php");
// })




// 찜하는 부분 관련 ajax
// header추가 위해 이렇게 빼줌.
function movie_like(pk,e){
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
          alert("좋아요버튼 클릭 됨");
          update_user_movie_list();

// $("#count-"+pk).html(response.like_count+"개");
          // $("#like_area").load();
          // $("#count-"+pk).html(response.like_count+"개");
          // var users = $("#like-user-"+pk).text();
          // if(users.indexOf(response.nickname) != -1){
          //   $("#like-user-"+pk).text(users.replace(response.nickname, ""));
          // }else{
          //   $("#like-user-"+pk).text(response.nickname+users);
          // }

        }
   ,error: function(response){ // 통신 실패시 - 로그인 페이지 리다이렉트
    // alert("좋아요버튼 클릭 됨");
    alert(JSON.stringify(response))
    // window.location.replace("/accounts/login/")
    //  alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
  },
  complete: function (response) {
      // window.location.href = "www.google.com";
    // 서버로 부터 받은 값 비교해서 삭제인지 ~ 추가인지 판단해서 맞게 a테그 업데이트 해주겠다.
    var return_message = JSON.stringify(response.responseJSON.detail)
    if (return_message=='"찜목록에서 삭제 되었습니다. "'){
      // alert('deleted')
      // $("#like_area-"+pk).html(response);
      $("#like_area-"+pk).html(`<button id="like_area-${pk}" type="submit" onclick="movie_like(${pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`);
      }
    else{
      // $("#like_area-"+pk).html(response);
      $("#like_area-"+pk).html(`<button id="like_area-${pk}" type="submit"  onclick="movie_like(${pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`);
      }
    },
  });
}






// 영화 띄워주는 부분들
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // /api/movies/main_page_by_date/에 GET 요쳥
  axios.get('http://localhost:8000/api/movies/main_page_by_date')
    // 성공시
    .then(function(response) {

      // $('.content').append(`<h1>${is_login}</h1>`);
      // response.data 가 가진 요소들을 순회
      for (var i=0; i< response.data.length; i++) {
        // 각 순회에 해당하는 요소는 curMovie
        var curMovie = response.data[i];

  //       //  2018-12-30T15:00:00+09:00  날짜 보기 좋은 형식으로 변환
        var when_date_pre= curMovie.when
        var when_date = when_date_pre.split("T")[0]
        var when_time_pre_list = when_date_pre.split("T")[1].split(":")
        var when_time =  when_time_pre_list[0] +":"+when_time_pre_list[1]
        var when = when_date +" "+ when_time

        var curElement = `<div class="col-4 mb-3" >
                            <a href="movie_detail.html?${curMovie.pk}"><div class="card-img-top" style="height: 177px; width: 309px; background-image: url('${curMovie.thumbnail_url}'); background-size: cover;">`


                            // {% if user.is_authenticated %}
                            //     <div style="float:right; display:inline-block;" >
                            //
                            //         <form action="{% url 'members:user_movie_like' pk=movie.pk %}" method="POST">
                            //             {% csrf_token %}
                            //             <input type="hidden" name="next" value="{{ request.path }}">
                            //             {% if movie in user.like_movies %}
                            //             <button type="submit" class="btn btn-danger btn-xs" >찜취소</button>
                            //             {% else %}
                            //             <button type="submit" class="btn btn-success btn-xs" >찜하기</button>
                            //             {% endif %}
                            //         </form>
                            //     </div>
                            // {% endif %}


            // 로긴 했었는지 판별
            if (is_login){
              curElement +=    `<div  style="float:right; display:inline-block;" >
                                    <form id="like_area-${curMovie.pk}" name="like">`
// action="http://localhost:8000/api/members/movie-like/${curMovie.pk}"

              // 찜 했었는지 판별해서 버튼 보임
              if (movie_list.includes(curMovie.pk)){
                      curElement += `<button  type="submit"  onclick="movie_like(${curMovie.pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`
                      // curElement += `<button  type="submit" onclick="movie_like(${curMovie.pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`
                  }
              else{
                      // curElement += `<button  type="submit"  onclick="movie_like(${curMovie.pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`
                      curElement += `<button id="like_area-${curMovie.pk}" type="submit" onclick="movie_like(${curMovie.pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`
              }

              curElement +=     `   </form>
                                  </div>`
            }


        curElement +=    `</div></a>

                            <div class="card-body">
                                <h5 class="card-title">${curMovie.title}</h5>
                                <p class="card-text">${when}</p>
                            </div>

                          </div>`;

        $('.content').append(curElement);
      }
    })

    // 실패시
    .catch(function (error) {
      console.log(error);
    });
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
