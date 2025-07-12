import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import SegmentControl from '../../segmentControl';

const Wrapper = styled.View`
  background-color: white;
  padding: 15px;
`;

export default class RoundedTabBar extends PureComponent {
  render() {
    const { tabs, activeTab, goToPage } = this.props;

    return (
      <Wrapper>
        <SegmentControl selectedIndex={activeTab} values={tabs} onChange={goToPage} scrollEnabled={false} />
      </Wrapper>
    );
  }
}
