import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import TieziMain from './page/tiezi_main'
import TieziContext from './page/tiezi_context'
import TieziReply from './page/tiezi_reply'



class HomePage extends React.Component {
    static navigationOptions = {  
        header:null,//设置不显示标题栏
    }; 
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
          <TieziMain navigation={this.props.navigation}/>
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
    } 
});
const SimpleApp = StackNavigator({
    Home: { screen: HomePage },
    tiezi_context:{screen:TieziContext},
    tiezi_reply:{screen:TieziReply},
});
export default SimpleApp;
 