// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  onUpdateSnapshot: (
    callback: (snapshot: string) => void,
  ) => {
    const listener = (_, snapshot: any) =>
      callback(snapshot);

    ipcRenderer.on('update-snapshot', listener);

    return () => {
      ipcRenderer.removeListener(
        'update-snapshot',
        listener,
      );
    };
  },

  watchStart: () => {
    ipcRenderer.send('watch-start');
  },

  watchStop: () => {
    ipcRenderer.send('watch-stop');
  },
});
