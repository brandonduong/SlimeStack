import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions, TextInput} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {firebase} from '../../firebase/config';

export default function LobbyScreen(props) {
  const matchesRef = firebase.firestore().collection('match');
  const [disableButton, setDisableButton] = useState(false);
  const navigation = props.navigation;
  const user = props.user;
  const gameID = props.route.params.gameID;

  useEffect(() => {
    console.log('Lobby screen for: ' + gameID);

  }, []);

  function startGame() {

  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Text style={styles.title}>Lobby</Text>
            <PrimaryButton
              text={'Start Game'}
              onPress={() => startGame()}
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
