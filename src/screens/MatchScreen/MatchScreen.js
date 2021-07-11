import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button, TouchableOpacity} from 'react-native';
import styles from './styles';
import {
  BackButton,
  HandRow,
  MatchEventHeader,
  PrimaryButton,
  PyramidGrid,
} from '../../components';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {firebase} from '../../firebase/config';
import Slimes from '../../constants/Slimes';
import MatchState from '../../constants/MatchState';

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
  const [winners, setWinners] = useState([]);
  const [gameEnded, setGameEnded] = useState(MatchState.STARTED);

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
        setRound(data.roundNum);
        getHand(data);
      });
  }, []);

  useEffect(() => {
    // Listen to document updates
    const kill = matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();

        // Stop listening if player has left
        if (!data.players.includes(user.id)) {
          console.log('Player stopped listening');
          kill();
        } else if (gameEnded === MatchState.STARTED) {
          console.log(
            'Current data for player: ',
            data.players.indexOf(user.id),
            data,
          );

          // Update game state
          setPyramidGrid(data.pyramidGrid);
          setCurrentPlayerTurn(data.currentPlayerTurn);
          setRound(data.roundNum);
          setGameEnded(data.matchState);

          // Game is over once all players can not move (indicated by current player can't move)
          if (
            data.currentPlayerTurn === data.players.indexOf(user.id) &&
            !doc.metadata.hasPendingWrites &&
            !data.playersCanMove[data.players.indexOf(user.id)]
          ) {
            console.log(data.playersCanMove);
            console.log('Game is over');

            endGame();
          }
        }

        // Check if player has valid move, if not skip turn
        /*


         */
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, []);

  useEffect(() => {
    if (gameEnded === MatchState.FINISHED) {
      getWinners();
    }
  }, [gameEnded]);

  useEffect(() => {
    /*
    console.log(
      'Current player turn:',
      currentPlayerTurn,
      userIndex,
      pyramidGrid,
    );
    if (
      currentPlayerTurn === userIndex &&
      !validMoveExists(playerHand, {pyramidGrid: pyramidGrid})
    ) {
      skipTurn().then(() =>
        console.log('No valid move exists for player ' + userIndex),
      );
    } else if (currentPlayerTurn === userIndex) {
      console.log('Player has valid move for', playerHand, 'in', pyramidGrid);
    }

     */
  }, [pyramidGrid]);

  function endGame() {
    matchesRef
      .doc(gameID)
      .update({matchState: MatchState.FINISHED})
      .catch(error => {
        alert(error);
      });
  }

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
  function countHandSize(hand) {
    const handCopy = [...hand];
    console.log('Counting', handCopy);
    let empty = handCopy.indexOf(''); // Hand has element '' for every slime played
    while (empty !== -1) {
      handCopy.splice(empty, 1);
      empty = handCopy.indexOf('');
    }
    return handCopy.length;
  }

  function getWinners() {
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        const handCount = [
          countHandSize(data.player1Hand),
          countHandSize(data.player2Hand),
          countHandSize(data.player3Hand),
        ];
        const winnerHandCount = Math.min(...handCount);
        console.log(handCount, winnerHandCount);

        let winningPlayers = [];
        let winningPlayer = handCount.indexOf(winnerHandCount);
        while (winningPlayer !== -1) {
          winningPlayers.push(winningPlayer);
          winningPlayer = handCount.indexOf(winnerHandCount, winningPlayer + 1);
        }
        console.log('Winners:', winningPlayers);
        setWinners(winningPlayers);
      });
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

  async function endTurn() {
    await matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        // Help update database
        if (
          data.currentPlayerTurn === data.players.indexOf(user.id) &&
          pyramidGrid
        ) {
          const playerNumHand =
            'player' + (data.players.indexOf(user.id) + 1) + 'Hand';

          let newRoundNum = round;
          if ((data.players.indexOf(user.id) + 1) % 3 === data.startingPlayer) {
            newRoundNum += 1;
          }

          matchesRef
            .doc(gameID)
            .update({
              pyramidGrid: pyramidGrid,
              currentPlayerTurn: (data.currentPlayerTurn + 1) % 3,
              [playerNumHand]: playerHand,
              roundNum: newRoundNum,
            })
            .catch(error => {
              alert(error);
            });
        }
      });
  }

  async function skipTurn() {
    // Player has no valid move
    await matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        if (data.currentPlayerTurn === data.players.indexOf(user.id)) {
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
        }
      });
  }

  function validMove(cell, slime) {
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
          good = good || (validMove(count, slime) && hand.includes(slime));
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
      <MatchEventHeader
        gameEnded={gameEnded}
        currentPlayerTurn={currentPlayerTurn}
        userIndex={userIndex}
        winners={winners}
      />

      <PyramidGrid
        pyramidGrid={pyramidGrid}
        selectedSlime={selectedSlime}
        gameID={gameID}
        playerHand={playerHand}
        userIndex={userIndex}
        setPlayerHand={setPlayerHand}
        placeOnGrid={
          gameEnded === MatchState.STARTED ? placeSlime : async () => {}
        }
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
            if (gameEnded === MatchState.STARTED) {
              skipTurn().then(() =>
                console.log('Player', userIndex, 'skipped turn'),
              );
            }
          }}
        />
        <PrimaryButton
          text={'Leave'}
          onPress={() => {
            leaveMatch().then(() => console.log('Player left game'));
          }}
        />
      </View>
    </View>
  );
}
