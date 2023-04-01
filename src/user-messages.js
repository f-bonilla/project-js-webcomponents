class UserMessages extends HTMLElement{
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host{
          display: block;
        }
        #notice{
          margin: 10px;
        }
      </style>
      <div id="notice"></div>
    `;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.notice = shadow.querySelector('#notice');
    this.noticeTimeout;
  }
  show(message, props={}){
    clearTimeout(this.noticeTimeout);
    this.notice.textContent = message;
    this.noticeTimeout = window.setTimeout(()=>{
      this.notice.textContent = '';
    }, 3000);
  }
  connectedCallback(){}
  disconnectedCallback(){
    clearTimeout(this.noticeTimeout);
	}
}

export default UserMessages;
