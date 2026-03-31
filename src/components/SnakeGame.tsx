import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood({ x: 15, y: 5 });
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto screen-tear terminal-box p-4 md:p-6">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-magenta pb-2">
        <div className="text-xl md:text-2xl text-cyan glitch-text" data-text={`DATA:${score}TB`}>DATA:{score}TB</div>
        <div className="text-xl md:text-2xl text-magenta glitch-text" data-text="SNAKE.EXE">SNAKE.EXE</div>
      </div>

      <div
        className="relative bg-void border-2 border-cyan shadow-[0_0_20px_rgba(0,255,255,0.2)] p-1 w-full"
        style={{ aspectRatio: '1/1' }}
      >
        <div
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  ${isHead ? 'bg-magenta shadow-[0_0_15px_#FF00FF] z-10' : ''}
                  ${isSnake && !isHead ? 'bg-cyan opacity-90 border border-void' : ''}
                  ${isFood ? 'bg-magenta animate-pulse shadow-[0_0_10px_#FF00FF]' : ''}
                  ${!isSnake && !isFood ? 'bg-cyan/5 border border-cyan/10' : ''}
                `}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-void/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-4 border-magenta">
            <h2 className="text-5xl md:text-7xl font-bold text-magenta mb-4 glitch-text-large tracking-widest text-center" data-text="FATAL_ERR">FATAL_ERR</h2>
            <p className="text-cyan mb-6 text-xl md:text-2xl">DATA_LOST: {score}TB</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-magenta text-void hover:bg-cyan transition-colors uppercase tracking-widest cursor-pointer text-xl font-bold shadow-[4px_4px_0px_#00FFFF] hover:shadow-[4px_4px_0px_#FF00FF]"
            >
              REBOOT_SYS
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-void/80 flex items-center justify-center z-20 backdrop-blur-sm border-2 border-cyan">
            <h2 className="text-5xl text-cyan glitch-text" data-text="SYS_PAUSED">SYS_PAUSED</h2>
          </div>
        )}
      </div>
      <div className="mt-6 text-cyan/70 text-xs md:text-sm text-center border-t border-cyan/30 pt-4 w-full">
        [ INPUT: ARROWS / WASD ] <br/>
        [ INTERRUPT: SPACEBAR ]
      </div>
    </div>
  );
}
