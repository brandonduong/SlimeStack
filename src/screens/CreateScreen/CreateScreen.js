import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions} from 'react-native';
import styles from './styles';
import globalStyles from '../../styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import MatchState from '../../constants/MatchState';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {firebase} from '../../firebase/config';
import Slimes from '../../constants/Slimes';
import Slider from '@react-native-community/slider';

export default function CreateScreen(props) {
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buyinFee, setBuyinFee] = useState(0);

  const matchesRef = firebase.firestore().collection('match');
  const navigation = props.navigation;
  const user = props.user;
  const slimeCoins = props.route.params.slimeCoins;

  useEffect(() => {
    console.log('Create screen');
  }, []);

  function startingPyramidGrid(baseSize) {
    let pyramidGrid = [];
    for (let i = baseSize; i > 0; i--) {
      for (let o = 0; o < i; o++) {
        pyramidGrid.push(Slimes.EMPTY);
      }
    }
    return pyramidGrid;
  }

  function makeGameID(length) {
    let id = '';
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const max = characters.length;
    let seededRandom = 0;
    for (let i = 0; i < length; i++) {
      seededRandom = Math.random() * max;
      id += characters.charAt(Math.floor(seededRandom));
    }
    return id;
  }

  function startingPlayer() {
    const playerNums = [0, 1, 2];
    return playerNums[Math.floor(Math.random() * 3)];
  }

  //Returns true if the game id is invalid (already exists)
  async function isValidGameID(id) {
    if (id === '') {
      return true;
    }
    try {
      let snapshot = await matchesRef.doc(id).get();
      console.log(snapshot);
      if (!snapshot.exists) {
        // We want to make sure the game doesn't exist yet
        console.log(`Game ID (${id}) is valid`);
        return false;
      } else {
        console.log(`Game id (${id}) is not valid`);
        return true;
      }
    } catch {
      console.log(`Failed to check if game id ${id} is valid`);
      return true;
    }
  }

  async function createGame() {
    Keyboard.dismiss();

    setDisableButton(true);
    setIsLoading(true);
    let newGameID = makeGameID(Values.GAME_ID_LENGTH);
    while (await isValidGameID(newGameID)) {
      newGameID = makeGameID(Values.GAME_ID_LENGTH);
    }

    const starter = startingPlayer();
    try {
      await matchesRef
        .doc(newGameID)
        .set({
          players: [user.id],
          matchState: MatchState.LOBBY,
          pyramidGrid: startingPyramidGrid(Values.PYRAMID_GRID_BASE_SIZE),
          startingPlayer: starter,
          currentPlayerTurn: starter,
          playersCanMove: [true, true, true],
          roundNum: 1,
          buyinFee: buyinFee,
        })
        .then(() => {
          console.log('New game ' + newGameID + 'for ' + user.id);
          navigation.navigate(Screens.LOBBY, {gameID: newGameID});
        })
        .catch(error => {
          alert(error);
        });
    } catch (error) {
      console.log('Game creation failed: ' + error.message);
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={styles.title}>Create Game</Text>
      <View style={styles.header}>
        <Text style={styles.feedbackText}>Welcome, {user.fullName}. </Text>
        <Text style={styles.feedbackText}>SlimeCoins: {slimeCoins}!</Text>
      </View>
      <View style={styles.buttonView}>
        <Text style={styles.optionTag}>Buy-in Fee: {buyinFee}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={slimeCoins}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={val => setBuyinFee(Math.round(val))}
        />
        <PrimaryButton
          text={'Start'}
          onPress={() => createGame()}
          disabled={disableButton}
        />
        <BackButton
          onPress={() => {
            navigation.navigate(Screens.HOME);
          }}
          margin={Dimensions.get('screen').width / 15}
        />
      </View>
    </View>
  );
}
