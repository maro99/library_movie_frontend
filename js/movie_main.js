// 찜버튼 보일지 말지 판별하는 부분들

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
    // User정보는 Profile API에서 받아옴
    axios({
      method: 'get',
      url: 'http://localhost:8000/api/members/auth-test',
      headers: {
        'Authorization': 'Token ' + getCookie('token')
      }
    })
    .then(function (response) {
      is_login = true;

      for (var i=0; i< response.data.movie.length; i++) {
          // alert(JSON.stringify(response.data.movie[i].pk));
          movie_list[i]= response.data.movie[i].pk;
        }

    })
    .catch(function (error) {
      is_login = false;
    });
  }




  // /api/movies/main_page_by_date/에 GET 요쳥
  axios.get('http://localhost:8000/api/movies/main_page_by_date')
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

        var curElement = `<div class="col-4 mb-3">
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
              curElement +=    `<div style="float:right; display:inline-block;" >`


              // 찜 했었는지 판별해서 버튼 보임
              if (movie_list.includes(curMovie.pk)){
                      curElement += `<button type="submit" class="btn btn-danger btn-xs" >찜취소</button>`
                  }
              else{
                      curElement += `<button type="submit" class="btn btn-success btn-xs" >찜하기</button>`
              }

              curElement +=     `</div>`
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
