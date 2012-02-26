const widgets = require("widget");
const panels = require("panel");
const data = require("self").data;
const pageMod = require("page-mod");

//Global Flags
var uiReady = false;
var musicPlaying = false;
var songsQueued = false;

var gsPageMod = pageMod.PageMod({
  include: [
    'http://grooveshark.com/*',
    'http://listen.grooveshark.com/*',
    'http://preview.grooveshark.com/*'
  ],
  contentScriptWhen: 'end',
  contentScriptFile: data.url('pageMod.js'),
  onAttach: function onAttach(worker, mod) {
    if(!uiReady) {

      let wgPreviousSong = widgets.Widget({
        label:"Previous Song",
        id: 'wgPreviousSong',
        content: '<img src="'+data.url('ui/icons/control-skip-180.png') +
                 '" style="cursor:pointer;"/>',
        onClick: function() {if(songsQueued) worker.port.emit('previous')}
      });

      let wgPlayPauseSong = widgets.Widget({
        label:"Play Song",
        id: 'wgPlayPauseSong',
        content: '<img src="'+data.url('ui/icons/control.png') +
         '" style="cursor:pointer;"/>',
        onClick: function(){
          if(!musicPlaying) {
            if(songsQueued) {
              worker.port.emit('play')
              this.content = '<img src="'+data.url('ui/icons/control-pause.png') +
                             '" style="cursor:pointer;"/>';
              this.tooltip = "Pause Song";
              musicPlaying = true;
            }
          } else {
            worker.port.emit('pause')
            this.content = '<img src="'+data.url('ui/icons/control.png') +
                           '" style="cursor:pointer;"/>';
            this.tooltip = "Play Song";
            musicPlaying = false;
          }
        }
      });

      let wgNextSong = widgets.Widget({
        label:"Next Song",
        id: 'wgNextSong',
        content: '<div><img src="'+data.url('ui/icons/control-skip.png') +
                 '" style="cursor:pointer; float:left; width:16px"/></div>',
        onClick: function() {if(songsQueued)worker.port.emit('next')},
        width: 16
      });

      uiReady = true;
      worker.port.on("unload", function (msg) {
        wgPlayPauseSong.destroy();
        wgPreviousSong.destroy();
        wgNextSong.destroy();
        uiReady = false;
      });

      worker.port.on("nowPlaying", function (msg) {
        musicPlaying = true;
        songsQueued = true;
        wgPlayPauseSong.content = '<img src="'+data.url('ui/icons/control-pause.png') +
                             '" style="cursor:pointer;"/>';
        wgPlayPauseSong.tooltip = "Pause Song";
      });

      worker.port.on("stopped", function (msg) {
        wgPlayPauseSong.content = '<img src="'+data.url('ui/icons/control.png') +
                       '" style="cursor:pointer;"/>';
        wgPlayPauseSong.tooltip = "Play Song";
        musicPlaying = false;
        songsQueued = msg.songsQueued;
      });
    }
  }
});


//Developing shortcut
//require("tabs").activeTab.url = 'http://grooveshark.com';
