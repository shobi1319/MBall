import React, { useRef } from 'react';
import { Animated, StyleSheet, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icon library

interface BallProps {
  position: { x: number; y: number };
  onMove: (x: number, y: number) => void;
}

const Ball: React.FC<BallProps> = ({ position, onMove }) => {
  const ballRadius = 25;
  const lastMove = useRef({ x: position.x, y: position.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(gestureState.moveX - ballRadius, 300));
      const newY = Math.max(0, Math.min(gestureState.moveY - ballRadius, 600));

      // Throttle position updates to reduce re-renders
      if (
        Math.abs(newX - lastMove.current.x) > 5 ||
        Math.abs(newY - lastMove.current.y) > 5
      ) {
        lastMove.current = { x: newX, y: newY };
        onMove(newX, newY);
      }
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.container, { left: position.x, top: position.y }]}
    >
      <Icon name="user" size={50} color="#0000FF" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(Ball);
