// Library imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View, Platform } from "react-native";
import { useSelector } from "react-redux";
import { onValue, ref, getDatabase, child, off, get } from "firebase/database";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Local imports
import ConversationSettings from "../screens/ConversationSettings";
import Settings from "../screens/Settings";
import ConversationsList from "../screens/ConversationsList";
import Conversation from "../screens/Conversation";
import NewConversation from "../screens/NewConversation";
import { getFirebase } from "../utils/FirebaseIntegration";
import { setConversationsData } from "../store/conversationSlice";
import Colours from "../constants/Colours";
import Styles from "../constants/Styles";
import { setSavedUsers } from "../store/userSlice";
import { setConversationMessages } from "../store/messagesSlice";

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

// Stack Navigator Component
const StackNavigator = () => {
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
      <Stack.Group screenOptions={{ presentation: "containedModal" }}>
        <Stack.Screen // Conversation Settings Screen
          name="NewConversation"
          component={NewConversation}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// Home Navigator (returns Stack Navigator)
const HomeNavigator = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const savedUsers = useSelector((state) => state.users.savedUsers);
  const [loading, setLoading] = useState(true); // Loading state


  // Expo Push Notifications - source: https://docs.expo.dev/versions/latest/sdk/notifications/
  const [expoPushToken, setExpoPushToken] = useState('');
  //console.log(expoPushToken)
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("notif tapped")
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  console.log(expoPushToken)

  // Subscribes to firebase listeners for user chats and gets the data from them
  useEffect(() => {
    // Firebase prerequisites
    const app = getFirebase();
    const databaseRef = ref(getDatabase(app));

    // Save a reference to all conversations that the user is a part of (as an array)
    const userChatsRef = child(databaseRef, "userChats/" + userData.uid);
    const refList = [userChatsRef];

    // Subscribes to user chats listener and gets the data
    onValue(userChatsRef, (querySnapshot) => {
      // Gets the conversation ids from the user's active conversations
      const conversationIds = querySnapshot
        ? Object.values(querySnapshot.val() || {})
        : [];
      const conversations = {};
      let chatCount = 0;

      // Subscribes to each Conversation listener and gets the data
      for (const id of conversationIds) {
        const chatRef = child(databaseRef, "Conversations/" + id); // Saves a reference to this chat's data
        refList.push(chatRef);
        onValue(chatRef, (chatSnapshot) => {
          chatCount++;

          const data = chatSnapshot.val();

          if (data) {
            data.key = chatSnapshot.key;

            // For each chat the user is a part of...
            // For each user in each chat, gets their data if it's not already saved
            data.users.forEach(uid => {
              if (savedUsers[uid]) return; // If the user's data is already saved, skip
              const userRef = child(databaseRef, "users/" + uid); // Saves a reference to the user's data

              get(userRef).then((userSnapshot) => { // Gets the user's data from firebase
                const newUser = userSnapshot.val();
                // Dispatches an action to update the users data in the store
                dispatch(setSavedUsers({ newUsers: { newUser } }));
              });

              refList.push(userRef); // Adds the user's data reference to the list
            });
            conversations[chatSnapshot.key] = data; // Adds the chat data to the conversations object
          }

          if (chatCount >= conversationIds.length) {
            // Dispatches the conversations to the store
            dispatch(
              setConversationsData({ conversationsData: conversations })
            );
            setLoading(false);
          }
        });

        const messagesRef = child(databaseRef, "messages/" + id);
        refList.push(messagesRef);

        onValue(messagesRef, messagesSnapshot => {
          const messagesData = messagesSnapshot.val();
          dispatch(
            setConversationMessages({
              conversationId: id,
              messagesData
            })
          )
        });
        if (chatCount === 0) setLoading(false);
      }
    });

    return () => {
      // Unsubscribes from all user conversations firebase listeners
      refList.forEach((ref) => off(ref));
    };
  }, []);

  if (loading) {
    // Loading indicator while fetching conversations data
    <View style={Styles.center}>
      <ActivityIndicator size="large" color={Colours.primary} />
    </View>;
  }
  return <StackNavigator />;
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

// Expo Push Notifications - source: https://docs.expo.dev/versions/latest/sdk/notifications/
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Unfortunately, we need permission to make push notifications work.');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
    //console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default HomeNavigator;
