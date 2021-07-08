import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button, TouchableOpacity} from 'react-native';
import styles from './styles';
import { BackButton, HandRow, PyramidGrid } from "../../components";
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
  const [pyramidGrid, setPyramidGrid] = useState([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(-1);
  const [userIndex, setUserIndex] = useState(-1);

  useEffect(() => {
    console.log('Match screen for: ' + gameID);

    // Initialize match
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        setPlayers(data.players);
        setUserIndex(data.players.indexOf(user.id));
        setPyramidGrid(data.pyramidGrid);
        setCurrentPlayerTurn(data.startingPlayer);
        getHand(data);
      });

    // Listen to document updates
    matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();

        // Update game state
        setPyramidGrid(data.pyramidGrid);
        setCurrentPlayerTurn(data.currentPlayerTurn);
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, [gameID, user.id]);

  function getHand(data) {
    // Initialize local player hand
    console.log('Fetching hand');
    switch (data.players.indexOf(user.id)) {
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
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Round: {round}</Text>
      {currentPlayerTurn === userIndex ? (
        <View style={styles.header}>
          <Text style={styles.subTitle}>Your Turn!</Text>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.subTitle}>
            Player {currentPlayerTurn + 1}'s Turn!
          </Text>
        </View>
      )}

      <PyramidGrid
        pyramidGrid={pyramidGrid}
        selectedSlime={selectedSlime}
        gameID={gameID}
        playerHand={playerHand}
      />

      <View style={styles.separator} />

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
