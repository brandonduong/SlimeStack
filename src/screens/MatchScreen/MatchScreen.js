import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View, Button} from 'react-native';
import styles from './styles';
import {BackButton} from '../../components';
import Screens from '../../constants/Screens';
import Slimes from '../../constants/Slimes';
import Values from '../../constants/Values';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MatchState from '../../constants/MatchState';
import {firebase} from '../../firebase/config';

export default function MatchScreen(props) {
  const navigation = props.navigation;
  const matchesRef = firebase.firestore().collection('match');
  const gameID = props.route.params.gameID;
  const [round, setRound] = useState(0);
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

      <View style={styles.handView}>
        {playerHand.slice(0, Values.HAND_SIZE / 2).map((slime, id) => (
          <TouchableOpacity
            style={
              (styles.slimeInHand,
              {
                backgroundColor: selectedSlime === id ? 'green' : '#DDDDDD',
              })
            }
            key={'hand-' + id}
            onPress={() => {
              setSelectedSlime(id);
              console.log('Player pressed: ' + slime + playerHand[id]);
            }}>
            <Text>{slime}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.handView}>
        {playerHand
          .slice(Values.HAND_SIZE / 2 + 1, Values.HAND_SIZE)
          .map((slime, id) => (
            <TouchableOpacity
              style={
                (styles.slimeInHand,
                {
                  backgroundColor:
                    selectedSlime === id + Values.HAND_SIZE / 2 + 1
                      ? 'green'
                      : '#DDDDDD',
                })
              }
              key={'hand-' + id}
              onPress={() => {
                setSelectedSlime(id + Values.HAND_SIZE / 2 + 1);
                console.log(
                  'Player pressed: ' +
                    slime +
                    playerHand[id + Values.HAND_SIZE / 2 + 1],
                );
              }}>
              <Text>{slime}</Text>
            </TouchableOpacity>
          ))}
      </View>

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
