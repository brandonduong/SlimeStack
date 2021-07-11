import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Values from '../constants/Values';
import {firebase} from '../firebase/config';
import Slimes from '../constants/Slimes';
import MatchState from '../constants/MatchState';

MatchEventHeader.propTypes = {
  gameEnded: PropTypes.string,
  currentPlayerTurn: PropTypes.number,
  userIndex: PropTypes.number,
  winners: PropTypes.arrayOf(PropTypes.number),
};

export default function MatchEventHeader(props) {
  return (
    <View>
      {props.gameEnded === MatchState.STARTED ? (
        props.currentPlayerTurn === props.userIndex ? (
          <View style={styles.header}>
            <Text style={styles.subTitle}>Your Turn!</Text>
          </View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.subTitle}>
              Player {props.currentPlayerTurn + 1}'s Turn!
            </Text>
          </View>
        )
      ) : (
        <></>
      )}

      {props.gameEnded === MatchState.FINISHED &&
      props.winners &&
      props.winners.length > 0 ? (
        props.winners.length === 1 ? (
          <View style={styles.header}>
            <Text style={styles.subTitle}>
              Player {props.winners[0] + 1} wins!
            </Text>
          </View>
        ) : (
          <View style={styles.header}>
            <Text style={styles.subTitle}>
              Players{' '}
              {props.winners
                .map(item => {
                  return item + 1;
                })
                .join(', ')}{' '}
              win!
            </Text>
          </View>
        )
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
