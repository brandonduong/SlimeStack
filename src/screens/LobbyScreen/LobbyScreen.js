import React, {useEffect, useState} from 'react';
import {Text, View, Dimensions} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {BackButton} from '../../components/index';
import {firebase} from '../../firebase/config';
import MatchState from '../../constants/MatchState';
import Slimes from '../../constants/Slimes';
import Values from '../../constants/Values';

export default function LobbyScreen(props) {
  const matchesRef = firebase.firestore().collection('match');
  const [disableButton, setDisableButton] = useState(false);
  const navigation = props.navigation;
  const user = props.user;
  const gameID = props.route.params.gameID;
  const [players, setPlayers] = useState([]);
  // const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    console.log('Lobby screen for: ' + gameID);
    matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();
        console.log('Current data: ', data);
        setPlayers(data.players);

        if (data.matchState === MatchState.STARTED) {
          navigation.navigate(Screens.MATCH, {
            gameID: gameID
          });
        }

        /*
        data.players.forEach((playerID, index) => {
          console.log(playerID);
          usersRef
            .doc(playerID)
            .get()
            .then(player => {
              console.log(player.data());
              setPlayerNames([...playerNames, player.data().fullName]);
            })
            .catch(error => 'Username fetch failed: ' + error.message);
        });
        */
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, []);

  function initializeHand(size) {
    let hand = [];
    const slimes = [
      Slimes.BLUE,
      Slimes.GREEN,
      Slimes.PINK,
      Slimes.RED,
      Slimes.YELLOW,
      Slimes.POOP,
    ];
    const max = slimes.length;
    let seededRandom = 0;
    for (let i = 0; i < size; i++) {
      seededRandom = Math.random() * max;
      hand.push(slimes[Math.floor(seededRandom)]);
    }
    console.log(hand);
    return hand.sort();
  }

  function startGame() {
    if (players.length < 3) {
      alert('Can not start a game with less than 3 players.');
    } else {
      matchesRef.doc(gameID).update({
        matchState: MatchState.STARTED,
        player1Hand: initializeHand(Values.HAND_SIZE),
        player2Hand: initializeHand(Values.HAND_SIZE),
        player3Hand: initializeHand(Values.HAND_SIZE),
      });
      navigation.navigate(Screens.MATCH, {gameID: gameID});
    }
  }

  async function leaveRoom() {
    const userIndex = players.indexOf(user.id);
    setPlayers(players.splice(userIndex, 1));
    matchesRef.doc(gameID).update({players: players});
    await checkIfLastToLeave();
    navigation.navigate(Screens.HOME);
  }

  // Check if we were the last person to leave the game
  async function checkIfLastToLeave() {
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        if (doc.data().players.length === 0) {
          doc.delete();
        }
      })
      .catch(error => 'Game deletion failed: ' + error.message);
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.title}>Lobby</Text>
        <Text style={styles.subTitle}>Join Code:</Text>
        <Text style={styles.joinCode}>{gameID}</Text>
        <View style={styles.playerView}>
          {players.map((player, id) => (
            <Text style={styles.playerID} key={'player-' + id}>
              Player {id + 1}: {player}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.buttonView}>
        {players[0] === user.id ? (
          <PrimaryButton
            text={'Start Game'}
            onPress={() => startGame()}
            disabled={disableButton}
          />
        ) : (
          <Text style={styles.waitText}>Waiting for player 1 to start.</Text>
        )}
        <BackButton
          onPress={() => {
            leaveRoom();
          }}
          margin={Dimensions.get('screen').width / 15}
        />
      </View>
    </View>
  );
}
