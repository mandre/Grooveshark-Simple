//using experimental unsafeWindow - Bug 660780
var GS = unsafeWindow.GS;

self.port.on("play", function () {
  if(GS.player.isPaused) {
    GS.player.resumeSong();
  } else {
    GS.player.playSong();
  }
});

self.port.on("pause", function () GS.player.pauseSong() );
self.port.on("next", function () GS.player.nextSong() );
self.port.on("previous", function () GS.player.previousSong() );

try{
  function unloadListener(e){
    self.port.emit("unload");
    return true;
  }

  function stoppedListener(song){
    self.port.emit("stopped", {"songsQueued":song.AlbumID > 0});
  }

  function playingListener(event){
      self.port.emit("nowPlaying", {"song":event.activeSong, "notify": false});
  }

  var jQuery = unsafeWindow.jQuery;
  jQuery(unsafeWindow).unload(unloadListener);
  jQuery.subscribe("gs.player.playing", playingListener);
  jQuery.subscribe("gs.player.stopped", stoppedListener);

} catch(e) { };
