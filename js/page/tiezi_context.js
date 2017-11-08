
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
  TouchableOpacity ,
  TextInput,
  Modal,
} from 'react-native';
import {GLOBALVARIABLE} from '../common/globalVariable';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageFullScreen from '../common/imageFullScreen';
import CustomImage from '../common/customImage';
var ImagePicker = require('react-native-image-picker');
var dataList;//楼主的帖子信息
var navigation;
const {height, width} = Dimensions.get('window');

export default class TieziContext extends Component {
    constructor(props) {
        super(props);
        dataList=this.props.navigation.state.params.dataList.item;
        dataList["isFirst"]=true;
        navigation=this.props.navigation;
        this.state = {
            isLoading: true,
            dataArray: [],//查询的数据数组
            refreshState: RefreshState.Idle,
            textInputOnFocus:false,
            textInputFlex:{flex:1},
            footerInputOpacity:{opacity:0.6},
            footerInputBackColor:{backgroundColor:"#cccccc"},
            avatarSource: [],
            isVisible:false,
            imageSrc:{},//回复的图片，点击事件用
            pickerPhotoViews:[],//选择的图片的视图
            pickervideoView:null,
            
        }
        this.currentPage=1;
        this.pickerViews=[];//选择的图片的视图
        this.pickerList=[];//选择的图片的列表
        
    }
    static navigationOptions = ({ navigation }) => ({  
        title:`${navigation.state.params.dataList.item.turtle.turtleName}`,
        //header:null,//设置不显示标题栏
    }); 
    _imageListClick(url){
        this.setState({
            isVisible:true,
            imageSrc:{uri:url},
        });
      
    }
    moduleClose=()=>{
        this.setState({
            isVisible:false,
        })
    }
  init(fun){
    let _this=this;
    fetch(GLOBALVARIABLE.HTTPurl+'/getReply?tieziId='+dataList.tiezi_contextId+'&currentPage='+this.currentPage)
      .then((response) => response.json()).then(function (responseJson){
            let res=responseJson;
            let array;
            if(_this.currentPage==1){
                res.splice(0,0,dataList);//将帖子的内容插入到第一列
                array=res;
            }else{
                let arr=_this.state.dataArray;
                for(let ii=0;ii<res.length;ii++){
                    arr.push(res[ii]);
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
  _onScroll=()=>{
    let flatlist=this.refs.RefreshListView._listRef;
    let scrollMetrics=flatlist._scrollMetrics;
    let contentLength=scrollMetrics.contentLength;//列表的总长度
    let offset=scrollMetrics.offset;//移出可见区域的长度（滑动的长度）
    let visibleLength=scrollMetrics.visibleLength;//可见的区域高度
    let currentLength=offset+visibleLength;//当前一共消耗的总长度
    if(currentLength==(contentLength-10)&&this.state.refreshState!=RefreshState.FooterRefreshing){//当消耗的总长度等于泪飙总长度（滑动到最后一个子项目）,并且处不于正在加载状态
        this.onFooterRefresh();//执行上拉加载更多
    }
    
  }
  onHeaderRefresh = () => {
    this.currentPage=1;
    this.setState({refreshState: RefreshState.HeaderRefreshing});
    this.init(function(res,_this){
        _this.setState({
            refreshState: RefreshState.Idle,
        })
    });

}
onFooterRefresh = () => {
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

_picInit(picList,iWidth){
    //let picListString=picList.replace(/\[|]/g,'');
    //let list=picListString.split(",");
    let picArray=[];
    if(picList.length>0){
        for (let i = 0; i < picList.length; i++) {
            picArray.push(
                
            <CustomImage resizeMode='contain' picUrl={{uri: picList[i].picUrl}} style={{width: iWidth, height:iWidth*4/3 ,marginBottom:4}} onPress={()=>this._imageListClick(picList[i].picUrl)}/>
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
    let user=item.user;
    if(typeof(item.isFirst)!="undefined"){
        let userInfo=item.userInfo;
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
                <View ref="item_body" style={{marginTop:10,marginBottom:10}}>
                    <Text style={{fontSize:15,fontWeight:'bold',color:'#000000',marginBottom:10}}>{item.title}</Text>
                    <Text style={{fontSize:14,color:'#000000'}}>{item.context}</Text>
                </View>
                <View ref="item_resoure">{this._picInit(item.picList,width-30)}</View>
            </View>
        );
    }else{
        let userInfo=user.userInfo;
        let replyList=item.replyList;
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
                <View>{this._reply(replyList,item)}</View>
            </View>
        );
    }
}
_replyFor(array,childenList,parent,tag){//tag:是否为最顶层的标识
    if(childenList!=null){
        let userParent=parent.user;
        for(let i=0;i<childenList.length;i++){
            let user=childenList[i].user;
            if(childenList[i].reply_id==parent.replyId&&tag){
                array.push(
                    <View >
                        <Text numberOfLines={3} style={{flexDirection:"row",marginBottom:5}} onPress={()=>alert(childenList[i].replyId)}>
                            <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{user.userName} : </Text>
                            <Text style={{justifyContent:"flex-start"}} onPress={()=>alert(childenList[i].context)}>{childenList[i].context}</Text>
                        </Text>
                    </View>);
            }else if(childenList[i].reply_id==parent.replyId&&tag==false){
                array.push(
                    <View >
                        <Text numberOfLines={3} style={{flexDirection:"row",marginBottom:5}} onPress={()=>alert(childenList[i].replyId)}>
                            <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{user.userName}</Text>
                            <Text style={{justifyContent:"flex-start",}}> 回复 </Text>
                            <Text style={{justifyContent:"flex-start",color:"#3487ce"}}>{userParent.userName} : </Text>
                            <Text style={{justifyContent:"flex-start"}} onPress={()=>alert(childenList[i].context)}>{childenList[i].context}</Text>
                        </Text>
                    </View>);
            }
            array=this._replyFor(array,childenList[i].replyList,childenList[i],false);
        }
        
    }
        return array;
    
}
_reply(replyList,item){//回复列表视图
    let array=[];
    array=this._replyFor(array,replyList,item,true);
    let array2=[];
    if(typeof(array)!="undefined"){
        if(array.length<=5){
            return (
                <View style={styles.reply}>
                    { array.map((elem, index) => {
                        return elem;
                    })}
                </View>
            );
        }else{//回复超过5条
            for(let i=0;i<5;i++){
                array2.push(array[i]);
            }
            array2.push(<View ><Text numberOfLines={1} style={{marginBottom:7,color:"#3487ce"}} onPress={()=>{navigation.navigate("tiezi_reply",{dataList:item});}}>更多{array.length-5}条回复</Text></View>);
            return (
                <View style={styles.reply}>
                    { array2.map((elem, index) => {
                        return elem;
                    })}
                </View>
            );
        }
    }else{
        return null;
    }
}
_renderItem=({item})=>{
    return (
    <View key={"tieziContextlist"+item.tiezi_contextId}>
        {this._listItem(item)}
    </View>
    );
}

textInputonBlur=()=>{//输入框失去焦点
    if(this.state.textInputOnFocus){
        this.setState({
            textInputOnFocus:false,
            textInputFlex:{flex:1},
            footerInputOpacity:{opacity:0.6},
            footerInputBackColor:{backgroundColor:"#cccccc"},
        });
    }
    
}
textInputonFocus =()=>{//输入框获取焦点
    this.setState({
        textInputOnFocus:true,
        textInputFlex:{flex:3},
        footerInputOpacity:{opacity:1},
        footerInputBackColor:{backgroundColor:"#ffffff"},
    });
}
sendReply=()=>{//发送消息
    let imgAry=this.pickerList;//待发送的图片的列表
    if(imgAry.length>0){
        this.uploadImage(imgAry);
    }else{
        fetch(GLOBALVARIABLE.HTTPurl+'/addReply',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(tubState),
        }).then((response) => response.text() )
            .then((responseData)=>{
                let responD=responseData;
                console.log('responseData',responD);
                
                
            }).catch((error)=>{console.error('error',error)});
    }

}
/**
 * 上传图片
 * @param {*} imgAry //图片地址数组
 * @param {*} fun //回调函数
 */
uploadImage(imgAry) {
    let formData = new FormData();       //因为需要上传多张图片,所以需要遍历数组,把图片的路径数组放入formData中
    for(var i = 0;i<imgAry.length;i++){
        let file = {uri: imgAry[i], type: 'application/octet-stream', name: 'image'+i+'.png'};   //这里的key(uri和type和name)不能改变,
        formData.append("file",file);   //这里的file就是后台需要的key
    }
    fetch(GLOBALVARIABLE.HTTPurl+'/upload',{
        method:'POST',
        headers:{
            'Content-Type':'multipart/form-data;charset=utf-8',
            "x-access-token": token,
        },
        body:formData,
    }).then((response) => response.text() )
        .then((responseData)=>{
            let responD=responseData;
            console.log('responseData',responD);
            this.pickerList=[];//清除发送图片的列表
            this.pickerViews=[];//清除发送图片的视图
            this.setState({pickerPhotoViews:[]});//更新清除后的状态
            // if(typeof(fun)!=undefined){
            //     fun(responD);//先发送图片，完成后再执行下一步操作
            // }else{

            // }
            
        }).catch((error)=>{console.error('error',error)});
}
photoButton=()=>{
    let options = {
        title: '请选择图片来源',
        cancelButtonTitle:'取消',
        takePhotoButtonTitle:'拍照',
        chooseFromLibraryButtonTitle:'相册图片',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        },
        mediaType:'photo',
      };
      let _this=this;
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source = {uri:response.uri};
          let index=this.pickerViews.length;
          this.pickerList.push(source.uri);//将已选择的图片链接放进列表
            this.pickerViews.push(<CustomImage key={"CustomImage"+index} hasClose={true} style={{width:((4/3)*80),height:80}} picUrl={source} delpickerImage={(e)=>this.delpickerImage(e,index)}/>);
            _this.setState({
                pickerPhotoViews:this.pickerViews,
            });
            // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        }
      });
}
  render() {
    if(this.state.isLoading){
        
        this.init();
      }
    return (
      <View style={styles.container}>
            <TouchableOpacity onPressIn={this.textInputonBlur}>
                <RefreshListView 
                    ref="RefreshListView"
                    data={this.state.dataArray} 
                    renderItem={this._renderItem} 
                    onEndReachedThreshold={0.01}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
            </TouchableOpacity>
        <View style={[styles.footerInput,this.state.footerInputOpacity,this.state.footerInputBackColor]}>
            <View style={{flexDirection:"row"}}>
                {this.state.textInputOnFocus==true?(
                    <View style={styles.replyLeftIcon}>
                    <FontAwesome name="photo" size={25} color="#dddddd" style={{justifyContent:"flex-start",marginTop:3,marginRight:5,}} onPress={this.photoButton}/>
                    <FontAwesome name="smile-o" size={30} color="#dddddd" style={{justifyContent:"flex-start"}}/>
                </View>
                ):null}
                <TextInput ref="TextInput" multiline={true} underlineColorAndroid="transparent" placeholder="谈谈你的看法..." style={[styles.TextInput,this.state.textInputFlex]} onFocus={this.textInputonFocus} />
                {this.state.textInputOnFocus==true?(
                    <Text style={styles.send} onPress={this.sendReply}>发送</Text>
                ):null}
                
            </View>
            {(this.state.textInputOnFocus==true&&this.state.pickerPhotoViews.length)>0?(
                <ScrollView horizontal={true} style={{height:100,width:width,paddingTop:10,flexDirection:"row"}}>
                    { this.state.pickerPhotoViews.map((elem, index) => {
                        return elem;
                    })}
                </ScrollView>
            ):null}
            
        </View>
        
      </View>
    );
  }
  delpickerImage(e,index){
    this.pickerViews.splice(index,1);
    this.pickerList.splice(index,1);
    this.setState({
        pickerPhotoViews:this.pickerViews,
    });
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
        paddingLeft:15,paddingTop:10,paddingRight:15,paddingBottom:20,borderBottomColor:"#ececec",borderBottomWidth:1
      },
      reply:{
        backgroundColor:"#eeeeee",width:width-70,marginLeft:40,marginTop:10,padding:10,
      },
      footerInput:{
        width:width,position:"absolute",bottom:0,left:0,padding:10,borderTopWidth:1,borderTopColor:"#eeeeee"
      },
      TextInput:{
        padding: 5,
        backgroundColor:"#ffffff",
        // flex:4,
        height:30,
        justifyContent:"flex-start",
        borderWidth:1,
        borderColor:"#ececec"
      },
      replyLeftIcon:{
        flexDirection:"row",flex:1,marginRight:0,
      },
      send:{
          width:35,height:30,borderRadius:2,backgroundColor:"#ffffff",flex:1,marginLeft:5,
          textAlign:"center",lineHeight:25,color:"#cccccc",borderWidth:1,borderColor:"#ececec"
      },

  
});

