import {dialog} from 'electron';
import {ipcMain} from 'electron-better-ipc';

ipcMain.answerRenderer('select-file', async () => {
  const {filePaths} = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return filePaths.length > 0 ? filePaths[0] : '';
});
