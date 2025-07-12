import useInspection from '../../../../../Context/Inspection/Hooks/UseInspection';
import useUser from '../../../../../Context/User/Hooks/UseUser';

function useOfflineInspectionList(keyword, selectedFilter, selectedSort, propertyId) {
  const {
    inspection: { inspections },
    getInspections,
    getInspectionFormDetail,
    releaseInspection,
    resetInspectionLocations,
    deleteInspection,
  } = useInspection();

  const {
    user: { user },
  } = useUser();

  const release = (item) => {
    releaseInspection(parseInt(item.parentId, 10), item.id, true);
  };

  const onRemovePress = async (item) => {
    const formData = await getInspectionFormDetail(item, user);
    if (formData) {
      deleteInspection(item, formData);
    }
  };

  const loadData = async (page = 1) => {
    const params = {
      page,
      keyword,
      statusIds: selectedFilter.statusIds,
      propertyId: propertyId && `${propertyId}`,
      typeIds: selectedFilter.typeIds,
    };

    if (selectedSort.sortIds) {
      params.sortData = selectedSort.sortIds[0];
    }
    getInspections(params);
  };

  return { loadData, list: inspections, onRemovePress, release, pickUp: () => {}, resetInspectionLocations };
}

export default useOfflineInspectionList;
