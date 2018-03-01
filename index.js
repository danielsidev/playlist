const Chromecast      = require('./lib');
const MediaControls   = require('./src/controller/mediaControls');
const MediaChromecast = require('./src/controller/mediaChromecast');
/* onload - jquery */
$(function(){

    MediaControls.init();
    MediaChromecast.init(Chromecast);
    MediaControls.fadeOutControls("camadaPausePlay");

    $('#chromecastBtn').click(function(){
        if(MediaControls.state.playlist.length >0){
            MediaControls.mediaVideo.pause();
            MediaControls.fadeOutControls("camadaPausePlay");
            $("#camadaConfirmaChromecast").fadeIn();
        }else{
            alert("Primeiro carregue um vídeo e só depois compartilhe no Chromecast!");
        }
    });

    $('#enviarVideoCancelar').click(function(){
        $("#camadaConfirmaChromecast").fadeOut();
    });
    $('#enviarVideo').click(function(){
            let device = $("#device").val();
            device = (device.length==0 || device=="")?null:device;
            MediaChromecast.sendVideoChromecast(device);
            $("#camadaConfirmaChromecast").fadeOut();
    });

    $('#muteBtn').click(function(){
          MediaControls.toggleMute();
          $('.icon-volume').html($('.icon-volume').text() == 'volume_up' ? 'volume_off' : 'volume_up');
    });
    $("#playPauseBtnCast").click(function(){
      $(".icon-play-cast").html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
      $(".playCast").css("background","#2a70b1 !important");
    });

    $('#fullscreenBtn').click(function(){
        MediaControls.setfullScreen();
        $('.icon-fullscreen').html($('.icon-fullscreen').text() == 'fullscreen' ? 'fullscreen_exit' : 'fullscreen');
    });

    $('#menuBtn').click(function(){ MediaControls.hoverMenu(); });

    $('#progressBar').mousedown(function(e){ MediaControls.timeUpdateVideo(e); });

    $('#mediaVideo').click(function(){
       MediaControls.playVideo();
       MediaControls.fadeInControls("mediaControls");
     });

    $('#mediaVideo').mousemove(function(){
      if( window.innerHeight == screen.height) {
      console.log("Estamos em FullScreen! ");
      $('#mediaControls').css("bottom","0%");
      MediaControls.fadeOutControls("mediaControls");
      $('#mediaControls').mouseomove(function(){ MediaControls.fadeInControls("mediaControls"); });

    }else{
      console.log("NÃO estamos em FullScreen! ");
      $('#mediaControls').css("bottom","8%");
      $('#mediaVideo').mouseenter(function(){ MediaControls.fadeInControls("mediaControls"); });
      $('#mediaVideo').mouseleave(function(){ MediaControls.fadeOutControls("mediaControls"); });
      $('#mediaControls').mouseover(function(){ MediaControls.fadeInControls("mediaControls"); });
      $('#mediaControls').mouseout(function(){ MediaControls.fadeOutControls("mediaControls"); });
    }
    });


    $('#progressBar').mousedown(function(e){ MediaControls.timeUpdateVideo(e); });

    $('#playPauseBtn').click(function(){
        $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
      MediaControls.playVideo();
    });

    $('#videosBtn').change(function(e){ MediaControls.loadVideosFiles(e); });



    $(".btn-file-online, #btnFechar").click(function(){
        $("#camadaVideoOnline").fadeToggle( "slow", "linear" );
    });

    $("#carregarVideoOnline").click(function(){
      let url = $("#videoOnline").val();
      console.log("URL: "+url);
      if(url!==""){
        let vid = { "target":{"files":[]}};
        let link = url.split('/');
        let name = link[url.length -1];
        vid.target.files[0] ={"name":name,"path":url};
        console.log("URL Objeto: "+JSON.stringify(vid));
        MediaControls.loadVideosFiles(vid);
        $("#camadaVideoOnline").fadeToggle( "slow", "linear" );
      }
    });

    $('.btnFechar').click(function(){
      $('#media-play-list').fadeOut();
    });

    $("#preloader").fadeOut("slow");

});
$(document).keydown(function(e) {
  const remote = require('electron').remote;
  let janela = remote.getCurrentWindow();
  console.log("Tecla pressionada: "+e.keyCode);
switch(e.keyCode) {

    case 86:/* v => Abre a janela para escolher o vídeo */
    case 76:/* l => Abre a janela para escolher o vídeo */
      $('#videosBtn').click();
    break;
    case 80:/* p => play/pause */
    case 32:/* barra de espaço  => play/pause */
      $('.icon-play-pause').html($('.icon-play-pause').text() == 'play_arrow' ? 'pause' : 'play_arrow');
      MediaControls.playVideo();
      break;
    case 70: /* f => Fullscreen */
      MediaControls.setfullScreen();
      $('.icon-fullscreen').html($('.icon-fullscreen').text() == 'fullscreen' ? 'fullscreen_exit' : 'fullscreen');
      break;
    case 81: /* q => Quit => Fehc a janela ( No mac mantém o processo aberto) */
      janela.close();
        break;
    case 77: /* m => Menu = > Abre/Fecha o menu */
      MediaControls.hoverMenu();
      break;
    case 85: /* u => Unvoice ( Mudo ) / Retorna o som */
      MediaControls.toggleMute();
      $('.icon-volume').html($('.icon-volume').text() == 'volume_up' ? 'volume_off' : 'volume_up');
      break;

    default:

  }
});
