import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Obstacle {
  id: number;
  left: number;
  top: number;
  type: string;
  speed: number;
}

const GameLogic = () => {
  const [ballPosition, setBallPosition] = useState({ x: 130, y: 600 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const GROUND_POSITION = 600; // Position where obstacles should be removed

  // Load best score on initial load
  useEffect(() => {
    const loadBestScore = async () => {
      const storedBestScore = await AsyncStorage.getItem('bestScore');
      if (storedBestScore) setBestScore(parseInt(storedBestScore, 10));
    };
    loadBestScore();
  }, []);

  // Game intervals for obstacle spawning and movement
  useEffect(() => {
    if (!gameOver) {
      const obstacleInterval = setInterval(spawnObstacle, Math.max(2000 - level * 200, 500));
      const moveObstaclesInterval = setInterval(updateObstacles, 50);

      return () => {
        clearInterval(obstacleInterval);
        clearInterval(moveObstaclesInterval);
      };
    }
  }, [gameOver, level]);

  // Increase level based on score
  useEffect(() => {
    const levelUpThreshold = 20;
    setLevel(Math.floor(score / levelUpThreshold) + 1);
  }, [score]);

  // Collision detection logic
  useEffect(() => {
    if (!gameOver) {
      const collisionCheckInterval = setInterval(() => {
        checkCollisions();
      }, 20); // Check for collisions every 20ms

      return () => clearInterval(collisionCheckInterval);
    }
  }, [obstacles, ballPosition, gameOver]);

  // Spawn a new obstacle
  const spawnObstacle = () => {
    const newObstacle: Obstacle = {
      id: Date.now(),
      left: Math.random() * (SCREEN_WIDTH - 50), // Random horizontal position
      top: -50, // Start above the screen
      type: getRandomType(),
      speed: Math.random() * (5 + level) + 5, // Speed increases with level
    };
    setObstacles((prev) => [...prev, newObstacle]);
  };

  // Move obstacles and remove those reaching the ground
  const updateObstacles = () => {
    setObstacles((prevObstacles) =>
      prevObstacles
        .map((obstacle) => {
          if (obstacle.top >= GROUND_POSITION) {
            setScore((prevScore) => prevScore + 1); // Increment score for obstacles hitting the ground
            return null; // Remove obstacle
          }
          return { ...obstacle, top: obstacle.top + obstacle.speed }; // Move obstacle down
        })
        .filter((obstacle) => obstacle !== null) as Obstacle[] // Filter out removed obstacles
    );
  };

  // Detect collision between the ball and an obstacle
  const detectCollision = (obstacle: Obstacle) => {
    const ballRadius = 25; // Assuming ball has a radius of 25
    const obstacleSize = 50; // Assuming obstacles are square with a size of 50

    return (
      ballPosition.x < obstacle.left + obstacleSize && // Ball's left side is before obstacle's right side
      ballPosition.x + ballRadius * 2 > obstacle.left && // Ball's right side is after obstacle's left side
      ballPosition.y < obstacle.top + obstacleSize && // Ball's top side is above obstacle's bottom side
      ballPosition.y + ballRadius * 2 > obstacle.top // Ball's bottom side is below obstacle's top side
    );
  };

  // Check for collisions
  const checkCollisions = () => {
    obstacles.forEach((obstacle) => {
      if (detectCollision(obstacle)) {
        console.log('Collision detected! Game Over.');
        setGameOver(true); // End the game
        saveBestScore(); // Save best score
      }
    });
  };

  // Save best score to AsyncStorage
  const saveBestScore = async () => {
    if (score > bestScore) {
      await AsyncStorage.setItem('bestScore', score.toString());
      setBestScore(score);
    }
  };

  // Restart the game
  const restartGame = () => {
    setScore(0);
    setObstacles([]);
    setBallPosition({ x: 130, y: 600 });
    setGameOver(false);
    setLevel(1);
  };

  // Get a random obstacle type
  const getRandomType = () => {
    const types = ['bullet', 'grenade', 'tank', 'missile', 'barrel', 'shield', 'cubes', 'mine'];
    return types[Math.floor(Math.random() * types.length)];
  };

  return {
    ballPosition,
    setBallPosition,
    obstacles,
    score,
    bestScore,
    gameOver,
    level,
    restartGame,
  };
};

export default GameLogic;
