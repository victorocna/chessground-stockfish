const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNode = !isBrowser;

let Chess;

if (isNode) {
  const chess = require('chess.js');
  Chess = chess.Chess;
} else {
  Chess = require('chess.js');
}

module.exports = Chess;
module.exports.Chess = Chess;
