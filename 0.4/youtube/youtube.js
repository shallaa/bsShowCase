/*
	쥬크박스(pekuid@gmail.com)
	http://developers.google.com/youtube
	https://console.developers.google.com/project
	https://developers.google.com/youtube/v3/docs/search/list
	https://developers.google.com/youtube/iframe_api_reference
*/
var player, app;
function onYouTubeIframeAPIReady(){
	player = new YT.Player('player', {
		height: '360',
		width: '640',
		videoId: 'nQm_9nbY_7U',
		playerVars:{
			"loop" : 1
		},
		events: {
			//'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': function(event){
				switch(event.data){
					case 2:alert('요청한 동영상ID가 잘못되었습니다.'); break; 
					case 5:alert('요청한 콘텐츠를 HTML5 플레이어에서 재생할 수 없습니다.'); break; 
					case 100: alert('요청한 동영상을 찾을 수 없습니다.'); break;
					case 101:
					case 150:alert('요청한 동영상의 소유자가 내장 플레이어에서 동영상을 재생하는 것을 허용하지 않습니다.'); break;
				}
				player.nextVideo();
			}
		}
	});
}

function onPlayerReady(event){
}

function onPlayerStateChange(event){
	var els;
	player.setLoop(true);
	//player.setShuffle(true);
	if( event.data == YT.PlayerState.ENDED ){
	}else	if( event.data == YT.PlayerState.PLAYING ){
		bs.Dom('@li.playlist').S('class-', 'playing');
		els = bs.Dom('@li.playlist');
		for(var i = 0; i < els.length; i++){
			if( bs.Dom( els[i] ).S('@data-video-id') == player.getVideoData().video_id ){
				bs.Dom( els[i] ).S('class+', 'playing');
			}
		}
	}else if( event.data == YT.PlayerState.CUED ){
		
	}
}
bs.plugin( 'save', 'last' );
bs(function(){
	if( !player ) bs.reload();
	if( bs.DETECT.os.charAt(0) == 'i' ){
		bs.Dom('#menuDiv').S('width', 250);
		bs.Dom('#controlBox').S(null);
	}else if(bs.DETECT.os == 'android'){
		bs.Dom('#play').S('visibility', 'hidden');
	}
	var playlist = [], searchResults = [], t0;
	bs.css('youtube.css');
	if( t0 = bs.save('playlist') ){
		playlist = t0;
	}
	if( t0 = bs.save('searchResult') ){
		searchResults = t0;
	}
	(function(){
		var videoId, videoIdx;
		var len = playlist.length;
		console.log(len)
		for (var i=0; i<len; i++) {
			videoId = playlist[i];
			videoIdx = searchResults.indexOf(videoId);
			bs.Dom('#playlists').S('>',
				bs.Dom('<li>').S('class+', 'playlist', '@data-video-id', videoId, '>',
					bs.Dom('<img>').S('@align', 'left', '@src', searchResults[++videoIdx], '@title', searchResults[++videoIdx],
					'@alt', searchResults[videoIdx], 'this'),
				'html+', searchResults[videoIdx], 'this')
			);
		};
		bs.Dom('@li.playlist').S( 'click', function(){
			var classes = bs.Dom(this).S('class').split(' ');
			if( classes.indexOf('on') > -1 ){ bs.Dom(this).S('class-', 'on');}
			else{ bs.Dom(this).S('class+', 'on');}
		} );
		if( bs.DETECT.os.charAt(0) != 'i' ){
			player.cuePlaylist( playlist, 0, 0, 'default');
		}else{
			player.cuePlaylist( playlist, 0, 0, 'default'); return;
		}
		if( bs.DETECT.os.charAt(0) != 'i' ) bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
	})();
	bs.Dom('#search').S('submit', function(ev){
		//console.log(ev);
		// 검색키워드로 Youtube검색
		var url = 'https://www.googleapis.com/youtube/v3/search';
		bs.get( function(rs){
			var item, type, videoId, title, thumbD, thumbH, thumbM;
			rs = JSON.parse(rs);
			console.log(rs);
			bs.Dom('#searchResults').S('html', '');
			for(var i=0; i<rs.items.length; i++){
				item = rs.items[i],
				type = item.id.kind, // youtube#video
				videoId = item.id.videoId,
				title = item.snippet.title,
				thumbD = item.snippet.thumbnails.default.url,
				thumbH = item.snippet.thumbnails.high.url,
				thumbM = item.snippet.thumbnails.medium.url;
				if( searchResults.indexOf(videoId) < 0 ){
					searchResults.push(videoId);
					searchResults.push(thumbD);
					searchResults.push(title);
				}
				if( type != 'youtube#video' ) continue;
				bs.Dom('#searchResults').S('>',
					bs.Dom('<li>').S('class+', 'results', '@data-video-id', videoId, '>',
						bs.Dom('<img>').S('@align', 'left', '@src', thumbD, '@title', title,
						'@alt', title, 'this'),
					'html+', title, 'this')
				);
			}
			bs.Dom('@li.results').S( 'click', function(){
				var classes = bs.Dom(this).S('class').split(' ');
				if( classes.indexOf('on') > -1 ){ bs.Dom(this).S('class-', 'on');}
				else{ bs.Dom(this).S('class+', 'on');}
			} );
		}, url,
			'q', bs.Dom('#q').S('@value'),
			"part", 'snippet',
			"maxResults", 50,
			"order", "relevance",
			"key", "AIzaSyAkz-K8M2YGdbHvBiyVHvgwKM-MMeQtwfo" );
	});

	bs.Dom('#tabPlayList').S('click', function(){
		bs.Dom('#searchlist').S('@hidden', '');
		bs.Dom('#playlist').S('@hidden', null);
		bs.Dom('#tabSearch').S('class-', 'pure-menu-selected');
		bs.Dom(this).S('class+', 'pure-menu-selected');
	});

	bs.Dom('#tabSearch').S('click', function(){
		bs.Dom('#searchlist').S('@hidden', null);
		bs.Dom('#playlist').S('@hidden', '');
		bs.Dom('#tabPlayList').S('class-', 'pure-menu-selected');
		bs.Dom(this).S('class+', 'pure-menu-selected');
		bs.Dom('#q').S('f');
	});
	if( bs.DETECT.os.charAt(0) != 'i' ){
		bs.Dom('#play').S( 'click', function(){
			if( !player.getPlaylist() && playlist.length ){
				
			}
			if( bs.Dom('#play i').S('class').indexOf('fa-play') > -1 ){
				player.playVideo();
				bs.Dom('#play i').S('class-', 'fa-play', 'class+', 'fa-pause');
			}else{
				// 시작되지 않음(-1), 종료됨(0), 재생 중(1), 일시중지(2), 버퍼링(3), 동영상 신호(5)
				if( player.getPlayerState() == 2 )
					player.playVideo(), bs.Dom('#play i').S('class-', 'fa-play', 'class+', 'fa-pause');
				else
					player.pauseVideo(), bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
			}
		});
	}
	function savePlaylist(){
		var videoId, videoIdx;
		var videos = bs.Dom('@li.results.on');
		var len = videos.length;
		console.log(len)
		for (var i=0; i<len; i++) {
			videoId = bs.Dom( videos[i] ).S('@data-video-id');
			if( playlist.indexOf(videoId) < 0 ) playlist.push( videoId );
			else continue;
			videoIdx = searchResults.indexOf(videoId);
			bs.Dom('#playlists').S('>',
				bs.Dom('<li>').S('class+', 'playlist', '@data-video-id', videoId, '>',
					bs.Dom('<img>').S('@align', 'left', '@src', searchResults[++videoIdx], '@title', searchResults[++videoIdx],
					'@alt', searchResults[videoIdx], 'this'),
				'html+', searchResults[videoIdx], 'this')
			);
		}
		bs.Dom('@li.playlist').S( 'click', function(){
			var classes = bs.Dom(this).S('class').split(' ');
			if( classes.indexOf('on') > -1 ){ bs.Dom(this).S('class-', 'on');}
			else{ bs.Dom(this).S('class+', 'on');}
		} );
		console.log(playlist);
		bs.save('playlist', playlist);
		bs.save('searchResult', searchResults);
		player.cuePlaylist( playlist, 0, 0, 'default');
		if( bs.DETECT.os.charAt(0) != 'i' ) bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
	}
	bs.Dom('#btPlaylist').S( 'click', savePlaylist);
	bs.Dom('#btTrash').S( 'click', function(){
		var videos = bs.Dom('@li.playlist.on'), videoIdx;
		var len = videos.length;
		for (var i=0; i<len; i++) {
			videoId = bs.Dom( videos[i] ).S('@data-video-id');
			playlist.splice( playlist.indexOf(videoId), 1 );
		}
		console.log(playlist);
		bs.Dom('#playlists').S('html', '');
		len = playlist.length;
		for(var i=0; i<len; i++) {
			videoIdx = searchResults.indexOf(playlist[i]);
			bs.Dom('#playlists').S('>',
				bs.Dom('<li>').S('class+', 'playlist', '@data-video-id', videoId, '>',
					bs.Dom('<img>').S('@align', 'left', '@src', searchResults[++videoIdx], '@title', searchResults[++videoIdx],
					'@alt', searchResults[videoIdx], 'this'),
				'html+', searchResults[videoIdx], 'this')
			);
		}
		bs.Dom('@li.playlist').S( 'click', function(){
			var classes = bs.Dom(this).S('class').split(' ');
			if( classes.indexOf('on') > -1 ){ bs.Dom(this).S('class-', 'on');}
			else{ bs.Dom(this).S('class+', 'on');}
		} );
		bs.save('playlist', playlist);
		bs.save('searchResult', searchResults);
		player.cuePlaylist( playlist, 0, 0, 'default');
		if( bs.DETECT.os.charAt(0) != 'i' ) bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
	});
	if( bs.DETECT.os.charAt(0) != 'i' ){
		bs.Dom('#prevPL').S( 'click', function(){
			player.previousVideo();
		});
		bs.Dom('#nextPL').S( 'click', function(){
			player.nextVideo();
		});
	}
});