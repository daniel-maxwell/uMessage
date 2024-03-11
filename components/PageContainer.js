// Library Imports
import { View, StyleSheet} from 'react-native';

// Page Container Component
const PageContainer = props => {

  // Merge the passed-in style with the container's default style
  const combinedStyle = StyleSheet.flatten([styles.container, props.style]);

  return (
    <View style={combinedStyle}>
      {props.children}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  }
});


export default PageContainer;