/* @flow */
/* eslint no-bitwise: 1 */

export default (time: number) => {
  if (!time) return '0:00';
  // let mins = ~~(time / 60)
  // let secs = ~~(time % 60)

  // Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = ~~(time % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) ret += `${hrs}:${mins < 10 ? '0' : ''}`;

  ret += `${mins}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
};
