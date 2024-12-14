import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getWishList, handleWishClick, showToastMessage } from '../wish/wishListProcess';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';
import { destination } from '../../types/typeInterfaces';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WishListPage() {
    const { user } = useAuth();
    const [wishListItems, setWishListItems] = useState<destination[]>([]);
    const navigation = useNavigation<NavigationProp>();

    // 찜 목록 데이터 가져오기
    const fetchWishListData = async () => {
        if (!user?.user_id) {
            showToastMessage('로그인 후에 이용 가능합니다');
            return;
        }

        try {
            const wishList = await getWishList(user.user_id);
            // 찜한 관광지들의 상세 정보 가져오기
            const destinations = await Promise.all(
                wishList.map(async (destId) => {
                    const response = await axios.get(`${EXPO_PUBLIC_API_URL}/destinations/${destId}`);
                    return response.data;
                })
            );
            setWishListItems(destinations);
        } catch (error) {
            console.error('찜 목록 로딩 실패:', error);
            showToastMessage('찜 목록을 불러오는데 실패했습니다');
        }
    };

    useEffect(() => {
        fetchWishListData();
    }, [user?.user_id]);

    const handleDestinationClick = (destination: destination) => {
        navigation.navigate('destination', { dest_id: destination.dest_id });
    };

    const handleWishRemove = async (destId: string) => {
        if (!user?.user_id) return;
        await handleWishClick(destId, user.user_id);
        setWishListItems(prev => prev.filter(item => item.dest_id !== destId));
    };

    if (!user?.user_id) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>로그인 후에 이용 가능합니다</Text>
            </View>
        );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={wishListItems}
          keyExtractor={(item) => item.dest_id}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.itemContainer}
              onPress={() => handleDestinationClick(item)}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.dest_name}</Text>
                <Pressable 
                  style={styles.wishButton}
                  onPress={() => handleWishRemove(item.dest_id)}
                >
                  <AntDesign name="heart" size={24} color="#eb4b4b" />
                </Pressable>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.message}>찜한 여행지가 없습니다</Text>
          }
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontWeight: '500',
    },
    wishButton: {
        position: 'absolute',
        right: 12,
        bottom: 12,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    }
});
