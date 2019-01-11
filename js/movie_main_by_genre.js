
// /api/movies/main_page_by_date/에 GET 요쳥
axios.get('http://localhost:8000/api/movies/main_page_by_genre')
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

          // $('.content').append(`<div class="row">`);
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

              curElement  = ` <div class="col-4 mb-3">`
              curElement += `     <a href="movie_detail.html?${curMovie.pk}"><div class="card-img-top" style="height: 177px; width: 309px; background-image: url('${curMovie.thumbnail_url}'); background-size: cover;"></div></a>`
              curElement += `     <div class="card-body">`
              curElement += `       <h5 class="card-title">${curMovie.title}</h5>`
              curElement += `       <p class="card-text">${when}</p>`
              curElement += `     </div>`
              curElement += ` </div>`;

              // $('.content').append(curElement);
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
