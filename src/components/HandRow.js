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
    let colour = '#DDDDDD';
    let opacity = 0.5;

    if (props.selectedSlime === slimeIndex) {
      opacity = 1;
    }
    console.log(props.selectedSlime);

    switch (slime) {
      case Slimes.YELLOW:
        colour = addOpacity('rgba(255,255,0)', opacity);
        break;
      case Slimes.RED:
        colour = addOpacity('rgba(255, 0, 0)', opacity);
        break;
      case Slimes.PINK:
        colour = addOpacity('rgba(255,192,203)', opacity);
        break;
      case Slimes.GREEN:
        colour = addOpacity('rgba(0,128,0)', opacity);
        break;
      case Slimes.BLUE:
        colour = addOpacity('rgba(173, 216, 230)', opacity);
        break;
      case Slimes.POOP:
        colour = addOpacity('rgba(165, 42, 42)', opacity);
        break;
    }

    return {
      margin: 2,
      width: Dimensions.get('screen').width / 5 - 25,
      height: Dimensions.get('screen').width / 5 - 25,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colour,
      borderColor: 'black',
      borderWidth: 2,
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
