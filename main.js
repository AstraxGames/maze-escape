const { app, BrowserWindow, globalShortcut, Menu, ipcMain } = require('electron'); // Added ipcMain for updater communication
const { autoUpdater } = require('electron-updater');

let win;
let splash;

// Auto-updater configuration
autoUpdater.autoDownload = false; // CRITICAL: Changed to false so player triggers it from the custom UI
autoUpdater.autoInstallOnAppQuit = false; // We will force install immediately when downloaded

function startApp() {
    // 1. Create the Splash Screen
    splash = new BrowserWindow({ 
        width: 400, 
        height: 300, 
        frame: false, 
        transparent: true, 
        alwaysOnTop: true 
    });
    splash.loadFile('splash.html');

    // 2. Check for updates BEFORE loading the main game
    autoUpdater.checkForUpdates();
}

function launchMainGame() {
    if (win) return; // Prevent double launching

    // Create Main Window (Strict Fullscreen)
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

    // Show main window when the game is fully loaded
    win.once('ready-to-show', () => {
        if (splash) splash.destroy();
        win.show();
    });

    // Block F11 to strictly prevent exiting fullscreen
    globalShortcut.register('F11', () => {
        // Do nothing! This completely disables the F11 key.
    });
}

// Custom Application Menu
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

// --- NEW UPDATE SCREEN LAUNCHER ---
function launchUpdateScreen() {
    if (win) return;

    win = new BrowserWindow({
        width: 700,
        height: 450,
        frame: false, // Sleek borderless window for updater
        transparent: true,
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('update.html');

    win.once('ready-to-show', () => {
        if (splash) splash.destroy();
        win.show();
    });
}

// --- AUTO UPDATER EVENTS ---

autoUpdater.on('update-available', () => {
    console.log('Update available. Launching update screen...');
    launchUpdateScreen(); // Show custom update screen instead of game
});

autoUpdater.on('update-not-available', () => {
    console.log('Game is up to date.');
    launchMainGame(); // Start game normally
});

autoUpdater.on('error', (err) => {
    console.log('Update error or offline. Launching game.', err);
    launchMainGame(); // Fallback: Start game even if no internet
});

// Receive message from update.html to start downloading
ipcMain.on('start-download', () => {
    autoUpdater.downloadUpdate();
});

// Send download progress to update.html
autoUpdater.on('download-progress', (progressObj) => {
    if (win) win.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded. Installing now...');
    autoUpdater.quitAndInstall(); // Force restart and install immediately
});

app.whenReady().then(() => {
    createMenu();
    startApp(); // Start with splash screen and update check
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});