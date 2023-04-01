import {logger} from './utils.js';
import FileManager from './file-manager.js';

const translate = list=>{
  const elements = list || document.querySelectorAll('[data-lang]');
  elements.forEach(element=>element.textContent=Locale.get(element.getAttribute('data-lang')));
};
const Locale = (()=>{
  const subscribers = {};
  const languages = {};
  let language;
  return {
    currentLang: ()=>language,
    init: async (languageFiles, defaultLang)=>{
      language = defaultLang || (navigator.language || navigator.userLanguage).split('-')[0];
      const files = await FileManager.getJsonFiles(languageFiles);
      files.forEach(file => Object.assign(languages, { ...file }));
      translate();
    },
    get: (key)=>{
      if (!languages[language][key]) return '{{'+key+'}}';
      return languages[language][key];
    },
    suscribe: (id, componentCallback)=>{
      subscribers[id] = componentCallback;
      componentCallback();
    },
    unsuscribe: id=>{
      delete subscribers[id];
    },
    change: (incomingLang)=>{
      if(!languages[incomingLang]){
        return logger.error(languages[language]['lang_not_available'].replace('{{lang}}', incomingLang));
      }
      if(incomingLang !== language){
        language = incomingLang;
        for(let subscriber in subscribers){
          subscribers[subscriber]();
        }
      }
    },
    update: elements=>translate(elements),
  }
})();

export default Locale;
