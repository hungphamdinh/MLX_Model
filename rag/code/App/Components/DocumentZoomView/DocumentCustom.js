/* eslint-disable react/require-default-props */
import React, { PureComponent } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { mapDocumentItem } from '../../Utils/file';
import { ImageResource } from '../../Themes';
import { getBearerToken } from '../../Services/FileService';

export default class DocumentCustom extends PureComponent {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    index: PropTypes.number,
    document: PropTypes.object,
    isDelete: PropTypes.bool,
    deleteDocument: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.carouselItems = {};
  }

  captureCarouselItem = (ref, idx) => {
    this.carouselItems[idx] = ref;
  };

  render() {
    const { document, style, index, deleteDocument, isDelete } = this.props;
    const documentThumbnail = mapDocumentItem(document);
    let source = documentThumbnail;

    if (typeof documentThumbnail === 'string') {
      source = {
        uri: documentThumbnail,
        headers: getBearerToken(),
      };
    }

    return (
      <View>
        <Image ref={(ref) => this.captureCarouselItem(ref, index)} source={source} style={style} />
        {isDelete ? (
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
            onPress={() => deleteDocument()}
          >
            <Image style={{ width: 20, height: 20 }} source={ImageResource.IC_DeleteImage} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
