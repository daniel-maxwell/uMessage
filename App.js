// Libraries
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import * as LoadingScreen from 'expo-splash-screen';
import * as Fonts from 'expo-font';
import 'react-native-gesture-handler';

// Local imports
import Navigator from './navigation/Navigator';


LoadingScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding


export default function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    // Load the fonts
    const prepare = async () => {
      try {
        await Fonts.loadAsync({
          "black": require("./assets/fonts/NotoSans-Black.ttf"),
          "blackItalic": require("./assets/fonts/NotoSans-BlackItalic.ttf"),
          "bold": require("./assets/fonts/NotoSans-Bold.ttf"),
          "boldItalic": require("./assets/fonts/NotoSans-BoldItalic.ttf"),
          "extraBold": require("./assets/fonts/NotoSans-ExtraBold.ttf"),
          "extraBoldItalic": require("./assets/fonts/NotoSans-ExtraBoldItalic.ttf"),
          "extraLight": require("./assets/fonts/NotoSans-ExtraLight.ttf"),
          "extraLightItalic": require("./assets/fonts/NotoSans-ExtraLightItalic.ttf"),
          "italic": require("./assets/fonts/NotoSans-Italic.ttf"),
          "light": require("./assets/fonts/NotoSans-Light.ttf"),
          "lightItalic": require("./assets/fonts/NotoSans-LightItalic.ttf"),
          "medium": require("./assets/fonts/NotoSans-Medium.ttf"),
          "mediumItalic": require("./assets/fonts/NotoSans-MediumItalic.ttf")
        });
      }
      // If there's an error, log it
      catch (error) {
        console.log('Error loading fonts', error);
      }
      // Finally, set the app state as 'loaded'
      finally {
        setAppLoaded(true);
      }
    };

    prepare();
  }, []);


  // Hide the splash screen when the app is ready
  const onLayoutChange = useCallback( async () => {
    if (appLoaded) {
      await LoadingScreen.hideAsync();
    }
  }, [appLoaded]);


  // If the app hasn't finished loading, don't render anything
  if (!appLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={styles.container} onLayout={onLayoutChange}>
      <Navigator />

    </SafeAreaProvider>
  );
}


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
