// electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
// const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1200,
    titleBarStyle: 'default',
    // frame: false,
    autoHideMenuBar: true,
    icon: 'public/@brand/logo/Logo-White.png',
    tabbingIdentifier: 'Protium',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startURL = 'https://test.Protium.com/';

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('new-window-for-tab', (event, url) => {
  event.preventDefault();
  mainWindow.loadURL(url);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
