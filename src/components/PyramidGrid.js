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
};

export default function PyramidGrid(props) {
  const matchesRef = firebase.firestore().collection('match');

  async function placeSlime(cell, slime) {
    if (slime) {
      await matchesRef
        .doc(props.gameID)
        .get()
        .then(doc => {
          if (doc.data().currentPlayerTurn === props.userIndex) {
            // Register player's move on grid
            props.pyramidGrid.splice(cell, 1, slime);

            // Remove placed slime from hand
            const index = props.playerHand.indexOf(slime);
            props.playerHand.splice(index, 1);

            // Help update database
            const playerNumHand = 'player' + (props.userIndex + 1) + 'Hand';

            matchesRef
              .doc(props.gameID)
              .update({
                pyramidGrid: props.pyramidGrid,
                currentPlayerTurn: (doc.data().currentPlayerTurn + 1) % 3,
                [playerNumHand]: props.playerHand,
              })
              .catch(error => {
                alert(error);
              });
          } else {
            alert('Wait your turn! You are player ' + (props.userIndex + 1));
          }
        });
    }
  }

  function pyramidCellStyle(slime) {
    let colour = '#FFFFFF';
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
      width: Dimensions.get('screen').width / 7 - 16,
      height: Dimensions.get('screen').width / 7 - 16,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      backgroundColor: colour,
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 7 - 21,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 6 - 15,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 5 - 10,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 4 - 6,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 3 - 3,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE * 2 - 1,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(
                  id + Values.PYRAMID_GRID_BASE_SIZE,
                  props.playerHand[props.selectedSlime],
                ).then(() =>
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
                placeSlime(id, props.playerHand[props.selectedSlime]).then(() =>
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
    flex: 1,
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
    fontSize: Dimensions.get('screen').height / 60,
  },
});
