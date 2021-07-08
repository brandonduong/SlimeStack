import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button, TouchableOpacity} from 'react-native';
import styles from './styles';
import {BackButton, HandRow, PyramidGrid} from '../../components';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {firebase} from '../../firebase/config';
import Slimes from '../../constants/Slimes';

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
        getHand(data);
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

  async function placeSlime(cell, slime) {
    if (slime && validMove(cell, slime)) {
      await matchesRef
        .doc(gameID)
        .get()
        .then(doc => {
          if (doc.data().currentPlayerTurn === userIndex) {
            // Register player's move on grid
            pyramidGrid.splice(cell, 1, slime);

            // Remove placed slime from hand
            const index = selectedSlime;
            playerHand[index] = '';

            // Help update database
            const playerNumHand = 'player' + (userIndex + 1) + 'Hand';

            matchesRef
              .doc(gameID)
              .update({
                pyramidGrid: pyramidGrid,
                currentPlayerTurn: (doc.data().currentPlayerTurn + 1) % 3,
                [playerNumHand]: playerHand,
              })
              .catch(error => {
                alert(error);
              });
          } else {
            alert('Wait your turn! You are player ' + (userIndex + 1));
          }
        });
    }
  }

  function validMove(cell, slime) {
    if (pyramidGrid[cell] !== Slimes.EMPTY) {
      return false;
    }

    // First row always valid
    if (cell < Values.PYRAMID_GRID_BASE_SIZE) {
      return true;
    } else {
      // Rest of game logic
      let count = 0;
      for (let i = Values.PYRAMID_GRID_BASE_SIZE; i > 0; i--) {
        for (let o = 0; o < i; o++) {
          if (count === cell) {
            // Can't put anything on poop
            console.log(cell, i);
            if (
              pyramidGrid[cell - i] === Slimes.POOP ||
              pyramidGrid[cell - i - 1] === Slimes.POOP
            ) {
              return false;
            }

            return (
              (pyramidGrid[cell - i] === slime &&
                pyramidGrid[cell - i - 1] !== Slimes.EMPTY) ||
              (pyramidGrid[cell - i - 1] === slime &&
                pyramidGrid[cell - i] !== Slimes.EMPTY) ||
              (slime === Slimes.POOP &&
                pyramidGrid[cell - i] !== Slimes.EMPTY &&
                pyramidGrid[cell - i - 1] !== Slimes.EMPTY)
            );
          }
          count++;
        }
      }
    }
    return false;
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
        userIndex={userIndex}
        setPlayerHand={setPlayerHand}
        placeOnGrid={placeSlime}
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
        rowStart={Values.HAND_SIZE / 2}
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
