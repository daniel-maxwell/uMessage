// Library imports
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Local imports
import Colours from '../constants/Colours';

// ReplyTo Component
const ReplyTo = (props) => {
  const { text, user, onCancel } = props;
  const name = `${user.firstName} ${user.lastName}`;

  return <View style={styles.container}>
    <View style={styles.textContainer}>
      <Text numberOfLines={1} style={styles.name}>{name}</Text>
      <Text numberOfLines={1}>{text}</Text>
    </View>

    <TouchableOpacity onPress={onCancel} style={{paddingRight: 5}}>
      <AntDesign name="close" size={24} color={Colours.blue} />
    </TouchableOpacity>
  </View>
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colours.lighterGrey,
    borderLeftColor: Colours.blue,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    fontFamily: 'medium',
    color: Colours.blue,
    fontWeight: 'medium',
    letterSpacing: 0.3,
  },
});

export default ReplyTo;