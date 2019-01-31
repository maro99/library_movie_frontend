
// 로긴상태 먼저 확인
  var is_login = false;
  var movie_list = [];
  var token = getCookie('token');
  if (token) {
      init_function_if_login2();
      // init_function_if_login(movie_show_detail_page);
      is_login = true;
  }
  else{
    movie_show_detail_page();
  }



// 콜백을 이용해서 영화 리스트 최신화 후에
// 영화 업데이트 하도록 띄우기위한 함수.
// update_user_movie_list() +  movie_show_detail_page 된건데 일단 이렇게 써주겠슴.
// function init_function_if_login(callback2){
//
//   axios({
//       method: 'get'
//       ,url: 'http://localhost:8000/api/members/auth-test'
//       // ,async:false
//       ,headers: {
//         'Authorization': 'Token ' + token
//       }
//     })
//     .then(function (response) {
//       is_login = true;
//
//       // 어떤 영화 찜했는지 pk 목록 빼서 movie_list변수에 저장.
//       for (var i=0; i< response.data.movie.length; i++) {
//           // alert(JSON.stringify(response.data.movie[i].pk));
//           movie_list[i]= response.data.movie[i].pk;
//         }
//     alert('movie_list_updated')
//         // alert("사용자 찜목록 최신화 됨.");
//     callback2();
//     })
//     .catch(function (error) {
//       is_login = false;
//     });
//
//
// }

async function init_function_if_login2(){
  alert('1')
  await await_update_user_movie_list()
  alert('2')                               // 2번 출력
  await await_movie_show_detail_page()
  alert('3')
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

          alert("1. 사용자 찜목록 최신화 됨.");
          resolve("async는 Promise방식을 사용합니다.");
        })
        .catch(function (error) {
          is_login = false;
          resolve("async는 Promise방식을 사용합니다.");
        });
    });
}

function await_movie_show_detail_page(){
  return new Promise(function(resolve, reject){
    var temp=location.href.split("?")
    var pk = temp[1]

     axios.get('http://localhost:8000/api/movies/'+ pk)
        // 성공시
        .then(function(response) {
        //   // response.data 가 가진 요소들을 순회
        //   for (var i=0; i< response.data.length; i++) {

        //     // 각 순회에 해당하는 요소는 curMovie
            var curMovie = response.data;

    //       //  2018-12-30T15:00:00+09:00  날짜 보기 좋은 형식으로 변환
            var when_date_pre= curMovie.when
            var when_date = when_date_pre.split("T")[0]
            var when_time_pre_list = when_date_pre.split("T")[1].split(":")
            var when_time =  when_time_pre_list[0] +":"+when_time_pre_list[1]
            var when = when_date +" "+ when_time

            alert('2.영화정보 나타냄')
            // alert(JSON.stringify(movie_list))
            // $('.content').append(`<h1>${is_login}</h1>`);
            var curElement = `<div class="card bg-dark text-white">`
            curElement += `<div class="card-img-top" style="height: 354px; width: 618px; background-image: url('${curMovie.thumbnail_url}'); margin: 20px;  background-size: cover;"> `


              // 로긴 했었는지 판별
              if (is_login){
                  curElement +=    `<div  style="float:right; display:inline-block;" >
                                        <form id="like_area-${curMovie.pk}" name="like">`
                  // 찜 했었는지 판별해서 버튼 보임
                  if (movie_list.includes(curMovie.pk)){
                          curElement += `<button  type="submit"  onclick="movie_like(${curMovie.pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`
                      }
                  else{
                          curElement += `<button id="like_area-${curMovie.pk}" type="submit" onclick="movie_like(${curMovie.pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`
                  }
                  curElement +=     `   </form>
                                      </div>`
                }

            curElement     +=   `</div>`
            curElement     +=   `<div class="card-body">`
            curElement     +=   ` <h4 class="card-title">${curMovie.title}</h4>`

            if(curMovie.genre){
              curElement     +=   `<p class="card-text">장르 : ${curMovie.genre}</p>`
            }
            if(curMovie.director){
              curElement     +=   `<p class="card-text">감독 : ${curMovie.director}</p>`
            }
            if(curMovie.rating){
              curElement     +=   `<p class="card-text">평점 : ${curMovie.rating}</p>`
            }
            if(curMovie.age){
              curElement     +=   `<p class="card-text">시청연령 : ${curMovie.age}</p>`
            }
            if(curMovie.runtime){
              curElement     +=   `<p class="card-text">런타임 : ${curMovie.runtime}</p>`
            }

            curElement     +=   `<p class="card-text">상영일 : ${when}</p>`
            curElement     +=   `<p class="card-text">장소: <a href="https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query= ${curMovie.library.library_name}">${curMovie.library.library_name}</a> ${curMovie.place}</p>`
            if(curMovie.story){
              curElement     +=   `<p class="card-text"> ${curMovie.story}</p>`
            }
            curElement     +=`</div>`
            curElement     +=`</div>`

            $('.content').append(curElement);


        //   }
        resolve("async는 Promise방식을 사용합니다.");
        })

        // 실패시
        .catch(function (error) {
          console.log(error);
          resolve("async는 Promise방식을 사용합니다.");
        });
    });
}












  // User 영화 좋아요 정보 최신화 하는 함수
function update_user_movie_list(){

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

          alert("1. 사용자 찜목록 최신화 됨.");
      })
      .catch(function (error) {
        is_login = false;
      });
}







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
          // alert("좋아요버튼 클릭 됨");
          update_user_movie_list();

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


function movie_show_detail_page(){

  var temp=location.href.split("?")
  var pk = temp[1]

   axios.get('http://localhost:8000/api/movies/'+ pk)
      // 성공시
      .then(function(response) {
      //   // response.data 가 가진 요소들을 순회
      //   for (var i=0; i< response.data.length; i++) {

      //     // 각 순회에 해당하는 요소는 curMovie
          var curMovie = response.data;

  //       //  2018-12-30T15:00:00+09:00  날짜 보기 좋은 형식으로 변환
          var when_date_pre= curMovie.when
          var when_date = when_date_pre.split("T")[0]
          var when_time_pre_list = when_date_pre.split("T")[1].split(":")
          var when_time =  when_time_pre_list[0] +":"+when_time_pre_list[1]
          var when = when_date +" "+ when_time

          alert('2.영화정보 나타냄')
          // alert(JSON.stringify(movie_list))
          // $('.content').append(`<h1>${is_login}</h1>`);
          var curElement = `<div class="card bg-dark text-white">`
          curElement += `<div class="card-img-top" style="height: 354px; width: 618px; background-image: url('${curMovie.thumbnail_url}'); margin: 20px;  background-size: cover;"> `


            // 로긴 했었는지 판별
            if (is_login){
                curElement +=    `<div  style="float:right; display:inline-block;" >
                                      <form id="like_area-${curMovie.pk}" name="like">`
                // 찜 했었는지 판별해서 버튼 보임
                if (movie_list.includes(curMovie.pk)){
                        curElement += `<button  type="submit"  onclick="movie_like(${curMovie.pk}, event)" class="btn btn-danger btn-xs" >찜취소</button>`
                    }
                else{
                        curElement += `<button id="like_area-${curMovie.pk}" type="submit" onclick="movie_like(${curMovie.pk}, event)" class="btn btn-success btn-xs" >찜하기</button>`
                }
                curElement +=     `   </form>
                                    </div>`
              }

          curElement     +=   `</div>`
          curElement     +=   `<div class="card-body">`
          curElement     +=   ` <h4 class="card-title">${curMovie.title}</h4>`

          if(curMovie.genre){
            curElement     +=   `<p class="card-text">장르 : ${curMovie.genre}</p>`
          }
          if(curMovie.director){
            curElement     +=   `<p class="card-text">감독 : ${curMovie.director}</p>`
          }
          if(curMovie.rating){
            curElement     +=   `<p class="card-text">평점 : ${curMovie.rating}</p>`
          }
          if(curMovie.age){
            curElement     +=   `<p class="card-text">시청연령 : ${curMovie.age}</p>`
          }
          if(curMovie.runtime){
            curElement     +=   `<p class="card-text">런타임 : ${curMovie.runtime}</p>`
          }

          curElement     +=   `<p class="card-text">상영일 : ${when}</p>`
          curElement     +=   `<p class="card-text">장소: <a href="https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query= ${curMovie.library.library_name}">${curMovie.library.library_name}</a> ${curMovie.place}</p>`
          if(curMovie.story){
            curElement     +=   `<p class="card-text"> ${curMovie.story}</p>`
          }
          curElement     +=`</div>`
          curElement     +=`</div>`

          $('.content').append(curElement);


      //   }
      })

      // 실패시
      .catch(function (error) {
        console.log(error);
      });

}
