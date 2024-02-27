import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Settings from "../screens/Settings";
import ConversationsList from "../screens/ConversationsList";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';

// Local imports
import ConversationSettings from '../screens/ConversationSettings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerTitle: "" }}>
      <Tab.Screen
        name="ChatList"
        component={ConversationsList}
        options={{
          tabBarLabel: "Conversations",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="chatbubbles-outline" size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons name="settings-outline" size={size} color={color} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conversations"
        component={TabNavigator}
        options={{
          gestureEnabled: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConversationSettings"
        component={ConversationSettings}
        options={{
          gestureEnabled: true,
          headerTitle: "Conversation Settings",
          headerTitleStyle: styles.label,
          headerBackTitleVisible: true,
          headerBackTitle: "Back",
          headerBackTitleStyle: { fontFamily: "light", fontSize: 18 },
        }}
      />
    </Stack.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontFamily: "light",
    fontSize: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default HomeNavigator;
