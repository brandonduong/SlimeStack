import React, { useEffect, useState } from "react";
import {Keyboard, Text, View, Dimensions} from 'react-native';
import styles from './styles';
import PrimaryButton from '../../components/PrimaryButton';
import Screens from '../../constants/Screens';
import {BackButton, LoadingPage} from '../../components/index';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function CreateScreen({navigation}) {
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Create screen');
  }, []);

  async function pressSubmit() {}

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.mainView}>
            <Text style={styles.title}>Create Game</Text>
            {/*
            <TextInput
              autoCorrect={false}
              marginBottom={10}
              onChangeText={text => this.updateName(text)}
              placeholder={'Your Name'}
              value={this.state.name}
            />
            */}
            <PrimaryButton
              text={'Start'}
              onPress={() => pressSubmit()}
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
