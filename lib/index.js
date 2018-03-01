
var player = require('chromecast-player')();
var chalk = require('chalk');
var keypress = require('keypress');
var circulate = require('array-loop');
var xtend = require('xtend');
var shuffle = require('array-shuffle');
var unformatTime = require('./utils/unformat-time');
var debug = require('debug')('castnow');
var debouncedSeeker = require('debounced-seeker');
var noop = function() {};

// plugins
var directories = require('./plugins/directories');
var xspf = require('./plugins/xspf');
var localfile = require('./plugins/localfile');
var torrent = require('./plugins/torrent');
var transcode = require('./plugins/transcode');
var subtitles = require('./plugins/subtitles');
var stdin = require('./plugins/stdin');


//exibe status

function fatalError(err) {
  console.log(chalk.red(err));
//process.exit();
}

var last = function(fn, l) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    args.push(l);
    l = fn.apply(null, args);
    return l;
  };
};

var ctrl = function(err, p, ctx) {
    if (err) {
      console.log(chalk.red(err));
      //process.exit();
    }

    var playlist = ctx.options.playlist;

      ctx.once('closed', function() {
        console.log(chalk.red('lost connection'));
        //process.exit();
      });

      if (!ctx.options.disableTimeline) {
        p.on('position', function(pos) {
          console.log("=> "+pos.percent);
        });
      }

      var seek = debouncedSeeker(function(offset) {
        if (ctx.options.disableSeek || offset === 0) return;
        var seconds = Math.max(0, (p.getPosition() / 1000) + offset);
        console.log('seeking to '+seconds);
        p.seek(seconds);
      }, 500);

      var updateTitle = function() {
        p.getStatus(function(err, status) {
          if (!status || !status.media ||
            !status.media.metadata ||
            !status.media.metadata.title){ return; }

            var metadata = status.media.metadata;
            var title;
            if (metadata.artist) {
              title = 'Playlist: ' + metadata.artist + ' - ' + metadata.title;
            } else {
              title = 'Playlist: ' + metadata.title;
            }
            console.log("State -Source => "+title);

          });
        };

        var initialSeek = function() {
          var seconds = unformatTime(ctx.options.seek);
          console.log('seeking to '+seconds);
          p.seek(seconds);
        };

        p.on('playing', updateTitle);

        if (!ctx.options.disableSeek && ctx.options.seek) {
          p.once('playing', initialSeek);
        }

        updateTitle();

        var nextInPlaylist = function() {
          if (ctx.mode !== 'launch'){ return;}
          if (!playlist.length){
            console.log("Não existem mais vídeos...Acabou a playlist."); return  false;//process.exit();
          }
          p.stop(function() {
            console.log("State => Stop");
            console.log('loading next in playlist: '+playlist[0]);
            p.load(playlist[0], noop);
            var file = playlist.shift();
            if (ctx.options.loop){ playlist.push(file);}
          });
        };

        p.on('status', last(function(status, memo) {
          if (status.playerState == 'PLAYING'){
            $('.icon-cast').html('cast_connected');
            $('.icon-cast').css("color","#e1c72c");
            $("#load-cast").fadeIn();
            $("#tipo-load-cast").removeClass( "determinate" );
            $("#tipo-load-cast").addClass( "indeterminate" );
            $(".icon-play-cast").html('pause');

            return;//process.exit();
          }
          if (status.playerState !== 'IDLE') {
            $("#tipo-load-cast").removeClass( "indeterminate" );
            $("#tipo-load-cast").addClass( "determinate" );
            $('.icon-cast').css("color","#fff");
            $("#tipo-load-cast").css("width","0px");
             return;
           }
          if (status.idleReason !== 'FINISHED'){
            $("#tipo-load-cast").removeClass( "indeterminate" );
            $("#tipo-load-cast").addClass( "determinate" );
            $("#tipo-load-cast").css("width","0px");
            $('.icon-cast').css("color","#fff");
            $('.icon-cast').html('cast');
            $("#load-cast").fadeOut();
             return; }
          if (memo && memo.playerState === 'IDLE'){
            $("#tipo-load-cast").removeClass( "indeterminate" );
            $("#tipo-load-cast").addClass( "determinate" );
            $("#tipo-load-cast").css("width","0px");
            $('.icon-cast').css("color","#fff");
            return;
          }
          nextInPlaylist();
          return status;
        }));
}; //Fecha ctrl = function()

var capitalize = function(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};

var logState = (function() {
  var inter;
  return function(status) {
    if (inter){ clearInterval(inter); }
    document.getElementById('camadaChromecastStatus').innerHTML=capitalize(status)+"...";
    console.log('player status: '+status);      
    inter = setInterval(function() {
      document.getElementById('camadaChromecastStatus').innerHTML=capitalize(status)+"...";
      console.log(capitalize(status)+"...");
    }, 300);
  };
})();

player.use(function(ctx, next) {
  ctx.on('status', logState);
  next();
});

player.use(stdin);
player.use(directories);
player.use(torrent);
player.use(xspf);
player.use(localfile);
player.use(transcode);
player.use(subtitles);

player.use(function(ctx, next) {
  if (ctx.mode !== 'launch'){ return next(); }
  if (ctx.options.shuffle){ ctx.options.playlist = shuffle(ctx.options.playlist);}
      ctx.options = xtend(ctx.options, ctx.options.playlist[0]);
      var file = ctx.options.playlist.shift();
  if (ctx.options.loop){ ctx.options.playlist.push(file); }
  next();
});

//console.log('Carregando vídeo...');
//player.launch(opts, ctrl);

//player.launch(opts, ctrl);
process.on('SIGINT', function() {
  console.log("SIGINT => Conclui carregamento!")
  //process.exit();
});

process.on('exit', function() {
  //oculta barra de progresso
});

module.exports.player = player;
module.exports.ctrl = ctrl;
