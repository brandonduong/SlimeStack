import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

HandRow.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string).isRequired,
  rowStart: PropTypes.number,
  rowEnd: PropTypes.number,
  selectedSlime: PropTypes.number,
  setSelectedSlime: PropTypes.func,
};

export default function HandRow(props) {
  return (
    <View style={styles.handView}>
      {props.hand.slice(props.rowStart, props.rowEnd).map((slime, id) => (
        <TouchableOpacity
          style={{
            ...styles.slimeInHand,
            backgroundColor:
              props.selectedSlime === id + props.rowStart ? 'green' : '#DDDDDD',
          }}
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
  slimeInHand: {
    alignItems: 'center',
    padding: 10,
    margin: 2,
  },
});
