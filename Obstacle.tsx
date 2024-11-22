import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Replace with your preferred icon set

interface ObstacleProps {
  left: number;
  top: number;
  type: string; // Example types: 'bullet', 'grenade', 'tank', etc.
}

const Obstacle: React.FC<ObstacleProps> = ({ left, top, type }) => {
  const { iconName, color } = getIconProperties(type);

  if (!iconName) return null;

  return (
    <View style={[styles.obstacle, { left, top }]}>
      <View style={styles.highlight}>
        <Icon name={iconName} size={50} color={color} />
      </View>
    </View>
  );
};

const getIconProperties = (type: string) => {
  switch (type) {
    case 'bullet':
      return { iconName: 'dot-circle-o', color: '#FF6347' }; // Red circle
    case 'grenade':
      return { iconName: 'bomb', color: '#8B0000' }; // Dark red bomb
    case 'tank':
      return { iconName: 'rocket', color: '#556B2F' }; // Green rocket
    case 'missile':
      return { iconName: 'arrow-up', color: '#FFD700' }; // Golden missile
    case 'barrel':
      return { iconName: 'cubes', color: '#8B4513' }; // Brown barrel
    case 'shield':
      return { iconName: 'shield', color: '#4682B4' }; // Steel blue shield
    case 'spike':
      return { iconName: 'caret-up', color: '#B22222' }; // Crimson spike
    case 'mine':
      return { iconName: 'rocket', color: '#808080' }; // Grey mine (gear)
    default:
      return { iconName: null, color: '' };
  }
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  highlight: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background for better visibility
  },
});

export default React.memo(Obstacle);
