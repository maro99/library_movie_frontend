function get_distance_var(){
    // movie_like.js에서 일괄적으로 다루려고 일단 선언만 해놓음 ( movie_main_by_distance에는 원래 목적대로 작성해놓음)
}

function await_show_movie_page(){
  return new Promise(function(resolve, reject){

    // /api/movies/main_page_by_date/에 GET 요쳥
    axios.get(root_address + '/api/movies/main_page_by_rating')
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

          $('.content').append(curElement);
        }
      })

      // 실패시
      .catch(function (error) {
        console.log(error);
      });
    });
}
