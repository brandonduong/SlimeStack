import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
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
  },
  remainingSlimeCounter: {
    fontSize: Dimensions.get('screen').height / 50,
    textAlign: 'right',
  },
  playerCanMoveIndicator: {
    color: '#ff0000',
  },
  matchInfoHeader: {
    flexDirection: 'row',
    display: 'flex',
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
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hand: {
    backgroundColor: 'rgba(45,45,45,0.2)',
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
    borderLeftColor: 'black',
    marginTop: Dimensions.get('screen').height / 115,
    marginRight: 7,
  },
});
