import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import SwipeableViews from 'react-swipeable-views-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { getDocumentType } from '../../Utils/file';
import { fileTypes } from '../../Config/Constants';
import i18n from '@I18n';
import { getBearerToken } from '../../Services/FileService';

const ANIM_CONFIG = { duration: 200 };
const { width, height } = Dimensions.get('window');

export default function (WrappedComponent) {
  return class extends Component {
    static propTypes = {
      uri: PropTypes.string,
    };
    static defaultProps = {
      uri: 'https://avatars0.githubusercontent.com/u/31804215?s=40&u=e062af680bf255b696606270b8cbd23465dac616&v=4',
    };

    constructor(props) {
      super(props);
      this.myWrapper = React.createRef();
      this.state = {
        index: 0,
        origin: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        target: {
          x: 0,
          y: 0,
          opacity: 1,
        },
        fullscreen: false,
        animating: false,
        panning: false,
        selectedImageHidden: false,
        slidesDown: false,
      };
      this.openAnim = new Animated.Value(0);
      this.pan = new Animated.Value(0);

      this.carouselItems = {};

      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !this.state.animating,
        onStartShouldSetPanResponderCapture: () => !this.state.animating,
        onMoveShouldSetPanResponder: () => !this.state.animating,
        onMoveShouldSetPanResponderCapture: () => !this.state.animating,
        onPanResponderTerminationRequest: () => true,
        onPanResponderMove: (evt, gestureState) => {
          this.pan.setValue(gestureState.dy);

          if (Math.abs(gestureState.dy) > 15 && !this.state.panning) {
            this.pan.setValue(0);
            this.setState({ panning: true });
          }
        },
        onPanResponderRelease: this.handlePanEnd,
        onPanResponderTerminate: this.handlePanEnd,
      });
    }

    animateOpenAnimToValue = (toValue, onComplete) =>
      Animated.timing(this.openAnim, {
        ...ANIM_CONFIG,
        toValue,
      }).start(() => {
        this.setState({ animating: false });
        if (onComplete) {
          onComplete();
        }
      });
    open = (index) => () => {
      const activeComponent = this.carouselItems[index].carouselItems[index];
      activeComponent.measure((rx, ry, width, height, x, y) => {
        this.setState(
          {
            fullscreen: true,
            animating: true,
            origin: {
              x,
              y,
              width,
              height,
            },
            target: { x: 0, y: 0, opacity: 1 },
            index,
          },
          () => {
            this.animateOpenAnimToValue(1);
          }
        );
      });
    };

    close = () => {
      this.setState({ animating: true });
      this.carouselItems[this.state.index].carouselItems[this.state.index].measure((rx, ry, width, height, x, y) => {
        this.setState({
          origin: {
            x,
            y,
            width,
            height,
          },
          slidesDown: x + width < 0 || x > width,
        });

        this.animateOpenAnimToValue(0, () => {
          this.setState({
            fullscreen: false,
            selectedImageHidden: false,
            slidesDown: false,
          });
        });
      });
    };

    handlePanEnd = (evt, gestureState) => {
      if (Math.abs(gestureState.dy) > 50) {
        this.setState({
          panning: false,
          target: {
            x: gestureState.dx,
            y: gestureState.dy,
            opacity: 1 - Math.abs(gestureState.dy / height),
          },
        });
        this.close();
      } else {
        Animated.timing(this.pan, {
          toValue: 0,
          ...ANIM_CONFIG,
        }).start(() => this.setState({ panning: false }));
      }
    };

    getFullscreenOpacity = () => {
      const { panning, target } = this.state;

      return {
        opacity: panning
          ? this.pan.interpolate({
              inputRange: [-height, 0, height],
              outputRange: [0, 1, 0],
            })
          : this.openAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, target.opacity],
            }),
      };
    };

    captureCarouselItem = (ref, idx) => {
      this.carouselItems[idx] = ref;
    };

    handleModalShow = () => {
      const { animating, selectedImageHidden } = this.state;

      if (!selectedImageHidden && animating) {
        this.setState({ selectedImageHidden: true });
      }
    };

    getSwipeableStyle = () => {
      const { fullscreen, origin, slidesDown, target } = this.state;

      if (!fullscreen) {
        return { flex: 1 };
      }

      const inputRange = [0, 1];

      return !slidesDown
        ? {
            left: this.openAnim.interpolate({
              inputRange,
              outputRange: [origin.x, target.x],
            }),
            top: this.openAnim.interpolate({
              inputRange,
              outputRange: [origin.y, target.y],
            }),
            width: this.openAnim.interpolate({
              inputRange,
              outputRange: [origin.width, width],
            }),
            height: this.openAnim.interpolate({
              inputRange,
              outputRange: [origin.height, height],
            }),
          }
        : {
            left: 0,
            right: 0,
            height,
            top: this.openAnim.interpolate({
              inputRange,
              outputRange: [height, target.y],
            }),
          };
    };

    renderDefaultHeader = () => (
      <TouchableWithoutFeedback onPress={this.close}>
        <View style={{ borderRadius: 5, backgroundColor: '#000' }}>
          <Text
            style={{
              color: 'white',
              padding: 15,
              fontWeight: 'bold',
              fontSize: 23,
            }}
          >
            X
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );

    renderDocument = (document) => {
      let source = document.uri;
      const documentType = getDocumentType(document);

      if (document.fileUrl) {
        source = {
          uri: document.fileUrl,
          headers: getBearerToken(),
        };
      }

      switch (documentType) {
        case fileTypes.image: {
          return (
            <FastImage
              source={source}
              resizeMode={FastImage.resizeMode.contain}
              style={{ width, height, alignSelf: 'center' }}
              {...this.panResponder.panHandlers}
            />
          );
        }
        // case fileTypes.video: {
        //   return  <View style={{ flex: 1 }}><Video
        //     uri={ document.uri || `${document.fileUrl}${token}` }
        //     repeat
        //     resizeMode={'stretch'}
        //     posterResizeMod={'contain'}
        //     style={{ flex: 1 }}
        //   /></View>
        // }
        // case fileTypes.pdf: {
        //   return  <Text>'pdf'</Text>
        // }
        default: {
          return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>{i18n.t('DOCUMENT_PREVIEW_NOT_SUPPORT')}</Text>
            </View>
          );
        }
      }
    };

    renderFullscreenContent = (document, index) => () => {
      const { panning } = this.state;
      const containerStyle = [this.getSwipeableStyle(), panning && { top: this.pan }];

      return (
        <Animated.View style={containerStyle} key={index}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            ref={(ref) => {
              if (ref) {
                ref.scrollResponderHandleStartShouldSetResponder = () => true;
              }
            }}
            contentContainerStyle={{ flex: 1 }}
            maximumZoomScale={2}
            alwaysBounceVertical={false}
          >
            {this.renderDocument(document)}
          </ScrollView>
        </Animated.View>
      );
    };

    renderFullscreen = () => {
      const { animating, panning, fullscreen } = this.state;
      const opacity = this.getFullscreenOpacity();
      const documents = this.myWrapper.current.props.arrayDocuments;
      return (
        <Modal transparent visible={fullscreen} onShow={this.handleModalShow} onRequestClose={this.close}>
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'black',
              },
              opacity,
            ]}
          />
          <SwipeableViews
            disabled={animating || panning}
            index={this.state.index}
            onChangeIndex={(index) => {
              this.setState({
                index,
              });
            }}
          >
            {documents.map((item, index) => this.renderFullscreenContent(item, index)())}
          </SwipeableViews>
          <Animated.View
            style={[
              opacity,
              {
                position: 'absolute',
                top: 40,
                left: 20,
              },
            ]}
          >
            {this.renderDefaultHeader()}
          </Animated.View>
        </Modal>
      );
    };

    render() {
      const { fullscreen, selectedImageHidden, index } = this.state;
      const getOpacity = () => ({
        opacity: selectedImageHidden ? 1 : 1,
      });
      return (
        <View>
          <WrappedComponent
            ref={this.myWrapper}
            {...this.props}
            open={this.open}
            indexState={index}
            getOpacity={getOpacity}
            captureCarouselItem={this.captureCarouselItem}
          />
          {fullscreen && this.renderFullscreen()}
        </View>
      );
    }
  };
}
