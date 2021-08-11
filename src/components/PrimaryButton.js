import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import globalStyles from '../styles';
import {Icon} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

PrimaryButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool, // By default it is not disabled
  color: PropTypes.string, // White by default
  hasOutline: PropTypes.bool, // No outline by default
  outlineColor: PropTypes.string, //White by default
  textColor: PropTypes.string, // White by default
  width: PropTypes.number, //85% by default
  height: PropTypes.number, //85% by default
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

export default function PrimaryButton(props) {
  let viewStyling = {};
  let textStyling = {};
  if (props.color) {
    viewStyling.backgroundColor = props.color;
  }
  if (props.textColor) {
    textStyling.color = props.textColor;
  }
  if (props.hasOutline) {
    viewStyling.borderWidth = 1;
    viewStyling.borderColor = '#ffffff';
  }
  if (props.borderColor) {
    viewStyling.borderColor = props.outlineColor;
  }
  if (props.width) {
    viewStyling.minWidth = props.width;
    viewStyling.maxWidth = props.width;
  }
  if (props.height) {
    viewStyling.minHeight = props.height;
    viewStyling.maxHeight = props.height;
  }

  const isDisabled = !(
    props.disabled === undefined || props.disabled === false
  );

  return (
    <TouchableOpacity
      style={[globalStyles.button, viewStyling, props.buttonStyle]}
      onPress={isDisabled ? () => {} : () => props.onPress()}>
      {props.text && (
        <Text style={[globalStyles.buttonText, textStyling, props.textStyle]}>
          {props.text}
        </Text>
      )}

      {props.icon && (
        <FontAwesome5 name={props.icon} style={globalStyles.icon} />
      )}
    </TouchableOpacity>
  );
}
