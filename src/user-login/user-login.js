import {logger, getUniqueId, isEmail} from '../utils.js';
import Locale from '../locale.js';
import FileManager from '../file-manager.js';
import UserMessages from '../user-messages.js';

const ID = getUniqueId();

const userLogin = (email, password)=>email==='guest@domain.com' && password === 'guest';
const checkForm = email=>isEmail(email);

class UserLogin extends HTMLElement{
	constructor(){
		super();
	}
	updateLang(){
		Locale.update(this.shadow.querySelectorAll('[data-lang]'));
	}
	onDivClick(e){
		e.preventDefault();
		if(!checkForm(this.email.value)){
			return this.userMessages.show(Locale.get('email_ko'));
		}
		if(!userLogin(this.email.value, this.password.value)){
			return this.userMessages.show(Locale.get('login_ko'));
		}
		this.userIsLoggedCallback();
	}
	addListeners(){
		this.submitFormListener = this.onDivClick.bind(this);
		this.submitForm.addEventListener('click', this.submitFormListener);
	}
	removeListeners(){
		this.submitForm.removeEventListener('click', this.submitFormListener);
	}
	connectedCallback(){
		(async ()=>{
			const template = await FileManager.getHtml('./src/user-login/user-login.html');
			this.shadow = this.attachShadow({mode: 'open'});
			this.shadow.appendChild(template.content.cloneNode(true));
			Locale.suscribe(ID, this.updateLang.bind(this));
			this.userMessages = this.appendComponent('user-messages', UserMessages);
			this.email = this.shadow.querySelector('#email');
			this.password = this.shadow.querySelector('#password');
			this.submitForm = this.shadow.querySelector('#submit-form');
			this.addListeners();
		})();
	}
	disconnectedCallback(){
		this.removeListeners();
		Locale.unsuscribe(ID);
	}
	static get observedAttributes(){
		return [];
	}
	attributeChangedCallback(){
	}
	appendComponent(name, component){
		customElements.define(name, component);
		return this.shadowRoot.querySelector(name);
	}
};

export default UserLogin;
