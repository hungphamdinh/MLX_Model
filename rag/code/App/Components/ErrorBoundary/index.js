import React from 'react';
import { Text, Button } from '@Elements';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import I18n from '@I18n';
import RNRestart from 'react-native-restart';
import logService from '../../Services/LogService';
import SentryService from '../../Services/SentryService';

const FallbackWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding-horizontal: 20px;
`;

const FallbackText = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333333;
`;

const FallbackComponent = () => {
  const content = I18n.t('ERROR_SOMETHING_WENT_WRONG', 'Some thing went wrong');
  const buttonTitle = I18n.t('COMMON_TRY_AGAIN', 'Try again');

  return (
    <FallbackWrapper>
      <SafeAreaView />
      <FallbackText>Oops!</FallbackText>
      <FallbackText>{content}</FallbackText>
      <Button primary rounded title={buttonTitle} onPress={RNRestart.Restart} />
    </FallbackWrapper>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
    });

    logService.error(error, errorInfo);
    SentryService.captureException(error);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
