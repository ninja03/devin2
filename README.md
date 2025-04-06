# 🐈‍⬛ 3D Cat Othello 🐈

A modern implementation of the classic Othello (Reversi) game with a twist - using cat emojis instead of traditional black and white discs, all presented in an eye-catching 3D visual style.

## 🎮 Play Now

You can play the game online at:
- [GitHub Pages](https://ninja03.github.io/devin2/)
- [Devin Apps Deployment](https://cat-emoji-game-3p2ogncv.devinapps.com)

## 📋 Game Rules

Othello (also known as Reversi) is a strategy board game played on an 8×8 board:

1. The game starts with four pieces in the center: two black cats (🐈‍⬛) and two white cats (🐈)
2. Black always moves first
3. Players take turns placing their pieces on the board
4. A valid move must "sandwich" at least one of the opponent's pieces between the newly placed piece and another piece of the player's color
5. All "sandwiched" pieces are flipped to the current player's color
6. If a player cannot make a valid move, their turn is skipped
7. The game ends when neither player can make a valid move
8. The player with the most pieces on the board wins

## 🎯 Features

- 🎨 Beautiful 3D visual effects with shadows and perspective
- 🐱 Cat emojis (🐈‍⬛ and 🐈) instead of traditional black and white discs
- 🎲 Full implementation of Othello/Reversi rules
- 🔄 Valid moves highlighted with green dots
- 📊 Real-time score tracking
- 🏆 Game over detection with winner announcement
- 🔄 New game button to restart anytime
- 📱 Responsive design for various screen sizes

## 🛠️ Technology Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling and responsive design
- **Vite**: Fast build tool and development server
- **shadcn/ui**: UI component library
- **Lucide Icons**: For beautiful, consistent icons

## 🚀 Development

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ninja03/devin2.git
   cd devin2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
