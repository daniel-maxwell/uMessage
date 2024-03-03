// Library Imports
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Local Imports
import Input from '../components/input';
import colours from '../constants/colours';
import SubmitFormButton from '../components/SubmitFormButton';

// Sign In Form Component
const SignIn = () => {
  return (
    <>
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
        title="Sign In"
        style={{ marginTop: 20 }}
        onPress={() => console.log("Sign In")}
        disabled={false}
      />
    </>
  );
};

export default SignIn;
