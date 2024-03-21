// Library Imports
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";

// Local Imports
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import Colours from "../constants/Colours";
import Styles from "../constants/Styles";
import { searchForUsers } from "../utils/UserActions";
import DataItem from "../components/DataItem";
import { setSavedUsers } from "../store/userSlice";

// Chat Contacts Screen
const NewConversation = (props) => {
  const dispatch = useDispatch(); // Redux dispatch function
  const [loading, setLoading] = useState(false); // Loading state
  const [users, setUsers] = useState(); // Users state
  const [noUsersFound, setNoUsersFound] = useState(false); // No users found state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const userData = useSelector((state) => state.auth.userData); // User data from redux store
  const isGroupChat = props.route.params && props.route.params.isGroupChat; // Group chat flag

  // Set custom header button options
  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="  Back"
              aria-label="Back Button"
              onPress={() => props.navigation.goBack()}
            ></Item>
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? "Add participants" : "New conversation"
    });
  }, []);

  // Search for users when search query changes (after a delay)
  useEffect( () => {
    const searchDelay = setTimeout( async () => {
      // If search query is empty, set users to null and return
      if (!searchQuery || searchQuery === "") {
        setNoUsersFound(false);
        setUsers();
        return;
      }
      setLoading(true);

      const results = await searchForUsers(searchQuery); // Users that match search query
      delete results[userData.uid]; // Remove current user from results
      setUsers(results); // Set users state

      // If no users found, set no users found state
      if (Object.keys(results).length === 0) {
        setNoUsersFound(true);
      } else {
        setNoUsersFound(false);
        dispatch(setSavedUsers({ newUsers: results }))
      }
      setLoading(false);
    }, 500);

    // Clear search delay
    return () => clearTimeout(searchDelay);
  }, [searchQuery]);

  // When a user is selected, navigate to the chat list screen
  const userSelectedHandler = (uid) => {
    console.log("Selected user: ", uid);
    props.navigation.navigate("ChatList", {
      selectedUser: uid
    });
  };

  // Render New Conversation Search Screen
  return (
    <PageContainer>

      {
        isGroupChat && (
          <View style={styles.conversationNameContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textbox}
                placeholder="New Group Chat"
                autoCorrect={false}
                autoComplete={false}
              />
            </View>
          </View>
        )
      }

      <View style={styles.searchContainer}>
        <Ionicons name="search-sharp" size={15} color={Colours.lightGrey} />
        <TextInput
          placeholder="Search"
          aria-label="Search for a user to chat with"
          style={styles.search}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      { /* Render loading spinner if loading */
        loading && (
          <View style={Styles.center}>
            <ActivityIndicator size={'large'} color={Colours.primary} />
          </View>
        )
      }
      { /* Render users list if they exist and are not still loading */
        !loading && users && !noUsersFound &&
        <FlatList
          data={Object.keys(users)}
          renderItem={( itemData ) => {
            const uid = itemData.item;
            const user = users[uid];
            return (
              // Render user data item
              <DataItem
                title={`${user.firstName} ${user.lastName}`}
                subtitle={user.bio}
                img={user.profilePicture}
                aria-label={`User Search Result`}
                onPress={() => userSelectedHandler(uid)}
                />
            );
          }}
        />
      }
      { /* Render no users found message if no users are found */
        !loading && noUsersFound && (
          <View style={Styles.center} aria-label="No users found">
            <Ionicons
              name="sad-outline"
              size={55}
              color={Colours.lightGrey}
              style={styles.noUsersFoundIcon}
            />
            <Text style={styles.noUsersFoundText}>
              No users found!
            </Text>
          </View>
        )
      }
      { /* Render no users found message if the user hasn't searched yet */
        !loading && !users && (
          <View style={Styles.center} aria-label="No users found view">
            <FontAwesome
              name="users"
              size={55}
              color={Colours.lightGrey}
              style={styles.noUsersFoundIcon}
            />
            <Text style={styles.noUsersFoundText}>
              Search for users to start a conversation!
            </Text>
          </View>
        )
      }
    </PageContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: Colours.lighterGrey,
    height: 35,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  search: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    width: "100%",
  },
  noUsersFoundIcon: {
    marginBottom: 15,
  },
  noUsersFoundText: {
    color: Colours.textColour,
    fontFamily: "light",
    letterSpacing: 0.3,
    fontSize: 15,

  },
  conversationNameContainer: {
    paddingVertical: 10,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colours.offWhite,
    flexDirection: "row",
    borderRadius: 2,
  },
  textbox: {
    color: Colours.textColour,
    width: "100%",
    
    flex: 1,
    fontSize: 15,
    fontFamily: "light",
  },
});

export default NewConversation;
