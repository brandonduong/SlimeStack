import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Slimes from '../constants/Slimes';

HandRow.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string).isRequired,
  rowStart: PropTypes.number,
  rowEnd: PropTypes.number,
  selectedSlime: PropTypes.number,
  setSelectedSlime: PropTypes.func,
};

export default function HandRow(props) {
  function handSlimeStyle(slime) {
    let colour = '#DDDDDD';
    switch (slime) {
      case Slimes.YELLOW:
        colour = 'yellow';
        break;
      case Slimes.RED:
        colour = 'red';
        break;
      case Slimes.PINK:
        colour = 'pink';
        break;
      case Slimes.GREEN:
        colour = 'green';
        break;
      case Slimes.BLUE:
        colour = 'lightblue';
        break;
      case Slimes.POOP:
        colour = 'brown';
        break;
    }

    return {
      margin: 2,
      width: Dimensions.get('screen').width / 5 - 20,
      height: Dimensions.get('screen').width / 5 - 20,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colour,
    };
  }

  return (
    <View style={styles.handView}>
      {props.hand.slice(props.rowStart, props.rowEnd).map((slime, id) => (
        <TouchableOpacity
          style={handSlimeStyle(slime)}
          key={'hand-' + id + props.rowStart}
          onPress={() => {
            props.setSelectedSlime(id + props.rowStart);
            console.log(
              'Player pressed: ' + slime + props.hand[id + props.rowStart],
            );
          }}>
          <Text>{slime}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  handView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 2,
  },
});
