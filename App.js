import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { GroupsProvider } from './src/context/GroupsContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DiscoveryScreen from './src/screens/DiscoveryScreen';
import AccountScreen from './src/screens/AccountScreen';
import GroupChatScreen from './src/screens/GroupChatScreen';
import colors from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="DiscoveryTab" component={DiscoveryScreen} options={{ tabBarLabel: 'Discovery' }} />
      <Tab.Screen name="AccountTab" component={AccountScreen} options={{ tabBarLabel: 'Account' }} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, signIn } = useAuth();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onSignIn={signIn} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainStack} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GroupsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GroupsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
});
