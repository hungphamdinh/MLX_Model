import _ from 'lodash';
import useInspection from '../../../../../Context/Inspection/Hooks/UseInspection';
import { InspectionOrderByColumn } from '../../../../../Config/Constants';
import useUser from '../../../../../Context/User/Hooks/UseUser';

function useOnlineInspectionList(keyword, selectedFilter, selectedSort, propertyId) {
  const {
    inspection: { onlineInspections },
    getInspectionsOnline,
    releaseInspection,
    pickUpInspection,
    deleteOnlineInspection,
    resetInspectionLocations,
  } = useInspection();

  const {
    user: { user },
  } = useUser();

  const release = (item) => {
    releaseInspection(item.parentId, item.id, true);
  };

  const pickUp = async (item) => {
    pickUpInspection(item.parentId, true);
  };

  const onRemovePress = async (item) => {
    deleteOnlineInspection(item.parentId);
  };

  const loadData = async (page = 1) => {
    const sortData = selectedSort.sortIds ? selectedSort.sortIds[0] : null;
    const typeIds = selectedFilter.typeIds;
    const params = {
      page,
      keyword,
      inspectionPropertyIds: propertyId ? [propertyId] : [],
      statusIds: selectedFilter.statusIds
        ? selectedFilter.statusIds.map((item) => parseInt(item, 10))
        : selectedFilter.statusIds,
      orderByColumn: 0,
      isDescending: true,
    };
    if (_.size(typeIds) === 1) {
      params.type = typeIds[0];
    }
    if (sortData) {
      params.orderByColumn = `${InspectionOrderByColumn[sortData.type]}`;
      params.isDescending = !sortData.isAsc;
    }

    // show all jobs in list if go from property detail
    getInspectionsOnline(params, !propertyId && user.id);
  };

  return { loadData, list: onlineInspections, onRemovePress, pickUp, release, resetInspectionLocations };
}

export default useOnlineInspectionList;
