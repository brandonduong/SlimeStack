import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: Dimensions.get('screen').height / 20,
    fontFamily: 'poppins-semibold',
    color: '#fff',
    marginBottom: 10,
  },
  backButtonView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorBox: {
    minHeight: Dimensions.get('screen').height / 15,
    maxHeight: Dimensions.get('screen').height / 15,
    minWidth: '85%',
    maxWidth: '85%',
  },
  error: {
    fontSize: Dimensions.get('screen').height / 50,
    fontFamily: 'poppins-semibold',
    color: '#fff',
    textAlign: 'center',
  },
  questionTag: {
    marginTop: 15,
    paddingLeft: Dimensions.get('screen').width / 15,
    paddingRight: Dimensions.get('screen').width / 15,
    minWidth: '85%',
    maxWidth: '85%',
  },
  questionTagText: {
    fontSize: Dimensions.get('screen').height / 50,
    fontFamily: 'poppins-semibold',
    color: '#ffffff66',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalContent: {
    fontSize: Dimensions.get('screen').height / 50,
    fontFamily: 'poppins-semibold',
    color: '#ffffffaa',
    textAlign: 'left',
  },
});
