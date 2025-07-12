import _ from 'lodash';
import { ProtectedStorage } from '@Services/MMKVStorage';
import NavigationService from '@NavigationService';
import { useStateValue, useHandlerAction } from '../../index';
import {
  getBuildingsFailure,
  getBuildingsRequest,
  getBuildingsSuccess,
  getDashboardStatisticFailure,
  getDashboardStatisticRequest,
  getDashboardStatisticSuccess,
  getHomeModulesFailure,
  getHomeModulesRequest,
  getHomeModulesSuccess,
  getWeatherForecastFailure,
  getWeatherForecastRequest,
  getWeatherForecastSuccess,
  setDeepLinkActionRequest,
  GET_COMPANIES,
} from '../Actions';
import { RequestApi } from '../../../Services';
import {
  transformBuildings,
  transformDashboardStatistic,
  transformHomeModules,
} from '../../../Transforms/HomeTransformer';
import { handleCacheRequestFromAsyncStorage } from '../../../Utils/network';
import { inspectionStandardModules, OFFLINE_INSPECTION_ID } from '../../../Config/Constants';
import { modal, NetWork } from '../../../Utils';
import I18n from '../../../I18n';
import LocaleConfig from '../../../Config/LocaleConfig';
import SyncDB from '../../../Services/OfflineDB/SyncDB';
import keyDeviceStore from '../../../Utils/keyDeviceStore';
import PermissionConfig from '../../../Config/PermissionConfig';

const useHome = () => {
  const [{ home }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling } = useHandlerAction();
  const getHomeModules = async () => {
    try {
      // add default home modules when submit a new ui to store
      let homeResponse = {
        orderModule: [
          {
            page: 'Pages.Plan.Maintenance',
            module: 'Module.Plan',
            position: 2,
          },
          {
            page: 'Pages.Survey.Employee',
            module: 'Module.Survey',
            position: 3,
          },
          {
            page: 'Pages.Survey',
            module: 'Module.Survey',
            position: 4,
          },
          {
            page: 'Pages.Delivery',
            module: 'Module.Delivery',
            position: 5,
          },
        ],
        userConfig: { modules: ['Pages.CalendarEvents', 'Pages.WeatherForecast'] },
      };
      dispatch(getHomeModulesRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.requestModuleHome);
      if (result) {
        homeResponse = result;
      }
      // const planOverview = await handleCacheRequest(RequestApi.requestGetPlanOverview);
      // const woOverview = await handleCacheRequest(RequestApi.requestGetWorkOrderOverview);
      // const homeModules = transformHomeModules(homeResponse.modules);

      const localeConfig = await handleCacheRequestFromAsyncStorage(RequestApi.requestLocalSettings);
      LocaleConfig.init(localeConfig);
      const modules = _.get(homeResponse, 'orderModule', []);
      const userConfig = _.get(homeResponse, 'userConfig', {});
      const disabledModules =
        (await handleCacheRequestFromAsyncStorage(RequestApi.requestGetDisableFeatureTenant)) || [];
      const moduleRes = homeResponse.orderModule;
      const moduleActives = moduleRes.filter((moduleLocal) => !disabledModules.includes(moduleLocal.page));
      const userConfigModules = {
        ...userConfig,
        modules: userConfig.modules.filter((item) => moduleActives.find((x) => x.page === item)),
      };
      const grantedPermissions = result.grantedPermissions || {};
      const permissionKeys = Object.keys(result.grantedPermissions);
      permissionKeys.forEach((key) => {
        if (
          !moduleActives.find((module) => module.page === key) &&
          key.includes('Pages.') &&
          !['Pages.InspectionProperty', 'Pages.Form'].includes(key)
        ) {
          delete grantedPermissions[key];
        }
      });
      PermissionConfig.permissions = grantedPermissions;

      // Set DatabaseName based on tenant
      const tenantSelected = await ProtectedStorage.get(keyDeviceStore.TANENTSELECTED);
      const accountUserId = await ProtectedStorage.get(keyDeviceStore.ACCOUNT_USER_ID);
      SyncDB.setDataBaseName(accountUserId, tenantSelected.tenantId);

      // check condition go to home module or inspection tab
      const isOfflineInspection = _.findIndex(userConfig.modules, (id) => id === OFFLINE_INSPECTION_ID) > -1;

      const moduleHome = isOfflineInspection ? inspectionStandardModules : transformHomeModules(moduleActives);
      dispatch(
        getHomeModulesSuccess({
          modules,
          moduleHome,
          bottomModules: _.slice(
            moduleHome.filter((item) => item.screen !== 'inspection'),
            1,
            5
          ),
          userModuleConfig: userConfigModules,
          isOfflineInspection,
        })
      );

      if (isOfflineInspection) {
        NavigationService.replace('inspection');
        if (!NetWork.isConnected) {
          NetWork.setIsInspectionOffline(true);
        }
      } else if (NetWork.isConnected) {
        NavigationService.replace('mainTab');
      } else {
        alert(I18n.t('NO_INTERNET', 'There is no internet detected. Please check your network and try again.'));
      }
    } catch (err) {
      dispatch(getHomeModulesFailure(err));
      modal.showError(I18n.t('MODAL_ERROR_CONTENT'));
    }
  };

  const setDeepLinkAction = (payload) => {
    dispatch(setDeepLinkActionRequest(payload));
  };

  const getWeatherForecast = async (payload) => {
    try {
      dispatch(getWeatherForecastRequest(payload));

      let geography = payload;
      if (!geography) {
        // get default based on
        const result = await RequestApi.getTenantAddress();
        if (result.geography.latitude && result.geography.longitude) {
          geography = result.geography;
        }
      }

      const result = await RequestApi.getCurrentWeather(geography.latitude, geography.longitude);
      dispatch(getWeatherForecastSuccess({ current: result.data }));
    } catch (e) {
      dispatch(getWeatherForecastFailure(e));
    }
  };

  const getDashboardStatistic = async (permissions) => {
    try {
      dispatch(getDashboardStatisticRequest(permissions));

      const result = await RequestApi.getDashboardMobile();
      dispatch(getDashboardStatisticSuccess(transformDashboardStatistic(result, permissions)));
    } catch (e) {
      dispatch(getDashboardStatisticFailure(e));
    }
  };

  const getBuildings = async () => {
    try {
      dispatch(getBuildingsRequest());
      const buildings = await RequestApi.getBuildings();
      dispatch(getBuildingsSuccess(transformBuildings(buildings)));
    } catch (err) {
      dispatch(getBuildingsFailure(err));
    }
  };

  const getCompanies = async (params) => RequestApi.filterCompanies(params);

  return {
    home,
    getHomeModules,
    setDeepLinkAction,
    getWeatherForecast,
    getDashboardStatistic,
    getBuildings,
    getCompanies: withLoadingAndErrorHandling(GET_COMPANIES, getCompanies),
  };
};

export default useHome;
