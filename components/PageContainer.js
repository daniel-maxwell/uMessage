// Library Imports
import { View, StyleSheet} from 'react-native';

// Page Container Component
const PageContainer = props => {
  return (
    <View style={styles.container}>
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