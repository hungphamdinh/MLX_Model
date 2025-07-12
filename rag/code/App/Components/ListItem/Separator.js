import styled from 'styled-components/native';
import _ from 'lodash';

const Separator = styled.View`
  height: ${(props) => _.get(props, 'height', 20)}px;
`;

export default Separator;
