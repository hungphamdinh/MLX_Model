import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import DocumentCustom from './DocumentCustom';

export default class DocumentInWraper extends PureComponent {
  static propTypes = {
    open: PropTypes.func,
    getOpacity: PropTypes.func,
    index: PropTypes.number,
    captureCarouselItem: PropTypes.func,
    indexState: PropTypes.number,
    style: PropTypes.object,
    isDelete: PropTypes.bool,
    deleteDocument: PropTypes.func,
  };

  render() {
    const {
      open,
      getOpacity,
      index,
      document,
      captureCarouselItem,
      indexState,
      style,
      deleteDocument,
      isDelete,
    } = this.props;
    return (
      <TouchableWithoutFeedback onPress={open(index)}>
        <View style={indexState === index ? getOpacity() : null}>
          <DocumentCustom
            isDelete={isDelete}
            document={document}
            deleteDocument={deleteDocument}
            style={[{ resizeMode: 'cover', height: 200, width: 200, borderRadius: 8 }, style]}
            ref={(ref) => captureCarouselItem(ref, index)}
            index={index}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
