import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ball from './Ball';
import Obstacle from './Obstacle';
import GameLogic from './GameLogic';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icons

// Get dynamic screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BALL_RADIUS = SCREEN_WIDTH * 0.033; // Ball radius as 6.6% of screen width

const GameScreen = () => {
  const { ballPosition, setBallPosition, obstacles, score, bestScore, gameOver, level, restartGame } = GameLogic();

  // Prevent the ball from moving out of bounds
  const moveBall = (x: number, y: number) => {
    let newX = x;
    let newY = y;

    if (newX < BALL_RADIUS) newX = BALL_RADIUS;
    if (newX > SCREEN_WIDTH - BALL_RADIUS) newX = SCREEN_WIDTH - BALL_RADIUS;
    if (newY < BALL_RADIUS) newY = BALL_RADIUS;
    if (newY > SCREEN_HEIGHT - BALL_RADIUS) newY = SCREEN_HEIGHT - BALL_RADIUS;

    setBallPosition({ x: newX, y: newY });
  };

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.bestScoreText}>Best Score: {bestScore}</Text>
          <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Ball position={ballPosition} onMove={moveBall} />

          {/* Top Row for Score, Best Score, and Level */}
          <View style={styles.topRow}>
            <View style={styles.scoreItem}>
              <Icon name="star" size={20} color="#024549" />
              <Text style={styles.scoreText}>{`Score: ${score}`}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Icon name="trophy" size={20} color="#024549" />
              <Text style={styles.scoreText}>{`Best: ${bestScore}`}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Icon name="flag-checkered" size={20} color="#024549" />
              <Text style={styles.scoreText}>{`Level: ${level}`}</Text>
            </View>
          </View>

          {/* Render obstacles */}
          {obstacles.map((obstacle) => (
            <Obstacle key={obstacle.id} left={obstacle.left} top={obstacle.top} type={obstacle.type} />
          ))}

          {/* Replace ground with water GIF */}
          <Image source={require('./assets/water1.gif')} style={styles.ground} resizeMode="cover" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 30,
    color: 'red',
  },
  bestScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: SCREEN_HEIGHT * 0.08, // Adjust dynamically to 8% of screen height
  },
});

export default GameScreen;
