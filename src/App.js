import React, { useState, useEffect } from 'react';
import { Chessboard } from './components';
import { Chess } from './chess';
import { Stockfish } from './stockfish';
import { engineMove } from './functions';

const App = () => {
  const [game, setGame] = useState(new Chess());

  const onMove = async (from, to) => {
    game.move({ from, to, promotion: 'q' });
    setGame(game);

    await opponentMove();
  };

  const opponentMove = async () => {
    await engine.set_position(game.fen());
    const bestMove = engineMove(await engine.go_time(1000));

    game.move(bestMove);
    setGame(game);
  };

  const engine = new Stockfish('/stockfish/stockfish.asm.js');
  useEffect(() => {
    engine.init();
  }, []);

  useEffect(() => {
    engine.quit();
  }, [game.game_over()]);

  return (
    <div className="App">
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div>
          <Chessboard fen={game.fen()} onMove={onMove} coordinates />
        </div>
        <h1>Hello world</h1>
      </div>
    </div>
  );
};

export default App;
