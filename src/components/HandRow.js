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
  function addOpacity(rgbString, opacity) {
    return rgbString.split(')')[0] + ',' + opacity + ')';
  }

  function handSlimeStyle(slime, slimeIndex) {
    let colour = '#dddddd';
    let opacity = 1;

    switch (slime) {
      case Slimes.YELLOW:
        colour = addOpacity('rgba(222,222,85)', opacity);
        break;
      case Slimes.RED:
        colour = addOpacity('rgba(191,86,86)', opacity);
        break;
      case Slimes.PINK:
        colour = addOpacity('rgba(255,192,203)', opacity);
        break;
      case Slimes.GREEN:
        colour = addOpacity('rgba(100,193,100)', opacity);
        break;
      case Slimes.BLUE:
        colour = addOpacity('rgba(173, 216, 230)', opacity);
        break;
      case Slimes.POOP:
        colour = addOpacity('rgba(214,124,62)', opacity);
        break;
    }

    opacity = 0.1;
    if (props.selectedSlime === slimeIndex) {
      opacity = 1;
    }

    return {
      margin: 2,
      width: Dimensions.get('screen').width / 5 - 25,
      height: Dimensions.get('screen').width / 5 - 25,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colour,
      borderColor: addOpacity('rgba(78,5,90)', opacity),
      borderWidth: 3,
    };
  }

  return (
    <View style={styles.handView}>
      {props.hand.slice(props.rowStart, props.rowEnd).map((slime, id) => (
        <TouchableOpacity
          style={handSlimeStyle(slime, id + props.rowStart)}
          key={'hand-' + id + props.rowStart}
          onPress={() => {
            props.setSelectedSlime(id + props.rowStart);
            console.log(
              'Player pressed: ' + slime + props.hand[id + props.rowStart],
            );
          }}>
          <Text style={styles.slimeText}>{slime}</Text>
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
  slimeText: {fontWeight: 'bold', color: 'rgb(59,59,59)'},
});
