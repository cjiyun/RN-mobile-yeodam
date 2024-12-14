import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import HomeScreen from '../components/(tabs)/index';
import SearchScreen from '../components/(tabs)/search';
import DestinationScreen from '../components/destination/destDetails';
import WishListPage from '../components/(tabs)/wishListPage';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  // 중간 생략 StackNavigator 렌더 부분
  return (
    <Stack.Navigator
      screenOptions={{}}>
      <Stack.Screen
        name='main'
        component={HomeScreen}
        options={{
          headerTitle: () => <Header />,
        }}
      />
      <Stack.Screen
        name='search'
        component={SearchScreen}
        options={{ title: '검색' }}
      />
      <Stack.Screen
        name='destination'
        component={DestinationScreen}
        options={({ route }) => ({
          title: route.params.dest_id
        })}
      />
      <Stack.Screen
        name='wishList'
        component={WishListPage}
        options={{ title: '가보고 싶은 장소' }}
      />
    </Stack.Navigator>
  );
}