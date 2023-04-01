'use strict';

import Locale from './locale.js';
import LanguageMenu from './language-menu/language-menu.js';
import UserLogin from './user-login/user-login.js';
import App from './app/app.js';

document.getElementsByTagName('body')[0]
  .appendChild(document.createElement('app-wrapper'));

await Locale.init(['./i18n/es.json', './i18n/en.json']);

customElements.define('app-wrapper',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <language-menu></language-menu>
        <user-login></user-login>
        <my-app></my-app>
      `;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
    userLogged(){
      this.login.remove();
      this.startApp();
    }
    startApp(){
      this.appendComponent('my-app', App);
    }
    connectedCallback(){
      this.languageMenu = this.appendComponent('language-menu', LanguageMenu);
      this.login = this.appendComponent('user-login', UserLogin);
      this.login.userIsLoggedCallback = this.userLogged.bind(this);
    }
    appendComponent(name, component){
      customElements.define(name, component);
      return this.shadowRoot.querySelector(name);
    }
  }
);

