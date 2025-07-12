/**
 * Created by thienmd on 10/14/20
 */
import _ from 'lodash';
import { PAGE_SIZE } from '../../Config';

function getMaxPage(totalItem) {
  if (totalItem % PAGE_SIZE === 0) {
    return Math.floor(totalItem / PAGE_SIZE);
  }
  return Math.floor(totalItem / PAGE_SIZE) + 1;
}

export const defaultListModel = {
  data: [],
  isRefresh: false,
  isLoadMore: false,
  currentPage: 1,
  totalPage: 1,
};

export default class ListModel {
  constructor() {
    this.isLoadMore = false;
    this.isRefresh = true;
    this.currentPage = 1;
    this.data = [];
    this.totalPage = 1;
  }

  setPage(page) {
    this.currentPage = page;
    if (page === 1) {
      this.data = [];
      this.isRefresh = true;
      this.isLoadMore = false;
      return;
    }
    this.isLoadMore = true;
  }

  setData(payload) {
    const items = _.get(payload, 'items', []);
    const totalCount = _.get(payload, 'totalCount', 0);
    if (this.currentPage === 1) {
      this.data = [];
    }
    this.totalPage = getMaxPage(totalCount);
    this.data = this.data.concat(items);
    this.isRefresh = false;
    this.isLoadMore = false;
  }

  updateData(newData) {
    this.data = newData;
  }
}
