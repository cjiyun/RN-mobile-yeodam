import { ToastAndroid } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { EXPO_PUBLIC_API_URL } from '@env';

// 데이터베이스 테이블 구조에 맞는 타입 정의
interface WishList {
    user_id: string;
    dest_list: string[];  // JSON 형태로 저장되는 관광지 ID 배열
}

// Toast 메시지 표시 함수
export const showToastMessage = (msg: string) => {
    ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
    );
};

// 찜 목록 조회 함수
export const getWishList = async (userId: string): Promise<string[]> => {
    try {
        const response = await axios.get<WishList>(`${EXPO_PUBLIC_API_URL}/wishlist/${userId}`);
        return response.data.dest_list || [];
    } catch (error) {
        console.error('찜 목록 조회 실패:', error);
        return [];
    }
};

// 찜하기/취소 함수
export const toggleWishList = async (userId: string, destId: string) => {
    try {
        // 현재 사용자의 찜 목록 조회
        const currentList = await getWishList(userId);
        const isWished = currentList.includes(destId);
        
        // 새로운 찜 목록 생성
        const newDestList = isWished
            ? currentList.filter(id => id !== destId)
            : [...currentList, destId];

        // 데이터베이스 업데이트
        await axios.put(`${EXPO_PUBLIC_API_URL}/wishlist`, {
            user_id: userId,
            dest_list: newDestList
        });

        showToastMessage(isWished ? '취소되었습니다.' : '가보고 싶은 장소로 등록되었습니다.');
        return !isWished;

    } catch (error) {
        console.error('찜하기 처리 실패:', error);
        showToastMessage('처리 중 오류가 발생했습니다');
        throw error;
    }
};

// 찜하기 버튼 클릭 핸들러
export const handleWishClick = async (userId: string, destId: string) => {
  try {
      await toggleWishList(userId, destId);
  } catch (error) {
      console.error('찜하기 실패:', error);
      showToastMessage('찜하기 처리 중 오류가 발생했습니다');
  }
};

// 찜 상태 확인 Hook
export const useWishListStatus = (userId: string, destId: string) => {
    const [isWished, setIsWished] = useState(false);

    useEffect(() => {
        const checkWishStatus = async () => {
            try {
                const wishList = await getWishList(userId);
                setIsWished(wishList.includes(destId));
            } catch (error) {
                console.error('찜 상태 확인 실패:', error);
            }
        };

        if (userId && destId) {
            checkWishStatus();
        }
    }, [userId, destId]);

    return isWished;
};