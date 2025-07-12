/* @flow */

export default (time: number = 500, data: any = 'resolve_data') => new Promise(resolve => setTimeout(() => resolve(data), time));
