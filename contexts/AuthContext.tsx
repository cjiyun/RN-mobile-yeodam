import React, { createContext, useContext, useState } from 'react';
import { EXPO_PUBLIC_API_URL } from '@env';
import axios from 'axios';

// 사용자 정보 타입 정의
interface User {
    user_id: string;
    nickname: string;
    profile_image?: string;
    keywords?: string[];
}

// 컨텍스트 타입 정의
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoggedIn: boolean;
    isFirstLogin: boolean;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

    const value = {
        user,
        setUser: async (userData: User | null) => {
            if (userData) {
                try {
                    const response = await axios.get(`${EXPO_PUBLIC_API_URL}/users/${userData.user_id}`);
                    setIsFirstLogin(!response.data.keywords);
                } catch (error) {
                    console.error('사용자 정보 확인 실패:', error);
                }
            }
            setUser(userData);
        },
        isLoggedIn: !!user,
        isFirstLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 커스텀 훅
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 