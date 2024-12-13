import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { useEffect } from 'react';
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  useEffect(() => {
    initializeKakaoSDK('9ee15697ff1bff6cb85a7e12ed3ab126');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <StackNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
