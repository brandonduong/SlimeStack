import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
  mainView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  playerView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  title: {
    fontSize: Dimensions.get('screen').height / 20,
    fontFamily: 'poppins-semibold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: Dimensions.get('screen').height / 30,
    fontFamily: 'poppins-semibold',
  },
  joinCode: {
    fontSize: Dimensions.get('screen').height / 30,
    fontFamily: 'poppins-semibold',
  },
  playerID: {
    fontSize: Dimensions.get('screen').height / 45,
    fontFamily: 'poppins-semibold',
  },
  buttonView: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

});
