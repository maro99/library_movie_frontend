// // /api/movies/main_page_by_date/에 GET 요쳥
// axios.get('http://localhost:8000/api/movies/main_page_by_date')
//   // 성공시
//   .then(function(response) {
//       temp=location.href.split("?")
//       data = temp[1]
//       $('.content').append(data);
//
//   })
//
//   // 실패시
//   .catch(function (error) {
//     console.log(error);
//   });
//


  var temp=location.href.split("?")
  var pk = temp[1]

  // /api/movies/<int:pk>/에 GET 요쳥

  axios.get('http://localhost:8000/api/movies/'+ pk)
    // 성공시
    .then(function(response) {
    //   // response.data 가 가진 요소들을 순회
    //   for (var i=0; i< response.data.length; i++) {

    //     // 각 순회에 해당하는 요소는 curMovie
        var curMovie = response.data;



        var curElement = `<div class="card-img-top" style="height: 354px; width: 618px; background-image: url('${curMovie.thumbnail_url}'); margin: 20px;  background-size: cover;">
                          </div>
                          <div class="card-body">
                              <h4 class="card-title">${curMovie.title}</h4>

                              <p class="card-text">장르 : ${curMovie.genre}</p>

                              <p class="card-text">감독 : ${curMovie.director}</p>

                              <p class="card-text">평점 : ${curMovie.rating}</p>

                              <p class="card-text">시청연령 : ${curMovie.age}</p>

                              <p class="card-text">런타임 :  ${curMovie.runtime} 분 </p>

                              <p class="card-text">상영일:  ${curMovie.when}</p>

                              <p class="card-text">장소: <a href="https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query= ${curMovie.library.library_name}">${curMovie.library.library_name}</a> ${curMovie.place}</p>

                              <p>줄거리: </p>
                                  <span>${curMovie.story}</span>

                          </div>`

        $('.content').append(curElement);


    //   }
    })

    // 실패시
    .catch(function (error) {
      console.log(error);
    });
