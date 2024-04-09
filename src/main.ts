import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { OffsetAPI } from './riot-api/api/OffsetAPI';
import { ProcessAPI } from './riot-api/api/ProcessAPI';
import { Metadata } from './riot-api/objects/metadata';
import { RiotAPI } from './riot-api/api/RiotAPI';
import { Snapshot } from './riot-api/objects/snapshot';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  let timer: ReturnType<typeof setTimeout>;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
      ),
    );
  }

  ipcMain.on('watch-start', async () => {
    const version = '14.7.1';
    const region = 'ko_KR';
    const offset = OffsetAPI.fetch(version);

    const process = new ProcessAPI();

    try {
      process.openProcess();
    } catch {
      console.error('League of Legends.exe is not running');
      return;
    }

    const metadata: Metadata = {
      championMetas: await RiotAPI.getChampions(
        version,
        region,
      ),
      offset,
      version,
      region,
      process,
    };

    const loop = () => {
      const snapshot = Snapshot.fromBuffer(metadata);

      mainWindow.webContents.send(
        'update-snapshot',
        snapshot,
      );
      timer = setTimeout(loop, 100);
    };

    loop();
  });

  ipcMain.on('watch-stop', () => {
    clearTimeout(timer);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
