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
      coordinate: null,
      region: null,
      distance: 0,
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

      this.setState({
        coordinate: new AnimatedRegion({
          longitude,
          latitude,
        }),
        region: new AnimatedRegion({
          longitude,
          latitude,
          longitudeDelta: 0.000421,
          latitudeDelta: 0.000922,
        }),
      })
    });
    navigator.geolocation.watchPosition(position => {
      const { longitude, latitude } = position.coords;
      if (!this.state.coordinate) return;

      this.setState({
        distance: this.state.distance + this.getDistanceFromLatLonInKm(this.latitude, this.longitude, latitude, longitude),
      });

      this.state.coordinate.timing({
        longitude,
        latitude,
      }).start();

      this.state.region.timing({
        longitude,
        latitude,
      }).start();
    }, error => {
      console.log(error);
    }, { distanceFilter: 0.01 });
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated
          style={styles.map}
          region={this.state.region}>
          <Marker.Animated
            ref={marker => { this.marker = marker }}
            coordinate={this.state.coordinate}
          />
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
