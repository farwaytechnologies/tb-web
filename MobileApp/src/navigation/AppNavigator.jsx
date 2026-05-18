import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main screens
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CoursePlayerScreen from '../screens/CoursePlayerScreen';
import MyLearningScreen from '../screens/MyLearningScreen';
import ExamsScreen from '../screens/ExamsScreen';
import TakeExamScreen from '../screens/TakeExamScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import JobsScreen from '../screens/JobsScreen';
import JobApplyScreen from '../screens/JobApplyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CertificatesScreen from '../screens/CertificatesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.card },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: colors.bg },
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Courses: focused ? 'library' : 'library-outline',
            Community: focused ? 'people' : 'people-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          paddingBottom: 4,
        },
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: 'Create Account' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: 'Reset Password' }} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
      <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} options={{ title: 'Learn' }} />
      <Stack.Screen name="MyLearning" component={MyLearningScreen} options={{ title: 'My Learning' }} />
      <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exams' }} />
      <Stack.Screen name="TakeExam" component={TakeExamScreen} options={{ title: 'Take Exam' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'New Post' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Jobs" component={JobsScreen} options={{ title: 'Job Alerts' }} />
      <Stack.Screen name="JobApply" component={JobApplyScreen} options={{ title: 'Apply' }} />
      <Stack.Screen name="Certificates" component={CertificatesScreen} options={{ title: 'My Certificates' }} />
    </Stack.Navigator>
  );
}

function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
