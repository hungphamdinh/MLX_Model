import Geolocation from '@react-native-community/geolocation';
import { modal } from './index';

export const getCurrentLocation = (callBack, setLoading = () => {}) => {
    setLoading(true);
    Geolocation.getCurrentPosition(
        ({ coords }) => {
            callBack(coords);
            setLoading(false);
        },
        (err) => {
            callBack(null);
            modal.showError(err.message);
            setLoading(false);
        },
        {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 30000,
          }
    );
};
