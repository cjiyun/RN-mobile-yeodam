import { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import handleSocialLogin from '../logins/socialAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStateHandlers } from '../../types/auth';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileDropDownProps extends AuthStateHandlers {}

export default function ProfileDropDown({ setUserInfo, setIsLoggedIn }: ProfileDropDownProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    try {
      await handleSocialLogin.kakaoLogout();
      await Promise.all([
        AsyncStorage.removeItem('userInfo'),
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('refreshToken')
      ]);
      setUserInfo(null);
      setIsLoggedIn(false);
      setShowDropdown(false);
      Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  };

  return (
    <Modal
      visible={showDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.overlay}
        onPress={() => setShowDropdown(false)}
      >
        <View style={styles.dropdown}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setShowDropdown(false);
              navigation.navigate('Settings');
            }}
          >
            <Text>설정</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Text>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
})