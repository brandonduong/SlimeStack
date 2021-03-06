import React, {useEffect, useState} from 'react';
import {Text, View, Dimensions, Image} from 'react-native';
import styles from './styles';
import globalStyles from '../../styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {BackButton} from '../../components/index';
import {firebase} from '../../firebase/config';
import MatchState from '../../constants/MatchState';
import Slimes from '../../constants/Slimes';
import Values from '../../constants/Values';

export default function LobbyScreen(props) {
  const matchesRef = firebase.firestore().collection('match');
  const usersRef = firebase.firestore().collection('users');
  const [disableButton, setDisableButton] = useState(false);
  const navigation = props.navigation;
  const user = props.user;
  const gameID = props.route.params.gameID;
  const [players, setPlayers] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [buyinFee, setBuyinFee] = useState(0);
  // const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    console.log('Lobby screen for: ' + gameID);
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        setBuyinFee(doc.data().buyinFee);
      });

    const kill = matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();
        // console.log('Current data: ', data);

        // Stop listening

        setPlayers(data.players);
        if (data.matchState === MatchState.STARTED) {
          kill();
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

  useEffect(() => {
    // Whenever player state changes, update playerNames list
    if (players.length > 0) {
      usersRef
        .where('id', 'in', players)
        .get()
        .then(docs => {
          let names = [];
          docs.forEach(doc => {
            const data = doc.data();
            names[players.indexOf(data.id)] = data.fullName;
          });
          setPlayerNames(names);
        })
        .catch(error => {
          alert(error);
        });
    }
  }, [players]);

  useEffect(() => {
    // Wait for playerNames to update before moving to match
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        if (data.matchState === MatchState.STARTED && playerNames.length > 0) {
          console.log(playerNames);
          navigation.navigate(Screens.MATCH, {
            gameID: gameID,
            playerNames: playerNames,
            buyinFee: buyinFee,
          });
        }
      })
      .catch(error => {
        alert(error);
      });
  }, [playerNames]);

  function initializeHands(size) {
    let hands = [];
    const slimes = [
      Slimes.BLUE,
      Slimes.GREEN,
      Slimes.PINK,
      Slimes.RED,
      Slimes.ORANGE,
    ];
    const max = slimes.length;
    let seededRandom = 0;
    for (let i = 0; i < 3; i++) {
      let hand = [];
      for (let o = 0; o < size; o++) {
        seededRandom = Math.random() * max;
        hand.push(slimes[Math.floor(seededRandom)]);
      }
      console.log('Hand:', hand);
      hands.push(hand.sort());
    }
    // 75% chance for a Poo to appear
    if (Math.floor(Math.random() * 4) >= 1) {
      hands[Math.floor(Math.random() * 3)][size - 1] = Slimes.GOLD;
    }
    return hands;
  }

  function startGame() {
    if (players.length < 3) {
      alert('Can not start a game with less than 3 players.');
    } else {
      const hands = initializeHands(Values.HAND_SIZE);
      console.log(playerNames);

      matchesRef.doc(gameID).update({
        matchState: MatchState.STARTED,
        player1Hand: hands[0],
        player2Hand: hands[1],
        player3Hand: hands[2],
      });
    }
  }

  async function leaveRoom() {
    const userIndex = players.indexOf(user.id);

    setPlayers(players.splice(userIndex, 1));
    // Update player list in firestore
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
          // Delete lobby is all players left
          doc.delete();
        }
      })
      .catch(error => 'Game deletion failed: ' + error.message);
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Lobby</Text>
      <View style={globalStyles.header}>
        <Text style={globalStyles.feedbackText}>Join Code: {gameID}</Text>
        <Text style={globalStyles.feedbackText}>
          Buy-in Fee: {buyinFee}{' '}
          <Image
            style={globalStyles.slimeCoins}
            source={require('../../assets/slimecoin.png')}
          />
        </Text>
      </View>
      {/*
      <View style={styles.playerView}>
        {players.map((player, id) => (
          <Text style={styles.playerID} key={'player-' + id}>
            Player {id + 1}: {player}
          </Text>
        ))}
      </View>
      */}
      <View style={styles.playerView}>
        <Text style={globalStyles.subtitle}>Players Waiting in Lobby</Text>
        <View style={globalStyles.separator} />
        {playerNames.map((player, id) => (
          <Text style={globalStyles.buttonText} key={'player-' + id}>
            Player {id + 1}: {player}
          </Text>
        ))}
      </View>
      <View style={globalStyles.buttonView}>
        {players[0] === user.id ? (
          <PrimaryButton
            text={'Start Game'}
            onPress={() => startGame()}
            disabled={disableButton}
          />
        ) : (
          <Text style={globalStyles.buttonText}>
            Waiting for player 1 to start.
          </Text>
        )}
        <PrimaryButton
          text={'Leave'}
          onPress={() => leaveRoom()}
          disabled={disableButton}
        />
      </View>
    </View>
  );
}
