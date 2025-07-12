import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import moment from 'moment';
import NavigationService from '@NavigationService';
import { DeviceEventEmitter } from 'react-native';
import { FormProvider } from 'react-hook-form';
import _ from 'lodash';
import { Text } from '@Elements';
import { FormDate, FormDocumentPicker, FormInput, FormNumberInput } from '@Components/Forms';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import * as Yup from 'yup';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import LocaleConfig from '../../../Config/LocaleConfig';
import SegmentControl from '../../../Components/segmentControl';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import RequestApi from '../../../Services/RequestApi';
import useInventory from '../../../Context/Inventory/Hooks/UseInventory';
import { PAGE_SIZE } from '../../../Config';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';

const Title = styled(Text)`
  font-size: 16px;
  margin-bottom: 10px;
`;

const AddInventoryStock = () => {
  const {
    inventory: { inventoryDetail = {} },
    addInventoryAllocate,
    addInventoryStock,
    detailInventory,
    getInventoryHistories,
  } = useInventory();
  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const [typeIndex, setTypeIndex] = useState(0);
  const isStockIn = typeIndex === 0;

  const validationStockInSchema = Yup.object().shape({
    description: Yup.string().required(requiredMessage),
    inventoryId: Yup.number().nullable().required(requiredMessage),
    warehouse: Yup.object().required(requiredMessage),
    // deliveryNo: Yup.string().required(requiredMessage),
    // companyId: Yup.number().nullable().required(requiredMessage),
    // brandId: Yup.number().nullable().required(requiredMessage),
  });

  const validationStockOutSchema = Yup.object().shape({
    description: Yup.string().required(requiredMessage),
    quantity: Yup.object().nullable().required(requiredMessage),
    // issuedById: Yup.number().nullable().required(requiredMessage),
    // takenById: Yup.number().nullable().required(requiredMessage),
    inventoryId: Yup.number().nullable().required(requiredMessage),
    warehouse: Yup.object().required(requiredMessage),
  });

  const today = new Date();
  const defaultCost = {
    text: '0',
    rawValue: 0,
  };

  const getInitialValues = (index) => {
    const isStockOut = index === 1;
    const stockOutParams = {
      quantity: defaultCost,
      issuedId: null,
      takenById: null,
    };
    const stockInParams = {
      quantity: {
        text: inventoryDetail.quantity,
        rawValue: 1,
      },
      actualQuantity: defaultCost,
      plannedQuantity: defaultCost,
      deliveryNo: '',
      stockCheckComment: '',
      unitPrice: defaultCost,
      cost: defaultCost,
      brandId: '',
      images: [],
      issuedBy: undefined,
      takenBy: undefined,
    };
    return {
      ...(isStockOut ? stockOutParams : stockInParams),
      description: undefined,
      inventoryId: inventoryDetail.id,
      warehouse: undefined,
      inputDate: today,
    };
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(isStockIn ? validationStockInSchema : validationStockOutSchema),
    defaultValues: getInitialValues(),
  });

  const { setFieldValue, watch } = formMethods;
  const [wUnitPrice, wActualQuantity] = watch(['unitPrice', 'actualQuantity']);

  useEffect(() => {
    let cost = 0;
    if (wUnitPrice && wActualQuantity) {
      cost = wUnitPrice.rawValue * wActualQuantity.rawValue;
    }
    setFieldValue('cost', { text: cost });
  }, [wUnitPrice, wActualQuantity]);

  const onChangeSegment = (index) => {
    setTypeIndex(index);
    const initialKey = Object.keys(getInitialValues(index));
    const initialVal = getInitialValues(index);
    initialKey.forEach((localKey) => {
      setFieldValue(localKey, initialVal[localKey]);
    });
  };

  const parseNumber = (number) => {
    if (number.rawValue === 0 && number.text) {
      return number.text;
    }
    return number.rawValue;
  };

  const onSubmit = async (values) => {
    const {
      deliveryNo,
      stockCheckComment,
      takenById,
      issuedById,
      quantity,
      cost,
      actualQuantity,
      plannedQuantity,
      unitPrice,
      inputDate,
      images,
      description,
      inventoryId,
      warehouse,
      company,
      brand,
      issuedBy,
      takenBy,
    } = values;

    const common = {
      description,
      inventoryId,
      warehouse: warehouse.id,
      warehouseId: _.get(warehouse, 'id'),
      companyId: _.get(company, 'id'),
      brandId: _.get(brand, 'id'),
      takenById: _.get(takenBy, 'id'),
      issuedById: _.get(issuedBy, 'id'),
      inventory: inventoryDetail,
      images: undefined,
    };

    const stockIn = {
      quantity: parseNumber(quantity),
      cost: parseNumber(cost),
      actualQuantity: parseNumber(actualQuantity),
      plannedQuantity: parseNumber(plannedQuantity),
      unitPrice: parseNumber(unitPrice),
      deliveryNo,
      inputDate: moment(inputDate, LocaleConfig.dateTimeFormat).format(),
      stockCheckComment,
    };

    const stockOut = {
      quantity: parseNumber(quantity),
      stockOutDate: moment(inputDate, LocaleConfig.dateTimeFormat).format(),
      issuedById,
      takenById,
    };

    const params = {
      ...(isStockIn ? stockIn : stockOut),
      ...common,
    };

    const submitRequest = typeIndex === 0 ? addInventoryStock : addInventoryAllocate;
    const result = await submitRequest(params);
    if (result) {
      await RequestApi.requestUploadFileInventoryStock(result.documentId, images);
      detailInventory({ inventoryId: inventoryDetail.id });
      getInventoryHistories({
        page: 1,
        inventoryId: inventoryDetail.id,
        pageSize: PAGE_SIZE,
      });
      NavigationService.goBack();

      DeviceEventEmitter.emit('ReloadInventory');
    }
  };

  const textOptions = {
    precision: 0,
    delimiter: LocaleConfig.groupSeparator,
    unit: '',
    suffixUnit: '',
  };

  const baseLayoutProps = {
    title: 'MODAL_ADD_STOCK_TITLE',
    padding: true,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  const inventoryName = _.get(inventoryDetail, 'name');
  return (
    <BaseLayout {...baseLayoutProps}>
      <Title preset="medium" text={inventoryName} />
      <SegmentControl
        values={['MODAL_ADD_STOCK_IN', 'MODAL_ADD_STOCK_OUT']}
        name="typeIndex"
        label="COMMON_TYPE"
        selectedIndex={typeIndex}
        onChange={onChangeSegment}
      />
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormSuggestionPicker
            required
            type={SuggestionTypes.WARE_HOUSE}
            label="INVENTORY_WAREHOUSES"
            title="INVENTORY_WAREHOUSES"
            placeholder="INVENTORY_WAREHOUSES"
            name="warehouse"
          />

          <FormNumberInput
            textOptions={textOptions}
            maxLength={null}
            editable={!isStockIn}
            required
            label={isStockIn ? 'MODAL_ADD_STOCK_COUNT' : 'STOCK_ISSUED_QUANTITY'}
            placeholder=""
            name="quantity"
          />
          {isStockIn && (
            <>
              <FormNumberInput
                textOptions={textOptions}
                maxLength={null}
                label="STOCK_PLANNED_QUANTITY"
                placeholder=""
                name="plannedQuantity"
              />
              <FormNumberInput
                required
                textOptions={textOptions}
                maxLength={null}
                label="STOCK_ACTUAL_QUANTITY"
                placeholder=""
                name="actualQuantity"
              />
              <FormNumberInput
                includeSymbol
                maxLength={null}
                label="STOCK_UNIT_PRICE"
                placeholder=""
                name="unitPrice"
              />
              <FormNumberInput includeSymbol maxLength={null} label="STOCK_TOTAL_VALUE" placeholder="" name="cost" />
            </>
          )}

          <FormDate label="STOCK_UPDATED_DATE" name="inputDate" required minDate={today} />
          {isStockIn ? (
            <>
              <FormInput label="STOCK_DELIVERY_NUMBER" placeholder="" name="deliveryNo" />
              <FormSuggestionPicker
                // required
                type={SuggestionTypes.COMPANY}
                label="STOCK_COMPANY"
                name="company"
              />
              <FormSuggestionPicker type={SuggestionTypes.BRAND} label="STOCK_BRAND" name="brand" />
            </>
          ) : (
            <>
              <FormSuggestionPicker
                // required
                type={SuggestionTypes.EMPLOYEE}
                label="STOCK_ISSUED_BY"
                name="issuedBy"
              />
              <FormSuggestionPicker
                addOnParams={{ isProvider: true }}
                type={SuggestionTypes.PROVIDER}
                label="STOCK_TAKEN_BY"
                name="takenBy"
                key="takenBy"
              />
            </>
          )}

          <FormInput required label="COMMON_DESCRIPTION" placeholder="" name="description" multiline />
          {isStockIn && <FormInput label="STOCK_CHECK_COMMENT" placeholder="" name="stockCheckComment" multiline />}
          <FormDocumentPicker name="images" label="COMMON_IMAGES" />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddInventoryStock;
