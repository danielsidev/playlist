

<h1 align="center"> Playlist</h1>
<p align="center">
  <img width="200"  src="http://danielsiqueira.net/playlist/playlist-logo-completa-peq.png">
</p>
Software for video playback and for to share with chromecast.
Developed with Electron, NodeJS, Javascript and JQuery.

### Download to MacOs executable here:


https://danielsiqueira.net/playlist/macos/Playlist.zip


* To run the application on macos, enable the option to allow software from any source. Step by step => <a href="http://www.techtudo.com.br/dicas-e-tutoriais/noticia/2013/10/como-instalar-aplicativos-de-fora-da-mac-app-store-no-os-x-mavericks.html">Techtudo: Run software outside the apple store</a>

* Requires network discovery to share the video with the chromecast. Be sure to enable guest mode to make the chromecast public on the network.

### About video formats and subtitles
----------
The first version support videos mp4 and subtitles srt
The app convert the subtitles srt in subtitles vtt while load the movie
To load the correctly subtitle  put the subtitle with same name of the video in same folder

### Controls with mouse and keyboard
----------
> On keyboard:
- v or l => Open display to load videos
- p or space-bar => Play/pause
- m => Open menu with playlist of videos
- u => Change to Mute/ With sound
- f =>  Enter full screen / Exit full screen
- q = > Quit App

### Instructions
----------
* Require mdns module native

In the root of project..  
First excute:
> sudo npm install

*This will make download from dependecies*
----------

After, execute:
>  sudo npm start

*Start the electron with the aplication*
----------
### About mdns module( It is a module necessary  to create the communicate with chromecast ):
In root of project....
> If you get some error on linux , try:

On Linux make the install with:
> sudo npm run ubuntu-mdns && sudo npm run dependecy-ubuntu

If you have problems with permission EACCES make this:
> sudo npm run permission


To Generate Executable: to macos
>  npm run pack-osx ( will generate a executable for macos )
----------

To Install: to linux (.deb)
> npm run pack-linux64 ( will request your password to a permission write )
> npm run install-deb64 ( will allocate the package in home/$USER/playlist and will create a shortcut on program list and will open the app )
----------

To Generate Executable: to windows
>  npm run pack-win64 ( no test for now - help me test )
----------

### To contribute with the project, make a fork of it
 Follow this steps( Web site in portuguese ):
 https://imasters.com.br/desenvolvimento/como-contribuir-com-um-projeto-no-github/?trace=1519021197&source=single
