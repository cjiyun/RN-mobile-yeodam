import { Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
  },
}); 