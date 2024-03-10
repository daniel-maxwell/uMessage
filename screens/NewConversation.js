// Library Imports
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';

// Local Imports
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer";
import Colours from "../constants/Colours";
import Styles from "../constants/Styles";
import { searchForUsers } from "../utils/UserActions";

// Chat Contacts Screen
const NewConversation = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Back"
              onPress={() => props.navigation.goBack()}
            ></Item>
          </HeaderButtons>
        );
      },
      headerTitle: "New Conversation",
    });
  }, []);

  useEffect( () => {
    const searchDelay = setTimeout( async () => {
      if (!searchQuery || searchQuery === "") {
        setNoUsersFound(false);
        setUsers();
        return;
      }
      setLoading(true);

      const results = await searchForUsers(searchQuery);
      console.log(results);

      setLoading(false);
    }, 500);

    return () => clearTimeout(searchDelay);

  }, [searchQuery]);

  // Render New Conversation Search Screen
  return (
    <PageContainer>
      <View style={styles.searchContainer}>
        <Ionicons name="search-sharp" size={15} color={Colours.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.search}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {
        !loading && noUsersFound && (
          <View style={Styles.center}>
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
      {
        !loading && !users && (
          <View style={Styles.center}>
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
});

export default NewConversation;
