import { getSVG } from "../function.js";

/*
this class declares an audio input. 
requirements are to provide 
instantiate an element this way

 <t-bs-image-input
    name='ephraim'
    id="ojone"
    errormessage="{{ $userJson }}"
    required
    width="500"
></t-bs-image-input>
*/
export default class ThrinkleButton extends HTMLElement {
    static formAssociated = true;//needed for form elements
	static observedAttributes = ["value","disabled","type","name","margin","label","icon","kind","id"];
    
    constructor() {        
        super();
        this._internals = this.attachInternals();//need for form elements
        this._initialized = false;   
        this.role='button';
        
        this.radius = 5;
        if(this.hasAttribute('radius')){
            this.radius = this.getAttribute('radius');
        }
        this.width = null;
        if(this.hasAttribute('width')){
            this.width = this.getAttribute('width');
        }     
        if(this.label){
            this.labelText = this.label;
        }     
        if(this.hasAttribute('label')){
            this.labelText = this.getAttribute('label');
        }  
        if(this.hasAttribute('type')){
            this.type = this.getAttribute('type').toLowerCase();
        }
        if(this.hasAttribute('kind')){
            this.kind = this.getAttribute('kind').toLowerCase();
        }          
        this.disabled = false;// this is disabled by default
        if(this.hasAttribute('disabled')){
            this.disabled = true;
        }
        
    }
    attributeChangedCallback(name, oldValue, newValue) {
       if(oldValue == newValue) return;
        switch (name) {
			case 'value':
                //set form value, this value is used for form related operations
                if(this.button?.value) {
                    this.button.value = newValue;
                }
                this.updateFormValue(newValue)
				break ;
			case 'type':
                //set form type, this type is used for form related operations
                if(this.button?.type){
                    this.button.type = newValue;
                }                
				break ;
			case 'kind':
                //set form kind, this kind is used for form related operations
                if(this.button) {
                    this.button.classList.add(`thrinkle-btn-${newValue}`);
                }
				break ;
			case 'name':
                //set form name, this name is used for form related operations
                if(this.button?.name) {
                    this.button.name = newValue;
                }
				break;
			case 'id':
                //set form name, this name is used for form related operations
                if(this.button?.id) {
                    this.button.id = newValue;
                }
				break;
			case 'margin':
                //set form name, this name is used for form related operations
                this.style.margin = newValue;
				break ;
			case 'label':
                //set form name, this name is used for form related operations
                if(this.labelTextElem){
                    this.labelTextElem = newValue;
                }                
				break ;
            case 'disabled':
                if(!this.hasAttribute('disabled')){
                    this._internals.ariaDisabled = 'false';
                    this.button.disabled = false;
                }else{
                    this._internals.ariaDisabled = 'true';
                    this.button.disabled = true;
                }
		}
	}
    updateFormValue(value){
        // updates the value of the form element
        value = this.hasAttribute('trimmed') ? value.trim() : value;
        this._internals.setFormValue(value);
    }
    /* setup the getters and setters of this custom element */
    get form() { return this._internals.form;}//needed for form elements
    get name() { return this.getAttribute('name');}//needed for form elements
    set name(val) { this.setAttribute('name',val);}//needed for form elements
    get id() { return this.getAttribute('id');}//needed for form elements
    set id(val) { this.setAttribute('id',val);}//needed for form elements
    get type() { return this.getAttribute("type");}//needed for form elements
    set type(val) { this.setAttribute('type',val);}//needed for form elements
    get value(){ return this.button.value;}//needed for form elements
    set value(val){this.setAttribute('value',val);}//needed for form elements
    get label(){ return this.labelText;}//needed for form elements
    set label(val){
        this.setAttribute('label',val);
    }//needed for form elements
    get icon(){ return this.getAttribute("icon");}//needed for form elements
    set icon(val){
        this.setAttribute('icon',val);
    }
    get kind(){ return this.getAttribute("kind");}//needed for form elements
    set kind(val){
        this.setAttribute('kind',val);
    }
    set margin(val){this.setAttribute('margin',val);}//needed for form elements
    
    connectedCallback(){
        if(this._initialized) return;
        this._initialized = true;
        // Your custom element initialization logic here
        // keep this element invisible till css is fully loaded
        this.setAttribute('data-thrinkle-loading', '');
        // create the buttons container
        this.classList.add( 
            "thrinkle-button-container"
        );
        if(this.marginLeft){
            this.style.marginLeft = this.marginLeft;
        }
        if(this.hasAttribute('margin-left')){
            this.style.marginLeft = this.getAttribute('margin-left');
        }
        // create the button
        this.button = document.createElement('button');
        this.button.type = this.type;
        this.button.disabled = this.disabled;
        
        this.button.style.width = this.width ? this.width : 'fit-content';
        this.button.style.borderTopLeftRadius = `${this.radius}px`;
        this.button.style.borderTopRightRadius = `${this.radius}px`;
        this.button.style.borderBottomRightRadius = `${this.radius}px`;
        this.button.style.borderBottomLeftRadius = `${this.radius}px`;
        this.button.classList.add(
            "thrinkle-btn",
            `thrinkle-btn-${this.kind}`
        );
        this.button.id = this.hasAttribute('id') ? this.getAttribute('id') : `button_${Date.now()}`;
        this.button.name = this.hasAttribute('name') ? this.getAttribute('name') : `button_name_${Date.now()}`;
        this.iconDiv = document.createElement('div');
        this.iconDiv.style.display = 'flex';
        this.iconDiv.style.alignItems = 'center';
        if(this.icon){
            this.iconDiv.innerHTML = getSVG(this.icon.toLowerCase());
        }
        if(this.hasAttribute('icon')){
            if(this.labelText){
                this.iconDiv.classList.add('thrinkle-mr-2');
            }
            this.iconDiv.innerHTML = getSVG(this.getAttribute('icon').toLowerCase());
        }  
        if(this.icon || this.hasAttribute('icon')){
            if(this.labelText){
                this.iconDiv.classList.add('thrinkle-mr-2');
            }
            this.button.appendChild(this.iconDiv);
        }      
        if(this.labelText){
            this.labelTextElem = document.createTextNode(`${this.labelText}`);
            this.button.appendChild(this.labelTextElem);
        }        
        this.appendChild(this.button);
        
        
        const style = document.createElement('style');
        style.setAttribute('id','thrinkle_button')
        this.css = ` 
            .thrinkle-button-container{
                display: flex;
                align-items: center;
                width: fit-content;
                height: fit-content;
                padding 0;
                margin-top: 5px;
                margin-bottom: 5px;
                margin-left: 10px;
                margin-right: 5px;
            }           
            .thrinkle-btn{
                display: flex;
                align-items: center;
                justify-content: center;
                outline: none;
                border: 0;
                padding: 10px;
                cursor: pointer;
                min-height: 2rem;
                font-size: 0.875rem;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                
            }
            .thrinkle-btn-primary{
                background-color: oklch(0.587 0.193 252);
                color: white;
            }
            .thrinkle-btn-primary:hover{
                background-color: oklch(0.487 0.193 252);
                transition: background-color 0.3s ease;
            }
            .thrinkle-btn-danger{
                background-color: oklch(0.587 0.258 29.234);
                color: white;
            }
            .thrinkle-btn-danger:hover{
                background-color: oklch(0.487 0.258 29.234);
                transition: background-color 0.3s ease;
            }
            .thrinkle-btn-warning{
                background-color: oklch(0.844 0.172 84.934);
                color: black;
            }
            .thrinkle-btn-warning:hover{
                background-color: oklch(0.744 0.172 84.934);
                transition: background-color 0.3s ease;
            }
            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-button[data-thrinkle-loading] {
                display: none;
            }
        `;
        style.textContent = this.css;
        if(!document.head.querySelector("style#thrinkle_button")){
            document.head.appendChild(style);
        }
        window.addEventListener('thrinkle-styles-loaded', function(e) {
            // remove the loading attribute to show the alert
            this.removeAttribute('data-thrinkle-loading');
            
        }.bind(this), true);
    }
}