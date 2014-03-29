bsShowCase
==========

The place for fabulous BS examples

## ShowCase 구경 하기

<a href='http://projectbs.github.io/bsShowCase/' target='_blank'>ShowCase</a>

## ShowCase 내려 받기

bsShowCase의 모든 showcase는 bsShowCase의 bsJS 연구 나무의 bsjs.js를 상대 경로로 참조하고 있습니다.

그래서 bsShowCase를 내려 받아 로컬에서 사용해보려면 bsShowCase뿐 아니라 bsJS도 모두 아래와 같이 같은 폴더 아래에 받아야 합니다.

    ANY-FOLDER
          └----bsJS           
          └----bsShowCase

bsJS는 <a href='https://github.com/projectBS/bsJS' target='_blank'><strong>여기</strong></a>에서 내려받을 수 있습니다.


## ShowCase 추가 하기

구경만 하지 마시고 <a href='https://github.com/projectBS/bsTest' target='_blank'><strong>bsTest</strong></a>에서 마음껏 테스트 해 보시고, 여기 **bsShowCase**에도 추가해주세요. 

1. 새로운 showcase를 위한 폴더를 새로 만들어 showcase 작성. **Entry Point가 되는 html 파일의 이름은 반드시 index.html로 만든다.**
2. 새로운 showcase의 화면 캡쳐 이미지 파일의 이름을 'thumb_SHOWCASE이름.png'로 만들고 bsShowCase/Thumbnails 폴더 내에 저장  
3. [index.html](https://github.com/projectBS/bsShowCase/blob/gh-pages/index.html) 의 `<div class='list'>~~~</div>` 부분을 복사하여 새로 만든 showcase에 맞게 수정하여 추가
4. bsShowCase에 Push 
5. 1~2분 후 <a href='http://projectbs.github.io/bsShowCase/' target='_blank'>http://projectbs.github.io/bsShowCase/</a>를 방문하면 추가된 showcase 확인 가능

### 예시

>**bs**를 사용해서 **로또(lotto)** showcase를 만들자!!

1. **bsShowCase/lotto** 폴더 생성 후 그 안에 **index.html**과 기타 파일 및 폴더 저장
2. **bsShowCase/Thumbnails** 폴더 내에 'thumb_lotto.png' 저장 
3. **bsShowCase/index.html** 파일 내에 아래 내용을 **`<div id="stage"></div>`** 바로 위에 추가 후 저장
    `````
    <div class="list"><a href="lotto/" target="_blank"><img src="Thumbnails/thumb_lotto.png"/>lotto : 인생 역전</a></div>
    `````
4. **`git push origin gh-pages`** 또는 *SourceTree*와 같은 Git GUI Tool을 사용하여 bsShowCase에 Push
5. 1~2분 후 <a href='http://projectbs.github.io/bsShowCase/' target='_blank'>http://projectbs.github.io/bsShowCase/</a>를 방문해서 **lotto** showcase 추가된 것 확인
  

