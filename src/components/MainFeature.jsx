import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
                  Player 2
                  ? 'Player 2 Wins!'
                    <UserIcon className="w-4 h-4 text-white" />
                    Player 2
  const [boxes, setBoxes] = useState([]);
  
  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);
  
  const initializeGame = () => {
    // Reset game state
    setGameStarted(false);
    setGameOver(false);
    setPlayerTurn(1);
    setScores({ player1: 0, player2: 0 });
    setAiThinking(false);
    
    // Initialize grid structure
    const newHorizontalLines = [];
    const newVerticalLines = [];
    const newBoxes = [];
    
    // Create horizontal line states
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize + 1; j++) {
        newHorizontalLines.push({
          row: i,
          col: j,
          claimed: false,
          owner: null
        });
      }
    }
    
    // Create vertical line states
    for (let i = 0; i < gridSize + 1; i++) {
      for (let j = 0; j < gridSize; j++) {
        newVerticalLines.push({
          row: i,
          col: j,
          claimed: false,
          owner: null
        });
      }
    }
    
    // Create box states
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newBoxes.push({
          row: i,
          col: j,
          owner: null,
          completed: false
        });
      }
    }
    
    setHorizontalLines(newHorizontalLines);
    setVerticalLines(newVerticalLines);
    setBoxes(newBoxes);
  };
  
  // Start a new game
  const startGame = () => {
    initializeGame();
    setGameStarted(true);
    toast.info("Game started! Player 1's turn");
  };
  
  // Handle line click
  const handleLineClick = (lineType, row, col) => {
    if (gameOver || (playerTurn === 2 && gameMode === 'ai' && !aiThinking)) return;
    
    // Find the line and check if it's already claimed
    let lines = lineType === 'horizontal' ? [...horizontalLines] : [...verticalLines];
    const lineIndex = lines.findIndex(line => line.row === row && line.col === col);
    
    if (lineIndex === -1 || lines[lineIndex].claimed) return;
    
    // Claim the line
    lines[lineIndex].claimed = true;
    lines[lineIndex].owner = playerTurn;
    
    if (lineType === 'horizontal') {
      setHorizontalLines(lines);
    } else {
      setVerticalLines(lines);
    }
    
    // Check if any boxes are completed by this move
    const boxesCompleted = checkCompletedBoxes();
    
    // Switch turns if no boxes were completed
    if (!boxesCompleted) {
      if (gameMode === 'ai' && playerTurn === 1) {
        // AI's turn
        setPlayerTurn(2);
        setAiThinking(true);
        
        // Simulate AI thinking time
        setTimeout(() => {
          makeAiMove();
          setAiThinking(false);
        }, 1000);
      } else {
        // Switch to other player's turn
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
        toast.info(`Player ${playerTurn === 1 ? 2 : 1}'s turn`);
      }
    } else {
      // Player gets another turn if they completed a box
      const newScores = { ...scores };
      if (playerTurn === 1) {
        newScores.player1 += boxesCompleted;
      } else {
        newScores.player2 += boxesCompleted;
      }
      setScores(newScores);
      
      // Check if the game is over
      const totalBoxes = gridSize * gridSize;
      if (newScores.player1 + newScores.player2 === totalBoxes) {
        setGameOver(true);
        const winner = newScores.player1 > newScores.player2 ? 1 : (newScores.player2 > newScores.player1 ? 2 : 0);
        if (winner === 0) {
          toast.info("Game over! It's a tie!");
        } else {
          toast.success(`Game over! Player ${winner} wins!`);
        }
      } else {
        toast.success(`Player ${playerTurn} completed ${boxesCompleted} box${boxesCompleted > 1 ? 'es' : ''}!`);
      }
    }
  };
  
  // Check if any boxes are completed by the last move
  const checkCompletedBoxes = () => {
    let completedCount = 0;
    const newBoxes = [...boxes];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const boxIndex = i * gridSize + j;
        
        if (!newBoxes[boxIndex].completed) {
          // Check if this box is completed
          const topLine = horizontalLines.find(line => line.row === i && line.col === j);
          const rightLine = verticalLines.find(line => line.row === i && line.col === j + 1);
          const bottomLine = horizontalLines.find(line => line.row === i + 1 && line.col === j);
          const leftLine = verticalLines.find(line => line.row === i && line.col === j);
          
          if (topLine?.claimed && rightLine?.claimed && bottomLine?.claimed && leftLine?.claimed) {
            newBoxes[boxIndex].completed = true;
            newBoxes[boxIndex].owner = playerTurn;
            completedCount++;
          }
        }
      }
    }
    
    if (completedCount > 0) {
      setBoxes(newBoxes);
    }
    
    return completedCount;
  };
  
  // AI move logic
  const makeAiMove = () => {
    // Simple AI: Look for a move that doesn't complete a box
    let safeMoves = [];
    
    // Check horizontal lines
    horizontalLines.forEach((line, index) => {
      if (!line.claimed) {
        // TODO: More advanced AI would check if this move completes a box
        safeMoves.push({ type: 'horizontal', index, row: line.row, col: line.col });
      }
    });
    
    // Check vertical lines
    verticalLines.forEach((line, index) => {
      if (!line.claimed) {
        // TODO: More advanced AI would check if this move completes a box
        safeMoves.push({ type: 'vertical', index, row: line.row, col: line.col });
      }
    });
    
    // Make a random move if there are safe moves
    if (safeMoves.length > 0) {
      const randomMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
      handleLineClick(randomMove.type, randomMove.row, randomMove.col);
    }
  };
  
  // Render the game grid
  const renderGrid = () => {
    const dotSize = 16; // Dot size in pixels
    const spacing = 60; // Spacing between dots
    const padding = 20; // Padding around the grid
    
    const gridWidth = (gridSize + 1) * spacing;
    const gridHeight = (gridSize + 1) * spacing;
    
    return (
      <div className="relative mx-auto" style={{ width: gridWidth + padding * 2, height: gridHeight + padding * 2 }}>
        {/* Render Dots */}
        {Array.from({ length: gridSize + 1 }).map((_, rowIndex) => (
          Array.from({ length: gridSize + 1 }).map((_, colIndex) => (
            <div
              key={`dot-${rowIndex}-${colIndex}`}
              className="absolute rounded-full bg-primary transform transition-all duration-300"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                left: `${padding + colIndex * spacing - dotSize / 2}px`,
                top: `${padding + rowIndex * spacing - dotSize / 2}px`,
              }}
            />
          ))
        ))}
        
        {/* Render Horizontal Lines */}
        {horizontalLines.map((line, index) => (
          <div
            key={`h-line-${index}`}
            className={`absolute cursor-pointer transition-all duration-300 ${line.claimed ? (line.owner === 1 ? 'bg-primary' : 'bg-secondary') : 'bg-surface-300 dark:bg-surface-700 hover:bg-surface-400 dark:hover:bg-surface-600'}`}
            style={{
              width: `${spacing - dotSize}px`,
              height: '4px',
              left: `${padding + line.col * spacing + dotSize / 2}px`,
              top: `${padding + line.row * spacing - 2}px`,
              borderRadius: '2px'
            }}
            onClick={() => !line.claimed && gameStarted && handleLineClick('horizontal', line.row, line.col)}
          />
        ))}
        
        {/* Render Vertical Lines */}
        {verticalLines.map((line, index) => (
          <div
            key={`v-line-${index}`}
            className={`absolute cursor-pointer transition-all duration-300 ${line.claimed ? (line.owner === 1 ? 'bg-primary' : 'bg-secondary') : 'bg-surface-300 dark:bg-surface-700 hover:bg-surface-400 dark:hover:bg-surface-600'}`}
            style={{
              width: '4px',
              height: `${spacing - dotSize}px`,
              left: `${padding + line.col * spacing - 2}px`,
              top: `${padding + line.row * spacing + dotSize / 2}px`,
              borderRadius: '2px'
            }}
            onClick={() => !line.claimed && gameStarted && handleLineClick('vertical', line.row, line.col)}
          />
        ))}
        
        {/* Render Boxes */}
        {boxes.map((box, index) => (
          box.completed && (
            <div
              key={`box-${index}`}
              className={`absolute transition-all duration-500 ${box.owner === 1 ? 'bg-primary/20' : 'bg-secondary/20'}`}
              style={{
                width: `${spacing}px`,
                height: `${spacing}px`,
                left: `${padding + box.col * spacing - dotSize / 2}px`,
                top: `${padding + box.row * spacing - dotSize / 2}px`,
                borderRadius: '4px'
              }}
            >
              <div className="flex items-center justify-center h-full">
                <span className={`text-lg font-bold ${box.owner === 1 ? 'text-primary' : 'text-secondary'}`}>
                  {box.owner === 1 ? 'P1' : 'P2'}
                </span>
              </div>
            </div>
          )
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card relative overflow-hidden mb-6"
      >
        {/* Game Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold mb-1">Dot Nexus</h2>
            <p className="text-surface-600 dark:text-surface-300">
              {gameStarted 
                ? (gameOver 
                  ? "Game Over!" 
                  : `Player ${playerTurn}'s Turn ${aiThinking ? '(AI thinking...)' : ''}`) 
                : "Connect dots to make boxes"}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Game Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              disabled={gameStarted && !gameOver}
              className={`btn ${gameStarted && !gameOver ? 'bg-surface-200 dark:bg-surface-700 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'} flex items-center`}
            >
              <RefreshCwIcon className="w-5 h-5 mr-2" />
              {gameStarted ? (gameOver ? "New Game" : "Game in Progress") : "Start Game"}
            </motion.button>
          </div>
        </div>
        
        {/* Game Settings Panel */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2" />
                  Game Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grid Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <GridIcon className="w-4 h-4 mr-2" />
                      Grid Size
                    </label>
                    <div className="flex space-x-2">
                      {[3, 4, 5, 6].map(size => (
                        <button
                          key={`size-${size}`}
                          onClick={() => !gameStarted && setGridSize(size)}
                          className={`flex-1 py-2 px-3 rounded-lg border ${gridSize === size 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'} 
                            ${gameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={gameStarted}
                        >
                          {size}x{size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Game Mode */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <User2Icon className="w-4 h-4 mr-2" />
                      Game Mode
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => !gameStarted && setGameMode('ai')}
                        className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center ${gameMode === 'ai' 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'} 
                          ${gameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={gameStarted}
                      >
                        <BotIcon className="w-4 h-4 mr-2" />
                        vs AI
                      </button>
                      <button
                        onClick={() => !gameStarted && setGameMode('local')}
                        className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center ${gameMode === 'local' 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'} 
                          ${gameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={gameStarted}
                      >
                        <User2Icon className="w-4 h-4 mr-2" />
                        Local 2P
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Score Display */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className={`rounded-xl p-4 ${playerTurn === 1 && gameStarted && !gameOver ? 'bg-primary/10 border-2 border-primary' : 'bg-surface-100 dark:bg-surface-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">
                    {gameMode === 'local' ? 'Player 1' : username}
                  </span>
                </div>
                {playerTurn === 1 && gameStarted && !gameOver && (
                  <div className="animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{scores.player1}</span>
              </div>
            </div>
            
            <div className={`rounded-xl p-4 ${playerTurn === 2 && gameStarted && !gameOver ? 'bg-secondary/10 border-2 border-secondary' : 'bg-surface-100 dark:bg-surface-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                    {gameMode === 'ai' ? (
                      <BotIcon className="w-4 h-4 text-white" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium">
                    {gameMode === 'ai' ? 'AI Player' : 'Player 2'}
                  </span>
                </div>
                {playerTurn === 2 && gameStarted && !gameOver && (
                  <div className="animate-pulse">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-secondary">{scores.player2}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game instructions if not started */}
        {!gameStarted ? (
          <div className="text-center p-6 bg-surface-50 dark:bg-surface-800 rounded-xl mb-8">
            <div className="mb-4 inline-block">
              <TrophyIcon className="w-12 h-12 text-primary opacity-70" />
            </div>
            <h3 className="text-xl font-semibold mb-2">How to Play</h3>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              Connect the dots by clicking on the space between them. Complete a box to score a point and get another turn. The player with the most boxes wins!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="btn bg-primary text-white hover:bg-primary-dark"
            >
              Start Playing
            </motion.button>
          </div>
        ) : (
          // Game grid
          <div className="flex justify-center mb-8 overflow-x-auto py-4">
            <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-4 shadow-inner">
              {renderGrid()}
            </div>
          </div>
        )}
        
        {/* Game over screen */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-surface-50 dark:bg-surface-800 rounded-xl text-center"
          >
            <div className="mb-4 inline-block">
              <TrophyIcon className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {scores.player1 > scores.player2 
                ? (gameMode === 'local' ? 'Player 1 Wins!' : `${username} Wins!`) 
                : (scores.player2 > scores.player1 
                  ? (gameMode === 'ai' ? 'AI Wins!' : 'Player 2 Wins!') 
                  : "It's a tie!")}
            </h3>
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">{scores.player1}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">
                  {gameMode === 'local' ? 'Player 1' : username}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-1">{scores.player2}</div>
                <div className="text-sm text-surface-500 dark:text-surface-400">
                  {gameMode === 'ai' ? 'AI Player' : 'Player 2'}
                </div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="btn bg-primary text-white hover:bg-primary-dark"
            >
              <ReloadIcon className="w-5 h-5 mr-2" />
              Play Again
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MainFeature;