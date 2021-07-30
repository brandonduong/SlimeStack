import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {firebase} from '../../firebase/config';
import {BackButton, PrimaryButton} from '../../components/index';
import Screens from '../../constants/Screens';
import MatchState from '../../constants/MatchState';
import Values from '../../constants/Values';

export default function HomeScreen(props) {
  const navigation = props.navigation;

  const usersRef = firebase.firestore().collection('users');
  const userID = props.user.id;
  const username = props.user.fullName;

  const [slimeCoins, setSlimeCoins] = useState(0);

  useEffect(() => {
    const kill = usersRef.doc(userID).onSnapshot(
      doc => {
        const data = doc.data();
        // Stop listening if player has left
        if (!firebase.auth().currentUser) {
          console.log('Player logged out ');
          kill();
        } else {
          setSlimeCoins(data.slimeCoins);
        }
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, [userID, usersRef]);

  function logout() {
    firebase.auth().signOut().then(props.setUser(null));
    navigation.navigate(Screens.LOGIN);
    console.log('User logged out');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slime Stack</Text>
      <View style={styles.header}>
        <Text style={styles.feedbackText}>Welcome, {username}. </Text>
        <Text style={styles.feedbackText}>SlimeCoins: {slimeCoins}!</Text>
      </View>
      {/*
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new entity"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEntityText(text)}
          value={entityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      */}

      <View style={styles.buttonView}>
        <PrimaryButton
          text={'Create Game'}
          onPress={() => navigation.navigate(Screens.CREATE)}
        />
        <PrimaryButton
          text={'Join Game'}
          onPress={() => navigation.navigate(Screens.JOIN)}
        />
        <PrimaryButton text={'How To Play'} />
        <BackButton
          onPress={() => {
            logout();
          }}
          margin={Dimensions.get('screen').width / 15}
        />
      </View>

      {/*
      {entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={item => item.id}
            removeClippedSubviews={true}
          />
        </View>
      )}
      */}
    </View>
  );
}
