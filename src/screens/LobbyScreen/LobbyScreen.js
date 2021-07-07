import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions, TextInput} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {firebase} from '../../firebase/config';

export default function LobbyScreen(props) {
  const matchesRef = firebase.firestore().collection('match');
  const [disableButton, setDisableButton] = useState(false);
  const navigation = props.navigation;
  const user = props.user;
  const gameID = props.route.params.gameID;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    console.log('Lobby screen for: ' + gameID);
    matchesRef.doc(gameID).onSnapshot(doc => {
      const data = doc.data();
      setPlayers(data.players);
      console.log('Current data: ', data);
    });

  }, []);

  function startGame() {}

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Text style={styles.title}>Lobby</Text>
            <Text style={styles.title}>Join Code: {gameID}</Text>
            {players.map((player, id) => (
              <Text style={styles.playerID} key={'player-' + id}>
                Player {id + 1}: {player}
              </Text>
            ))}
            {players[0] === user.id ? (
              <PrimaryButton
                text={'Start Game'}
                onPress={() => startGame()}
                disabled={disableButton}
              />
            ) : (
              <Text style={styles.waitText}>Wait for player 1 to start.</Text>
            )}
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
