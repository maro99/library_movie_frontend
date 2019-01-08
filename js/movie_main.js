
// /api/movies/main_page_by_date/에 GET 요쳥

axios.get('http://localhost:8000/api/movies/main_page_by_date')
  // 성공시
  .then(function(response) {
    // response.data 가 가진 요소들을 순회
    for (var i=0; i< response.data.length; i++) {
      // 각 순회에 해당하는 요소는 curMovie
      var curMovie = response.data[i];

      // curMovie의 내용을 '.content'요소에 append(뒤에 붙여넣음)
      // var curElement = '<div class="card mb-3">';
      // curElement    += '  <div class="card-header"></div>';
      // curElement    += '  <div class="card-body p-0">';
      // curElement    += '    <img src="' + curMovie.thumbnail_url + '" width="100%">';
      // curElement    += '  </div>';
      // curElement    += '</div>';

      var curElement = `<div class="col-4 mb-3">
                          <a href="movie_detail.html?${curMovie.pk}"><div class="card-img-top" style="height: 177px; width: 309px; background-image: url('${curMovie.thumbnail_url}'); background-size: cover;"></div></a>

                          <div class="card-body">
                              <h5 class="card-title">${curMovie.title}</h5>
                              <p class="card-text">${curMovie.when}</p>
                          </div>

                        </div>`;

      $('.content').append(curElement);
    }
  })

  // 실패시
  .catch(function (error) {
    console.log(error);
  });
