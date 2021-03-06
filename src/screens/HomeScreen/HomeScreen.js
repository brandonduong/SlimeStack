import React, {useEffect, useState} from 'react';
import {Image, Text, View, Modal, FlatList, Dimensions} from 'react-native';
import styles from './styles';
import globalStyles from '../../styles';
import {firebase} from '../../firebase/config';
import {PrimaryButton} from '../../components/index';
import Screens from '../../constants/Screens';
import Values from '../../constants/Values';
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import Alert from 'react-native/Libraries/Alert/Alert';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function HomeScreen(props) {
  const navigation = props.navigation;

  const usersRef = firebase.firestore().collection('users');
  const userID = props.user.id;
  const username = props.user.fullName;
  const dailyBonus = props.route.params.dailyBonus;

  const [slimeCoins, setSlimeCoins] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const adUnitId = __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-3100447499130313/5020322691';

  useEffect(() => {
    // Initialize leaderboard screen
    refreshLeaderboard();

    // Reward daily login bonus
    if (dailyBonus) {
      alert(
        "Thanks for logging in today! Enjoy your daily login bonus of 100 Slime Coins! Don't spend them all in one place!",
      );
    }
  }, []);

  function showRewardAd() {
    // Create a new instance
    const rewardAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    let adWatched = false;

    // Add event handlers
    rewardAd.onAdEvent((type, error) => {
      if (type === RewardedAdEventType.LOADED) {
        rewardAd.show();
      }

      if (type === RewardedAdEventType.EARNED_REWARD) {
        usersRef
          .doc(userID)
          .update({slimeCoins: firebase.firestore.FieldValue.increment(300)});
        adWatched = true;
      }

      if (type === AdEventType.CLOSED) {
        if (adWatched) {
          console.log('User earned reward of 300 SlimeCoins');
          Alert.alert(
            'Thanks for watching!',
            'Here are 300 SlimeCoins as a thanks!',
            [{text: 'Yum', onPress: () => {}}],
            {cancelable: true},
          );
          adWatched = false;
        }
      }
    });

    // Load a new advert
    rewardAd.load();
  }

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
          setWins(data.wins);
          setLosses(data.losses);
        }
      },
      err => {
        console.log('Encountered error:' + err);
      },
    );
  }, [userID, usersRef]);

  function refreshLeaderboard() {
    usersRef
      .where('slimeCoins', '>', 0)
      .orderBy('slimeCoins', 'desc')
      .limit(100)
      .get()
      .then(docs => {
        let leaderboard = [];
        docs.forEach(doc => {
          const data = doc.data();
          leaderboard.push({
            fullName: data.fullName,
            slimeCoins: data.slimeCoins,
            id: data.id,
          });
        });
        setLeaderboardData(leaderboard);
      })
      .catch(error => {
        alert(error);
      });
  }

  function logout() {
    firebase.auth().signOut().then(props.setUser(null));
    navigation.navigate(Screens.LOGIN);
    console.log('User logged out');
  }

  const instructions = [
    {
      instruction: `Start each game with ${Values.HAND_SIZE} random slimes in hand.`,
      id: 1,
      imageSrc: require('../../assets/slimestack1.png'),
    },
    {
      instruction:
        'Take turns stacking slimes in the shape of a pyramid against other players!',
      id: 2,
      imageSrc: require('../../assets/slimestack2.png'),
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
      imageSrc: require('../../assets/slimestack3.png'),
    },
    {
      instruction: 'The player with the smallest hand at the end wins!',
      id: 6,
      imageSrc: require('../../assets/slimestack4.png'),
    },
    {
      instruction:
        'Above, the player Tupy has only 5 slimes left in their hand, therefore Tupy wins!',
      id: 7,
    },
  ];

  const renderInstruction = ({item}) => (
    <View style={{width: '100%'}}>
      <Text
        style={styles.instructionsText}>{`\u2022 ${item.instruction}`}</Text>
      {item.imageSrc ? (
        <Image
          style={styles.instructionImage}
          source={item.imageSrc}
          resizeMode={'contain'}
        />
      ) : (
        <></>
      )}
    </View>
  );

  const renderLeaderboard = ({item}) => (
    <View style={styles.leaderboardEntries}>
      <Text style={styles.leaderboardName}>{`${item.fullName}`}</Text>
      <Text style={styles.leaderboardSlimeCoin}>{`${item.slimeCoins}`}</Text>
    </View>
  );

  const instructionScreen = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInstructions}
      onRequestClose={() => {
        setShowInstructions(!showInstructions);
      }}>
      <View style={styles.instructionsView}>
        <Text style={globalStyles.subtitle}>How to Play!</Text>
        <View style={globalStyles.separator} />
        <FlatList
          data={instructions}
          renderItem={renderInstruction}
          keyExtractor={item => item.id}
        />
        <View style={globalStyles.separator} />
        <PrimaryButton
          text={'Back'}
          onPress={() => setShowInstructions(!showInstructions)}
        />
      </View>
    </Modal>
  );

  const leaderboardScreen = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLeaderboard}
      onRequestClose={() => {
        setShowLeaderboard(!showLeaderboard);
      }}>
      <View style={styles.instructionsView}>
        <Text style={globalStyles.subtitle}>
          <FontAwesome5 name={'trophy'} style={globalStyles.icon} /> Leaderboard{' '}
          <FontAwesome5 name={'trophy'} style={globalStyles.icon} />
        </Text>
        <View style={styles.leaderboardEntries}>
          <Text style={styles.leaderboardName}>{'Username'}</Text>
          <Text style={styles.leaderboardSlimeCoin}>{'SlimeCoins'}</Text>
        </View>
        <View style={globalStyles.separator} />
        <FlatList
          data={leaderboardData}
          renderItem={renderLeaderboard}
          keyExtractor={item => item.id}
        />
        <View style={globalStyles.separator} />
        <PrimaryButton
          width={Dimensions.get('screen').height / 15}
          onPress={() => refreshLeaderboard()}
          icon={'redo-alt'}
        />
        <PrimaryButton
          text={'Back'}
          onPress={() => setShowLeaderboard(!showLeaderboard)}
        />
      </View>
    </Modal>
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
          />{' '}
          <PrimaryButton
            icon={'plus'}
            width={Dimensions.get('screen').height / 32}
            height={Dimensions.get('screen').height / 32}
            onPress={() => {
              Alert.alert(
                'Watch an ad?',
                'Would you like to watch an ad to mine 300 juicy yummy SlimeCoins?',
                [
                  {text: 'Sure!', onPress: () => showRewardAd()},
                  {
                    text: 'Not now',
                  },
                ],
                {cancelable: true},
              );
            }}
          />
        </Text>
      </View>
      <View style={globalStyles.separator} />
      <View style={styles.winlossView}>
        <Text style={styles.winloss}>{`Wins: ${wins}`}</Text>
        <Text style={styles.winloss}>{`Losses: ${losses}`}</Text>
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
      {instructionScreen()}

      {/* Leaderboard */}
      {leaderboardScreen()}

      <View style={globalStyles.buttonView}>
        <PrimaryButton
          icon={'sign'}
          text={'Create Game'}
          onPress={() =>
            navigation.navigate(Screens.CREATE, {slimeCoins: slimeCoins})
          }
        />
        <PrimaryButton
          icon={'sign-in-alt'}
          text={'Join Game'}
          onPress={() =>
            navigation.navigate(Screens.JOIN, {slimeCoins: slimeCoins})
          }
        />
        <PrimaryButton
          icon={'scroll'}
          text={'How To Play'}
          onPress={() => setShowInstructions(true)}
        />
        <PrimaryButton
          icon={'trophy'}
          text={'Leaderboard'}
          onPress={() => setShowLeaderboard(true)}
        />
        <PrimaryButton
          icon={'sign-out-alt'}
          text={'Logout'}
          onPress={() => logout()}
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
