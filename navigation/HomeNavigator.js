// Library imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

// Local imports
import ConversationSettings from "../screens/ConversationSettings";
import Settings from "../screens/Settings";
import ConversationsList from "../screens/ConversationsList";
import Conversation from "../screens/Conversation";
import NewConversation from "../screens/NewConversation";

const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createNativeStackNavigator(); // Stack Navigator

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerTitle: "", headerShadowVisible: false }}
    >
      <Tab.Screen // Conversations List Screen
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
      <Tab.Screen // Settings Screen
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
      <Stack.Group>
        <Stack.Screen // Home Screen
          name="Conversations"
          component={TabNavigator}
          options={{
            gestureEnabled: true,
            headerShown: false,
          }}
        />
        <Stack.Screen // Conversation Screen
          name="Conversation"
          component={Conversation}
          options={{
            gestureEnabled: true,
            headerTitle: "",
            headerBackTitleVisible: true,
            headerBackTitle: "Back",
            headerBackTitleStyle: { fontFamily: "light", fontSize: 18 },
          }}
        />
        <Stack.Screen // Conversation Settings Screen
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
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
        <Stack.Screen // Conversation Settings Screen
            name="NewConversation"
            component={NewConversation}
          />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    fontFamily: "light",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeNavigator;
