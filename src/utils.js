const getUniqueId = (()=>{
  const ids = [];
  return function get(){
    const result = (new Date().getTime()).toString(36).toUpperCase();
    if (ids[result]){
      return get();
    }else{
      ids[result] = true;
      return result;
    }  
  };
})();

const background1 = '#'+'477b28';
const color1= 'white';
const background2 = '#'+'62ab37';
const color2= 'white';
const background3 = '#'+'61ff7e';
const color3= 'black';
const background4 = '#'+'a6ebc9';
const color4= 'black';
const logStyles = [
  `color:${color1};background-color:${background1};padding:3px;font-weight:bold;`,
  `color:${color2};background-color:${background2};padding:3px;`,
  `color:${color3};background-color:${background3};padding:3px;`,
  `color:${color4};background-color:${background4};padding:3px;`,
];
const infoStyles = [
  `color:black;background-color:lightskyblue;padding:3px;font-weight:bold;`,
  `color:${color2};background-color:${background2};padding:3px;`,
  `color:${color3};background-color:${background3};padding:3px;`,
  `color:${color4};background-color:${background4};padding:3px;`,
];
const warnStyles = [
  `color:black;background-color:yellow;padding:3px;font-weight:bold;`,
  `color:${color2};background-color:${background2};padding:3px;`,
  `color:${color3};background-color:${background3};padding:3px;`,
  `color:${color4};background-color:${background4};padding:3px;`,
];
const errorStyles = [
  `color:${color1};background-color:red;padding:3px;font-weight:bold;`,
  `color:${color2};background-color:${background2};padding:3px;`,
  `color:${color3};background-color:${background3};padding:3px;`,
  `color:${color4};background-color:${background4};padding:3px;`,
];
const print = (titles, style, msg, logType)=>{
  const header = logType !== 'log' ? '%cLog:'+logType.toUpperCase() : '%cLog';
  const title = [header, ...titles];
  const msgStyle = title.map((element, index)=>style[index]);
  console.log(title.join('%c'), ...msgStyle, msg);
};
const log = (msg, ...title)=>print(title, logStyles, msg, 'log');
const info = (msg, ...title)=>print(title, infoStyles, msg, 'info');
const warn = (msg, ...title)=>print(title, warnStyles, msg, 'warn');
const error = (msg, ...title)=>print(title, errorStyles, msg, 'error');
const group = (id)=>console.group(id);
const groupEnd = (id)=>console.groupEnd(id);
const logger = (function(){
  return {log, info, warn, error, group, groupEnd}
})();

const isEmail = email=>/\S+@\S+\.\S+/g.test(email);
export {getUniqueId, logger, isEmail};