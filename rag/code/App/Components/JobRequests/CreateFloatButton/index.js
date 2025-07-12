import React from 'react';

import { Animated } from 'react-native';
import I18n from '@I18n';
import { FloatingButton } from '../../index';
import FloatingSecondaryButton from '../../FloatingButton/FloatingSecondaryButton';

class CreateFloatButton extends React.Component {
  constructor() {
    super();
    this.state = {
      animation: new Animated.Value(0),
      openFloatingButton: false,
    };
  }

  toggleMenu = () => {
    const toValue = this.state.openFloatingButton ? 0 : 1;
    Animated.spring(this.state.animation, {
      toValue,
      friction: 5,
    }).start();

    this.setState({ openFloatingButton: !this.state.openFloatingButton });
  };

  getYPosition(index) {
    return -60 - 45 * index;
  }

  render() {
    const { buttons } = this.props;
    return (
      <FloatingButton
        animation={this.state.animation}
        open={this.state.openFloatingButton}
        toggleMenu={this.toggleMenu}
      >
        {buttons.map((button, index) => (
          <FloatingSecondaryButton
            key={button.title}
            animation={this.state.animation}
            yPosition={this.getYPosition(index)}
            title={I18n.t(button.title)}
            onPress={() => {
              this.toggleMenu();
              button.onPress();
            }}
          />
        ))}

        {/* <FloatingSecondaryButton */}
        {/*  animation={this.state.animation} */}
        {/*  yPosition={-105} */}
        {/*  title={I18n.t('AD_WO_BUTTON_QUICK_CREATE')} */}
        {/*  onPress={this.openQuickCreateWorkOrder} */}
        {/* /> */}
        {/* <FloatingSecondaryButton */}
        {/*  animation={this.state.animation} */}
        {/*  yPosition={-60} */}
        {/*  title={I18n.t('AD_WO_BUTTON_CREATE')} */}
        {/*  onPress={this.openCreateWorkOrder} */}
        {/* /> */}
      </FloatingButton>
    );
  }
}

export default CreateFloatButton;
