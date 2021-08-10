import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button, TouchableOpacity} from 'react-native';
import styles from './styles';
import globalStyles from '../../styles';
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
  const usersRef = firebase.firestore().collection('users');
  const gameID = props.route.params.gameID;
  const playerNames = props.route.params.playerNames;
  const buyinFee = props.route.params.buyinFee;
  const user = props.user;

  const [round, setRound] = useState(1);
  const [players, setPlayers] = useState([]);
  const [playersLeft, setPlayersLeft] = useState([false, false, false]);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerHandSizes, setPlayerHandSizes] = useState([12, 12, 12]);
  const [selectedSlime, setSelectedSlime] = useState(null);
  const [pyramidGrid, setPyramidGrid] = useState([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(-1);
  const [userIndex, setUserIndex] = useState(-1);
  const [winners, setWinners] = useState([]);
  const [gameEnded, setGameEnded] = useState(MatchState.STARTED);
  const [playersCanMove, setPlayersCanMove] = useState([true, true, true]);
  const [turnTimeLeft, setTurnTimeLeft] = useState(-1); // First turn should have no timer

  useEffect(() => {
    console.log('Match screen for: ' + gameID);
    //console.log(playerNames);

    // Initialize match
    matchesRef
      .doc(gameID)
      .get()
      .then(doc => {
        const data = doc.data();
        setPlayers(data.players);
        setPlayersLeft(data.playersLeft);
        setUserIndex(data.players.indexOf(user.id));
        setPyramidGrid(data.pyramidGrid);
        setCurrentPlayerTurn(data.startingPlayer);
        setRound(data.roundNum);
        setPlayersCanMove(data.playersCanMove);
        getHand(data);

        // Pay Buy-in Fee
        usersRef
          .doc(user.id)
          .get()
          .then(userDoc => {
            usersRef
              .doc(user.id)
              .update({slimeCoins: userDoc.data().slimeCoins - data.buyinFee});
          });
      });

    // Listen to document updates
    const kill = matchesRef.doc(gameID).onSnapshot(
      doc => {
        const data = doc.data();

        // Stop listening if player has left
        if (data.playersLeft[userIndex]) {
          console.log('Player stopped listening ');
          kill();
        } else if (gameEnded === MatchState.STARTED) {
          console.log(
            'Current data for player: ',
            data.players.indexOf(user.id),
            data,
          );

          // Reset turn timer for every new turn
          setTurnTimeLeft(Values.TURN_TIMER);

          setCurrentPlayerTurn(data.currentPlayerTurn);
          setRound(data.roundNum);
          setGameEnded(data.matchState);
          setPlayersCanMove(data.playersCanMove);
          setPlayersLeft(data.playersLeft);

          // Find index of the player before current player
          let lastPlayerIndex = data.players.indexOf(user.id - 1);
          if (lastPlayerIndex === -1) {
            lastPlayerIndex = 2;
          }

          // Only update game state if last player did something
          if (data.playersCanMove[lastPlayerIndex]) {
            // Update game state
            setPyramidGrid(data.pyramidGrid);
            setPlayerHandSizes([
              countHandSize(data.player1Hand),
              countHandSize(data.player2Hand),
              countHandSize(data.player3Hand),
            ]);
          }

          // Game is over once all players can not move (indicated by current player can't move)
          if (
            data.currentPlayerTurn === data.players.indexOf(user.id) &&
            !doc.metadata.hasPendingWrites &&
            !data.playersCanMove[data.players.indexOf(user.id)]
          ) {
            console.log('Game is over');

            endGame();
          }
        }
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, []);

  useEffect(() => {
    if (gameEnded === MatchState.STARTED) {
      if (turnTimeLeft > 0) {
        const timer = setTimeout(() => {
          setTurnTimeLeft(turnTimeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (turnTimeLeft === 0 && currentPlayerTurn === userIndex) {
        console.log('Turn timer ran out');
        skipTurn();
      }
    }
  }, [turnTimeLeft]);

  useEffect(() => {
    if (gameEnded === MatchState.FINISHED) {
      getWinners();
    }
  }, [gameEnded]);

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
    // console.log('Counting', handCopy);
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

        // Add 1 win to user if they are a winner
        if (winningPlayers.includes(userIndex)) {
          usersRef
            .doc(user.id)
            .update({wins: firebase.firestore.FieldValue.increment(1)});
        } else {
          usersRef
            .doc(user.id)
            .update({losses: firebase.firestore.FieldValue.increment(1)});
        }

        awardSlimeCoin(winningPlayers);
      });
  }

  function awardSlimeCoin(winningPlayers) {
    usersRef
      .doc(user.id)
      .get()
      .then(doc => {
        const data = doc.data();

        let reward = (Values.HAND_SIZE - playerHandSizes[userIndex]) * 10;
        if (winningPlayers.includes(userIndex)) {
          // Player is a winner, and shares pot with other winners
          reward += (buyinFee * 3) / winningPlayers.length;
        }

        usersRef.doc(user.id).update({
          slimeCoins: data.slimeCoins + reward,
        });
      })
      .catch(error => {
        alert(error);
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
              pyramidGrid[cell - i] === Slimes.GOLD ||
              pyramidGrid[cell - i - 1] === Slimes.GOLD
            ) {
              return false;
            }

            return (
              (pyramidGrid[cell - i] === slime &&
                pyramidGrid[cell - i - 1] !== Slimes.EMPTY) ||
              (pyramidGrid[cell - i - 1] === slime &&
                pyramidGrid[cell - i] !== Slimes.EMPTY) ||
              (slime === Slimes.GOLD &&
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

  async function leaveMatch() {
    const newPlayersLeft = playersLeft;
    newPlayersLeft[userIndex] = true;
    setPlayersLeft(newPlayersLeft);
    matchesRef.doc(gameID).update({playersLeft: newPlayersLeft});
    navigation.navigate(Screens.HOME);
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.matchContainer}>
        <View style={styles.matchInfoHeader}>
          <View style={styles.rounds}>
            <Text style={styles.roundCounter}>Round: {round}</Text>
            {turnTimeLeft >= 0 && gameEnded === MatchState.STARTED ? (
              <Text style={styles.turnTimer}>Time Left: {turnTimeLeft}</Text>
            ) : (
              <></>
            )}
            <MatchEventHeader
              gameEnded={gameEnded}
              currentPlayerTurn={currentPlayerTurn}
              userIndex={userIndex}
              winners={winners}
            />
          </View>
          <View styles={styles.remainingSlimes}>
            {playerNames.map((playerName, id) => (
              <View style={styles.remainingSlime} key={'remaining-slimes' + id}>
                {currentPlayerTurn === id ? (
                  <View style={styles.turnIndicator} key={'turn' + id} />
                ) : (
                  <></>
                )}

                <Text
                  style={styles.remainingSlimeCounter}
                  key={'remaining-slime-counter' + id}>
                  {playersCanMove[id] ? (
                    <></>
                  ) : (
                    <Text
                      styles={styles.playerCanMoveIndicator}
                      key={'can-move-indicator' + id}>
                      X{' '}
                    </Text>
                  )}
                  {playerName}: {playerHandSizes[id]}
                </Text>
              </View>
            ))}
          </View>
        </View>

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

        <View style={styles.hand}>
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
        </View>

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
    </View>
  );
}
