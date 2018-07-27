/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

ErrorUtils.setGlobalHandler(error => {
  Alert.alert(
    'Error',
    `${error.stack}`,
    [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  );
});


type Props = {};
export default class App extends Component<Props> {
  _failHere() {
    var fail = {};
    fail.invalidFunction();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={() => { var obj = {}; obj.invalidFunction(); }}>Welcome to React Native!</Text>
        <Text style={styles.instructions} onPress={() => {this._failHere()}}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
