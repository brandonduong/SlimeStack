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

PyramidGrid.propTypes = {
  pyramidGrid: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSlime: PropTypes.number,
  gameID: PropTypes.string,
  playerHand: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function PyramidGrid(props) {
  const matchesRef = firebase.firestore().collection('match');

  async function placeSlime(cell, slime) {
    props.pyramidGrid.splice(cell, 1, slime);
    try {
      await matchesRef
        .doc(props.gameID)
        .update({pyramidGrid: props.pyramidGrid})
        .catch(error => {
          alert(error);
        });
    } catch (error) {
      console.log('Failed to place slime ' + error.message);
    }
  }

  return (
    <View style={styles.pyramidRow}>
      {props.pyramidGrid
        .slice(0, Values.PYRAMID_GRID_BASE_SIZE)
        .map((cell, id) => (
          <TouchableOpacity
            key={'cell-' + id}
            style={{
              ...styles.pyramidCell,
            }}
            onPress={() => {
              placeSlime(id, props.playerHand[props.selectedSlime]).then(r =>
                console.log(
                  'Player placed: ' +
                    props.playerHand[props.selectedSlime] +
                    ' at cell ' +
                    id,
                ),
              );
            }}>
            <Text>{props.pyramidGrid[id]}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pyramidRow: {
    flexDirection: 'row',
    padding: 2,
  },
  pyramidCell: {
    margin: 2,
    width: Dimensions.get('screen').width / 9 - 16,
    height: Dimensions.get('screen').width / 9 - 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
