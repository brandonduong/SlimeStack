import {Dimensions, StyleSheet} from 'react-native';

const appBackgroundColor = 'rgb(233,210,238)';
const textColor = 'rgb(102,62,107)';
const titleColor = 'rgb(78,5,90)';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: appBackgroundColor,
  },
  buttonView: {
    flex: 2,
    minWidth: '85%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 50,
  },
  feedbackText: {
    fontSize: Dimensions.get('screen').height / 30,
    textAlign: 'left',
    color: textColor,
    fontWeight: 'bold',
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
    fontSize: Dimensions.get('screen').height / 15,
    fontFamily: 'poppins-semibold',
    marginTop: 50,
    color: titleColor,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: Dimensions.get('screen').height / 25,
    fontFamily: 'poppins-semibold',
    marginTop: 50,
    color: titleColor,
    fontWeight: 'bold',
  },
  buttonText: {
    color: textColor,
    fontFamily: 'poppins-semibold',
    fontSize: Dimensions.get('screen').height / 37,
    fontWeight: 'bold',
  },
  button: {
    minWidth: Dimensions.get('screen').width / 2.2,
    maxWidth: Dimensions.get('screen').width / 2.2,
    backgroundColor: '#eee7f1',
    borderRadius: Dimensions.get('screen').height,
    margin: 10,
    height: Dimensions.get('screen').height / 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: titleColor,
  },
  separator: {
    marginTop: 8,
    backgroundColor: 'rgb(186,136,191)',
    height: 2,
    width: '90%',
  },
});
