import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';

const tokenAuth = {
  // 토큰 확인 및 사용자 인증
  verifyToken: async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        const response = await axios.get(`${EXPO_PUBLIC_API_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('토큰 유효성 검사 실패:', error);
      await AsyncStorage.removeItem('user_token');
      return null;
    }
  }
};

export default tokenAuth; 