import { Dimensions, StyleSheet } from "react-native";

const appBackgroundColor = 'rgba(216, 193, 222, 1)';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appBackgroundColor,
  },
  buttonView: {
    flex: 2,
    minWidth: '85%',
    display: 'flex',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: Dimensions.get('screen').height / 30,
    textAlign: 'left',
  },
  slimeCoins: {
    height: Dimensions.get('screen').height / 30,
    width: Dimensions.get('screen').height / 30,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('screen').height / 40,
    marginTop: 3,
    marginBottom: 3,
  },
  title: {
    fontSize: Dimensions.get('screen').height / 20,
    fontFamily: 'poppins-semibold',
    marginTop: 50,
  },
});
