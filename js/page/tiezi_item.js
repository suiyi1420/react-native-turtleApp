import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import ImageFullScreen from '../common/imageFullScreen';
const {height, width} = Dimensions.get('window');

export default class TieziItem extends Component {
    constructor(props){
        super(props);
        this.state={
            isVisible:false,
            imageSrc:{},
        };
    }

    picInit(picList,contextId){
        //let picListString=picList.replace(/\[|]/g,'');
        //let list=picListString.split(",");
        let list=picList;
        let sourceList=[];
        let _this=this;
        let iHeight;
        if(list.length==1){
            iHeight=(width-30)*0.6;
            sourceList.push({url: list[0].picUrl});
            return(
                <View ref="item_resource" style={{height:(width-30)*0.6}}>
                    <TouchableOpacity key={"image"+0} style={{flex:1,width: (width-30), height: iHeight}} onPress={()=>this._imageListClick(list[0].picUrl)}>
                        <Image ref={"imageList"+contextId+0} style={{flex:1,width: undefined, height: undefined}} source={{uri: list[0].picUrl}} />
                    </TouchableOpacity>
                </View>
            ); 
        }else if(list.length>1){
            var pages1 = [],pages2=[],pages=[];
            var page1,page2;
            let iwidth=(width-30)/3;
            for(let i=0;i<list.length;i++){
                sourceList.push({url: list[i].picUrl});
            }
            if(list.length<=3&&list.length>1){
                iHeight=(width-30)*0.3;
                if(list.length==2){
                    iwidth=(width-30)/2;
                }
                for (let i = 0; i < list.length; i++) {
                    pages1.push(
                        <TouchableOpacity key={"Image"+i} onPress={()=>{this._imageListClick(list[i].picUrl)}}>
                            <Image ref={"imageList"+contextId+i} style={{flex:1,marginRight:3,width: iwidth, height: iHeight}} source={{uri: list[i].picUrl}} />
                        </TouchableOpacity>
                    );
                  }
                page1=<View style={{flex:1,flexDirection:'row'}}>
                    { pages1.map((elem, index) => {
                        return elem;
                    })}
                </View>;
                pages.push(page1);
            }else{
                iHeight=(width-30)*0.6;
                for (let i = 0; i < 3; i++) {
                    pages1.push(
                        <TouchableOpacity  key={"Image"+i} onPress={()=>this._imageListClick(list[i].picUrl)}>
                            <Image ref={"imageList"+contextId+i} style={{flex:1,width: iwidth, height: iHeight/2,marginRight:3}} source={{uri: list[i].picUrl}} />
                        </TouchableOpacity>
                    );
                    
                }
                page1=<View key={0} style={{flex:1,flexDirection:'row'}}>{ pages1.map((elem, index) => {return elem;})}</View>;
                pages.push(page1);
                for (let i = 3; i < list.length; i++) {
                    pages2.push(
                        <TouchableOpacity  key={"Image2"+i} onPress={()=>this._imageListClick(list[i].picUrl)}>
                            <Image ref={"imageList"+contextId+i} style={{flex:1,width: iwidth, height: iHeight/2,marginRight:3}} source={{uri: list[i].picUrl}} />
                        </TouchableOpacity>
                    );
                    
                }
                if(list.length<6){
                    let num=6-list.length;
                    for(let i=0;i<num;i++){
                        pages2.push(
                            <Image key={"Image3"+i} style={{flex:1,width: iwidth, height: iHeight/2,marginRight:3}} source={{uri:'sss'}} />
                          );
                    }
                    
                    
                }
                page2=<View key={"Image"+1} style={{flex:1,flexDirection:'row'}}>
                    { pages2.map((elem, index) => {
                        return elem;
                    })}
                </View>;
                pages.push(page2);
            }
            
            return(
                <View ref="item_resource" style={{height:iHeight}}>
                    
                { pages.map((elem, index) => {
                    return elem;
                })}
                </View>
            ); 
        }
        
    }
    _imageListClick(url){
        this.setState({
            isVisible:true,
            imageSrc:{uri:url},
        });
      
    }
    // moduleClose=()=>{
    //     this.setState({
    //         modalshow:false,
    //     })
    // }
  render() {
      const{dataList}=this.props;
      const data=dataList.item;
      let turtleMap=data.turtle;
      let user=data.user;
      let userInfo=data.userInfo;
    return (
      <View style={styles.container} onStartShouldSetResponder={(evt) => true} onPress={()=>alert("aaas")}>
        <View ref="item_head" style={{height:35,flexDirection:'row'}}>
            <Image onPress={this._onPress} source={{uri:userInfo.userPicture}} style={{height:35,width:35,borderRadius:17}} />
            <View style={{height:35}}>
                <Text>{user.userName}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{alignItems:'flex-start'}}>{data.time}</Text>
                    <Text style={{alignItems:'flex-start',marginLeft:5}}>{data.location}</Text>
                </View>
                
            </View>
        </View>
        <View ref="item_body" style={{marginTop:5,marginBottom:5}}>
            <Text style={{fontSize:15,fontWeight:'bold',color:'#000000'}}>{data.title}</Text>
            <Text style={{fontSize:14,color:'#000000'}}>{data.context}</Text>
        </View>
        <View ref="item_resoure">{this.picInit(data.picList,data.tiezi_contextId)}</View>
        <View ref="item_foot" style={{flexDirection:'row',height:30,marginTop:5}}>
            <View style={{flex:1,alignItems:'flex-start'}}><Text>{turtleMap.turtleName}</Text></View>
            <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1,alignItems:'flex-end'}}><Text>aaa</Text></View>
                <View style={{flex:1,alignItems:'flex-end'}}><Text>bbb</Text></View>
            </View>
        </View>
        <ImageFullScreen isVisible={this.state.isVisible} imageSrc={this.state.imageSrc}/>
        {/* <Modal visible={this.state.modalshow} animationType={"none"} transparent={true} >
            <TouchableOpacity style={{backgroundColor:'rgba(0, 0, 0, 0.8)'}} onPress={this.moduleClose} >
                <Image resizeMode="contain" source={this.state.imageSrc} style={{width:width,height:height}}/>
            </TouchableOpacity>
            
        </Modal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        padding:15
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
