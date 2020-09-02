/**
 * Message is like
 * info depth 16 seldepth 18 multipv 1 score cp -7 nodes 308641 nps 307411 hashfull 130 time 1004
 * pv g8f6 g1f3 *e7e6 e2e3 f8e7 f1e2 d7d5 e1g1 e8g8 c2c4 c7c5 c4d5 e6d5 b1c3 b8c6 d4c5 bmc 0.00878805
 */

const getDepth = (message) => {
  if (!message) {
    return '0';
  }
  return message.split(' ')[2];
};
const getScore = (message) => {
  if (!message) {
    return '0.00';
  }
  const score = Number(message.split(' ')[9]);
  return String(-score / 100);
};
const getPV = (message) => {
  if (!message) {
    return '';
  }
  return message.split(' pv ')[1].split(' bmc')[0];
};

export default { getDepth, getPV, getScore };
