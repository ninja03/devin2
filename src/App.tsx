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
        className={`w-12 h-12 flex items-center justify-center border border-gray-400 ${
          (row + col) % 2 === 0 ? 'bg-green-700' : 'bg-green-600'
        } ${isValid ? 'cursor-pointer hover:bg-green-500' : ''}`}
        onClick={() => isValid ? makeMove(row, col) : null}
      >
        {cell === 'black' && <span className="text-3xl">🐈‍⬛</span>}
        {cell === 'white' && <span className="text-3xl">🐈</span>}
        {cell === null && isValid && <div className="w-3 h-3 rounded-full bg-green-400 opacity-70"></div>}
      </div>
    );
  };

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-600">
        {board.map((row, rowIndex) => (
          row.map((_, colIndex) => renderCell(rowIndex, colIndex))
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Cat Othello</h1>
      
      <div className="mb-4 flex gap-8">
        <div className="flex items-center">
          <span className="text-2xl mr-2">🐈‍⬛</span>
          <span className="font-bold">{scores.black}</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-2">🐈</span>
          <span className="font-bold">{scores.white}</span>
        </div>
      </div>
      
      <Card className="p-6 bg-white shadow-lg">
        {renderBoard()}
      </Card>
      
      <div className="mt-4">
        {!gameOver ? (
          <div className="flex items-center">
            <span className="mr-2">Current player:</span>
            <span className="text-2xl">{currentPlayer === 'black' ? '🐈‍⬛' : '🐈'}</span>
          </div>
        ) : (
          <div className="text-xl font-bold">
            {winner === 'tie' 
              ? "It's a tie!" 
              : `${winner === 'black' ? '🐈‍⬛ Black' : '🐈 White'} wins!`}
          </div>
        )}
      </div>
      
      <Button 
        className="mt-6 flex items-center gap-2"
        onClick={initializeGame}
      >
        <RefreshCw size={16} />
        New Game
      </Button>
    </div>
  )
}

export default App
