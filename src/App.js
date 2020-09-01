import React, { useState, useEffect } from 'react';
import { Chessboard } from './components';
import { Chess } from './chess';
import { Stockfish } from './stockfish';
import { engineMove } from './functions';

// integer between 1-20, where higher is better;
const DEFAULT_SKILL_LEVEL = 20;

const App = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [engine] = useState(
    new Stockfish({
      scriptPath: '/stockfish/stockfish.asm.js',
      skillLevel: DEFAULT_SKILL_LEVEL,
    })
  );
  const onMove = async (from, to) => {
    //eslint-disable-next-line
    // TODO: only valid moves

    game.move({ from, to, promotion: 'q' });
    setFen(game.fen());

    await opponentMove();
  };

  const opponentMove = async () => {
    //eslint-disable-next-line
    console.log('opp moved');
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
        </div>
      </div>
    </div>
  );
};

export default App;
