import _ from 'lodash';

export const differenceTwoArrayObject = (originalArray, targetArray, key = 'id') => {
  const newArr = _.filter(targetArray, obj => !obj[key]);
  const updatedArr = _.filter(targetArray, obj => obj[key]);
  const deletedArr = _.filter(originalArray, obj => _.findIndex(targetArray, targetObj => targetObj[key] === obj[key]) === -1);
  return {
    created: newArr,
    updated: updatedArr,
    deleted: deletedArr,
  };
};

export const getUniqueData = (data, key = 'id') => data.filter((value, index, self) => index === self.findIndex((t) => t[key] === value[key]));

export const removeDuplicateInTwoArray = (array1, array2, key = 'id') => array1.filter((val) => !array2.find((val2) => val[key] === val2[key]));

export const getGeneralElementsInTwoArray = (array1, array2, key = 'id') => array1.filter((val) => array2.find((val2) => val[key] === val2[key]));

export const getDefaultTitleFromArr = (data, fieldName = 'name') => {
  return _.size(data) && data.map((item) => item[fieldName]).join(', ');
};