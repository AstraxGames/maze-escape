const { app, BrowserWindow, globalShortcut } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
    win = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // Intercept F11 to cleanly toggle fullscreen without small window bugs
    globalShortcut.register('F11', () => {
        if (win) {
            const isFullScreen = win.isFullScreen();
            win.setFullScreen(!isFullScreen);
        }
    });

    // Check for updates automatically in background after launching
    autoUpdater.checkForUpdatesAndNotify();
}

// Auto-updater logs & events
autoUpdater.on('update-available', () => {
    console.log('Update available. Downloading...');
});

autoUpdater.on('update-downloaded', () => {
    // Automatically restart to install update
    autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});