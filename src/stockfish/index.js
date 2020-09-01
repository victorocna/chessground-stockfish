// For stockfish, scriptPath should be stockfish.asm.js --> Pay attention to .asm.js

class Engine {
  constructor({ scriptPath, skillLevel }) {
    if (!window.chessEngineWorker) {
      window.chessEngineWorker = new Worker(scriptPath);
    }
    this.skillLevel = skillLevel || 20;
    this.activity = this.state = {
      count: {
        init: 0,
        use_uci: 0,
        is_ready: 0,
        set_position: 0,
        go_depth: 0,
        go_time: 0,
        stop: 0,
        quit: 0,
      },
      totalTime: {
        init: 0,
        use_uci: 0,
        is_ready: 0,
        set_position: 0,
        go_depth: 0,
        go_time: 0,
        stop: 0,
        quit: 0,
      },
      tempTime: {},
    };
  }
  setSkillLevel() {
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level value ' + this.skillLevel
    );
  }
  async init() {
    this.logBefore('init');
    await this.use_uci();
    await this.is_ready();
    this.setSkillLevel();
    this.logAfter('init');
  }
  logBefore(command) {
    //eslint-disable-next-line
    console.log('logBefore ', command);
    this.state.count[command]++;
    this.state.tempTime[command] = new Date();
  }
  logAfter(command) {
    //eslint-disable-next-line
    console.log('logAfter ', command);
    this.state.totalTime[command] += new Date() - this.state.tempTime[command];
    this.state.tempTime[command] = 0;
    //eslint-disable-next-line
    console.log(this.state);
  }
  use_uci() {
    return new Promise((resolve) => {
      this.logBefore('use_uci');
      window.chessEngineWorker.postMessage('uci');

      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'uciok') {
          this.logAfter('use_uci');
          resolve(message);
        }
      };
    });
  }
  is_ready() {
    this.logBefore('is_ready');
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('isready');
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'readyok') {
          this.logAfter('is_ready');
          resolve(message);
        }
      };
    });
  }
  set_position(fen) {
    return new Promise((resolve) => {
      this.logBefore('set_position');
      window.chessEngineWorker.postMessage('position fen ' + fen);
      this.logAfter('set_position');
      resolve();
    });
  }

  go_depth(depth) {
    return new Promise((resolve) => {
      this.logBefore('go_depth');
      window.chessEngineWorker.postMessage('go depth ' + depth);
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          this.logAfter('go_depth');
          resolve(message.data);
        }
      };
    });
  }
  go_time(time) {
    return new Promise((resolve) => {
      this.logBefore('go_time');
      window.chessEngineWorker.postMessage('go movetime ' + time);
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          this.logAfter('go_time');
          resolve(message.data);
        }
      };
    });
  }

  go_infinite() {
    //eslint-disable-next-line
    // TODO: decide if we should implement this
    return null;
  }

  stop() {
    this.logBefore('stop');
    window.chessEngineWorker.postMessage('stop');
    this.logAfter('stop');
  }

  quit() {
    this.logBefore('quit');
    window.chessEngineWorker.postMessage('quit');
    this.logAfter('quit');
  }
}
//eslint-disable-next-line
module.exports = Engine;
//eslint-disable-next-line
module.exports.Stockfish = Engine;
// export default Engine;
