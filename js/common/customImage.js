/**
 * 自定义右上角带红色关闭按钮的图片组件
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity ,
  CameraRoll 
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageFullScreen from './imageFullScreen';
export default class CustomImage extends Component{
    state={
        isVisible:false,
        
    }
    constructor(props){
        super(props);
        this.state={
            isVisible:false,
        };
    }
    render(){
        
        let minsize;
        minsize=this.props.style.width<this.props.style.height?this.props.style.width:this.props.style.height;
        if(true){
            return(
                <View style={[styles.image,this.props.style]}>
                    <TouchableOpacity onPress={()=>{this.setState({isVisible:true,});this.props.onPress()}}>
                        <Image resizeMode={this.props.resizeMode} source={this.props.picUrl} style={this.props.style}>
                            {this.props.hasClose==true?(
                                <TouchableOpacity style={[styles.TouchableOpacity,{width:minsize*0.25,height:minsize*0.25}]} onPress={this.props.delpickerImage}>
                                    <FontAwesome size={minsize*0.25} name="close" color="white" style={styles.FontAwesome} />
                                </TouchableOpacity>
                            ):null}
                            
                        </Image>
                    </TouchableOpacity>
                    <ImageFullScreen isVisible={this.state.isVisible} imageSrc={this.props.picUrl}/>
                </View>
            );
        }else{
            return null;
        }
        
    }
}

const styles = StyleSheet.create({
    image:{
        marginRight:10,
    },
    TouchableOpacity:{
        position:'absolute',right:0,top:0,backgroundColor:"red",
    },
    FontAwesome:{
        position:'absolute',right:2.5,top:-1
    },
});