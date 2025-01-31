import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  horizontalContent: {
    padding: 16,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  item: {
    padding: 8,
  },
  itemTitle: {
    paddingLeft: 4,
  },
  textInputDark: {
    backgroundColor: 'grey',
    padding: 8,
    borderRadius: 8,
  },
  textInputLight: {
    backgroundColor: 'lightgrey',
    padding: 8,
    borderRadius: 8,
  },
});

export default Styles;
