// update_user_movie_list() +  movie_show_detail_page 된건데 일단 이렇게 써주겠슴.
async function init_function_if_login(){
  // alert('1')
  await await_update_user_movie_list()
  // alert('2')
  await await_movie_show_like_page()
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

function await_movie_show_like_page(){
  return new Promise(function(resolve, reject){

        // /api/movies/main_page_by_date/에 GET 요쳥
        axios.get('http://localhost:8000/api/members/movie-like-page',
              {headers: {Authorization: 'Token ' + token }}
            )
          // 성공시
          .then(function(response) {

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
        });
    }
