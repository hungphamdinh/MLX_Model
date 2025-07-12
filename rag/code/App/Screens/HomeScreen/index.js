import React, { useEffect, useState } from 'react';
import { Linking, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import NavigationService from '@NavigationService';
import I18n from '@I18n';
import _ from 'lodash';
import Geolocation from '@react-native-community/geolocation';
import BaseLayout from '../../Components/Layout/BaseLayout';
import WeatherForecast from '../../Components/Home/WeatherForecast';
import useHome from '../../Context/Home/Hooks/UseHome';
import LoaderContainer from '../../Components/Layout/LoaderContainer';
import useUser from '../../Context/User/Hooks/UseUser';
import Row from '../../Components/Grid/Row';
import { Button, Spacer } from '../../Elements';
import ModuleStatistic from '../../Components/Home/ModuleStatistic';
import useNotification from '../../Context/Notification/Hooks/UseNotification';
import ModalReceiptQRCode from '../../Modal/ReceiptQRCode';
import useJobRequest from '../../Context/JobRequest/Hooks/UseJobRequest';
import { requestLocationPermission } from '../../Utils/permissions';
import { DashboardStatisticTypes, ReceiptType } from '../../Config/Constants';
import PushNotificationService from '../../Services/PushNotificationService';
import useForm from '../../Context/Form/Hooks/UseForm';
import { isGranted } from '../../Config/PermissionConfig';
import ModalSuccess from '../../Components/ModalSuccess';
import useFee from '../../Context/Fee/Hooks/UseFee';
import { AlertNative } from '../../Components';
import useApp from '../../Context/App/Hooks/UseApp';
import useAsset from '../../Context/Asset/Hooks/UseAsset';
import { DeviceStore } from '../../Services/MMKVStorage';
import { keyDeviceStore } from '../../Utils';

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const ActionWrapper = styled(Row)`
  margin-horizontal: 20px;
  margin-bottom: 15px;
`;

const JRButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 30,
    flex: 1,
  },
  primary: true,
  rounded: true,
}))`
  font-size: 10px;
`;

const HomeScreen = ({ navigation }) => {
  const {
    home: { weatherForecast, dashboardStatistic, userModuleConfig, deepLinkPath },
    getWeatherForecast,
    getDashboardStatistic,
    setDeepLinkAction,
    getBuildings,
  } = useHome();

  const { getAllFormQuestionAnswerTemplate } = useForm();
  const { setAllowScanQRCode } = useApp();
  const { initJRConfigs } = useJobRequest();
  const { getUnreadCount } = useNotification();
  const {
    getCurrentInformation,
    getProfilePicture,
    checkBiometricSettings,
    switchToUserAccount,
    handleBiometricSettings,
    user: { tenant, accountUserId, user, biometricSetting, securitySetting, emailAddress, emailRegex },
  } = useUser();

  const {
    getAssetByCode,
    resetAssetDetail,
    asset: { assetDetail },
  } = useAsset();

  const {
    getAllSettings,
    setLangId,
    app: { languageId },
  } = useApp();

  const {
    fee: { isShowSuccessModal },
    closeSuccessModal,
  } = useFee();

  const [isRefresh, setIsRefresh] = useState(false);
  const [location, setLocation] = useState();
  const [receipt, setReceipt] = useState({});
  const [isShowDialog, setIsShowDialog] = useState(false);
  const currentRoute = NavigationService.getCurrentRoute();

  const handleBiometric = async () => {
    const deviceBiometric = await DeviceStore.get(keyDeviceStore.BIOMETRIC_SETTING);
    handleBiometricSettings({
      securitySetting, 
      biometricSetting: deviceBiometric,
      emailRegex,
      emailAddress
    })
  }

  useEffect(() => {
    initData();
    // use Device biometric to overwrite the site biometric
    handleBiometric();
    const getUrl = async () => {
      const url = await Linking.getInitialURL();
      Linking.emit('url', { url: url || deepLinkPath });
      setDeepLinkAction(null);
    };
    if (deepLinkPath) {
      getUrl();
    }

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    if (userModuleConfig) {
      const modules = userModuleConfig.modules;
      getDashboardStatistic(modules);
    }
  }, [userModuleConfig]);

  useEffect(() => {
    if (user) {
      checkBiometricSettings({
        biometricSetting,
        isBiometricAuthenticationAdmin: securitySetting.isBiometricAuthenticationAdmin,
      });
    }
  }, [user, biometricSetting]);

  useEffect(() => {
    setTimeout(() => {
      checkToAssetDetail();
    }, 500);
  }, [assetDetail, tenant]);

  useEffect(() => {
    if (isShowDialog) {
      showConfirmDialog();
    }
  }, [isShowDialog]);

  useEffect(() => {
    const { params } = currentRoute;
    if (params) {
      if (params.assetsCode) {
        getAssetByCode({
          code: params.assetsCode,
        });
        NavigationService.setParams({ assetsCode: null });
      } else {
        getReceiptCode(params);
      }
    }
  }, [currentRoute?.params]);

  useEffect(() => {
    requestLocationPermission(getOneTimeLocation, getWeatherForecast);
  }, []);

  const initData = async () => {
    getProfilePicture();
    getUnreadCount();
    getWeatherForecast(location);
    initJRConfigs();
    getAllFormQuestionAnswerTemplate();
    getBuildings();
    setIsRefresh(false);
    getAllSettings();
    setLangId(languageId);
  };

  const checkToAssetDetail = async () => {
    if (assetDetail && tenant) {
      const isCurrentTenant = tenant.id === assetDetail.tenant.id;
      if (isCurrentTenant) {
        if (currentRoute.name === 'home') {
          navigation.navigate('detailAssets');
        } else {
          navigation.replace('detailAssets');
        }
      } else {
        setIsShowDialog(true);
      }
    }
  };

  const onPressCancel = () => {
    resetAssetDetail();
    setAllowScanQRCode(true);
  };

  const showConfirmDialog = () => {
    if (isShowDialog) {
      AlertNative(
        I18n.t('ASSET_SWITCH_PROJECT'),
        I18n.t('ASSET_SWITCH_PROJECT_MESSAGE', undefined, assetDetail?.tenant?.name),
        changeProject,
        I18n.t('AD_COMMON_YES'),
        I18n.t('AD_COMMON_CANCEL'),
        onPressCancel
      );
      setIsShowDialog(false);
    }
  };

  const changeProject = () => {
    switchToUserAccount({
      tenantId: assetDetail.tenant.id,
      id: assetDetail.tenantUserId,
      userId: accountUserId,
    });
  };

  const onRefresh = () => {
    setIsRefresh(true);
    if (userModuleConfig) {
      getDashboardStatistic(userModuleConfig.modules);
    }
    initData();
  };

  const getReceiptCode = (params) => {
    const { code, cashAdvanceReceiptCode } = params;
    const data = code || cashAdvanceReceiptCode;
    setReceipt({
      code: data,
      feeType: cashAdvanceReceiptCode ? ReceiptType.CASH_ADVANCE : ReceiptType.FEE_RECEIPT,
    });
  };

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        getWeatherForecast(position.coords);
        setLocation(position.coords);
      },
      () => {
        getWeatherForecast();
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  const onJRCreatePress = () => {
    NavigationService.navigate('jobRequest');
    NavigationService.navigate('addJobRequest');
  };

  const onQuickJRCreatePress = () => {
    NavigationService.navigate('jobRequest');
    NavigationService.navigate('addQuickJobRequest');
  };

  const onStatisticItemPress = (filter, statisticType) => {
    if (statisticType === DashboardStatisticTypes.SURVEY) {
      NavigationService.navigate('employeeSurvey', { statisticType, isSubmitted: filter });
      return;
    }
    if (
      _.includes(
        [DashboardStatisticTypes.PLAN_MAINTENANCE, DashboardStatisticTypes.TEAM_PM, DashboardStatisticTypes.MY_PM],
        statisticType
      )
    ) {
      NavigationService.navigate('plainMaintenance', { statisticType, statusIds: filter });
      return;
    }

    NavigationService.navigate('jobRequest', { statisticType, statusIds: filter });
  };

  const getStatisticProps = (item) => ({
    title: item.title,
    color: item.backgroundColor,
    icon: item.icon,
    leftItem: {
      title: `${I18n.t('HOME_STATISTIC_PENDING')} ${I18n.t(item.itemName)}`,
      number: item.pending.count,
      color: item.leftColor,
      onPress: () => onStatisticItemPress(item.pending.filter, item.statisticType),
    },
    rightItem: {
      title: `${I18n.t('HOME_STATISTIC_COMPLETED')} ${I18n.t(item.itemName)}`,
      number: item.completed.count,
      color: item.rightColor,
      onPress: () => onStatisticItemPress(item.completed.filter, item.statisticType),
    },
  });

  return (
    <BaseLayout showLogo noShadow showBell>
      <LoaderContainer>
        <Wrapper refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}>
          <WeatherForecast weatherForecast={weatherForecast} />

          {isGranted('Pages.WorkOrdersV1') && isGranted('WorkOrders.WorkOrder.Create') && (
            <ActionWrapper>
              <JRButton title="HOME_JR_CREATE" onPress={onJRCreatePress} />
              <Spacer width={10} />
              <JRButton title="HOME_JR_QUICK_CREATE" onPress={onQuickJRCreatePress} />
            </ActionWrapper>
          )}

          {dashboardStatistic.map((item) => (
            <ModuleStatistic key={item.title} {...getStatisticProps(item)} />
          ))}
        </Wrapper>
      </LoaderContainer>
      <ModalReceiptQRCode receipt={receipt} resetCode={() => setReceipt({ code: '' })} />
      {isShowSuccessModal ? (
        <ModalSuccess
          titleButton={I18n.t('COMMON_CLOSE')}
          textContent={I18n.t('FEE_CHECK_RECEIPT_SUCCESS')}
          textTitle={I18n.t('MODAL_SUCCESS_TEXT_TITLE')}
          onPress={() => closeSuccessModal()}
        />
      ) : null}
      <PushNotificationService
        isNotifyUsersBeforeReachedSessionDuration={securitySetting?.isNotifyUsersBeforeReachedSessionDuration}
        onReceiveForegroundNotification={getUnreadCount}
      />
    </BaseLayout>
  );
};

export default HomeScreen;
