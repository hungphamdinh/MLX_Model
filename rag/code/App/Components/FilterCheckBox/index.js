import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import _, { isArray } from 'lodash';

import FilterSection from './Components/FilterSection';

const Wrapper = styled.View``;

const FilterContainer = styled.View``;

const FilterModal = ({ data, selectedFilter, onSelectedValue }) => {
  const [selectedValue, setSelectedValue] = useState({});

  useEffect(() => {
    setSelectedValue(_.clone(selectedFilter));
  }, []);

  return (
    <Wrapper>
      <FilterContainer>
        {_.keys(data).map((key, index) => {
          const filter = data[key];
          const currentFilter = _.get(selectedValue, key, []);
          const filterOptions = filter.options.map((option) => ({
            ...option,
            valueId: option.value,
            isCheck: isArray(currentFilter) ? currentFilter.findIndex((id) => id.value === option.value) > -1 : false,
          }));
          return (
            <FilterSection
              key={key}
              idx={index}
              title={filter.title}
              data={filterOptions}
              selectFilter={(cbIndex, item) => {
                const { multiple } = filter;
                const isExist = _.findIndex(currentFilter, (id) => id.value === item.value) > -1;

                if (!multiple) {
                  selectedValue[key] = [item.value];
                } else if (!isExist) {
                  selectedValue[key] = [...currentFilter, item];
                } else {
                  selectedValue[key] = currentFilter.filter((id) => id.value !== item.value);
                }

                setSelectedValue({ ...selectedValue });
                onSelectedValue({ ...selectedValue });
                // filter.value
              }}
            />
          );
        })}
      </FilterContainer>
    </Wrapper>
  );
};

export const haveExistFilter = (filter, path) => (name) => _.includes(_.get(filter, path, []), name);

const FilterCheckBox = ({ onSelectedValue, ...props }) => {
  const onChooseValue = (value) => {
    onSelectedValue(value);
  };

  return <FilterModal onSelectedValue={onChooseValue} {...props} />;
};

export default FilterCheckBox;
