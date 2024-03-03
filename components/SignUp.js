// Library Imports
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Local Imports
import Input from './input';
import colours from '../constants/colours';
import SubmitFormButton from './SubmitFormButton';

// Sign Up Form Component
const SignUp = (props) => {
  return (
    <>
      <Input /* First Name field */
        label="First Name"
        icon="person-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* Last Name field */
        label="Last Name"
        icon="person-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* E-mail field */
        label="E-mail"
        icon="mail-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <Input /* Password field */
        label="Password"
        icon="lock-closed-outline"
        iconPack={Ionicons}
        iconSize={20}
        iconColor={colours.blue}
      />
      <SubmitFormButton /* Submit */
        title="Sign Up"
        style={{ marginTop: 20 }}
        onPress={() => console.log("Sign Up")}
        disabled={false}
      />
    </>
  );
};

export default SignUp;
