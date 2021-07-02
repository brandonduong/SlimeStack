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

export default function HomeScreen(props) {
  const [entityText, setEntityText] = useState('');
  const [entities, setEntities] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigation = props.navigation;

  const entityRef = firebase.firestore().collection('entities');
  const userID = props.user.id;
  const username = props.user.fullName;

  useEffect(() => {
    console.log(userID);

    entityRef
      .where('authorID', '==', userID)
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        querySnapshot => {
          const newEntities = [];
          querySnapshot.forEach(doc => {
            const entity = doc.data();
            entity.id = doc.id;
            newEntities.push(entity);
          });
          setEntities(newEntities);
        },
        error => {
          console.log(error);
        },
      );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slime Stack</Text>
      <View style={styles.header}>
        <Text style={styles.feedbackText}>Welcome, {username}. </Text>
        <Text style={styles.feedbackText}>UserID: {userID}.</Text>
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
        <PrimaryButton
          text={'How To Play'}
          onPress={() => setShowInstructions(true)}
        />
        <BackButton
          onPress={() => {
            firebase.auth().signOut().then(props.setUser(null));
            navigation.navigate(Screens.LOGIN);
            console.log('User logged out');
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
