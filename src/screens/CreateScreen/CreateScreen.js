import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {firebase} from '../../firebase/config';

export default function CreateScreen(props) {
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const matchesRef = firebase.firestore().collection('match');
  const navigation = props.navigation;
  const user = props.user;

  useEffect(() => {
    console.log('Create screen');
  }, []);

  function makeGameID(length) {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
    const max = characters.length;
    let seededRandom = 0;
    for (let i = 0; i < length; i++) {
      seededRandom = Math.random() * max;
      id += characters.charAt(Math.floor(seededRandom));
    }
    return id;
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

    try {
      await matchesRef
        .doc(newGameID)
        .set({players: [user.id]})
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
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Text style={styles.title}>Create Game</Text>
            {/*
            <TextInput
              autoCorrect={false}
              marginBottom={10}
              onChangeText={text => this.updateName(text)}
              placeholder={'Your Name'}
              value={this.state.name}
            />
            */}
            <PrimaryButton
              text={'Start'}
              onPress={() => createGame()}
              disabled={disableButton}
            />
          </View>
          <View style={styles.backButtonView}>
            <BackButton
              onPress={() => {
                navigation.navigate(Screens.HOME);
              }}
              margin={Dimensions.get('screen').width / 15}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
