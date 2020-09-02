// For stockfish, scriptPath should be stockfish.asm.js --> Pay attention to .asm.js

class Engine {
  constructor({ scriptPath, skillLevel, onInfoMessage }) {
    if (!window.chessEngineWorker) {
      window.chessEngineWorker = new Worker(scriptPath);
    }
    this.onInfoMessage = onInfoMessage || console.log;
    this.skillLevel = skillLevel === 0 ? 0 : skillLevel ? skillLevel : 20;
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
  isInfoMessage(message) {
    if (!message || !message.data) {
      return false;
    }
    return message.data.startsWith('info');
  }
  setSkillLevel() {
    /**
     * skill level is 0-20, higher the stronger
     * skill level maximum error is 0-5000, lower the stronger
     * skill level probability is 1-1000, the higher the stronger
     * seems to be working with max value for maxError and min value for probability
     */
    /**
     * OLD WAY OF COMPUTING SKILL LEVEL VALUES;
     * const maxError = (20 - this.skillLevel) * 250;
     * const probability = 1000 - (20 - this.skillLevel) * 50;
     */
    const maxError = 5000;
    const probability = 1;
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level value ' + this.skillLevel
    );
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level Maximum Error value ' + maxError
    );
    window.chessEngineWorker.postMessage(
      'setoption name Skill Level Probability value ' + probability
    );
  }
  async init() {
    await this.use_uci();
    await this.is_ready();
    this.setSkillLevel();
  }
  use_uci() {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('uci');

      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'uciok') {
          resolve(message);
        }
      };
    });
  }
  is_ready() {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('isready');
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data === 'readyok') {
          resolve(message);
        }
      };
    });
  }
  set_position(fen) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('position fen ' + fen);
      resolve();
    });
  }

  go_depth(depth) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('go depth ' + depth);
      window.chessEngineWorker.onmessage = (message) => {
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }
  go_time(time) {
    return new Promise((resolve) => {
      window.chessEngineWorker.postMessage('go movetime ' + time);
      window.chessEngineWorker.onmessage = (message) => {
        if (this.isInfoMessage(message)) {
          console.log('isInfo');
          this.onInfoMessage(message.data);
        }
        if (message.data.startsWith('bestmove')) {
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
    window.chessEngineWorker.postMessage('stop');
  }

  quit() {
    window.chessEngineWorker.postMessage('quit');
  }
}
//eslint-disable-next-line
module.exports = Engine;
//eslint-disable-next-line
module.exports.Stockfish = Engine;
// export default Engine;
