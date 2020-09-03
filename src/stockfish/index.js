/**
 * Constructor requires a path to stockfish to run correctly in a web browser
 */
class Engine {
  constructor(props) {
    const { scriptPath, skillLevel = 20, onInfoMessage } = props || {};

    if (!window.chessEngineWorker) {
      window.chessEngineWorker = new Worker(
        scriptPath || '/stockfish/stockfish.asm.js'
      );
    }
    this.onInfoMessage = onInfoMessage;
    this.skillLevel = skillLevel;
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
        if (
          this.isInfoMessage(message) &&
          typeof this.onInfoMessage === 'function'
        ) {
          this.onInfoMessage(message.data);
        }
        if (message.data.startsWith('bestmove')) {
          resolve(message.data);
        }
      };
    });
  }

  go_infinite() {
    return null;
  }

  stop() {
    window.chessEngineWorker.postMessage('stop');
  }

  quit() {
    window.chessEngineWorker.postMessage('quit');
  }
}

export default Engine;
