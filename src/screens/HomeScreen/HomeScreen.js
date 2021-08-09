import React, {useEffect, useState} from 'react';
import {Image, Text, View, Modal, FlatList} from 'react-native';
import styles from './styles';
import globalStyles from '../../styles';
import {firebase} from '../../firebase/config';
import {PrimaryButton} from '../../components/index';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';

export default function HomeScreen(props) {
  const navigation = props.navigation;

  const usersRef = firebase.firestore().collection('users');
  const userID = props.user.id;
  const username = props.user.fullName;

  const [slimeCoins, setSlimeCoins] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

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

  const instructions = [
    {
      instruction: `Start each game with ${Values.HAND_SIZE} random slimes in hand.`,
      id: 1,
    },
    {
      instruction:
        'Take turns stacking slimes in the shape of a pyramid against other players!',
      id: 2,
    },
    {
      instruction:
        'Normal slimes can be placed on the bottom row, or on top of two other slimes if at least one of them are of the same color.',
      id: 3,
    },
    {
      instruction:
        'The rare golden slime can be placed on the bottom row, or on top of two other slimes, regardless of the slimes beneath.',
      id: 4,
    },
    {
      instruction: 'No slime can be placed on top of a golden slime.',
      id: 5,
    },
    {
      instruction: 'The player with the smallest hand at the end wins!',
      id: 6,
    },
  ];

  const renderInstruction = ({item}) => (
    <Text style={styles.instructionsText}>{`\u2022 ${item.instruction}`}</Text>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Slime Stack</Text>
      <View style={globalStyles.header}>
        <Text style={globalStyles.feedbackText}>Welcome, {username}!</Text>
        <Text style={globalStyles.feedbackText}>
          SlimeCoins: {slimeCoins}{' '}
          <Image
            style={globalStyles.slimeCoins}
            source={require('../../assets/slimecoin.png')}
          />
        </Text>
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

      {/* Instructions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInstructions}
        onRequestClose={() => {
          setShowInstructions(!showInstructions);
        }}>
        <View style={styles.instructionsView}>
          <Text style={globalStyles.subtitle}>How to Play!</Text>
          <FlatList
            data={instructions}
            renderItem={renderInstruction}
            keyExtractor={item => item.id}
          />
          <PrimaryButton
            text={'Back'}
            onPress={() => setShowInstructions(!showInstructions)}
          />
        </View>
      </Modal>

      <View style={globalStyles.buttonView}>
        <PrimaryButton
          text={'Create Game'}
          onPress={() =>
            navigation.navigate(Screens.CREATE, {slimeCoins: slimeCoins})
          }
        />
        <PrimaryButton
          text={'Join Game'}
          onPress={() =>
            navigation.navigate(Screens.JOIN, {slimeCoins: slimeCoins})
          }
        />
        <PrimaryButton
          text={'How To Play'}
          onPress={() => setShowInstructions(true)}
        />
        <PrimaryButton
          text={'Leaderboard'}
          onPress={() => console.log('In progress')}
        />
        <PrimaryButton text={'Logout'} onPress={() => logout()} />
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
