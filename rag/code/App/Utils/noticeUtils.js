import { noticeModalRef } from '../Components/NoticeModal';

export default {
  showError: (message, callback) => {
    noticeModalRef.current.setVisibleNotice({
      isSuccess: false,
      message,
      callback,
    });
  },
  showSuccess: (message, callback) => {
    noticeModalRef.current.setVisibleNotice({
      isSuccess: true,
      message,
      callback,
    });
  },
};
