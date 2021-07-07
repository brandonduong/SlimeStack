import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions, TextInput} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {firebase} from '../../firebase/config';

export default function JoinScreen(props) {
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinGameID, setJoinGameID] = useState('');
  const matchesRef = firebase.firestore().collection('match');
  const navigation = props.navigation;
  const user = props.user;

  useEffect(() => {
    console.log('Create screen');
  }, []);

  async function joinGame() {
    Keyboard.dismiss();

    try {
      await matchesRef
        .doc(joinGameID)
        .get()
        .then(doc => {
          console.log(doc.data());
          if (doc.exists) {
            const data = doc.data();
            if (data.players.length < 3 && !data.players.includes(user.id)) {
              matchesRef
                .doc(joinGameID)
                .update({players: [...data.players, user.id]});
              console.log('Join game ' + joinGameID + 'for ' + user.id);
              setDisableButton(true);
              setIsLoading(true);
              navigation.navigate(Screens.LOBBY, {gameID: joinGameID});
            } else {
              console.log(
                'Failed to join game ' + joinGameID + 'for ' + user.id,
              );
            }
          } else {
            console.log('Failed to join game ' + joinGameID + 'for ' + user.id);
          }
        })
        .catch(error => {
          alert(error);
        });
    } catch (error) {
      console.log('Failed to join game ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Text style={styles.title}>Join Game</Text>
            <TextInput
              placeholderTextColor="green"
              underlineColorAndroid="green"
              autoCorrect={false}
              marginBottom={10}
              onChangeText={text => setJoinGameID(text)}
              placeholder={'Game Room ID'}
              value={joinGameID}
              styles={styles.inputText}
            />
            <PrimaryButton
              text={'Join'}
              onPress={() => joinGame()}
              disabled={disableButton}
            />
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
