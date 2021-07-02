import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginTop: 80,
    marginBottom: 20,
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  title: {
    fontSize: 50,
    marginTop: 50,
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
    textAlign: 'center',
  },
  buttonView: {
    flex: 2,
    minWidth: '85%',
    display: 'flex',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: Dimensions.get('screen').height / 60,
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('screen').height / 40,
    marginTop: 3,
  },
});
