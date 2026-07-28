const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true, // Hides the default menu (Alt key shows it)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // Intercept F11 to prevent window resizing
    globalShortcut.register('F11', () => {
        const isFullScreen = win.isFullScreen();
        win.setFullScreen(!isFullScreen);
    });
}

app.whenReady().then(() => {
    createWindow();
});

// Cleanup on exit
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});