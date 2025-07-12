import _ from 'lodash';
import I18n from '@I18n';

export function transformListAsset(assets) {
  return _.map(assets, (item) => {
    const locationName = item.location?.name || I18n.t('ASSET_NO_LOCATION');
    const assetLocationName = `${item.assetName} (${locationName})`;

    return {
      ...item,
      assetLocationName,
    };
  });
}
