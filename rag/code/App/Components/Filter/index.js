import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import i18n from '@I18n';
import ShadowView from '@Elements/ShadowView';
import FilterModal from './Components/FilterModal';
import SortModal from './Components/SortModal';
import { icons } from '../../Resources/icon';
import { Metric } from '../../Themes';

const filterIconSize = 24;
const searchIconSize = 46;

const Wrapper = styled.View`
  padding: 15px;
  background-color: white;
  overflow: visible;
`;

const TopSection = styled.View`
  flex-direction: row;
  align-items: center;
  z-index: 4;
  elevation: 6;
  overflow: visible;
`;

const InputTopSection = styled(ShadowView)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  height: 46px;
  border-radius: 23px;
  background-color: white;
  box-shadow: 0px 0px 6px #00000029;
`;

const HiddenText = styled.Text`
  position: absolute;
  top: -40;
  left: 23px; /* same as SearchInput margin-left */
  font-family: Gotham-Book;
  opacity: 0;
`;

const FilterTopSection = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 23px;
  background-color: ${(props) => (props.visibleFilter ? '#648FCA' : 'transparent')};
  align-items: center;
  justify-content: center;
`;

const FilterIcon = styled.Image`
  width: ${filterIconSize}px;
  height: ${filterIconSize}px;
  tint-color: ${(props) => (props.visibleFilter ? 'white' : '#648FCA')};
`;

const SearchTopSection = styled.View`
  width: ${searchIconSize}px;
  height: ${searchIconSize}px;
  border-radius: 23px;
  background-color: #f5f5f5;
  border-color: white;
  border-width: 1px;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 23px;
  font-family: Gotham-Book;
`;

const VerticalLine = styled.View`
  height: 27px;
  width: 1px;
  margin-horizontal: 8px;
  background-color: #707070;
  opacity: 0.1;
`;

const SearchIcon = styled.Image``;

export const FilterTypes = {
  INPUT: 'INPUT',
  OPTIONS: 'OPTIONS',
  DROPDOWN: 'DROPDOWN',
  LIST_SELECT: 'LIST_SELECT',
  DATE_TIME: 'DATE_TIME',
};

const FilterView = ({
  style,
  selectedFilter,
  selectedSort,
  onSearch,
  iconFilter,
  customView,
  visibleFilter,
  showFilter = true,
  searchPlaceHolder,
  data,
  sortData,
  onCompleted,
  onSortCompleted,
  defaultFilter,
  onClear,
  keyword,
}) => {
  const [textSearch, setTextSearch] = useState('');
  const timer = React.useRef();
  const [visible, setVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const fullPlaceholderText = searchPlaceHolder ? i18n.t(searchPlaceHolder) : i18n.t('COMMON_SEARCH');

  // States for measuring widths
  const [containerWidth, setContainerWidth] = useState(0);
  const [fullPlaceholderWidth, setFullPlaceholderWidth] = useState(0);
  const [computedPlaceholder, setComputedPlaceholder] = useState(fullPlaceholderText);

  useEffect(() => {
    setTextSearch(keyword);
  }, [keyword]);

  // Compute the placeholder text based on available width
  useEffect(() => {
    if (!Metric.isIOS && containerWidth > 0 && fullPlaceholderWidth >= containerWidth) {
      const ratio = containerWidth / fullPlaceholderWidth;
      const targetLength = Math.floor(fullPlaceholderText.length * ratio);
      const safeLength = targetLength > 3 ? targetLength - 3 : targetLength;
      const finalText = fullPlaceholderText.substring(0, safeLength) + '...';
      setComputedPlaceholder(finalText);
    }
    else {
      setComputedPlaceholder(fullPlaceholderText);
    }
  }, [containerWidth, fullPlaceholderWidth, searchPlaceHolder]);

  const onHideModal = () => {
    setVisible(false);
    setSortVisible(false);
  };

  const onFilterPress = () => {
    setVisible(true);
  };

  const onSortPress = () => {
    setSortVisible(true);
  };

  const onChangeText = (text) => {
    setTextSearch(text);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      onSearch(text);
    }, 600);
  };

  const onPlaceHolderWidthCalculation = (e) =>{
    if(Metric.isIOS) {
      return;
    }
    const inputWidth = e.nativeEvent.layout.width;
    let baseWidth = searchIconSize;
    if(showFilter) {
      baseWidth += filterIconSize;
    }
    if(sortData) {
      baseWidth += filterIconSize;
    }

    const widthFinal = inputWidth - baseWidth;
    setContainerWidth(widthFinal);
}
  return (
    <>
      <Wrapper style={[style]}>
        <TopSection>
          {customView || (
              <InputTopSection onLayout={onPlaceHolderWidthCalculation}>
                <SearchInput
                  value={textSearch}
                  placeholder={computedPlaceholder}
                  placeholderTextColor="#9F9F9F"
                  onChangeText={onChangeText}
                  numberOfLines={1}
                  multiline={false}
                />
                <SearchTopSection>
                  <SearchIcon source={icons.search} />
                </SearchTopSection>
              </InputTopSection>
          )}
          {!Metric.isIOS && 
            // Render hidden text to measure placeholder width for dynamic truncation.
            <HiddenText onLayout={(e) => setFullPlaceholderWidth(e.nativeEvent.layout.width)}>
              {searchPlaceHolder ? i18n.t(searchPlaceHolder) : i18n.t('COMMON_SEARCH')}
          </HiddenText>
          }
          
          {showFilter && (
            <>
              <VerticalLine />
              <FilterTopSection onPress={onFilterPress} visibleFilter={visibleFilter}>
                <FilterIcon source={iconFilter ?? icons.filter} resizeMode="contain" visibleFilter={visibleFilter} />
              </FilterTopSection>
            </>
          )}
          {sortData && (
            <>
              {!showFilter && <VerticalLine />}
              <FilterTopSection onPress={onSortPress} visibleFilter={visibleFilter}>
                <FilterIcon source={icons.sort} resizeMode="contain" visibleFilter={visibleFilter} />
              </FilterTopSection>
            </>
          )}
        </TopSection>
        <FilterModal
          visible={visible}
          onHideModal={onHideModal}
          onClear={onClear}
          data={data}
          onCompleted={onCompleted}
          selectedFilter={selectedFilter}
          defaultFilter={defaultFilter}
        />
        <SortModal
          visible={sortVisible}
          onHideModal={onHideModal}
          data={sortData}
          onCompleted={onSortCompleted}
          selectedFilter={selectedSort}
        />
      </Wrapper>
    </>
  );
};

export default FilterView;