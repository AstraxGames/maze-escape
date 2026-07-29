const { app, BrowserWindow, globalShortcut, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;
let splash;

function createWindow() {
    // 1. Create the Splash Screen
    splash = new BrowserWindow({ 
        width: 400, 
        height: 300, 
        frame: false, 
        transparent: true, 
        alwaysOnTop: true 
    });
    splash.loadFile('splash.html');

    // 2. Create Main Window (Strict Fullscreen)
    win = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        show: false, // Don't show until ready
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    // 3. Show main window when the game is fully loaded
    win.once('ready-to-show', () => {
        setTimeout(() => {
            splash.destroy();
            win.show();
        }, 1500); 
    });

    // Block F11 to strictly prevent exiting fullscreen
    globalShortcut.register('F11', () => {
        // Do nothing! This completely disables the F11 key.
    });

    autoUpdater.checkForUpdatesAndNotify();
}

// Custom Application Menu (Step 3)
function createMenu() {
    const template = [
        {
            label: 'AstraX Games',
            submenu: [
                { label: 'About Maze Escape', click: () => { /* Add About Box logic later */ } },
                { type: 'separator' },
                { label: 'Quit', role: 'quit' }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
    createMenu();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});