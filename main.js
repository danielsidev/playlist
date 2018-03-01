const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
// previne o modo sleep, mantendo o computador ligado
const id = electron.powerSaveBlocker.start("prevent-display-sleep");
console.log("Power Save Blocker Started: ", electron.powerSaveBlocker.isStarted(id));
let mainWindow;
console.log("Sistema Operacional: "+process.platform);
var frame  = (process.platform === 'win32' || process.platform === 'linux')?true:false;
var altura = (frame)?480:455;
function createWindow () {
  // Create the browser window main.
  mainWindow = new BrowserWindow({
      width: 800,
      height: altura,
      frame: frame,
      show: false,
      transparent: true,
      title:'Playlist',
      center: true,
      backgroundColor: '#000000',
      icon: path.join(__dirname, 'src/assets/images/playlist-logo.png')

    });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindow.once('ready-to-show', () => {
   splash.destroy();
   mainWindow.show();
 });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  // create a new `splash`-Window
 splash = new BrowserWindow({width: 810, height: 610, transparent: true, frame: false, alwaysOnTop: true});
 splash.loadURL(url.format({
   pathname: path.join(__dirname, 'preload.html'),
   protocol: 'file:',
   slashes: true
 }));
 createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
