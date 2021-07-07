import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button} from 'react-native';
import styles from './styles';
import {BackButton, HandRow} from '../../components';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {firebase} from '../../firebase/config';

export default function MatchScreen(props) {
  const navigation = props.navigation;
  const matchesRef = firebase.firestore().collection('match');
  const gameID = props.route.params.gameID;
  const [round, setRound] = useState(1);
  const user = props.user;
  const [players, setPlayers] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [selectedSlime, setSelectedSlime] = useState(null);

  useEffect(() => {
    console.log('Match screen for: ' + gameID);
    matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();
        setPlayers(data.players);
        const userIndex = data.players.indexOf(user.id);
        console.log('Current data: ' + data + 'currentUser: ' + userIndex);

        // Initialize local player hand
        switch (userIndex) {
          case 0:
            setPlayerHand(data.player1Hand);
            break;
          case 1:
            setPlayerHand(data.player2Hand);
            break;
          case 2:
            setPlayerHand(data.player3Hand);
            break;
        }
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, [gameID, user.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round: {round}</Text>
      <View style={styles.header}>{/* Display current player's turn */}</View>

      <HandRow
        hand={playerHand}
        rowStart={0}
        rowEnd={Values.HAND_SIZE / 2}
        selectedSlime={selectedSlime}
        setSelectedSlime={setSelectedSlime}
      />

      <HandRow
        hand={playerHand}
        rowStart={Values.HAND_SIZE / 2 + 1}
        rowEnd={Values.HAND_SIZE}
        selectedSlime={selectedSlime}
        setSelectedSlime={setSelectedSlime}
      />

      <View style={styles.buttonView}>
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
