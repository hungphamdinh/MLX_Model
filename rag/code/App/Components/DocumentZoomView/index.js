/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import wrapperZoomDocuments from './HOCWrapper';
import DocumentInWraper from './DocumentInWraper';
import { Colors, ImageResource } from '../../Themes';

const { width } = Dimensions.get('window');

class DocumentZoom extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.object,
    getOpacity: PropTypes.func,
    captureCarouselItem: PropTypes.func,
    indexState: PropTypes.number,
    open: PropTypes.func,
    arrayDocuments: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isDelete: PropTypes.bool,
    deleteDocument: PropTypes.func,
    addDocument: PropTypes.bool,
    getPhotos: PropTypes.func,
    emptyText: PropTypes.string,
  };

  static defaultProps = {
    addDocument: false,
    isDelete: false,
    emptyText: 'No Document',
  };

  render() {
    const {
      emptyText,
      getPhotos,
      addDocument,
      deleteDocument,
      arrayDocuments,
      isDelete,
      getOpacity,
      captureCarouselItem,
      indexState,
      open,
      containerStyle,
    } = this.props;
    return (
      <View style={{ alignItems: 'center' }}>
        <ScrollView style={[styles.containerWrapper, containerStyle]} showsHorizontalScrollIndicator={false} horizontal>
          {addDocument ? (
            <TouchableOpacity onPress={() => getPhotos()} style={styles.addDocumentWrapper}>
              <View style={styles.addDocumentCircle}>
                <Image style={{ width: 25, height: 25 }} resizeMode="cover" source={ImageResource.IC_AddImage} />
              </View>
            </TouchableOpacity>
          ) : null}
          {!addDocument && (!arrayDocuments || arrayDocuments.length === 0) ? (
            <View style={styles.emptyDocumentBox}>
              <Text>{emptyText}</Text>
            </View>
          ) : (
            arrayDocuments.map((item, index) => (
              <DocumentInWraper
                deleteDocument={() => deleteDocument(item, index)}
                isDelete={isDelete}
                key={index}
                open={open}
                indexState={indexState}
                getOpacity={getOpacity}
                captureCarouselItem={captureCarouselItem}
                index={index}
                document={item}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  margin: 10,
                }}
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerWrapper: {
    borderRadius: 20,
    paddingTop: 10,
    height: 130,
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addDocumentWrapper: {
    width: 90,
    height: 90,
    marginLeft: 20,
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#F6F8FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDocumentCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDocumentBox: {
    width: width - 40,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default wrapperZoomDocuments(DocumentZoom);
