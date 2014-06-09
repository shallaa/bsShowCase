/*
	쥬크박스(pekuid@gmail.com)
	http://developers.google.com/youtube
	https://console.developers.google.com/project
	https://developers.google.com/youtube/v3/docs/search/list
	https://developers.google.com/youtube/iframe_api_reference
*/
var player, app;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '360',
		width: '640',
		videoId: 'nQm_9nbY_7U',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	//event.target.playVideo();
	player.setLoop(true);
	//player.setShuffle(true);
}

function onPlayerStateChange(event) {
	var els;
	if( event.data == YT.PlayerState.ENDED ){
		player.nextVideo();
	}else	if( event.data == YT.PlayerState.PLAYING){
		bs.Dom('@li.playlist').S('class-', 'playing');
		els = bs.Dom('@li.playlist');
		for(var i = 0; i < els.length; i++){
			if( bs.Dom( els[i] ).S('@data-video-id') == player.getVideoData().video_id ){
				bs.Dom( els[i] ).S('class+', 'playing');
			}
		}
	}
}
bs.plugin( 'save', 'last' );
bs(function(){
	var playlist = [], searchResults = [], t0;
	bs.css('youtube.css');
	if( t0 = bs.save('playlist') ){
		playlist = t0.split(',');
	}
	if( t0 = bs.save('searchResult') ){
		searchResults = t0.split(',');
	}
	(function(){
		var videoId, videoIdx;
		var len = playlist.length;
		console.log(len)
		for (var i=0; i<len; i++) {
			videoId = playlist[i];
			videoIdx = searchResults.indexOf(videoId);
			bs.Dom('#playlists').S('>',
				bs.tmpl( "<li class='playlist' data-video-id='@1@'>" +
						'<img align="left" src="@2@" title="@3@" alt="@4@">@5@' +
					"</li>",
					{"1":videoId,"2":searchResults[++videoIdx],"3":searchResults[++videoIdx],"4":searchResults[videoIdx],"5":searchResults[videoIdx]}
				)
			);
		};
		bs.Dom('@li.playlist').S( 'click', function(){
			var classes = bs.Dom(this).S('class').split(' ');
			if( classes.indexOf('on') > -1 ){ bs.Dom(this).S('class-', 'on');}
			else{ bs.Dom(this).S('class+', 'on');}
		} );
		player.cuePlaylist( playlist, 0, 0, 'default'); // TODO
		bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
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
				if( !searchResults.indexOf(videoId) > -1 ){
					searchResults.push(videoId);
					searchResults.push(thumbD);
					searchResults.push(title);
				}
				if( type != 'youtube#video' ) continue;
				bs.Dom('#searchResults').S('>',
					bs.tmpl( "<li class='results' data-video-id='@1@'>" +
							'<img align="left" src="@2@" title="@3@" alt="@4@">@5@' +
						"</li>",
						{"1":videoId,"2":thumbD,"3":title,"4":title,"5":title}
					)
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
	bs.Dom('#play').S( 'click', function(){
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
				bs.tmpl( "<li class='playlist' data-video-id='@1@'>" +
						'<img align="left" src="@2@" title="@3@" alt="@4@">@5@' +
					"</li>",
					{"1":videoId,"2":searchResults[++videoIdx],"3":searchResults[++videoIdx],"4":searchResults[videoIdx],"5":searchResults[videoIdx]}
				)
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
		bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
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
				bs.tmpl( "<li class='playlist' data-video-id='@1@'>" +
						'<img align="left" src="@2@" title="@3@" alt="@4@">@5@' +
					"</li>",
					{"1":videoId,"2":searchResults[++videoIdx],"3":searchResults[++videoIdx],"4":searchResults[videoIdx],"5":searchResults[videoIdx]}
				)
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
		bs.Dom('#play i').S('class-', 'fa-pause', 'class+', 'fa-play');
	});
	bs.Dom('#prevPL').S( 'click', function(){
		player.previousVideo();
	});
	bs.Dom('#nextPL').S( 'click', function(){
		player.nextVideo();
	});
});