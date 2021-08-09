import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
  matchContainer: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
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
    marginTop: 10,
  },
  roundCounter: {
    fontSize: Dimensions.get('screen').height / 40,
    fontFamily: 'poppins-semibold',
    color: 'rgb(78,5,90)',
  },
  turnTimer: {
    fontSize: Dimensions.get('screen').height / 40,
    fontFamily: 'poppins-semibold',
    color: 'rgb(78,5,90)',
  },
  remainingSlimeCounter: {
    fontSize: Dimensions.get('screen').height / 50,
    textAlign: 'right',
    color: 'rgb(78,5,90)',
  },
  playerCanMoveIndicator: {
    color: '#ff0000',
  },
  matchInfoHeader: {
    flexDirection: 'row',
    display: 'flex',
    marginBottom: 15,
  },
  rounds: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
  },
  remainingSlimes: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  buttonView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  hand: {
    backgroundColor: 'rgb(198,165,217)',
  },
  remainingSlime: {flexDirection: 'row', justifyContent: 'flex-end'},
  turnIndicator: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 0,
    borderLeftWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgb(78,5,90)',
    marginTop: Dimensions.get('screen').height / 115,
    marginRight: 7,
  },
  separator: {
    marginVertical: 8,
    backgroundColor: 'rgb(186,136,191)',
    height: 2,
    width: Dimensions.get('screen').width / 1.11,
    alignSelf: 'center',
  },
});
