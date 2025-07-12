/* @flow */

import React from 'react';
import I18n from '@I18n';

import { Modal, Image, StyleSheet, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Colors, Fonts, ImageResource, Metric } from '../../Themes';
import { Button, Icon, Text } from '../../Elements';
import AppContext from '../../Context/AppContext';
import {
  checkImageByMimeType,
  checkValidDocumentMimeType,
  convertHEICFile,
  getDimensionFile,
  resizeImage,
} from '../../Utils/file';
import { generateGUID } from '../../Utils/number';
import { openMultipleImagePicker } from '../../Elements/ImagePicker';
import { getPickerLanguageCode } from '../../Utils/language';

type State = {
  shown: boolean,
};
type Props = {
  onSelectedImage: Function,
  onCameraPress: Function,
  onLibraryPress: Function,
};

export default class SelectImageOptionsModal extends React.Component<Props, State> {
  static contextType = AppContext;
  state = {
    shown: false,
  };

  shown = (shown: boolean) => {
    this.setState({ shown });
  };

  resizedImages = async (images) =>
    Promise.all(
      images.map(async (image, index) =>
        checkImageByMimeType(image.type)
          ? resizeImage({
              ...image,
              uri: image.uri,
              index,
            })
          : image
      )
    );

  transformDocuments = async (documents) =>
    Promise.all(
      documents.map(async (item) => {
        if (checkImageByMimeType(item.type)) {
          const { width, height } = await getDimensionFile(item.uri);
          item.width = width;
          item.height = height;
        }
        return item;
      })
    );

  btDocumentPress = async () => {
    const { onSelectedImage } = this.props;
    const types = DocumentPicker.types;
    const documents = await DocumentPicker.pickMultiple({
      type: [types.images, types.docx, types.doc, types.ppt, types.pptx, types.csv, types.xls, types.xlsx, types.pdf],
    });
    const validDocuments = [];
    const documentTransform = await this.transformDocuments(documents);
    const resizedDocuments = await this.resizedImages(documentTransform);

    resizedDocuments.forEach((item) => {
      if (checkValidDocumentMimeType(item.type)) {
        item.mimeType = item.type;
        item.file = item.uri;
        item.path = item.uri;
        item.fileName = convertHEICFile(item.name);
        item.tempId = generateGUID();
        validDocuments.push(item);
      }
    });

    if (onSelectedImage) onSelectedImage(validDocuments);
  };

  showLibraryPicker = async () => {
    const { onSelectedImage, multiple = true } = this.props;
    const list = await openMultipleImagePicker({ usedCameraButton: true, singleSelectedMode: !multiple, androidLan: getPickerLanguageCode(this.props.languageId) });
    const images = list.map(({ fileName, mime, ...item }) => {
      const name = convertHEICFile(fileName) || `${generateGUID()}.jpeg`;
      return {
        ...item,
        tempId: generateGUID(),
        file: item.path,
        mimeType: mime,
        fileName: name,
      };
    });
    if (onSelectedImage) onSelectedImage(images);
  };

  btLibraryPress = () => {
    this.shown(false);
    setTimeout(() => {
      this.showLibraryPicker();
    }, 1000);
  };

  render() {
    const { onlyPickImage } = this.props;
    const { shown } = this.state;
    return (
      <Modal dismiss={() => this.shown(false)} visible={shown} animationType="fade" transparent>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={[styles.navBarContainer]}>
              <Button style={styles.button} onPress={() => this.shown(false)}>
                <Icon source={ImageResource.IC_Close} />
              </Button>
              <View style={styles.navBar}>
                <Text style={{ margin: Metric.space10 }} fontFamily={Fonts.Bold}>
                  {I18n.t('AD_TITLE_SELECT_IMAGE')}
                </Text>
              </View>
              <View style={styles.button} />
            </View>
            <View style={{ marginHorizontal: Metric.Space, marginBottom: Metric.space10 }}>
              <Button onPress={this.btLibraryPress}>
                <Text style={{ margin: Metric.space10 }} fontFamily={Fonts.Bold}>
                  {I18n.t('DOCUMENT_CHOOSE_LIBRARY_OR_CAMERA')}
                </Text>
              </Button>
              {!onlyPickImage && (
                <Button onPress={this.btDocumentPress}>
                  <Text style={{ margin: Metric.space10 }} fontFamily={Fonts.Bold} text="DOCUMENT_CHOOSE_OTHER_FILE" />
                </Button>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.opacity,
    justifyContent: 'center',
  },
  contentContainer: {
    marginHorizontal: Metric.Space,
    backgroundColor: Colors.bgWhite,
    borderRadius: Metric.borderRadius10,
  },
  navBarContainer: {
    backgroundColor: Colors.bgWhite,
    height: 50,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 10,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  navBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
