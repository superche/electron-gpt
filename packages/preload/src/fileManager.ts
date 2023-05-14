
import {ipcRenderer} from 'electron-better-ipc';

// Electron 文件选择弹窗
export async function selectFile () {
  const filepath = await ipcRenderer.callMain('select-file');

  return filepath;
}
