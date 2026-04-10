import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  onFim: () => void;
};

export default function SplashAnimadaScreen({ onFim }: Props) {
  const anim = useRef<LottieView>(null);

  return (
    <View style={styles.container}>
      <LottieView
        ref={anim}
        source={require('../assets/animations/animation.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFim}
        style={styles.anim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anim: {
    width: '100%',
    height: '100%',
  },
});