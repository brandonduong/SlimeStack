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

PyramidGrid.propTypes = {
  pyramidGrid: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSlime: PropTypes.number,
  gameID: PropTypes.string,
  playerHand: PropTypes.arrayOf(PropTypes.string).isRequired,
  setPlayerHand: PropTypes.func,
  userIndex: PropTypes.number,
  placeOnGrid: PropTypes.func,
};

export default function PyramidGrid(props) {
  function pyramidCellStyle(slime) {
    let colour = '#efefef';

    switch (slime) {
      case Slimes.ORANGE:
        colour = 'rgb(214,124,62)';
        break;
      case Slimes.RED:
        colour = 'rgb(195,78,78)';
        break;
      case Slimes.PINK:
        colour = 'rgba(255,192,203,1)';
        break;
      case Slimes.GREEN:
        colour = 'rgba(100,193,100,1)';
        break;
      case Slimes.BLUE:
        colour = 'rgba(173, 216, 230,1)';
        break;
      case Slimes.GOLD:
        colour = 'rgb(255,231,0)';
        break;
    }

    return {
      margin: 2,
      width: Dimensions.get('screen').width / 7 - 13,
      height: Dimensions.get('screen').width / 7 - 13,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colour,
      borderWidth: 1,
      borderColor: 'rgb(78,5,90)',
    };
  }

  return (
    <View style={styles.pyramid}>
      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 7 - 21,
            Values.PYRAMID_GRID_BASE_SIZE * 8 - 28,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 7 - 21)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 7 - 21,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 7 - 21),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 7 - 21]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 6 - 15,
            Values.PYRAMID_GRID_BASE_SIZE * 7 - 21,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 6 - 15)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 6 - 15,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 6 - 15),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 6 - 15]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 5 - 10,
            Values.PYRAMID_GRID_BASE_SIZE * 6 - 15,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 5 - 10)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 5 - 10,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 5 - 10),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 5 - 10]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 4 - 6,
            Values.PYRAMID_GRID_BASE_SIZE * 5 - 10,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 4 - 6)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 4 - 6,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 4 - 6),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 4 - 6]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 3 - 3,
            Values.PYRAMID_GRID_BASE_SIZE * 4 - 6,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 3 - 3)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 3 - 3,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 3 - 3),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 3 - 3]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE * 2 - 1,
            Values.PYRAMID_GRID_BASE_SIZE * 3 - 3,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE * 2 - 1)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE * 2 - 1,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE * 2 - 1),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE * 2 - 1]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(
            Values.PYRAMID_GRID_BASE_SIZE,
            Values.PYRAMID_GRID_BASE_SIZE * 2 - 1,
          )
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + (id + Values.PYRAMID_GRID_BASE_SIZE)}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(
                    id + Values.PYRAMID_GRID_BASE_SIZE,
                    props.playerHand[props.selectedSlime],
                  )
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        (id + Values.PYRAMID_GRID_BASE_SIZE),
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id + Values.PYRAMID_GRID_BASE_SIZE]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.pyramidRow}>
        {props.pyramidGrid
          .slice(0, Values.PYRAMID_GRID_BASE_SIZE)
          .map((cell, id) => (
            <TouchableOpacity
              key={'cell-' + id}
              style={pyramidCellStyle(cell)}
              onPress={() => {
                props
                  .placeOnGrid(id, props.playerHand[props.selectedSlime])
                  .then(() =>
                    console.log(
                      'Player placed: ' +
                        props.playerHand[props.selectedSlime] +
                        ' at cell ' +
                        id,
                    ),
                  );
              }}>
              <Text style={styles.pyramidCellText}>
                {props.pyramidGrid[id]}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pyramid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pyramidRow: {
    flexDirection: 'row',
    padding: 2,
  },
  pyramidCell: {
    margin: 2,
    width: Dimensions.get('screen').width / 7 - 16,
    height: Dimensions.get('screen').width / 7 - 16,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pyramidCellText: {
    overflow: 'visible',
    fontSize: Dimensions.get('screen').height / 67,
  },
});
