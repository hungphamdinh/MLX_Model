import _ from 'lodash';
import { icons } from '../Resources/icon';
import SurveyDashboard from '../Screens/Survey/SurveyDashboard';
import EmployeeSurvey from '../Screens/Survey/EmployeeSurvey';
import ListPlainMaintenance from '../Screens/PlanMaintenance';
import MeterReading from '../Screens/MeterReading';
import QRCodeScreen from '../Screens/FeeReceipt/QRCodeScan';
import JobRequest from '../Screens/JobRequest';
import Feedback from '../Screens/Feedback';
import Inventory from '../Screens/Inventory';
import Delivery from '../Screens/DeliveryScreen';
import { DashboardStatisticTypes } from '../Config/Constants';
import Attendance from '../Screens/Attendance';
import Visitor from '../Screens/Visitor';
import HomeScreen from '../Screens/HomeScreen';
import Asset from '../Screens/Asset';
import TaskManagement from '../Screens/TaskManagement';
import Booking from '../Screens/Booking';

const getHomeModuleByModuleName = (auth) => {
  switch (auth.page) {
    case 'Pages.Delivery':
      return {
        key: 'Pages.Delivery',
        screen: 'delivery',
        component: Delivery,
      };
    case 'Pages.Plan.Maintenance':
      return {
        key: 'Pages.Plan.Maintenance',
        screen: 'plainMaintenance',
        component: ListPlainMaintenance,
      };
    case 'Pages.Survey':
      return {
        key: 'Pages.survey',
        screen: 'surveyDashboard',
        component: SurveyDashboard,
      };
    case 'Pages.Survey.Employee':
      return {
        key: 'Pages.Survey.Employee',
        screen: 'employeeSurvey',
        component: EmployeeSurvey,
      };
    case 'Pages.WorkOrdersV1':
      return {
        key: 'Pages.WorkOrderV1',
        screen: 'jobRequest',
        component: JobRequest,
      };
    case 'Pages.MRManagement':
      return {
        key: 'Pages.MRManagement',
        screen: 'meterReading',
        component: MeterReading,
      };
    case 'Pages.FeeStatement.FeeReceipt.CheckUniqueCode':
      return {
        key: 'Pages.FeeStatement.FeeReceipt.CheckUniqueCode',
        screen: 'feeReceipt',
        component: QRCodeScreen,
      };
    case 'Pages.Attendance':
      return {
        key: 'Pages.Attendance',
        screen: 'attendance',
        component: Attendance,
      };
    case 'Pages.Inventory':
      return {
        key: 'Pages.Inventory',
        screen: 'inventory',
        component: Inventory,
      };
    case 'Pages.Inspection':
      return {
        key: 'Pages.Inspection',
        screen: 'inspection',
      };
    case 'Pages.Feedback':
      return {
        key: 'Pages.Feedback',
        screen: 'feedback',
        component: Feedback,
      };
    case 'Pages.Visitors':
      return {
        key: 'Pages.Visitor',
        screen: 'visitor',
        component: Visitor,
      };
    case 'Pages.Plan.Maintenance.Asset':
      return {
        key: 'Pages.Plan.Maintenance.Asset',
        screen: 'asset',
        component: Asset,
      };

    case 'Pages.TaskManagement':
      return {
        key: 'Pages.TaskManagement',
        screen: 'taskManagement',
        component: TaskManagement,
      };

    case 'Pages.Bookings':
      return {
        key: 'Pages.Bookings',
        screen: 'booking',
        component: Booking,
      };
    default:
      return undefined;
  }
};

export const transformHomeModules = (auths) => {
  const homeModules = [
    {
      key: 'home',
      moduleName: 'home',
      screen: 'home',
      component: HomeScreen,
    },
  ];
  auths.forEach((auth) => {
    const homeModule = getHomeModuleByModuleName(auth);
    if (homeModule) {
      homeModules.push(homeModule);
    }
  });
  return homeModules;
};

const getModuleStatistic = (list, ...resolveCodes) => {
  const countStatus = (items) => items.reduce((acc, curr) => acc + curr.count, 0);
  const pendingItems = list.filter((item) => _.includes(resolveCodes, item.code) === false);
  const completedItems = list.filter((item) => _.includes(resolveCodes, item.code));
  return {
    pending: {
      count: countStatus(pendingItems, ...resolveCodes),
      filter: pendingItems.map((item) => item.id),
    },
    completed: {
      count: countStatus(completedItems, ...resolveCodes),
      filter: completedItems.map((item) => item.id),
    },
  };
};

export const transformDashboardStatistic = (
  { allJobRequest, myJobRequest, planMaintenance, teamPlanMaintenance, myPlanMaintenance, survey, teamJobRequest },
  permissions
) => {
  let data = [];
  if (_.includes(permissions, 'Pages.WorkOrdersV1')) {
    data = [
      {
        ...getModuleStatistic(allJobRequest, 'RESOLVED', 'COMPLETED', 'CANCELLED'),
        backgroundColor: '#E6F6F3',
        leftColor: '#F8885C',
        rightColor: '#87AD97',
        title: 'HOME_STATISTIC_PROJECT',
        itemName: 'HOME_STATISTIC_JOB_REQUEST',
        icon: icons.homeProject,
        statisticType: DashboardStatisticTypes.ALL_JR,
      },
      {
        ...getModuleStatistic(teamJobRequest, 'RESOLVED', 'COMPLETED', 'CANCELLED'),
        backgroundColor: '#E8F5FC',
        leftColor: '#F8885C',
        rightColor: '#87AD97',
        title: 'HOME_STATISTIC_MY_TEAM_JR',
        itemName: 'HOME_STATISTIC_JOB_REQUEST',
        icon: icons.homeMyTeamJR,
        statisticType: DashboardStatisticTypes.TEAM_JR,
      },
      {
        ...getModuleStatistic(myJobRequest, 'RESOLVED', 'COMPLETED', 'CANCELLED'),
        backgroundColor: '#FFF8FF',
        leftColor: '#F8885C',
        rightColor: '#87AD97',
        title: 'HOME_STATISTIC_MY_JR',
        itemName: 'HOME_STATISTIC_JOB_REQUEST',
        icon: icons.homeMyJR,
        statisticType: DashboardStatisticTypes.MY_JR,
      },
    ];
  }

  if (_.includes(permissions, 'Pages.Plan.Maintenance')) {
    data.push({
      ...getModuleStatistic(planMaintenance, 'CLOSED', 'CANCEL'),
      backgroundColor: '#E5F9EE',
      leftColor: '#F8885C',
      rightColor: '#87AD97',
      title: 'HOME_STATISTIC_ALL_PM',
      itemName: 'HOME_STATISTIC_ALL_PM',
      icon: icons.homeProject,
      statisticType: DashboardStatisticTypes.PLAN_MAINTENANCE,
    });
    data.push({
      ...getModuleStatistic(teamPlanMaintenance, 'CLOSED', 'CANCEL'),
      backgroundColor: '#E8F5FC',
      leftColor: '#F8885C',
      rightColor: '#87AD97',
      title: 'HOME_STATISTIC_MY_TEAM_PM',
      itemName: 'HOME_STATISTIC_MY_TEAM_PM',
      icon: icons.homeMyTeamJR,
      statisticType: DashboardStatisticTypes.TEAM_PM,
    });
    data.push({
      ...getModuleStatistic(myPlanMaintenance, 'CLOSED', 'CANCEL'),
      backgroundColor: '#FFF8FF',
      leftColor: '#F8885C',
      rightColor: '#87AD97',
      title: 'HOME_STATISTIC_MY_PM',
      itemName: 'HOME_STATISTIC_MY_PM',
      icon: icons.homeMyJR,
      statisticType: DashboardStatisticTypes.MY_PM,
    });
  }

  if (_.includes(permissions, 'Pages.Survey.Employee')) {
    data.push({
      completed: {
        count: survey.find((item) => item.status.name === 'Submitted').count,
        filter: true,
      },
      pending: {
        count: survey.find((item) => item.status.name === 'NotSubmitted').count,
        filter: false,
      },
      backgroundColor: '#DFE7EC',
      leftColor: '#F8885C',
      rightColor: '#87AD97',
      title: 'HOME_STATISTIC_SURVEY',
      itemName: 'HOME_STATISTIC_SURVEY',
      icon: icons.homeSurvey,
      statisticType: DashboardStatisticTypes.SURVEY,
    });
  }
  return data;
};

export const transformBuildings = (data) => {
  const buildings = _.map(data, (building) => ({
    name: building.buildingCode,
    id: building.id,
  }));
  return _.sortBy(buildings, 'name');
};
