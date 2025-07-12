import React from 'react';
import LazyDropdownItem from '../../../Elements/LazyDropdownItem';

const FilterListSelect = ({ options, listExist, getList, ...restProps }) => (
  <LazyDropdownItem
    isDropdownItem
    showSearchBar
    options={options}
    listExist={listExist}
    getList={(page, key) => getList(page, key)}
    showValueByKey
    {...restProps}
    showCheckAll={false}
  />
);

export default FilterListSelect;
