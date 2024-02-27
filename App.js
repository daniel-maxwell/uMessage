import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import * as LoadingScreen from 'expo-splash-screen';
import * as Fonts from 'expo-font';

LoadingScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding


export default function App() {

  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
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
      catch (error) {
        console.log('Error loading fonts', error);
      }
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
    <SafeAreaProvider
    style={styles.container}
    onLayout={onLayoutChange}>
      <SafeAreaView>
        <Text style={styles.label}>Hi</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: "medium",
    fontSize: 24,
  }
});
