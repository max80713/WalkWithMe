import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView, { AnimatedRegion, Marker, Animated } from 'react-native-maps';

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
      distance: 0,
      markers: [],
    };
  }

  getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad = deg => {
    return deg * (Math.PI/180)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const { longitude, latitude } = position.coords;

      this.longitude = longitude;
      this.latitude = latitude;

      const centerMarker = {
        longitude,
        latitude,
      };

      const markers = [];

      const westMarker = Object.assign({}, centerMarker, {
        longitude: longitude - 0.001,
      });
      markers.push(westMarker);

      const eastMarker = Object.assign({}, centerMarker, {
        longitude: longitude + 0.001,
      });
      markers.push(eastMarker);

      this.setState({
        markers
      })
    });
    navigator.geolocation.watchPosition(position => {
      const { longitude, latitude } = position.coords;

      if (!this.longitude && !this.latitude) return;

      this.setState({
        distance: this.state.distance + this.getDistanceFromLatLonInKm(this.latitude, this.longitude, latitude, longitude),
      });
    }, error => {
      console.log(error);
    }, { distanceFilter: 0.01 });
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated
          style={styles.map}
          showsUserLocation
          followsUserLocation
        >
        {this.state.markers.map(marker => (
          <Marker
            key={marker.longitude}
            coordinate={marker}
          />
        ))}
        </Animated>
        <View style={styles.welcome}>
          <Text>
            {`distance: ${this.state.distance}`}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
