import {StyleSheet, Dimensions} from 'react-native';

const appBackgroundColor = 'rgb(233,210,238)';

export default StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
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
    color: 'rgb(102,62,107)',
    paddingHorizontal: 10,
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
    elevation: 10,
  },
  instructionImage: {
    width: Dimensions.get('screen').width - 70,
    alignSelf: 'center',
  },
  leaderboardEntries: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaderboardName: {
    fontSize: Dimensions.get('screen').height / 30,
    fontFamily: 'poppins-semibold',
    fontWeight: 'bold',
    marginTop: 10,
    color: 'rgb(102,62,107)',
    paddingHorizontal: 15,
  },
  leaderboardSlimeCoin: {
    fontSize: Dimensions.get('screen').height / 30,
    fontFamily: 'poppins-semibold',
    fontWeight: 'bold',
    marginTop: 10,
    color: 'rgb(102,62,107)',
    paddingHorizontal: 15,
  },
  winlossView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  winloss: {
    fontSize: Dimensions.get('screen').height / 40,
    fontFamily: 'poppins-semibold',
    fontWeight: 'bold',
    color: 'rgb(102,62,107)',
    paddingHorizontal: 15,
  },
});
