let srt2vtt = require('srt-to-vtt');
let fs = require('fs');

let MediaControls = {
  "state":{},
  "playPauseBtn":'',
  "muteBtn":'',
  "progressBar":'',
  "barVolume":'',
  "contentList":'',
  "mediaPlayList":'',
  "files":[],
  "nameVideo":'',
  "subtitles":'',
  "init":function() {
    MediaControls.state.playlist      = [];
    MediaControls.state.name          = '';
    MediaControls.state.ext           = '';
    MediaControls.state.path          = '';
    MediaControls.state.value         = 1;
    MediaControls.state.time          ='00:00';
    MediaControls.state.Totaltime     ='00:00';
    MediaControls.mediaVideo          = document.getElementById('mediaVideo');//$('#mediaVideo');
    MediaControls.playPauseBtn        = document.getElementById('playPauseBtn');//$('#playPauseBtn');
    MediaControls.muteBtn             = document.getElementById('muteBtn');//$('#muteBtn');
    MediaControls.progressBar         = document.getElementById('progressBar');//$('#progressBar');
    MediaControls.barVolume           = document.getElementById('barVolume');//$('#barVolume');
    MediaControls.time                = $('#time');
    MediaControls.totalTime           = $('#totalTime');
    MediaControls.contentList         = $('.content-list');
    MediaControls.mediaPlayList       = $('#media-play-list');
    MediaControls.nameVideo           = $('.name-video');
    MediaControls.subtitles           = $('#subtitles');
    MediaControls.mediaVideo.controls = false;
    MediaControls.mediaVideo.addEventListener('timeupdate', MediaControls.updateProgressBar, false);
  },
  "showChromecast":function(){
    $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
    MediaControls.mediaVideo.pause();
    MediaControls.toggleChromecast();
  },
  "loadVideosFiles":function(vid){
    let files = vid.target.files;
    MediaControls.files = files;
    let tam    = files.length;
    let videos = [tam];
    let item = "";
    if(tam>0){
    //MediaControls.contentList.html("");
    let ultimaPos = MediaControls.state.playlist.length;
    for(let v=0; v < tam; v++){
       videos[v] = {name:files[v].name,path:files[v].path};
       item = "<div  class='playlist'  onclick=\"MediaControls.loadVideoSingle('"+files[v].path+"')\" >"+files[v].name+"</div>";
       MediaControls.contentList.append(item);
       MediaControls.state.playlist.push(videos[v]);
       console.log(MediaControls.contentList.text()+"\n\n");
    }
      console.log("Tamanho da lista de vídeos: "+MediaControls.state.playlist.length);
      let tamList = MediaControls.state.playlist.length -1;
      if(tamList == 0){
        MediaControls.loadVideoSingle(MediaControls.state.playlist[tamList].path);
      }else if(videos.length>1){
        MediaControls.loadVideoSingle(MediaControls.state.playlist[ultimaPos].path);
      }

   }
  },
  "loadVideoSingle":function(vi){
    MediaControls.fadeOutControls("camadaPausePlay");
    $("#preloader").fadeIn("slow");
    console.log("Vídeo => "+vi);
    let pathFull  = vi;
    let path = pathFull.split('/');
    let tamP = path.length -1;
    let name = path[tamP]; // pega a última posição do array que contém o nome do arquivo com a extensão
    let e     = name.split('.');
    let tamE = e.length - 1;
    let ext   = e[tamE]; // pega a última posição do array que contém a extensão do arquivo
    let namePure = "";
      for(let n=0; n < tamE; n++){
        namePure+=e[n]+".";
      }
    let pathPure = "";
      for(let p=0; p < tamP; p++){
        pathPure+=path[p]+"/";
      }
        console.log("Nome Puro => "+namePure);
        console.log("Caminho Puro => "+pathPure);
    let srt = pathPure+"/"+namePure+"srt";
    let subtitles = pathPure+"/"+namePure+"vtt";
    let legend = false;
      if (fs.existsSync(srt)) {
        fs.createReadStream(srt)
          .pipe(srt2vtt())
          .pipe(fs.createWriteStream(subtitles));
          legend = true;
        }
    /* Fazer a validação depois */
    // if (MediaControls.canPlayVideo(ext)) {
    //   // Reset the player, change the source file and load it
    //   MediaControls.resetVideo();
    //   MediaControls.setState({video: file, ext:ext});
    //   MediaControls.mediaVideo.load();
    // }
    /* Fazer a validação depois */
    MediaControls.resetVideo();
    MediaControls.state.name = name;
    MediaControls.state.ext  = ext;
    MediaControls.state.path = pathFull;
    setTimeout(function(){
      let d = new Date();
      console.log("Convertendo legenda...");
        (legend)?MediaControls.subtitles.attr('src', subtitles):MediaControls.subtitles.attr('src', '');
        MediaControls.mediaVideo.src = MediaControls.state.path;
        MediaControls.mediaVideo.load();
        MediaControls.nameVideo.html(namePure.substring(0, 30)+"... ."+ext);
        MediaControls.mediaVideo.play();
        $('#media-play-list').fadeOut();
        $('.icon-play-pause').html('pause');
        $("#preloader").fadeOut("slow");
    }, 2000);

  },
  "loadNextVideo":function(name){
    if((MediaControls.state.name != "example.mp4") && (MediaControls.state.name != "")){
      let lista = MediaControls.state.playlist;
      let tam   = lista.length;
      tam--;
      let index = MediaControls.tofindIndexByKeyValue(lista, "name", name);
      index++;
      if(index<=tam){
        //MediaControls.changeButtonType(MediaControls.playPauseBtn, 'pause');
        $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
        console.log("Carregando Próximo Vídeo => "+lista[index].name);
        MediaControls.loadVideoSingle(lista[index].path);
      }else{
        //MediaControls.changeButtonType(MediaControls.playPauseBtn, 'play');
        $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
      }

    }
  },
  "tofindIndexByKeyValue":function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  },
  "changeButtonType":function(btn, value) {
    btn.title = value;
    btn.className = value;
  },
  "playVideo":function() {
    if((MediaControls.state.name != "")){
      if (MediaControls.mediaVideo.paused || MediaControls.mediaVideo.ended) {
        // Change the button to be a pause button
        $('.icon-play-pause').html('pause');
        MediaControls.fadeOutControls("camadaPausePlay");
        // Play the media
        MediaControls.mediaVideo.play();
      }
      // Otherwise it must currently be playing
      else {
        // Change the button to be a play button
        $('.icon-play-pause').html('play_arrow');
        MediaControls.fadeInControls("camadaPausePlay");
        // Pause the media
        MediaControls.mediaVideo.pause();
      }
    }
  },
  "stopVideo":function() {
 	  MediaControls.mediaVideo.pause();
 	  MediaControls.mediaVideo.currentTime = 0;
    $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
  },
  "updateProgressBar":function() {
    // Work out how much of the media has played via the duration and currentTime parameters
    let percentage = Math.floor((100 / MediaControls.mediaVideo.duration) * MediaControls.mediaVideo.currentTime);
     // Update the progress bar's value
     MediaControls.progressBar.value = (percentage>0)?percentage:0;
     console.log("porcentagem do vídeo: "+MediaControls.progressBar.value+ '% played');
     // Update the progress bar's text (for browsers that don't support the progress element)
     MediaControls.progressBar.innerHTML = MediaControls.progressBar.value + '% played';
      if(MediaControls.mediaVideo.ended){
        $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
        let name = MediaControls.state.name;
        console.log("Concluiu o Vídeo => "+name);
        MediaControls.loadNextVideo(name);
      }else{
        let duration =Math.floor(MediaControls.mediaVideo.duration);
        MediaControls.state.totalTime = MediaControls.formatTime(duration);
        MediaControls.totalTime.html(MediaControls.state.totalTime);
        let time = MediaControls.mediaVideo.currentTime.toFixed(0);
        MediaControls.state.time = MediaControls.formatTime(time);
        MediaControls.time.html(MediaControls.state.time);

      }
  },
  "formatTime":function(secs) {
   let hours = (secs / 3600) | 0
   let mins = ((secs - hours * 3600) / 60) | 0
   secs = (secs - (3600 * hours + 60 * mins)) | 0
   if (mins < 10){ mins = '0' + mins;}
   if (secs < 10){ secs = '0' + secs;}
   return (hours ? hours + ':' : '') + mins + ':' + secs;
  },
  "timeUpdateVideo":function(e) {
    let pos = e.pageX - MediaControls.progressBar.offsetLeft;
    let maxduration = MediaControls.mediaVideo.duration;
    let percent = 100 * pos / MediaControls.progressBar.offsetWidth;
      //Check within range
      if(percent > 100) {
        percent = 100;
      }
      if(percent < 0) {
        percent = 0;
      }
        let currentTime = maxduration * percent / 100;
        MediaControls.mediaVideo.currentTime = currentTime;
        MediaControls.progressBar.value = Math.floor((percent / 100));
        MediaControls.progressBar.innerHTML = MediaControls.progressBar.value + '% played';
  },
  "changeVolumeBar":function(){
    MediaControls.mediaVideo.volume = MediaControls.barVolume.value;
    MediaControls.state.value       = MediaControls.barVolume.value;
  },
  toggleMute:function(){
    if (MediaControls.mediaVideo.muted) {
      // Change the cutton to be a mute button
      //MediaControls.changeButtonType(MediaControls.muteBtn, 'mute');
      // Unmute the media player
      MediaControls.mediaVideo.muted = false;
    }
    else {
      // Change the button to be an unmute button
      //MediaControls.changeButtonType(MediaControls.muteBtn, 'unmute');
      // Mute the media player
      MediaControls.mediaVideo.muted = true;
    }
  },
  "canPlayVideo":function(ext) {
    console.log("EXT validação => "+ext);
    let ableToPlay = MediaControls.mediaVideo.canPlayType('videos/' + ext);
    console.log("ableToPlay => "+ableToPlay)
    if(ableToPlay == ''){
      return false;
    }else{
      return true ;
    }
  },
  "resetVideo":function(){
     MediaControls.progressBar.value = 0;
     MediaControls.mediaVideo.currentTime = 0;
    // MediaControls.changeButtonType(MediaControls.playPauseBtn, 'pause');
    $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
  },
  "replayVideo":function(){
    MediaControls.resetVideo();
    MediaControls.mediaVideo.play();
  },
  "setfullScreen":function(){
    if( window.innerHeight == screen.height) {
      document.webkitCancelFullScreen();
    //MediaControls.mediaVideo.webkitCancelFullScreen();
    }else{
      MediaControls.mediaVideo.webkitRequestFullScreen();
    }


  },
  "hoverMenu":function(){
    $("#media-play-list").fadeToggle( "slow", "linear" );
  },
  "fadeInControls":function(id){
    $("#"+id).removeClass("vjs-fade-out");
  },
  "fadeOutControls":function(id){
    $("#"+id).addClass("vjs-fade-out");
  },
  "toggleChromecast":function(){
    $("#camadaChromecast").fadeToggle( "slow", "linear" );
  },
  "toggleControls":function(){
    $("#mediaControls").toggleClass( 'vjs-fade-out');

  }
};

module.exports = MediaControls;
