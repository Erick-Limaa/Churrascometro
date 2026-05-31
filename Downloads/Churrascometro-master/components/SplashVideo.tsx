import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { StyleSheet, View } from 'react-native';

type Props = {
  onFinish: () => void;
};

export default function SplashVideo({ onFinish }: Props) {
  const handleStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onFinish();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/images/foguerav2.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={true}
        onPlaybackStatusUpdate={handleStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a00',
  },
});