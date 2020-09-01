// For stockfish, scriptPath should be stockfish.asm.js --> Pay attention to .asm.js

class Engine {
  constructor(scriptPath) {
    this.worker = new Worker(scriptPath);
  }
  async init() {
    await this.use_uci();
    await this.is_ready();
  }
  use_uci() {
    return new Promise((resolve) => {
      this.worker.postMessage('uci');
      this.worker.onmessage = (message) => {
        if (message.data === 'uciok') {
          resolve(message);
        }
      };
    });
  }
  is_ready() {
    return new Promise((resolve) => {
      this.worker.postMessage('isready');
      this.worker.onmessage = (message) => {
        if (message.data === 'readyok') {
          resolve(message);
        }
      };
    });
  }
  set_position(fen) {
    return new Promise((resolve) => {
      this.worker.postMessage('position fen ' + fen);
      resolve();
    });
  }

  go_depth(depth) {
    return new Promise((resolve) => {
      this.worker.postMessage('go depth ' + depth);
      this.worker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }
  go_time(time) {
    return new Promise((resolve) => {
      this.worker.postMessage('go movetime ' + time);
      this.worker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }

  go_infinite() {
    // TODO: decide if we should implement this
    return null;
  }

  stop() {
    this.worker.postMessage('stop');
  }

  quit() {
    this.worker.postMessage('quit');
  }
}

module.exports = Engine;
module.exports.Stockfish = Engine;
// export default Engine;
