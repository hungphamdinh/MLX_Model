/**
 * Created by thienmd on 10/7/20
 */
import React from 'react';
import FormEditorScreen from '../FormEditorScreen';
import LoaderContainer from '../../../../Components/Layout/LoaderContainer';
import useForm from '../../../../Context/Form/Hooks/UseForm';
import {PlaceHolder} from '../../../../Components';


const FormDetailScreen = ({ navigation }) => {
  const {
    isLoading,
  } = useForm();
  return (
      <LoaderContainer isLoading={isLoading} loadingComponent={<PlaceHolder />}>
          <FormEditorScreen navigation={navigation} />
      </LoaderContainer>

  );
};
export default FormDetailScreen;
