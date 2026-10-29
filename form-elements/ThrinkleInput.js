import { getSVG } from "../function.js";
/**
 * @element thrinkle-input
 * @summary it's a self-contained styled input component
 * @attr {string} id - a unique identifier for this component
 * @attr {string} name - a name given to the component, this is important for form operations
 * @attr {string} label - the visible description/title of the input component
 * @attr {string} placeholder - a text that describes the nature of the value required, it is only visible when no value is passed
 * @attr {string} [text|email|password|number|] type - defines the type of the input component to be displayed
 * @attr {string} value - defines the value of the component. This is the value passed to the serve during a form submission routine
 * @attr {boolean} rounded - when present defines makes the left and right ends of the component rounded
 * @attr {string} lefticon - Any lucide icon name. Defines the icon to be displayed to the left of the component
 * @attr {string} righticon - Any lucide icon name. Defines the icon to be displayed to the right of the component
 * @attr {boolean} icon - When present displays icons based on the corresponding input type
 */
export default class ThrinkleInput extends HTMLElement {
    static formAssociated = true;//needed for form elements
	static observedAttributes = ["value","disabled","label"];
    constructor() {
        super();
        /*set up this custom element attributes*/
        this._internals = this.attachInternals();//need for form elements
        this._initialized = false;   
    }
    /* setup the getters and setters of this custom element */
     
    /* setup the getters and setters of this custom element */
    get form() { return this._internals.form;}//needed for form elements
    get name() { return this.getAttribute('name');}//needed for form elements
    get type() { return 'ThrinkleInputElement';}//needed for form elements
    get value(){ return this.input.value;}//needed for form elements
    set value(val){this.setAttribute('value',val);}//needed for form elements
    
	updateFormValue(value){
        // updates the value of the form element
        this._internals.setFormValue(value);
    }

    validatePassword(password) {
        let score = 0;

        // Check password length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Check character types
        if (/[a-z]/.test(password)) score++;       // Lowercase
        if (/[A-Z]/.test(password)) score++;       // Uppercase
        if (/[0-9]/.test(password)) score++;       // Number
        if (/[^a-zA-Z0-9\s]/.test(password)) score++; // Special character

        // Categorize password
        if (score <= 3) {
            return "Weak";
        } else if (score <= 5) {
            return "Strong";
        } else {
            return "Excellent";
        }
    }
	attributeChangedCallback(name, oldValue, newValue) {
       if(oldValue == newValue) return;
        switch (name) {
			case 'value':
                //set form value, this value is used for form related operations
                if(this.input?.value) {
                    this.input.value = newValue;
                }
                this.updateFormValue(newValue)
				break ;
            case 'disabled':
                if(!this.hasAttribute('disabled')){
                    this._internals.ariaDisabled = 'false';
                    this.input.disabled = false;
                }else{
                    this._internals.ariaDisabled = 'true';
                    this.input.disabled = true;
                }
		}
	}
    formResetCallback() {
        // Reset to the initial value.
        // This assumes you store the initial value separately.
        const initialValue = this.getAttribute('value') ?? '';

        this.input.value = initialValue;
        this.updateFormValue(initialValue);
    }

    formDisabledCallback(disabled) {
        this.input.disabled = disabled;
        this._internals.ariaDisabled = String(disabled);
    }	
    connectedCallback() {  
        if(this._initialized) return;
        this._initialized = true;
        // Your custom element initialization logic here
        // keep this element invisible till css is fully loaded
        this.setAttribute('data-thrinkle-loading', '');
        

    	this.classList.add("thrinkle-input-group");
        /*setup this custom element attributes*/
		this.label = document.createElement("label");
    	this.label.classList.add("thrinkle-input-label");
        this.label.role = "presentation";

        //setup css classes
        
        const radius = this.hasAttribute('rounded') ? 9999 : 7;
        const padding = 5;

        if(this.hasAttribute('labelstyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.label.className=this.getAttribute('labelstyle');
            }else{
                this.label.classList.add(this.getAttribute('labelstyle'))
            }
        }
        if(this.hasAttribute('labelinlinestyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.label.style.cssText =this.getAttribute('labelinlinestyle')
            }else{
                this.label.style.cssText += `; ${this.getAttribute('labelinlinestyle')}`;
            }
        }

        this.input = document.createElement('input');
        this.input.value = this.hasAttribute('value') ? this.getAttribute('value') : ''; 
        this.input.placeholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : (this.getAttribute('label')||''); 
        this._internals.ariaPlaceholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : (this.getAttribute('label')||''); 
        
        this.input.addEventListener('input', (e)=>{
            this.updateFormValue(e.target.value);
        });

        this.input.classList.add('thrinkle-input')
        
        
        if(this.hasAttribute("type")){
            this._internals.role = this.getAttribute("type");
            this.input.type = this.getAttribute("type");
        }else{
            this._internals.role = 'text';
        }
        this.input.id = `thrinkle-input-${Date.now()}`;
        this.label.htmlFor = this.input.id;
        this.label.textContent = this.getAttribute('label') || '';
        if(this.hasAttribute('disabled')){
            this._internals.ariaDisabled = 'true';
            this.input.disabled = true;
        }
		this.appendChild(this.label);
        this.thrinkleInputContainer = document.createElement('div');
        this.thrinkleInputContainer.classList.add('thrinkle-input-container');

        this.thrinkleLeftIconDiv = document.createElement('div');        
        this.thrinkleRightIconDiv = document.createElement('div');
        // create icon based on the component type
        let defaultLeftIcon = false;
        let defaultRightIcon = false; 
        if(this.hasAttribute('icon')){
            switch (this.getAttribute('type').toLowerCase()) {
                case 'password':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('shield-check');
                    this.thrinkleRightIconDiv.innerHTML = getSVG('eye');
                    this.thrinkleRightIconDiv.style.cursor = "pointer";
                    this.thrinkleRightIconDiv.addEventListener('click',(e)=>{
                        if(this.input.type === 'password'){
                            this.input.type = 'text';
                            this.thrinkleRightIconDiv.innerHTML = getSVG('eye-off');
                        }else{
                            this.input.type = 'password';
                            this.thrinkleRightIconDiv.innerHTML = getSVG('eye');
                        }
                        
                    });
                    this.input.addEventListener('input',(e)=>{
                        console.log(this.validatePassword(this.input.value));                        
                    });
                    defaultLeftIcon = true;
                    defaultRightIcon = true; 
                    break;
                case 'email':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('mail');
                    defaultLeftIcon = true; 
                    break;
                case 'search':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('search');
                    defaultLeftIcon = true;
                    break;
                case 'url':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('link');
                    defaultLeftIcon = true; 
                    break;
                case 'numeric':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('arrow-up-0-1');
                    defaultLeftIcon = true;
                    break;
                case 'tel':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('phone');
                    defaultLeftIcon = true; 
                    break;
                case 'date':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('calendar-days');
                    defaultLeftIcon = true; 
                    break;
                case 'text':
                default:
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('case-sensitive');
                    defaultLeftIcon = true; 
                    break;
            }
                
        }
        
        // if left icon is provided this overrides the default icon
        if(this.hasAttribute('lefticon')){                
            this.thrinkleLeftIconDiv.innerHTML = getSVG(this.getAttribute('lefticon').toLowerCase());
        }

        this.thrinkleInputDiv = document.createElement('div');
        this.thrinkleInputDiv.classList.add('thrinkle-input-div');
        this.thrinkleInputDiv.appendChild(this.input);

        // if right icon is provided this overrides the default icon
        if(this.hasAttribute('righticon')){
            this.thrinkleRightIconDiv.innerHTML = getSVG(this.getAttribute('righticon').toLowerCase());
        }

        // attach the left icon to the DOM
        if(this.hasAttribute('leftticon') || defaultLeftIcon){
            this.thrinkleLeftIconDiv.classList.add('thrinkle-left-icon-div');
            this.thrinkleInputContainer.appendChild(this.thrinkleLeftIconDiv);
        }
        // attach the input to the DOM
        this.thrinkleInputContainer.appendChild(this.thrinkleInputDiv);
        // attach the right icon to the DOM
        if(this.hasAttribute('righticon') || defaultRightIcon){
            this.thrinkleRightIconDiv.classList.add('thrinkle-right-icon-div');
            this.thrinkleInputContainer.appendChild(this.thrinkleRightIconDiv);
        }

        this.appendChild(this.thrinkleInputContainer);
		/*bundle css object*/
		const style = document.createElement('style');
		style.setAttribute('id','thrinkle_input')
		this.css = `
		/* Style for the input component */
			.thrinkle-input-group{
				display: block;
				position: relative;
                border-top-left-radius: ${radius}px;
                border-bottom-left-radius: ${radius}px;
                border-top-right-radius: ${radius}px;
                border-bottom-right-radius: ${radius}px;
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
                padding: 5px;
				margin: 5px;
			}           
			
			.thrinkle-input-label{
				display: block;
				position: relative;
                color: oklch(20% 0 0);
				font-size: 0.875rem;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                font-weight: 500;
				width: fit-content;
			}

            .thrinkle-input-container{   
                display: flex;
                flex-direction: row;  
                align-items: center; 
                margin: 0px;
                margin-top: 5px;
                padding-left: ${padding}px;  
                padding-right: ${padding}px;
                padding-top: 2px;
                padding-bottom: 2px;        
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
                border-top-left-radius: ${radius}px;
                border-bottom-left-radius: ${radius}px;
                border-top-right-radius: ${radius}px;
                border-bottom-right-radius: ${radius}px;
                border-color: oklch(0.811 0.02 256);
            }
            .thrinkle-input-container:focus-within{				
                font-weight: bold;     
                box-shadow: 0px 0px 2px 4px oklch(from oklch(0.811 0.02 256) l c h/0.35);         
			}
            .thrinkle-left-icon-div,
            .thrinkle-right-icon-div{ 
                display: flex;
                align-items: center;               
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
                height: 1.2rem;
                width: 1.2rem;  
            }
            .thrinkle-left-icon-div{
                margin-left: ${padding}px;            
            }
            .thrinkle-right-icon-div{
                margin-right: ${padding}px;            
            }
            .thrinkle-left-icon-div svg,
            .thrinkle-right-icon-div svg{
                stroke: oklch(0.811 0.02 256);
            }
            
            .thrinkle-left-icon-div:hover,
            .thrinkle-right-icon-div:hover{
                border-radius: 9999px;
                background-color: oklch(0.811 0.02 256/0.2);
            }
            .thrinkle-input-div{
                display: flex;
                align-items: center; 
                flex: 1;               
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
            }
            .thrinkle-input{
                color: oklch(20% 0 0);                
                border-top-left-radius: ${radius}px;
                border-bottom-left-radius: ${radius}px;
                border-top-right-radius: ${radius}px;
                border-bottom-right-radius: ${radius}px;
                outline-color: transparent;    
                border-style: solid;
                border-width: 1px;
                border-color: transparent;
                font-size: 0.875rem;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                margin: 0px;
                padding: 5px;
                height: 100%;
                width: 100%;
            }
			
            
            
            
			/*disabled state*/
            
            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-input-group[data-thrinkle-loading] {
                display: none;
            }
		`;
		style.textContent = this.css;
		if(!document.head.querySelector("style#thrinkle_input")){
			document.head.appendChild(style);
		}
		/*bundle css object*/
        

        window.addEventListener('thrinkle-styles-loaded', function(e) {
            // remove the loading attribute to show the alert
            this.removeAttribute('data-thrinkle-loading');
            
        }.bind(this), true);
	}	
	disconnectedCallback() {
		// console.log("Custom element removed from page.");
        // window.removeEventListener('thrinkle-styles-loaded')
	}	
	adoptedCallback() {
		// console.log("Custom element moved to new page.");
	}
}