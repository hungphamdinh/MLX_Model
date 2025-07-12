export default (txt: number) => {
    let str = txt.match(/\d+/g, "") + '';
    let a = str.split('.').join('');
    let s = a.split(',').join('');
    return Number(s);
};

