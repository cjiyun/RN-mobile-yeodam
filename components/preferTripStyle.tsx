import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';
import { showToastMessage } from './wish/wishListProcess';
import { category } from '../types/typeInterfaces';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PreferTripStyle() {
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [keywords, setKeywords] = useState<category[]>([]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    // 키워드 목록 가져오기
    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await axios.get(`${EXPO_PUBLIC_API_URL}/categories`);
                setKeywords(response.data);
            } catch (error) {
                console.error('키워드 로딩 실패:', error);
                showToastMessage('키워드를 불러오는데 실패했습니다');
            }
        };
        fetchKeywords();
    }, []);

    // 키워드 선택/해제 처리
    const handleKeywordSelect = (keywordId: string) => {
        setSelectedKeywords(prev => {
            if (prev.includes(keywordId)) {
                return prev.filter(id => id !== keywordId);
            } else {
                return [...prev, keywordId];
            }
        });
    };

    // 선택 완료 처리
    const handleSubmit = async () => {
        if (selectedKeywords.length === 0) {
            showToastMessage('최소 1개 이상의 키워드를 선택해주세요');
            return;
        }

        Alert.alert(
            '선호 스타일 저장',
            '선택하신 여행 스타일을 저장하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel'
                },
                {
                    text: '확인',
                    onPress: async () => {
                        try {
                            await axios.put(`${EXPO_PUBLIC_API_URL}/users/${user?.user_id}/keywords`, {
                                keywords: selectedKeywords
                            });
                            showToastMessage('선호 스타일이 저장되었습니다');
                            navigation.replace('main');
                        } catch (error) {
                            console.error('선호 스타일 저장 실패:', error);
                            showToastMessage('저장에 실패했습니다');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>선호하는 여행 스타일을 선택해주세요</Text>
            <Text style={styles.subtitle}>나와 맞는 여행지를 추천해드립니다</Text>
            
            <View style={styles.keywordContainer}>
                {keywords.map((keyword) => (
                    <Pressable
                        key={keyword.keyword_id}
                        style={[
                            styles.keywordButton,
                            selectedKeywords.includes(keyword.keyword_id) && styles.selectedKeyword
                        ]}
                        onPress={() => handleKeywordSelect(keyword.keyword_id)}
                    >
                        <Text style={[
                            styles.keywordText,
                            selectedKeywords.includes(keyword.keyword_id) && styles.selectedKeywordText
                        ]}>
                            {keyword.keyword_name}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>선택 완료</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    keywordContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 32,
    },
    keywordButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
    },
    selectedKeyword: {
        backgroundColor: '#007AFF',
    },
    keywordText: {
        fontSize: 16,
        color: '#333',
    },
    selectedKeywordText: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
