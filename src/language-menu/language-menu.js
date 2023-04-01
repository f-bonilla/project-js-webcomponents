import {logger, getUniqueId} from '../utils.js';
import Locale from '../locale.js';
import FileManager from '../file-manager.js';

class LanguageMenu extends HTMLElement{
	constructor(){
		super();
		this.ID = getUniqueId();
	}
	updateLang(){
		Locale.update(this.shadow.querySelectorAll('[data-lang]'));
	}
	addListeners(){
		this.shadow.querySelector('select').addEventListener('change', e=>{
			Locale.change(e.target.value);
		});
	}
	removeListeners(){}
	connectedCallback(){
		(async ()=>{
			const template = await FileManager.getHtml('./src/language-menu/language-menu.html');
			this.shadow = this.attachShadow({mode: 'open'});
			this.shadow.appendChild(template.content.cloneNode(true));
			Locale.suscribe(this.ID, this.updateLang.bind(this));
			this.addListeners();
		})();
	}
	disconnectedCallback(){
		this.removeListeners();
		Locale.unsuscribe(this.ID);
	}
	static get observedAttributes(){
		return [];
	}
	attributeChangedCallback(name, oldValue, newValue){
	}
};

export default LanguageMenu;

