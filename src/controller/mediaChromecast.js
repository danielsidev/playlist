let MediaChromecast = {
     "player":'',
     "ctrl":'',
     "media":{
         "playlist":[],
         /* Comandos Possíveis:
            --device 'Nome do Chromecast', --address 'IP do Chromecast',
            --subtitles 'Caminho da legenda.srt', --subtitle-color #FFFFFFFF //RGBA//
            --tomp4 //converte para mp4//
            Exemplo: "command":"--device 'Sala', --subtitles '/home/maria/downloads/legenda.srt'"
          */
         "command":""
     },
     "videos":[],
    "init":function(Chromecast){
      MediaChromecast.player = Chromecast.player;
      MediaChromecast.ctrl   = Chromecast.ctrl;
    },
    "play":function(){
      MediaChromecast.player.attach(function(err, p) {
        if (p.currentSession.playerState === 'PLAYING') {
          p.pause();
        } else if (p.currentSession.playerState === 'PAUSED') {
          p.play();
        }
      });
    },
    "stop":function(){
      MediaChromecast.player.attach(function(err, p) {
        p.stop();
      });
      MediaControls.stopVideo();
      MediaControls.toggleChromecast();
    },
    "sendVideoChromecast":function(device) {
     MediaChromecast.media.command = (device==null || device=="")? "":"--device '"+device+"'";    
     let videos = MediaControls.state.playlist;
     let tam = videos.length;
      if(tam >0){
         MediaControls.showChromecast();
          for(let i = 0;i<tam; i++) {
            let e     = videos[i].path.split('.');
            let ext   = e[e.length - 1];
            videos[i].path = videos[i].path;//(ext=="avi" || ext=="mkv")?videos[i].path+" --tomp4":videos[i].path;
            console.log("Vídeo com extensão => "+ext);
            let vi = {path:videos[i].path};
            MediaChromecast.media.playlist.push(vi);
          }

            if(!MediaChromecast.media.playlist) {
              console.log('attaching...');
              MediaChromecast.player.attach(MediaChromecast.media, MediaChromecast.ctrl);
            }else {
              console.log('launching...');
              MediaChromecast.player.launch(MediaChromecast.media, MediaChromecast.ctrl);
            }
      }
    },
    bytesToSize:function(bytes) {
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0){return '0 Byte';}
          let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
};

module.exports = MediaChromecast;
