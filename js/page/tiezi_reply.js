
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import {GLOBALVARIABLE} from '../common/globalVariable';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'

var dataList;//层主的帖子信息
const {height, width} = Dimensions.get('window');
export default class TieziReply extends Component {
    constructor(props) {
        super(props);
        dataList=this.props.navigation.state.params.dataList;
        dataList["isFirst"]=true;
        this.state = {
            isLoading: true,
            dataArray: [],
            refreshState: RefreshState.Idle,
        }
        this.currentPage=1;
    }
    static navigationOptions = ({ navigation }) => ({  
        title:"回复",
        //header:null,//设置不显示标题栏
    }); 
      onHeaderRefresh = () => {//下拉刷新
        this.currentPage=1;
        this.setState({refreshState: RefreshState.HeaderRefreshing});
        this.init(function(res,_this){
            _this.setState({
                refreshState: RefreshState.Idle,
            })
        });
    
    }
    onFooterRefresh = () => {//上拉加载
        this.setState({refreshState: RefreshState.FooterRefreshing});
        this.currentPage++;
        this.init(function(length,_this){
            if(length>0){
                _this.setState({
                    refreshState: RefreshState.Idle,
                })
            }else{
                _this.setState({
                    refreshState: RefreshState.NoMoreData,
                })
            }
            
        });
        
    }
  init(fun){//回复内容请求
    let _this=this;
    fetch(GLOBALVARIABLE.HTTPurl+'/getReply?tieziId='+dataList.tieziId+'&replyId='+dataList.replyId+'&currentPage='+this.currentPage)
      .then((response) => response.json()).then(function (responseJson){
            let res=responseJson;
            let array;
            let replyArray=[];
            replyArray=_this._replyArray(replyArray,res,dataList,true);
            if(_this.currentPage==1){
                replyArray.splice(0,0,dataList);//将帖子的内容插入到第一列
                array=replyArray;
            }else{
                let arr=_this.state.dataArray;
                for(let ii=0;ii<replyArray.length;ii++){
                    arr.push(replyArray[ii]);
                }
                array=arr;
            }
            _this.setState({
                //复制数据源
                dataArray: array,
                isLoading: false,
            });
            if(typeof(fun)!="undefined"){
                fun(res.length,_this);
            }
            
          })
      .catch((error) => {
        console.error(error);
      });
    
  }
  

_picInit(picList,iWidth){//动态加载图片组件
    let picListString=picList.replace(/\[|]/g,'');
    let list=picListString.split(",");
    let picArray=[];
    if(list.length>0){
        for (let i = 0; i < list.length; i++) {
            picArray.push(
              <Image key={"Image"+i} style={{flex:1,width: iWidth, height:400 ,marginBottom:4}} source={{uri: list[i]}} />
            );
        }
        return (
        <View>
            { picArray.map((elem, index) => {
                return elem;
            })}
        </View>);
    }else{
        return null;
    }
    

}
_listItem(item){
    if(typeof(item.isFirst)!="undefined"){
        let user=item.user;
        let userInfo=user.userInfo;
        return (
            <View style={styles.listItem}>
                <View ref="item_head" style={{height:30,flexDirection:'row'}}>
                    <Image onPress={this._onPress} source={{uri:userInfo.userPicture}} style={{height:30,width:30,borderRadius:15}} />
                    <View style={{height:30,marginLeft:10}}>
                        <Text style={{fontSize:12}}>{user.userName}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{alignItems:'flex-start',fontSize:12}}>{item.time}</Text>
                            <Text style={{alignItems:'flex-start',marginLeft:10,fontSize:12}}>{item.location}</Text>
                        </View>
                    </View>
                </View>
                <View ref="item_body" style={{marginTop:10,marginBottom:10,marginLeft:40}}>
                
                    <Text style={{fontSize:14,color:'#000000'}}>{item.context}</Text>
                </View>
                <View ref="item_resoure"  style={{marginLeft:40}}>{this._picInit(item.picList,width-70)}</View>
                
            </View>
        );
    }else{
        return (
            <View style={styles.replylistItem}>
                <View>{this._reply(item)}</View>
            </View>
        );
    }
}
_replyArray(array,childenList,parent,tag){//回复的列表
    if(childenList!=null){
        for(let i=0;i<childenList.length;i++){
            if(childenList[i].reply_id==parent.replyId&&tag){
                array.push(childenList[i]);
            }else if(childenList[i].reply_id==parent.replyId&&tag==false){
                childenList[i]["parentReply"]=parent.user;
                array.push(childenList[i]);
            }
            array=this._replyArray(array,childenList[i].replyList,childenList[i],false);
        }
        
    }
    return array;
}
_reply(item){//回复列表视图
    if(typeof(item.parentReply)=="undefined"||item.parentReply==null){
        return (
            <View >
                <Text numberOfLines={3} style={{flexDirection:"row",marginBottom:5,lineHeight:25}} onPress={()=>alert(item.replyId)}>
                    <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{item.user.userName} : </Text>
                    <Text style={{justifyContent:"flex-start"}} onPress={()=>alert(item.context)}>{item.context}</Text>
                </Text>
            </View>
        );
    }else{
        return (
            <View >
                <Text numberOfLines={3} style={{flexDirection:"row",marginBottom:5,lineHeight:25}} onPress={()=>alert(item.replyId)}>
                    <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{item.user.userName}</Text>
                    <Text style={{justifyContent:"flex-start"}}> 回复 </Text>
                    <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{item.parentReply.userName} : </Text>
                    <Text style={{justifyContent:"flex-start"}} onPress={()=>alert(item.context)}>{item.context}</Text>
                </Text>
            </View>
        );
    }
}
_renderItem=({item})=>{
    return (
    <View key={"tieziReplylist"+item.tiezi_contextId}>
        {this._listItem(item)}
    </View>
    );
}

  render() {
    if(this.state.isLoading){
        
        this.init();
      }
    return (
      <View style={styles.container}>
        <RefreshListView 
            data={this.state.dataArray} 
            renderItem={this._renderItem} 
            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
            />
        
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'flex-start',//x轴
        //alignItems: 'center',//y轴
        backgroundColor: '#ffffff',
      },
      listItem:{
        paddingLeft:15,paddingTop:10,paddingRight:15,paddingBottom:20,borderBottomColor:"#ececec",borderBottomWidth:1,marginBottom:10
      },
      reply:{
        backgroundColor:"#eeeeee",width:width-70,marginLeft:40,marginTop:10,padding:10,
      },
      replylistItem:{
        paddingLeft:15,paddingTop:5,paddingRight:15,marginBottom:5
      },
  
});

