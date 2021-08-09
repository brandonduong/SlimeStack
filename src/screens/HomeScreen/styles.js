import {StyleSheet, Dimensions} from 'react-native';

const appBackgroundColor = 'rgb(233,210,238)';

export default StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  butttonText: {
    color: 'white',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
  instructionsTag: {
    marginTop: 15,
    paddingLeft: Dimensions.get('screen').width / 15,
    paddingRight: Dimensions.get('screen').width / 15,
    minWidth: '85%',
    maxWidth: '85%',
  },
  instructionsText: {
    fontSize: Dimensions.get('screen').height / 40,
    fontFamily: 'poppins-semibold',
    fontWeight: 'bold',
    marginTop: 20,
    color: 'rgb(78,5,90)',
  },
  instructionsView: {
    backgroundColor: appBackgroundColor,
    borderRadius: 20,
    padding: 10,
    margin: 20,
    height: Dimensions.get('screen').height / 1.2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
