import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// import loadAnimation from '../../../assets/animations/load.json';

export const Load: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* <LottieView
        source={loadAnimation}
        autoPlay={true}
        loop={true}
        style={styles.animation}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    backgroundColor: 'transparent',
    width: 200,
    height: 200,
  },
});
