/**
 * 点击图片后全屏显示
 */
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
const {height, width} = Dimensions.get('window');

export default class ImageFullScreen extends Component {
    state = {
        isVisible: false,
        imageSrc:{},
      };
    componentWillReceiveProps(nextProps) {
        if (!this.state.isVisible && nextProps.isVisible) {
          this.setState({ isVisible: true });
        }else{
            this.setState({ isVisible: false });
        }
    }
    componentWillMount() {
        if (this.props.isVisible) {
          this.setState({ isVisible: true });
        }else{
            this.setState({ isVisible: false });
        }
      }
    
      componentDidMount() {
        // if (this.state.modalshow) {
        //   this._open();
        // }
    }
    constructor(props){
        super(props);
        this.state={
            isVisible:false,
        };
    }
    moduleClose=()=>{
        this.setState({
            isVisible: false,
            imageSrc:{},
        })
    }
    
    render(){
       if(true){
        return(
            <Modal visible={this.state.isVisible} animationType={"none"} transparent={true} >
                <TouchableOpacity style={{backgroundColor:'rgba(0, 0, 0, 0.8)'}} onPress={this.moduleClose} >
                    <Image resizeMode="contain" source={this.props.imageSrc} style={{width:width,height:height}}/>
                </TouchableOpacity>
            </Modal>
        );
       }else{
        return null;
       }
        
    }
}
const styles = StyleSheet.create({
  
  
});