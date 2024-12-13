import { login, logout, unlink } from '@react-native-kakao/user';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';
import { UserProfile } from '../../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socialAuth = {
  
  // 카카오 로그인 시작
  kakaoLogin: async () => {
    try {
      const token = await login();
      
      const response = await axios.post(`${EXPO_PUBLIC_API_URL}/auth/kakao`, {
        token
      });

      // 백엔드가 보내주는 유저 정보 형식
      if (response.data.user) {
        const userInfo: UserProfile = {
          user_id: response.data.user.user_id,    // 'kakao_12345' 형식
          nickname: response.data.user.nickname,
          profile_image: response.data.user.profile_image
        };
        return userInfo;
      }
      return null;
    } catch (error) {
      console.error('Kakao Login Error:', error);
      throw error;
    }
  },

  // 카카오 로그아웃
  kakaoLogout: async () => {
    try {
      // 1. 카카오 SDK 로그아웃
      await logout();
      
      // 2. 백엔드에 로그아웃 알림
      await axios.post(`${EXPO_PUBLIC_API_URL}/auth/logout`);
    } catch (error) {
      console.error('Kakao Logout Error:', error);
      throw error;
    }
  },

  // 카카오 연동 해제
  kakaoUnlink: async () => {
    try {
      // 1. 카카오 연동 해제
      await unlink();
      
      // 2. 백엔드에 알림
      await axios.post(`${EXPO_PUBLIC_API_URL}/auth/unlink`);
      
      // 3. 로컬 데이터 정리
      await Promise.all([
        AsyncStorage.removeItem('userInfo'),
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('refreshToken')
      ]);
    } catch (error) {
      console.error('Kakao Unlink Error:', error);
      throw error;
    }
  }
};

export default socialAuth; 