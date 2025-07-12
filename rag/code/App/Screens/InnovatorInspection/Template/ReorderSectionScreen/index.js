/**
 * Created by thienmd on 10/7/20
 */
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import BaseLayout from '@Components/Layout/BaseLayout';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Text } from '@Elements';
import I18n from '@I18n';
import styles from './styles';
import { ImageResource } from '../../../../Themes';

const ReorderSectionScreen = ({ navigation }) => {
  const { params } = useRoute();
  const data = params?.data;
  const onComplete = params?.onComplete;
  const [sections, setSections] = React.useState(data);
  useEffect(() => {
    setSections(data);
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const onSavePress = () => {
    const updatedSections = sections.map((section, index) => ({
      ...section,
      pageIndex: index,
    }));

    goBack();
    onComplete(updatedSections);
  };

  const mainLayoutProps = {
    title: I18n.t('FORM_REORDER_SECTION'),
    onLeftPress: goBack,
    rightBtn: {
      icon: ImageResource.IC_SAVE,
      onPress: onSavePress,
    },
  };

  // cons
  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity style={[styles.itemContainer, { ...(isActive ? styles.selectedItem : {}) }]} onLongPress={drag}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <BaseLayout {...mainLayoutProps}>
      <DraggableFlatList
        data={sections}
        keyExtractor={(section) => `${section.id}`}
        renderItem={renderItem}
        onDragEnd={({ data: newData }) => setSections(newData)}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </BaseLayout>
  );
};
export default ReorderSectionScreen;
