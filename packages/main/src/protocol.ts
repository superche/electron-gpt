import * as path from 'path';
import {protocol} from 'electron';

export function registerFileProtocol() {
  const PROTOCOL_PREFIX = 'gptfile';
  protocol.registerFileProtocol(PROTOCOL_PREFIX, (request, callback) => {
    const url = request.url.substr(PROTOCOL_PREFIX.length + 3); // INFO: gptfile://
    callback(decodeURI(path.normalize(url)));
  });
}
