import React from 'react';
import { parseInfoMessage } from '../functions';
import './InfoMessage.css';

const { getDepth, getScore, getPV } = parseInfoMessage;

export default function InfoMessage({ engineName, message }) {
  const depth = getDepth(message);
  const score = getScore(message);
  const pv = getPV(message);
  return (
    <div className="info-message__container">
      <div className="info-message__top-row">
        <div className="info-message__engine-name">
          <span>{engineName}</span>
        </div>
        <div>
          <span>depth {depth}</span>
        </div>
      </div>
      <div className="info-message__bottom-row">
        <div className="info-message__pv">
          <p>
            <span className="info-message__score">
              (<b>{score}</b>)
            </span>
            <span className="info-message__pv">{pv}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
