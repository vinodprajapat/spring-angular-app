(function() {
  'use strict';

  // For our Java app, we want to spawn it and run in background
  var spawn = require('child_process').spawn;
  var fs = require('fs');
  var out = fs.openSync('./out.log', 'a');
  var err = fs.openSync('./out.log', 'a');
  var child = spawn('java', ['-jar', __dirname + '/app.jar'], {
    detached: true,
    stdio: ['ignore', out, err]
  });
  child.unref();

  var electron = require('electron');
  var app = electron.app; // Module to control application life.
  var BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  var mainWindow;

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 700
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });

  app.on('quit', function() {
    // Close and destroy the JAVA process
    child.kill('SIGINT');
  });

})();
