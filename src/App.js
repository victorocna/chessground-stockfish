import React, { useState, useEffect } from 'react';
import { Chessboard } from './components';
import { Chess } from './chess';
import { Stockfish } from './stockfish';
import { engineMove } from './functions';
import { InfoMessage } from './components';

const App = ({ verbose }) => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [message, setMessage] = useState(null);
  const [engine] = useState(new Stockfish({ onInfoMessage: setMessage }));

  const onMove = async (from, to) => {
    game.move({ from, to, promotion: 'q' });
    setFen(game.fen());

    await opponentMove();
  };

  const opponentMove = async () => {
    await engine.set_position(game.fen());
    const bestMove = engineMove(await engine.go_time(1000));

    game.move(bestMove);
    setFen(game.fen());
  };

  useEffect(() => {
    engine.init();
  }, []);

  useEffect(() => {
    engine.quit();
  }, [game.game_over()]);

  return (
    <div className="App">
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="m-4">
          <Chessboard fen={fen} onMove={onMove} coordinates />
          {verbose ? (
            <InfoMessage message={message} engineName={'Stockfish 10 ASM'} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
