import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginModal from '../auth/modals/LoginModal';
import tokenAuth from '../auth/logins/tokenAuth'; 
import { UserProfile } from '../types/auth';
import ProfileDropDown from '../auth/modals/ProfileDropDown';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 컴포넌트 마운트 시 토큰 검사
  useEffect(() => {
    tokenAuth.verifyToken().then(isValid => {
      if (isValid) {
        AsyncStorage.getItem('userInfo').then(storedUserInfo => {
          if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
            setIsLoggedIn(true);
          }
        });
      }
    });
  }, []);

  const handleLoginSuccess = async (user: UserProfile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userInfo', JSON.stringify(user))
      ]);
      setUserInfo(user);
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } catch (error) {
      console.error('Login state update failed:', error);
    }
  };

  return (
    <View style={styles.header}>
      <Image style={styles.logoIcon} source={require('../assets/images/logo-icon.png')} />
      <Text className='logo-name'>여담</Text>
      {isLoggedIn ? (
        <ProfileDropDown 
          setUserInfo={setUserInfo}
          setIsLoggedIn={setIsLoggedIn}
        />
      ) : (
        <TouchableOpacity onPress={() => setShowLoginModal(true)}>
          <Text>로그인</Text>
        </TouchableOpacity>
      )}

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logoIcon: {
    width: 30,
    height: 30,
    marginRight: 0,
  },
})