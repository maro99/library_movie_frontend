
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  현지점으로부터 거리 추출 관련 함수 및 변수
var lat
var lon
var lat_lng_dict = {}
var distance_range_list = [1,3,5,10,100]


// 브라우저 접속 ip 기준 위경도 뽑음
function onGeolocationSuccess(position) {
  // 좌표출력
  console.log("lat: " + position.coords.latitude + ", lon: " + position.coords.longitude);

  lat = position.coords.latitude
  lon = position.coords.longitude
}

 function onGeolocationFail(error) {
// 에러 출력
console.log("Error Code: " + error.code + ", Error Description: " + error.message);
}

function get_distance_var(){
  if (navigator.geolocation) {
  // 정확한 위치 사용 // 캐시 사용 안함 // timeout 3초 (3000ms)
   var positionOptions = { enableHighAccuracy	: true, maximumAge	: 0, timeout	: 3000
   };
  navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationFail, positionOptions);
  }
}

// 두 지점 사이의 거리 리턴
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    // console.log(d)
    return d;
  }




//  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   페이지 랜더링 관련 함수
function await_show_movie_page(){
  return new Promise(function(resolve, reject){

      // /api/movies/main_page_by_date/에 GET 요쳥
      axios.get(root_address + '/api/movies/main_page_by_distance')
        // 성공시
        .then(function(response) {
          // 서버에서는 기존 genre 속성 추가 했듯이 해당하는 도서관의 좌표를 속성으로 추가해 보자.

          //  서버로 부터 각 영화마다 해당 영화 상영하는 도서관의 위도 경도 가져와서
          // {도서관명: (위도,경도))} 이런 식으로 저장.
          // 이후 {도서관명 : 지금 위치로부터 거리 } 이렇게 다른 dict에 저장 .

          // 거리[1,2,3,4,5,50] 돌면서 1km 이내, 2km 이내, ~ 이런식으로 체크 해 가면서 각 영화-해당 도서관 의 이름으로 dict조회한 거리에 해당하는 범위에서 영화 출력.
          // 이후 curMovie

          for (var i=0; i< response.data.length; i++) {
              var curMovie = response.data[i];

              // //1.  {도서관명 : 지금 위치로부터 거리 } 이렇게  저장
              lat_lng_dict[curMovie.library.library_name] = calculateDistance(lat, lon, curMovie.library.lat, curMovie.library.lng)
              // console.log(curMovie)

          }

          // 1,3,5,100 범위 해당하는 영화만 각각 출력
            var from_km = 0
            for (var index=0; index< distance_range_list.length; index++){

                var to_km = distance_range_list[index]
                $('.content').append(`<h2>현재위치로 부터 ${from_km}~${to_km}km  </h2>`)


                curGenreBlock = `<div class="row">`

                // response.data 가 가진 요소들을 순회
                for (var i=0; i< response.data.length; i++) {

                  // 각 순회에 해당하는 요소는 curMovie
                  var curMovie = response.data[i];
                  var distance = lat_lng_dict[curMovie.library.library_name]
                  console.log(distance)
                  if ((from_km<=distance)&&(to_km > distance)){

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

                    curGenreBlock += curElement
                  }
                }
                curGenreBlock+=`</div>`
                $('.content').append(curGenreBlock);


            from_km = to_km
          }
       })

        // 실패시
        .catch(function (error) {
          console.log(error);
        });
      });
  }
