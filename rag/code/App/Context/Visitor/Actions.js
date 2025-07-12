import { generateAction } from '../../Utils/AppAction';

export const ADD_VISITOR = generateAction('visitor/ADD_VISITOR');
export const EDIT_VISITOR = generateAction('visitor/EDIT_VISITOR');
export const TRACKING_VISITOR = generateAction('visitor/TRACKING_VISITOR');
export const DETAIL_VISITOR = generateAction('visitor/DETAIL_VISITOR');
export const GET_VISITOR_REASONS = generateAction('visitor/GET_VISITOR_REASONS');
export const GET_ALL_VISITORS = generateAction('visitor/GET_ALL_VISITORS');
export const SCAN_QR_VISITOR = generateAction('visitor/SCAN_QR_VISITOR');
export const DEACTIVATE_VISITOR = generateAction('visitor/DEACTIVATE_VISITOR');
