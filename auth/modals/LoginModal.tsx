import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import socialAuth from '../logins/socialAuth';
import { UserProfile } from '../../types/auth';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginModal({ visible, onClose, onLoginSuccess }: LoginModalProps) {
  const handleKakaoLogin = async () => {
    try {
      const user = await socialAuth.kakaoLogin();
      if (user) {
        // 로그인 성공 처리
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>로그인</Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleKakaoLogin}
            >
              <Image 
                source={require('../assets/images/kakao-logo.png')} 
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
}); 