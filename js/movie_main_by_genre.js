// 아래 함수 호출은 이 파일호출하는곳에서 보면 알수있듯이 그보다 상위에서 호출된 movie_like.js 에서 호출.

function await_show_movie_page(){
  return new Promise(function(resolve, reject){

      // /api/movies/main_page_by_date/에 GET 요쳥
      axios.get(root_address + '/api/movies/main_page_by_genre')
        // 성공시
        .then(function(response) {

          // 일단 장르 리스트 부터 뽑자
          var genre_list = []
          for (var i=0; i< response.data.length; i++) {
            var curMovie = response.data[i];
            if ($.inArray(curMovie.genre, genre_list) == -1){
              genre_list.push(curMovie.genre)
            }
          }

          // 장르 리스트 돌면서 각 장르에 해당하는 영화만 출력
            for (var index=0; index< genre_list.length; index++){

              if (genre_list[index] == ""){
                $('.content').append(`<h2> 기타 </h2>`)
              }
              else{
                $('.content').append(`<h2>${genre_list[index]}</h2>`)
              }

                curGenreBlock = `<div class="row">`

                // response.data 가 가진 요소들을 순회
                for (var i=0; i< response.data.length; i++) {
                  // 각 순회에 해당하는 요소는 curMovie
                  var curMovie = response.data[i];

                  if (curMovie.genre==genre_list[index]){

              //       //  2018-12-30T15:00:00+09:00  날짜 보기 좋은 형식으로 변환
                    var when_date_pre= curMovie.when
                    var when_date = when_date_pre.split("T")[0]
                    var when_time_pre_list = when_date_pre.split("T")[1].split(":")
                    var when_time =  when_time_pre_list[0] +":"+when_time_pre_list[1]
                    var when = when_date +" "+ when_time

                    var curElement = `<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 mb-3" >
                                        <a href="movie_detail.html?${curMovie.pk}"><div class="card-img-top" style="padding-top: 57.28%; width: 100%; background-image: url('${curMovie.thumbnail_url}'); background-size: cover;">`

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
                    else{
                      curElement +=    `<div  style="float:right; display:inline-block;" >
                                            <form id="like_area-${curMovie.pk}" name="like">
                                              <button id="like_area-${curMovie.pk}" type="submit" onclick="movie_like(${curMovie.pk}, event)" class="btn btn-success btn-xs" >찜하기</button>
                                            </form>
                                        </div>`
                    }
                      curElement +=    `</div></a>
                                          <div class="card-body">
                                              <h5 class="card-title">${curMovie.title}</h5>
                                              <p class="card-text">${when}</p>
                                          </div>

                                        </div>`;

                    curGenreBlock += curElement
                  }
                }
                curGenreBlock+=`</div>`
                $('.content').append(curGenreBlock);

          }
       })

        // 실패시
        .catch(function (error) {
          console.log(error);
        });
      });
  }
