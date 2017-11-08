/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  
} from 'react-native';
import {GLOBALVARIABLE} from '../common/globalVariable';
import TieziItem from './tiezi_item';

const {height, width} = Dimensions.get('window');
var navigation;
export default class TieziMain extends Component {
    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            
        }
    }

  init(){
    let _this=this;
      var data= fetch(GLOBALVARIABLE.HTTPurl+'/getTiezi')
      .then((response) => response.json()).then(function (responseJson){
            let res=responseJson
            //console.log(responseJson);
            _this.setState({
                //复制数据源
                dataArray: res,
                isLoading: false,
            });
          })
      .catch((error) => {
        console.error(error);
      });
    
  }
  
  _onPress = (id) => {
      alert(id+"");
    navigate("tiezi_context");
  }
  _listItem= function(item) {
    
    return <TouchableOpacity style={{borderBottomColor:"#ececec",borderBottomWidth:1}} onPress={()=>{navigation.navigate("tiezi_context",{dataList:item});}}><TieziItem key={"TieziItem"+item.index} id={item.tiezi_contextId} dataList={item}></TieziItem></TouchableOpacity>
  }
  render() {
    
      if(this.state.isLoading){
        this.init();
      }
    return (
      <View style={styles.container} >
        <View ref="tieziMainHead" style={[styles.head,{height:width*0.4,width:width}]}>
            <Image onPress={()=>alert("www")} source={{uri:"content://media/external/images/media/100489"}} style={[styles.head_image,{height:width*0.4,width:width}]} >
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems: 'flex-start'}}>
                    <Text style={{backgroundColor:'#ffffff'}} onPress={()=>alert("www")}>aaaa</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems: 'flex-start'}}>
                    <Text style={{backgroundColor:'#ffffff'}} >bbb</Text>
                    <Text style={{backgroundColor:'#ffffff'}}>ccc</Text>
                </View>
            </Image>
        </View>
        <View style={{height:(height-(width*0.4))}}>
            <ScrollableTabView style={{height:(height-(width*0.4))}} tabBarPosition='top' tabBarUnderlineStyle ={{backgroundColor:"#ffe846"}} tabBarActiveTextColor="#ffe846" renderTabBar={() => <DefaultTabBar/>}>
                {this.state.isLoading==true?(<View tabLabel="主题帖" style={{backgroundColor:'#000000',height:(height-width*0.4),width:width}}></View>):(
                    <FlatList  style={{height:(height-(width*0.4)-60),borderBottomColor:"#ececec",borderBottomWidth:1}} tabLabel="主题帖" data={this.state.dataArray} renderItem={this._listItem} />
                )}
                <Text tabLabel="交易帖">交易贴12</Text>
            </ScrollableTabView>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',//x轴
        //alignItems: 'center',//y轴
        //backgroundColor: '#ffffff',
      },
  head: {
    
    //backgroundColor: '#000000',
  },
  head_image:{
    flex:1,
    flexDirection:'row'
  },
  body:{
    flex:3,
    backgroundColor: '#FAFAFA',
  }
  
});

