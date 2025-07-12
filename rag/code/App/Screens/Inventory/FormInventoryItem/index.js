import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import { Colors } from '@Themes';
import { FormProvider } from 'react-hook-form';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import { IconButton, Button, ExpandView } from '@Elements';
import _ from 'lodash';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FormDocumentPicker, FormInput, FormNumberInput, FormSwitch, FormLazyDropdown } from '@Components/Forms';
import { validateEmail } from '../../../Utils/common';
import FormMoneyInput from '../../../Components/Forms/FormMoneyInput';
import useInventory from '../../../Context/Inventory/Hooks/UseInventory';
import useUser from '../../../Context/User/Hooks/UseUser';
import { modal } from '../../../Utils';
import ItemUserEmail from './ItemUserEmail';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';
import LocaleConfig from '../../../Config/LocaleConfig';

const ButtonWrapper = styled(Button)`
  align-items: center;
`;

const FormInventoryItem = ({ navigation }) => {
  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    itemCode: Yup.string().required(requiredMessage),
    category: Yup.object().nullable().required(requiredMessage),
    name: Yup.string().required(requiredMessage),
  });

  const isAddNew = _.get(navigation, 'state.routeName') === 'addInventoryItem';

  const defaultCost = {
    text: '0',
    rawValue: 0,
  };

  const {
    getCategories,
    getLocations,
    addInventoryItem,
    editInventoryItem,
    inventory: { categories, locations, inventoryDetail },
  } = useInventory();
  const {
    user: { employees },
    getEmployees,
  } = useUser();
  const {
    file: { fileUrls, filesByGuid },
    getFileReference,
  } = useFile();

  const submitRequest = isAddNew ? addInventoryItem : editInventoryItem;

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      reminder: {
        emails: [],
        isActive: false,
        users: [],
      },
      inventoryLocation: null,
      category: null,
      quantity: '',
      name: '',
      itemCode: '',
      // categoryId: [],
      locationUseAt: '',
      locationRackNo: '',
      locationRowNo: '',
      locationOther: '',
      rating: '',
      typeDescription: '',
      isSerialized: false,
      colourCode: '',
      serialNumber: '',
      minimumBalance: defaultCost,
      userEmail: '',
      description: '',
      images: [],
      documents: [],
      categories: '',
      calculationUnit: '',
      priceBeforeVAT: defaultCost,
      finalPrice: defaultCost,
      note: '',
    },
  });

  const { watch, setFieldValue } = formMethods;
  const reminderEmails = watch('reminder.emails');
  const inventoryImages = watch('images');
  const inventoryDocuments = watch('documents');

  React.useEffect(() => {
    getCategories({
      page: 1,
      isParentNotChild: true,
    });
  }, []);

  React.useEffect(() => {
    if (inventoryDetail && !isAddNew) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [inventoryDetail]);

  React.useEffect(() => {
    if (!isAddNew) {
      if (fileUrls.length > 0) {
        setFieldValue('documents', fileUrls);
      }
      if (filesByGuid.length > 0) {
        setFieldValue('images', filesByGuid);
      }
    }
  }, [fileUrls.length, filesByGuid.length]);

  const getInitialValuesForUpdate = () => {
    const { guid, minimumBalance, priceBeforeVAT, finalPrice, category, reminder, ...restDetail } = inventoryDetail;

    // getFileReference(guid);
    getFileReference(inventoryDetail.documentId);
    getFileReference(inventoryDetail.guid, true);
    return {
      ...restDetail,
      category,
      minimumBalance: {
        text: `${minimumBalance}`,
        rawValue: minimumBalance,
      },
      priceBeforeVAT: {
        text: `${LocaleConfig.formatMoney(priceBeforeVAT)}`,
        rawValue: priceBeforeVAT,
      },
      finalPrice: {
        text: `${LocaleConfig.formatMoney(finalPrice)}`,
        rawValue: finalPrice,
      },
      documents: [],
      images: [],
      reminder: {
        ...reminder,
        userIds: _.map(reminder?.users, (item) => item.id),
      },
      userEmail: reminder?.emails,
    };
  };

  const getDefaultEmployees = () => {
    if (inventoryDetail?.reminder && !isAddNew) {
      const { reminder } = inventoryDetail;
      return _.size(reminder?.users) && reminder?.users.map((item) => item.displayName).join(', ');
    }
    return '';
  };

  const onCheckEmail = () => {
    const userEmail = watch('userEmail');
    if (!validateEmail(userEmail)) {
      modal.showError(I18n.t('COMMON_EMAIL_VALIDATION'));
    } else {
      addEmailAndResetInput(userEmail);
    }
  };

  const addEmailAndResetInput = (userEmail) => {
    setFieldValue('reminder.emails', [...reminderEmails, userEmail]);
    setFieldValue('userEmail', '');
  };

  const removeEmail = (index) => {
    setFieldValue(
      'reminder.emails',
      reminderEmails.filter((_item, idx) => index !== idx)
    );
  };

  const onSubmit = async ({
    images,
    documents,
    category,
    minimumBalance,
    finalPrice,
    priceBeforeVAT,
    inventoryLocation,
    reminder,
    ...values
  }) => {
    const params = {
      ...values,
      categoryId: category?.id,
      minimumBalance: minimumBalance.rawValue,
      priceBeforeVAT: priceBeforeVAT.rawValue,
      finalPrice: finalPrice.rawValue,
      locationId: inventoryLocation?.id,
      reminder: {
        ...reminder,
        userIds: _.map(reminder?.users, (item) => item.id)
      },
    };

    const response = await submitRequest({
      params,
      files: {
        documents,
        images,
      },
    });
    if (response) {
      navigation.goBack();
      DeviceEventEmitter.emit('ReloadInventory');
    }
  };

  return (
    <FormProvider {...formMethods}>
      <AwareScrollView>
        <FormInput required label="IV_INVENTORY_ITEM" name="name" placeholder="IV_INVENTORY_ITEM" mode="noBorder" />
        <FormInput
          required
          label="IV_INVENTORY_ITEM_CODE"
          name="itemCode"
          placeholder="IV_INVENTORY_ITEM_CODE"
          mode="noBorder"
        />
        <FormLazyDropdown
          listExist={categories.data}
          showSearchBar
          haveChildItem
          required
          getList={(page, keyword) =>
            getCategories({
              page,
              isParentNotChild: true,
              keyword,
            })
          }
          options={categories}
          title="COMMON_CATEGORY"
          label="COMMON_CATEGORY"
          name="category"
        />
        <FormInput label="IV_TO_BE_USED_AT" name="locationUseAt" placeholder="IV_TO_BE_USED_AT" mode="noBorder" />
        <FormLazyDropdown
          listExist={locations.data}
          showSearchBar
          getList={(page, keyword) =>
            getLocations({
              page,
              keyword,
            })
          }
          options={locations}
          title="IV_LOCATION"
          label="IV_LOCATION"
          name="inventoryLocation"
        />
        <FormNumberInput
          noBorder
          includeSymbol
          maxLength={null}
          label="IV_MIN_BALANCE"
          placeholder={I18n.t('IV_MIN_BALANCE')}
          name="minimumBalance"
        />
        <FormInput label="IV_LOCATION_RACK" name="locationRackNo" placeholder="IV_LOCATION_RACK" mode="noBorder" />
        <FormInput label="IV_LOCATION_ROW" name="locationRowNo" placeholder="IV_LOCATION_ROW" mode="noBorder" />
        <FormInput label="IV_LOCATION_OTHER" name="locationOther" placeholder="IV_LOCATION_OTHER" mode="noBorder" />
        <FormInput label="IV_RATING" name="rating" placeholder="IV_RATING" mode="noBorder" />
        <FormInput label="IV_TYPE" name="typeDescription" placeholder="IV_TYPE" mode="noBorder" />
        <FormInput label="IV_COLOUR_CODE" name="colourCode" placeholder="IV_COLOUR_CODE" mode="noBorder" />
        <FormInput
          editable={watch('isSerialized')}
          label="IV_SERIAL_NUMBER"
          name="serialNumber"
          keyboardType="number-pad"
          placeholder="IV_SERIAL_NUMBER"
          mode="noBorder"
        />
        <FormInput
          multiline
          label="COMMON_DESCRIPTION"
          name="description"
          placeholder="COMMON_DESCRIPTION"
          mode="noBorder"
        />
        <FormSwitch label="IV_SERIALIZED_ITEMS" placeholder="" name="isSerialized" />
        <FormSwitch label="IV_REMINDER" placeholder="" name="reminder.isActive" />
        {watch('reminder.isActive') && (
          <>
            <FormLazyDropdown
              listExist={employees.data}
              showSearchBar
              getList={(page, keyword) =>
                getEmployees({
                  page,
                  keyword,
                })
              }
              multiple
              titleKey="displayName"
              fieldName="displayName"
              options={employees}
              title="IV_EMPLOYEE"
              label="IV_EMPLOYEE"
              name="reminder.users"
              placeholder="REMINDER_ALL_USERS"
              defaultTitle={getDefaultEmployees()}
            />
            <FormInput
              label="IV_ADD_EMAIL_TO_NOTIFICATION"
              name="userEmail"
              placeholder="IV_ADD_EMAIL_TO_NOTIFICATION"
              mode="noBorder"
              rightIcon={<IconButton onPress={onCheckEmail} name="add-outline" color={Colors.text} />}
            />
            {_.size(reminderEmails) > 0 && (
              <>
                {reminderEmails.map((item, index) => (
                  <ItemUserEmail onPressRemove={() => removeEmail(index)} key={index.toString()} item={item} />
                ))}
              </>
            )}
          </>
        )}
        <ExpandView title="IV_SPECIFICATIONS_CONTRACT">
          <>
            <FormInput label="IV_CATEGORIES" name="categories" placeholder="IV_CATEGORIES" />
            <FormInput label="IV_CALCULATION_UNIT" name="calculationUnit" placeholder="IV_CALCULATION_UNIT" />
            <FormMoneyInput
              noBorder
              label="IV_PRICE_BEFORE_VAT"
              placeholder="IV_PRICE_BEFORE_VAT"
              name="priceBeforeVAT"
            />
            <FormMoneyInput noBorder label="IV_FINAL_PRICE" placeholder="IV_FINAL_PRICE" name="finalPrice" />
            <FormInput multiline label="IV_NOTE" name="note" placeholder="IV_NOTE" mode="noBorder" />
          </>
        </ExpandView>

        <FormDocumentPicker
          onlyPickImage
          name="images"
          label="COMMON_IMAGES"
          documentsOfSameRecord={[inventoryDocuments]}
        />
        <FormDocumentPicker name="documents" label="COMMON_DOCUMENT" documentsOfSameRecord={[inventoryImages]} />
        <ButtonWrapper>
          <Button primary rounded onPress={formMethods.handleSubmit(onSubmit)} title={I18n.t('AD_COMMON_SAVE')} />
        </ButtonWrapper>
      </AwareScrollView>
    </FormProvider>
  );
};

export default FormInventoryItem;
