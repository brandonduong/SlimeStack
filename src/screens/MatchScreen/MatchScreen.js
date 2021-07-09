import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button, TouchableOpacity} from 'react-native';
import styles from './styles';
import {
  BackButton,
  HandRow,
  PrimaryButton,
  PyramidGrid,
} from '../../components';
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
    const kill = matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();
        // console.log('Current data: ', data);

        // Update game state
        setPyramidGrid(data.pyramidGrid);
        setCurrentPlayerTurn(data.currentPlayerTurn);

        // Stop listening if player has left
        if (!data.players.includes(user.id)) {
          console.log('Player stopped listening');
          kill();
        }

        // Game is over once all players can not move (indicated by current player can't move)
        if (
          data.currentPlayerTurn === data.players.indexOf(user.id) &&
          !doc.metadata.hasPendingWrites &&
          !data.playersCanMove[data.players.indexOf(user.id)]
        ) {
          console.log(data.playersCanMove);
          console.log('Game is over');
        }

        // Check if player has valid move, if not skip turn
        /*
        if (
          data.currentPlayerTurn === data.players.indexOf(user.id) &&
          !validMoveExists(getHand(data), data)
        ) {
          endTurn(data);
          console.log(
            'No valid move exists for player ' + data.players.indexOf(user.id),
          );

          // Update in database player can move
          let playersCanMove = data.playersCanMove;
          if (playersCanMove[data.players.indexOf(user.id)]) {
            playersCanMove[data.players.indexOf(user.id)] = false;
            matchesRef.doc(gameID).update({playersCanMove: playersCanMove});
          } else {
            console.log('All players are out of moves');
          }
        } else if (
          data.currentPlayerTurn === data.players.indexOf(user.id) &&
          validMoveExists(getHand(data), data)
        ) {
          // Update in database player can move
          let playersCanMove = data.playersCanMove;
          playersCanMove[data.players.indexOf(user.id)] = true;
          matchesRef.doc(gameID).update({playersCanMove: playersCanMove});
        }

           */
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
        return data.player1Hand;
      case 1:
        setPlayerHand(data.player2Hand);
        return data.player2Hand;
      case 2:
        setPlayerHand(data.player3Hand);
        return data.player3Hand;
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

            // Reset all checks on playersCanMove
            matchesRef
              .doc(gameID)
              .update({
                playersCanMove: [true, true, true],
              })
              .catch(error => {
                alert(error);
              });

            endTurn();
          } else {
            alert('Wait your turn! You are player ' + (userIndex + 1));
          }
        });
    }
  }

  function endTurn() {
    // Help update database
    if (currentPlayerTurn === userIndex) {
      const playerNumHand = 'player' + (userIndex + 1) + 'Hand';

      matchesRef
        .doc(gameID)
        .update({
          pyramidGrid: pyramidGrid,
          currentPlayerTurn: (currentPlayerTurn + 1) % 3,
          [playerNumHand]: playerHand,
        })
        .catch(error => {
          alert(error);
        });
    }
  }

  function skipTurn() {
    // Player has no valid move

    if (currentPlayerTurn === userIndex) {
      matchesRef
        .doc(gameID)
        .get()
        .then(doc => {
          const data = doc.data();
          let playersCanMove = data.playersCanMove;
          playersCanMove[data.players.indexOf(user.id)] = false;

          matchesRef
            .doc(gameID)
            .update({
              playersCanMove: playersCanMove,
            })
            .catch(error => {
              alert(error);
            });
          endTurn();
        });
    }
  }

  function validMove(cell, slime, data) {
    if (data) {
      if (data.pyramidGrid[cell] !== Slimes.EMPTY) {
        return false;
      }
      // First row always valid
      if (cell < Values.PYRAMID_GRID_BASE_SIZE) {
        return true;
      } else {
        // Rest of game logic
        // console.log('Checking ' + cell + ' for ' + slime);
        let count = 0;
        for (let i = Values.PYRAMID_GRID_BASE_SIZE; i > 0; i--) {
          for (let o = 0; o < i; o++) {
            if (count === cell) {
              // Can't put anything on poop

              if (
                data.pyramidGrid[cell - i] === Slimes.POOP ||
                data.pyramidGrid[cell - i - 1] === Slimes.POOP
              ) {
                return false;
              }

              return (
                (data.pyramidGrid[cell - i] === slime &&
                  data.pyramidGrid[cell - i - 1] !== Slimes.EMPTY) ||
                (data.pyramidGrid[cell - i - 1] === slime &&
                  data.pyramidGrid[cell - i] !== Slimes.EMPTY) ||
                (slime === Slimes.POOP &&
                  data.pyramidGrid[cell - i] !== Slimes.EMPTY &&
                  data.pyramidGrid[cell - i - 1] !== Slimes.EMPTY)
              );
            }
            count++;
          }
        }
      }
      return false;
    } else {
      console.log(pyramidGrid);
      if (pyramidGrid[cell] !== Slimes.EMPTY) {
        return false;
      }
      // First row always valid
      if (cell < Values.PYRAMID_GRID_BASE_SIZE) {
        return true;
      } else {
        // Rest of game logic
        // console.log('Checking ' + cell + ' for ' + slime);
        let count = 0;
        for (let i = Values.PYRAMID_GRID_BASE_SIZE; i > 0; i--) {
          for (let o = 0; o < i; o++) {
            if (count === cell) {
              // Can't put anything on poop

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
  }

  function validMoveExists(hand, data) {
    console.log('Checking valid moves for ' + data.pyramidGrid);
    let good = false;
    const slimes = [
      Slimes.BLUE,
      Slimes.GREEN,
      Slimes.PINK,
      Slimes.RED,
      Slimes.YELLOW,
      Slimes.POOP,
    ];
    let count = 0;
    slimes.forEach((slime, index) => {
      count = 0;
      for (let i = Values.PYRAMID_GRID_BASE_SIZE; i > 0; i--) {
        for (let o = 0; o < i; o++) {
          // console.log(hand, slime, count);
          good =
            good || (validMove(count, slime, data) && hand.includes(slime));
          count++;
        }
      }
    });
    return good;
  }

  async function leaveMatch() {
    setPlayers(players.splice(userIndex, 1));
    matchesRef.doc(gameID).update({players: players});
    navigation.navigate(Screens.HOME);
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
        <PrimaryButton
          text={'Skip Turn'}
          onPress={() => {
            skipTurn();
          }}
        />
        <BackButton
          onPress={() => {
            leaveMatch().then(() => console.log('Player left game'));
          }}
          margin={Dimensions.get('screen').width / 15}
        />
      </View>
    </View>
  );
}
