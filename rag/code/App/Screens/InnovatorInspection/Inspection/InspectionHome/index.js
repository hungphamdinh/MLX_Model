/* eslint-disable consistent-return */
/**
 * Created by thienmd on 10/7/20
 */
import React, { useEffect, useRef } from 'react';
import { AppState, BackHandler, DeviceEventEmitter, RefreshControl, View } from 'react-native';
import BaseLayout from '@Components/Layout/BaseLayout';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { NavigationEvents } from '@react-navigation/compat';
import PushNotificationService from '@Services/PushNotificationService';
import NavigationContext from '@Context/NavigationContext';
import useHome from '@Context/Home/Hooks/UseHome';
import useTeam from '@Context/Team/Hooks/UseTeam';
import NavigationService from '@NavigationService';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import useForm from '../../../../Context/Form/Hooks/UseForm';

import LoaderContainer from '../../../../Components/Layout/LoaderContainer';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import styles from './styles';
import useUser from '../../../../Context/User/Hooks/UseUser';
import InspectionHomeItem from '../../../../Components/InnovatorInspection/InspectionHomeItem';
import useProperty from '../../../../Context/Property/Hooks/UseProperty';
import EmptyListComponent from '../../../../Components/Lists/EmptyListComponent';
import HomeLoading from '../../../../Components/Lists/Loaders/HomeLoading';
import useApp from '../../../../Context/App/Hooks/UseApp';
import { icons } from '../../../../Resources/icon';
import { Colors } from '../../../../Themes';
import { CheckBox } from '../../../../Elements';
import { INSPECTION_FORM_TYPE, Modules } from '../../../../Config/Constants';
import { keyDeviceStore, NetWork } from '../../../../Utils';
import useWorkflow from '../../../../Context/Workflow/Hooks/UseWorkflow';
import useNotification from '../../../../Context/Notification/Hooks/UseNotification';
import useFeatureFlag from '../../../../Context/useFeatureFlag';
import { DeviceStore } from '../../../../Services/MMKVStorage';

import useInspectionInitialization from '../../../../Components/InnovatorInspection/useInspectionInitialization';

export const getNonOfflineInspectionProps = (isOfflineInspection) => {
  if (!isOfflineInspection) {
    return {
      leftIcon: icons.back,
      onLeftPress: () => {
        NavigationService.pop();
      },
    };
  }
  return {};
};

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const HorizontalScrollView = styled.ScrollView``;

const SectionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding-horizontal: 13px;
`;

const SectionTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

const SeeAllButton = styled.TouchableOpacity``;

const SeeAllTitle = styled.Text`
  font-weight: bold;
  color: #5f92cc;
`;

const SectionHeader = ({ title, onSeeAllPress }) => (
  <SectionWrapper>
    <SectionTitle bold>{I18n.t(title)}</SectionTitle>
    <SeeAllButton onPress={onSeeAllPress}>
      <SeeAllTitle bold>{I18n.t('INSPECTION_SEE_ALL')}</SeeAllTitle>
    </SeeAllButton>
  </SectionWrapper>
);

const SectionList = React.memo(
  ({
    title,
    onSeeAllPress,
    onItemPress,
    onViewReport,
    onRemovePress,
    onPickUpPress,
    onReleasePress,
    data,
    status,
    inspectionTeams,
    ...props
  }) => {
    if (data.totalCount === 0) return null;

    return (
      <>
        <SectionHeader title={title} onSeeAllPress={onSeeAllPress} />
        <HorizontalScrollView horizontal>
          {_.map(data.items, (item, index) => (
            <View key={`${index}`}>
              {item && (
                <InspectionHomeItem
                  key={`${index}`}
                  onItemPress={onItemPress}
                  onRemovePress={() => onRemovePress(item)}
                  inspectionTeams={inspectionTeams}
                  onViewReport={() => onViewReport(item)}
                  onPickUpPress={(isRelease) => (isRelease ? onReleasePress(item) : onPickUpPress(item))}
                  {...item}
                  status={status || item.status}
                  hideSync
                  {...props}
                  data={item}
                />
              )}
            </View>
          ))}
        </HorizontalScrollView>
      </>
    );
  },
  (prevProps, nextProps) => {
    return _.isEqual(prevProps.data.totalCount, nextProps.data.totalCount);
  }
);
const MessageWrapper = styled.View`
  flex-direction: row;
  background-color: ${Colors.azure};
  padding: 10px;
`;

const MessageText = styled(Text)`
  color: white;
  flex: 1;
`;

const CircleButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
`;

const FilterWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
`;

const InspectionHomeScreen = ({ navigation }) => {
  const { currentRouteName } = React.useContext(NavigationContext);
  const appState = useRef(AppState.currentState);
  const [isShowMyJob, setIsShowMyJob] = React.useState(false);
  const [isShowInventoryCheckList, setIsShowInventoryCheckList] = React.useState(false);

  const {
    inspection: {
      newInspections,
      pickedUpInspections,
      inProgressInspections,
      completedInspections,
      allInspections,
      isLoadingInspectionHome,
      isUpdateInspection,
      inspectionSetting,
    },
    getHomeInspections,
    getInspectionFormDetail,
    getStatusConfigs,
    getInspectionSetting,
    viewReport,
    deleteInspection,
    deleteOnlineInspection,
    pickUpInspection,
    releaseInspection,
    getInspectionFormDetailOnline,
    getListStatus,
    resetInspectionLocations,
    getQuestionTypes,
    getQuestionTypeCategories,
    getProjectTypes,
  } = useInspection();

  const {
    workflow: { workflowStatusId, fields },
  } = useWorkflow();

  const {
    getAllSettings,
    setLangId,
    app: { languageId },
  } = useApp();

  const inspectionPropertyField =
    _.size(fields) && fields.properties.find((item) => item.propertyName === 'InspectionPropertyId');

  const {
    getCurrentInformation,
    checkBiometricSettings,
    handleBiometricSettings,
    user: { user, biometricSetting, securitySetting, emailRegex, emailAddress },
  } = useUser();
  const { getPropertyTypes, getAllPropertyBuildingType, getAllPropertyUnitType, getPropertySettings } = useProperty();
  const {
    getAllTeamMembers,
    team: { inspectionTeams },
    getTeamsInspection,
  } = useTeam();

  const { getAllFormQuestionAnswerTemplate, getFormCategories, getFormSetting, getDefineSections, getFormSettings } =
    useForm();

  const {
    sync: { isFirstPull, connectionType },
    doSynchronize,
    changeConnectionType,
    getLocalDBIds,
    patchUnsyncImagesImages,
  } = useSync();

  const { checkForceUpdate } = useApp();
  const {
    home: { isOfflineInspection },
  } = useHome();

  const { getUnreadCount } = useNotification();
  const { isEnableLiveThere } = useFeatureFlag();

  const { initInspectionInfo } = useInspectionInitialization()

  useEffect(() => {
    patchUnsyncImagesImages();
  }, []);

  useEffect(() => {
    if (NetWork.isInspectionOffline && NetWork.isConnected) {
      reloadAllData();
      NetWork.setIsInspectionOffline(false);
    }
  }, [NetWork.isInspectionOffline, NetWork.isConnected]);

  useEffect(() => {
    if (!NetWork.isConnected) {
      loadHomeData();
    }
  }, [NetWork.isConnected]);

  useEffect(() => {
    if (user) {
      checkBiometricSettings({
        biometricSetting,

        isBiometricAuthenticationAdmin: securitySetting?.isBiometricAuthenticationAdmin,
      });
    }
  }, [user, biometricSetting]);

  const onItemPress = async (item) => {
    resetInspectionLocations();
    if (item.isOnline) {
      getInspectionFormDetailOnline(item);
    } else {
      const formData = await getInspectionFormDetail(item, user);
      if (formData) {
        navigation.navigate('inspectionDetail', { id: item.id, formData, workflow: item, isDetail: true });
      }
    }
  };

  const onPickUpPress = async (item) => {
    pickUpInspection(item.parentId);
  };

  const onReleasePress = async (item) => {
    const remoteId = item.isOnline ? item.parentId : item.inspection.remoteId;
    releaseInspection(remoteId, item.id);
  };

  const onViewReport = async (item) => {
    viewReport({
      workflowData: item,
      isOnlineForm: item.isOnline,
    });
  };

  const filterTeam = (team) => (team ? inspectionTeams.filter((item) => item.id === team.id)[0] : null);

  const onRemovePress = async (item) => {
    if (item.isOnline) {
      deleteOnlineInspection(item.parentId);
    } else {
      const formData = await getInspectionFormDetail(item, user);
      if (formData) {
        deleteInspection(item, formData);
      }
    }
  };

  const mainLayoutProps = {
    style: styles.container,
    showLogo: true,
    showBell: true,
    onBtAddPress: () => {
      const params = !inspectionPropertyField?.isVisible
        ? {
            selectedProperty: null,
            generalInfo: {},
          }
        : null;
      navigation.navigate(inspectionPropertyField?.isVisible ? 'selectPropertyToCreate' : 'selectFormToCreate', params);
    },
    addPermission: 'Inspection.Create',
    showAddButton: true,
    ...getNonOfflineInspectionProps(isOfflineInspection),
  };

  const onSeeAllPress = (statusId, isOnline = true) => {
    navigation.navigate('inspectionList', { statusId, isOnline });
  };

  const loadHomeData = () => {
    const type = isShowInventoryCheckList ? INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST : null;
    getHomeInspections(workflowStatusId, isShowMyJob, user?.id, undefined, type);
  };

  const initData = async () => {
    setLangId(languageId);
    getStatusConfigs();
    getListStatus();
    getAllFormQuestionAnswerTemplate();
    getUnreadCount();
    getDefineSections();
    getAllSettings();
    getInspectionSetting();
    if (NetWork.isConnected) {
      getPropertyTypes();
      getAllTeamMembers();
      getFormSetting();
      getAllPropertyBuildingType();
      getAllPropertyUnitType();
      getFormCategories();
      getPropertySettings();
      getQuestionTypes(Modules.INSPECTION);
      getQuestionTypeCategories();
      getFormSettings();
      getProjectTypes();
      initInspectionInfo();
    }
  };

  const handleHardwareBackPress = () => {
    if (isOfflineInspection && _.includes(['Jobs', 'login'], currentRouteName)) {
      BackHandler.exitApp();
      return false;
    }
    return false;
  };

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      checkForceUpdate();
      getUnreadCount();
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

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
    getLocalDBIds();
    loadTeams();
    handleBiometric();
  }, []);


  const reloadAllData = () => {
    initData();
    loadHomeData();
    loadTeams();
  };

  const loadTeams = () => {
    if (NetWork.isConnected) {
      getTeamsInspection();
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
    return () => {
      backHandler.remove();
    };
  }, [currentRouteName]);

  React.useEffect(() => {
    if (workflowStatusId && !isUpdateInspection) {
      loadHomeData();
      const subscription = DeviceEventEmitter.addListener('ReloadHomeInspections', loadHomeData);
      return () => {
        subscription.remove();
      };
    }
  }, [workflowStatusId, isUpdateInspection, isShowMyJob, isShowInventoryCheckList]);

  React.useEffect(() => {
    if (!isFirstPull) {
      initData();
    }
  }, [isFirstPull]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      changeConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSyncPress = () => {
    doSynchronize();
  };

  const isEmptyData = allInspections.totalCount === 0 && pickedUpInspections.totalCount === 0;
  const sectionListProps = {
    onItemPress,
    onViewReport,
    onRemovePress,
    onPickUpPress,
    onReleasePress,
  };

  const onCheckShowMyJob = () => {
    setIsShowMyJob(!isShowMyJob);
  };

  const onCheckShowInventoryCheckList = () => {
    setIsShowInventoryCheckList(!isShowInventoryCheckList);
  };

  const btInspectionSettingPress = () => {
    NavigationService.navigate('inspectionSyncSetting');
  };

  const getHintMessage = () => {
    if (!NetWork.isConnected) {
      return (
        <MessageWrapper>
          <MessageText text="INSPECTION_OFFLINE_TEXT" />
        </MessageWrapper>
      );
    }
    if (connectionType !== 'wifi' && !inspectionSetting?.isSynchronizationViaCellular) {
      return (
        <MessageWrapper>
          <MessageText text="INSPECTION_CELLULAR_HINT" />
          <CircleButton onPress={btInspectionSettingPress}>
            <Icon name="cog-outline" color="black" size={25} />
          </CircleButton>
        </MessageWrapper>
      );
    }

    return null;
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <LoaderContainer isLoading={isLoadingInspectionHome || isFirstPull} loadingComponent={<HomeLoading />}>
        <Wrapper refreshControl={<RefreshControl refreshing={isLoadingInspectionHome} onRefresh={loadHomeData} />}>
          {getHintMessage()}
          <FilterWrapper>
            <CheckBox checked={isShowMyJob} onPressCheck={onCheckShowMyJob} title="INSPECTION_SHOW_MY_JOB_ONLY" />
            {isEnableLiveThere && (
              <CheckBox
                checked={isShowInventoryCheckList}
                onPressCheck={onCheckShowInventoryCheckList}
                title="INSPECTION_SHOW_INVENTORY_CHECK_LIST_ONLY"
              />
            )}
          </FilterWrapper>

          {isEmptyData && <EmptyListComponent />}
          <SectionList
            title="INSPECTION_NEW_INSPECTION"
            data={newInspections}
            allowPickUp
            inspectionTeams={inspectionTeams}
            onSeeAllPress={() => onSeeAllPress(workflowStatusId?.newStatus)}
            {...sectionListProps}
          />

          <SectionList
            title="INSPECTION_PICKED_UP_LIST"
            data={pickedUpInspections}
            onSeeAllPress={() => onSeeAllPress(undefined, false)}
            {...sectionListProps}
          />
          <SectionList
            title="INSPECTION_IN_PROGRESS_INSPECTION"
            data={inProgressInspections}
            inspectionTeams={inspectionTeams}
            status={{ name: 'inprogress' }}
            allowPickUp
            onSeeAllPress={() => onSeeAllPress(workflowStatusId?.inProgress)}
            {...sectionListProps}
          />

          <SectionList
            title="INSPECTION_COMPLETED_INSPECTION"
            data={completedInspections}
            onSeeAllPress={() => onSeeAllPress(workflowStatusId?.completed)}
            {...sectionListProps}
          />

          <SectionList
            title="INSPECTION_ALL_INSPECTION"
            data={allInspections}
            inspectionTeams={inspectionTeams}
            onSeeAllPress={() => onSeeAllPress(undefined)}
            {...sectionListProps}
          />
        </Wrapper>
      </LoaderContainer>
      <NavigationEvents
        onWillFocus={() => {
          onSyncPress();
        }}
      />
      {/* {isFirstPull || */}
      {/*  (isPullWithMigrations && ( */}
      {/*    <Modal transparent visible={isFirstPull || isPullWithMigrations}> */}
      {/*      <Hud loading /> */}
      {/*    </Modal> */}
      {/*  ))} */}

      {isOfflineInspection && (
        <PushNotificationService
          isNotifyUsersBeforeReachedSessionDuration={securitySetting?.isNotifyUsersBeforeReachedSessionDuration}
          onReceiveForegroundNotification={getUnreadCount}
        />
      )}
    </BaseLayout>
  );
};
export default InspectionHomeScreen;
