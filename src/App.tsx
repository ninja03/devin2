import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { RefreshCw } from 'lucide-react'

const BOARD_SIZE = 8;

type Player = 'black' | 'white';

type Cell = Player | null;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

function App() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [validMoves, setValidMoves] = useState<{[key: string]: boolean}>({});
  const [scores, setScores] = useState<{black: number, white: number}>({ black: 2, white: 2 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newBoard: Cell[][] = Array(BOARD_SIZE).fill(null).map(() => 
      Array(BOARD_SIZE).fill(null)
    );
    
    const mid = BOARD_SIZE / 2;
    newBoard[mid-1][mid-1] = 'white';
    newBoard[mid-1][mid] = 'black';
    newBoard[mid][mid-1] = 'black';
    newBoard[mid][mid] = 'white';
    
    setBoard(newBoard);
    setCurrentPlayer('black');
    setGameOver(false);
    setWinner(null);
    
    const moves = getValidMoves(newBoard, 'black');
    setValidMoves(moves);
    
    setScores({ black: 2, white: 2 });
  };

  const isValidMove = (board: Cell[][], row: number, col: number, player: Player): boolean => {
    if (board[row][col] !== null) {
      return false;
    }
    
    const opponent = player === 'black' ? 'white' : 'black';
    let valid = false;
    
    for (const [dx, dy] of DIRECTIONS) {
      let r = row + dx;
      let c = col + dy;
      let foundOpponent = false;
      
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
        r += dx;
        c += dy;
        foundOpponent = true;
      }
      
      if (foundOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        valid = true;
        break;
      }
    }
    
    return valid;
  };

  const getValidMoves = (board: Cell[][], player: Player): {[key: string]: boolean} => {
    const moves: {[key: string]: boolean} = {};
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(board, row, col, player)) {
          moves[`${row},${col}`] = true;
        }
      }
    }
    
    return moves;
  };

  const makeMove = (row: number, col: number) => {
    if (gameOver || !validMoves[`${row},${col}`]) {
      return;
    }
    
    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col] = currentPlayer;
    
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    
    for (const [dx, dy] of DIRECTIONS) {
      let r = row + dx;
      let c = col + dy;
      const piecesToFlip: [number, number][] = [];
      
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === opponent) {
        piecesToFlip.push([r, c]);
        r += dx;
        c += dy;
      }
      
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === currentPlayer) {
        for (const [flipRow, flipCol] of piecesToFlip) {
          newBoard[flipRow][flipCol] = currentPlayer;
        }
      }
    }
    
    setBoard(newBoard);
    
    const newScores = countPieces(newBoard);
    setScores(newScores);
    
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    
    const nextValidMoves = getValidMoves(newBoard, nextPlayer);
    
    if (Object.keys(nextValidMoves).length === 0) {
      const currentPlayerMoves = getValidMoves(newBoard, currentPlayer);
      
      if (Object.keys(currentPlayerMoves).length === 0) {
        setGameOver(true);
        
        if (newScores.black > newScores.white) {
          setWinner('black');
        } else if (newScores.white > newScores.black) {
          setWinner('white');
        } else {
          setWinner('tie');
        }
      } else {
        setValidMoves(currentPlayerMoves);
      }
    } else {
      setCurrentPlayer(nextPlayer);
      setValidMoves(nextValidMoves);
    }
  };

  const countPieces = (board: Cell[][]): {black: number, white: number} => {
    let black = 0;
    let white = 0;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === 'black') {
          black++;
        } else if (board[row][col] === 'white') {
          white++;
        }
      }
    }
    
    return { black, white };
  };

  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    const isValid = validMoves[`${row},${col}`] || false;
    
    return (
      <div 
        key={`${row}-${col}`}
        className={`w-12 h-12 flex items-center justify-center border border-gray-400 relative
          ${(row + col) % 2 === 0 ? 'bg-green-700' : 'bg-green-600'}
          ${isValid ? 'cursor-pointer hover:bg-green-500' : ''}
          transform perspective-800 transition-transform duration-200
          before:absolute before:inset-0 before:bg-black/10 before:bottom-[-2px] before:right-[-2px]
          before:transform before:skew-x-[1deg] before:skew-y-[1deg] before:z-[-1]`}
        style={{
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3), inset 1px 1px 0px rgba(255, 255, 255, 0.2), inset -1px -1px 0px rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => isValid ? makeMove(row, col) : null}
      >
        {cell === 'black' && (
          <div className="relative transform transition-all duration-300 hover:scale-110">
            <span className="text-3xl transform translate-y-[-2px] drop-shadow-[2px_3px_2px_rgba(0,0,0,0.5)]">🐈‍⬛</span>
          </div>
        )}
        {cell === 'white' && (
          <div className="relative transform transition-all duration-300 hover:scale-110">
            <span className="text-3xl transform translate-y-[-2px] drop-shadow-[2px_3px_2px_rgba(0,0,0,0.5)]">🐈</span>
          </div>
        )}
        {cell === null && isValid && (
          <div className="w-3 h-3 rounded-full bg-green-400 opacity-70 shadow-md animate-pulse"></div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-600 rounded-md shadow-xl transform perspective-1000 rotate-x-1 rotate-y-1"
        style={{
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg)'
        }}>
        {board.map((row, rowIndex) => (
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="text-yellow-300">3D</span> Cat Othello
      </h1>
      
      <div className="mb-6 flex gap-12">
        <div className="flex items-center bg-black/30 p-3 rounded-xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform">
          <span className="text-3xl mr-3 drop-shadow-lg">🐈‍⬛</span>
          <span className="font-bold text-2xl text-white">{scores.black}</span>
        </div>
        <div className="flex items-center bg-white/30 p-3 rounded-xl backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform">
          <span className="text-3xl mr-3 drop-shadow-lg">🐈</span>
          <span className="font-bold text-2xl text-white">{scores.white}</span>
        </div>
      </div>
      
      <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-xl border-2 border-gray-700"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
        {renderBoard()}
      </Card>
      
      <div className="mt-6 bg-gray-800/70 p-4 rounded-lg backdrop-blur-sm shadow-lg">
        {!gameOver ? (
          <div className="flex items-center">
            <span className="mr-3 text-white text-lg">Current player:</span>
            <span className="text-3xl transform scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentPlayer === 'black' ? '🐈‍⬛' : '🐈'}
            </span>
          </div>
        ) : (
          <div className="text-2xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {winner === 'tie' 
              ? "It's a tie!" 
              : `${winner === 'black' ? '🐈‍⬛ Black' : '🐈 White'} wins!`}
          </div>
        )}
      </div>
      
      <Button 
        className="mt-8 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all"
        onClick={initializeGame}
      >
        <RefreshCw size={18} />
        New Game
      </Button>
    </div>
  )
}

export default App
