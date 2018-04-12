import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      coordinate: new AnimatedRegion({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
      latitude: 37.78825,
      longitude: -122.4324,
    };
  }

  componentDidMount() {
    const duration = 500;
    navigator.geolocation.watchPosition(position => {
      const { longitude, latitude } = position.coords;
      this.setState({
        longitude,
        latitude,
      })
      this.state.coordinate.timing({
        longitude,
        latitude,
        duration
      }).start();
    });
  }

  render() {
    const { longitude, latitude } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {JSON.stringify(this.state.position)}
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <MapView 
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <MapView.Marker.Animated
            ref={marker => { this.marker = marker }}
            coordinate={this.state.coordinate}
          />
        </MapView>
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
