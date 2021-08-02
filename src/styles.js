import { Dimensions, StyleSheet } from "react-native";

const appBackgroundColor = 'rgb(233,210,238)';
const textColor = 'rgb(102,62,107)'

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
    color: textColor,
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
    color: textColor,
  },
  buttonText: {
    color: textColor,
    fontFamily: 'poppins-semibold',
    fontSize: Dimensions.get('screen').height / 35,
  },
  button: {
    minWidth: '45%',
    maxWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: Dimensions.get('screen').height,
    margin: 10,
    height: Dimensions.get('screen').height / 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
