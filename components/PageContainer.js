import { View, StyleSheet, SafeAreaView } from 'react-native';

const PageContainer = props => {
  return <View>
    {props.children}
  </View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  }
});


export default PageContainer;