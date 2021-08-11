import React, {useEffect, useState} from 'react';
import {Keyboard, Text, View, Dimensions, TextInput, Image} from 'react-native';
import globalStyles from '../../styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {firebase} from '../../firebase/config';
import Alert from 'react-native/Libraries/Alert/Alert';

export default function JoinScreen(props) {
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinGameID, setJoinGameID] = useState('');

  const matchesRef = firebase.firestore().collection('match');
  const navigation = props.navigation;
  const user = props.user;
  const slimeCoins = props.route.params.slimeCoins;

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

            // Deals with joining a lobby that has higer buyin fee
            if (slimeCoins < data.buyinFee) {
              Alert.alert(
                'Not enough SlimeCoins!',
                'You do not have enough SlimeCoins to join this lobby with buy-in fee of ' +
                  data.buyinFee,
                [{text: 'OK'}],
                {cancelable: false},
              );
            } else if (
              data.players.length < 3 &&
              !data.players.includes(user.id)
            ) {
              Alert.alert(
                'About to Join Game!',
                `This lobby has buy-in fee of ${data.buyinFee}. Are you sure you want to join?`,
                [
                  {
                    text: 'Join',
                    onPress: () => {
                      // Use firestore transactions to avoid race conditions
                      firebase.firestore().runTransaction(async t => {
                        const newestDoc = await t.get(
                          matchesRef.doc(joinGameID),
                        );
                        t.update(matchesRef.doc(joinGameID), {
                          players: [...newestDoc.data().players, user.id],
                        });
                      });

                      console.log('Join game ' + joinGameID + 'for ' + user.id);
                      setDisableButton(true);
                      setIsLoading(true);
                      navigation.navigate(Screens.LOBBY, {gameID: joinGameID});
                    },
                  },
                  {
                    text: 'Cancel',
                  },
                ],
                {cancelable: false},
              );
            } else {
              console.log(
                'Failed to join game ' + joinGameID + 'for ' + user.id,
              );
            }
          } else {
            alert('Failed to join game ' + joinGameID);
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
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Join Game</Text>
      <View style={globalStyles.header}>
        <Text style={globalStyles.feedbackText}>
          Welcome, {user.fullName}.{' '}
        </Text>
        <Text style={globalStyles.feedbackText}>
          SlimeCoins: {slimeCoins}{' '}
          <Image
            style={globalStyles.slimeCoins}
            source={require('../../assets/slimecoin.png')}
          />
        </Text>
      </View>
      <TextInput
        placeholderTextColor={'rgb(102,62,107)'}
        underlineColorAndroid={'rgb(78,5,90)'}
        autoCorrect={false}
        onChangeText={text => setJoinGameID(text.toUpperCase())}
        placeholder={'Game Room ID'}
        value={joinGameID}
        color={'rgb(78,5,90)'}
        maxLength={8}
        textAlign={'center'}
        fontSize={Dimensions.get('screen').width / 20}
        autoCapitalize={'characters'}
      />
      <View style={globalStyles.buttonView}>
        <PrimaryButton
          text={'Join'}
          onPress={() => joinGame()}
          disabled={disableButton}
        />
        <PrimaryButton
          text={'Back'}
          onPress={() => navigation.navigate(Screens.HOME)}
          disabled={disableButton}
        />
      </View>
    </View>
  );
}
