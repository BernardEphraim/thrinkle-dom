/**
 * working thrinkle switch class written on the 19/10/2023 by Bernard Ephraim
 * ThrinkleSwitch element is a toggle switch that can be used as a normal toggle switch within and outside
 * an HTML form element
 * Declared form:
 * <thrinkle-switch 
        name="switch1"
        id="switch1"
        onclick="setSystemState" 
        onstatelabel="Server" 
        offstatelabel="Reciever" 
        onstatevalue="1" 
        offstatevalue="0"
        value="0"
        state=
    ></thrinkle-switch>
 *  Internal structure:
    <div class="thrinkle-switch-container">
		<div class="thrinkle-toggle-container">
			<div class="thrinkle-toggle-handle"></div>
		</div>
		<div class="thrinkle-switch-label"></div>
	</div>
 *   
 *   the snippet above describes the html structure of the thrinkle toggle switch implementation
 * 	@method onclick (optional) - takes the reference to an event handler (note arguments should not be passed)
	@property onstatelabel (optional) - label for the switch's on state
	@property offstatelabel (optional) - label for the switch's off state 
	@property onstatevalue (optional) - the value of the switch's on state
	@property offstatevalue (optional) - the value of the switch's off state
	@property value (optional) - the value of the current state of the switch. If switch is in the on state, this takes on the data-onstatevalue
	@property oldvalue (optional) - the value of the previous state of the switch. This is useful when there is a change in state and there is need to revert back to the previous state
	@property state (optional) - can either be on or off, indicates the current state of the switch. Null values evaluate to the off state
	@property buttonstyle (optional) - accepts a valid css class for styling the swtich button. Note: when provided, it overrides the default style
	@property buttoncontainerstyle (optional) - accepts a valid css class for styling the swtich button container. Note: when provided, it overrides the default style
	@property switchlabelstyle (optional) - accepts a valid css class for styling the swtich label. Note: when provided, it overrides the default style
	@property switchcontainerstyle (optional) - accepts a valid css class for styling the swtich's outermost container. Note: when provided, it overrides the default style
	@property replacestyle - can either be true or false, indicates whether the user provided css classes should replace the default css class. true replaces, false appends
    @method getValue(el) - function- takes one argument el which can be any member of the switch tree: gets the current value of the switch
	@method getOldValue(el) - function- takes one argument el which can be any member of the switch tree: gets the previous value of the switch before the change of state
	@method setValue(el,val) - function- takes two arguments el which can be any member of the switch tree and val the value: sets the current value of the switch
	@method setOldValue(el,val) function- takes two arguments el which can be any member of the switch tree and val the value: sets the previous value of the switch
 */
export default class ThrinkleSwitch extends HTMLElement {
    static formAssociated = true;//needed for form elements
	static observedAttributes = ["value","disabled"];
    constructor() {
        super();
        /*set up this custom element attributes*/
        this._internals = this.attachInternals();//need for form elements
        this._internals.role = 'switch';

        // Your custom element initialization logic here
		this.setAttribute("role","switch");
        this.setAttribute("tabIndex","0");
        if(this.hasAttribute('disabled')){
            this._internals.ariaDisabled = 'true';
        }
        this.setAttribute('type','switch-button')
        if(!this.hasAttribute('onstatevalue')){
            this.setAttribute('onstatevalue','');
        }
        if(!this.hasAttribute('offstatevalue')){
            this.setAttribute('offstatevalue','');
        }
        if(!this.hasAttribute('onstatelabel')){
            this.setAttribute('onstatelabel','');
        }
        if(!this.hasAttribute('offstatelabel')){
            this.setAttribute('offstatelabel','');
        }

        //add the click event listener on the toggleButton function
        this.addEventListener('click',this.toggleValue,true); 
        //add the keypress event listener on the parent container to and tab focus and enter
        //keypress execute similar action as click would
        this.addEventListener('keypress',this.toggleKeypress,true); 
		
        //bind to external handlers if provided
        if(this.hasAttribute('onclick')){
            // Convert the string to a function reference
            let onclk = window[this.getAttribute('onclick')];
            // Check if the function exists
            if (typeof onclk === 'function') {	
                // Creating a custom event
                const myClickEvent = new CustomEvent('myClickEvent');	
                this.addEventListener('myClickEvent',function(e) {
                    e.preventDefault();
                    //attach the external onclick handler here
                    //this enables us pass a custom event argument that has the 
                    //this custom element as the target
                    onclk(e)
                }.bind(this),true);   

                //add the click event listener on the custom function
				//return as argument the instance of this object
                this.addEventListener('click',function(e) {
                    e.preventDefault();
                    //dispatch the custom click event on the custom element
                    this.dispatchEvent(myClickEvent)
                }.bind(this),true); 
                //add the keypress event listener on the custom function
                this.addEventListener('keypress',function(e) {
                    e.preventDefault(); // Prevent the default form submission
                    if (e.code === "Enter" || e.code === "Space") {
                        //if this is the enter button then process the function below
                        //this helps to execute the click events using the keyboard press
                        //for the visually impaired
                        onclk(e);
                    } 
                }.bind(this),true); 
            }									
        }

    	this.setAttribute("class", "thrinkle-switch-container");
        /*setup this custom element attributes*/
		this.container = document.createElement("div");
    	this.container.setAttribute("class", "thrinkle-toggle-container");
        this.container.role = "presentation";
		this.button = document.createElement("div");
    	this.button.setAttribute("class", "thrinkle-toggle-handle");
        this.button.role = "presentation";
		this.switchLabel = document.createElement("div");
    	this.switchLabel.setAttribute("class", "thrinkle-switch-label");
        this.switchLabel.role = "presentation";

        //setup css classes
        if(this.hasAttribute('buttonstyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.button.className=this.getAttribute('buttonstyle');
            }else{
                this.button.classList.add(this.getAttribute('buttonstyle'))
            }
        }
        if(this.hasAttribute('buttoninlinestyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.style.cssText =this.getAttribute('buttoninlinestyle')
            }else{
                this.style.cssText += `; ${this.getAttribute('buttoninlinestyle')}`;
            }
        }

        if(this.hasAttribute('buttoncontainerstyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.container.className=this.getAttribute('buttoncontainerstyle');
            }else{
                this.container.classList.add(this.getAttribute('buttoncontainerstyle'))
            }
            
        }
        if(this.hasAttribute('buttoncontainerinlinestyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.style.cssText =this.getAttribute('buttoncontainerinlinestyle')
            }else{
                this.style.cssText += `; ${this.getAttribute('buttoncontainerinlinestyle')}`;
            }
        }


        if(this.hasAttribute('switchlabelstyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.switchLabel.className=this.getAttribute('switchlabelstyle');
            }else{
                this.switchLabel.classList.add(this.getAttribute('switchlabelstyle'))
            }
        }
        if(this.hasAttribute('switchlabelinlinestyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.style.cssText =this.getAttribute('switchlabelinlinestyle')
            }else{
                this.style.cssText += `; ${this.getAttribute('switchlabelinlinestyle')}`;
            }
        }

        if(this.hasAttribute('switchcontainerstyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.className=this.getAttribute('switchcontainerstyle');
            }else{
                this.classList.add(this.getAttribute('switchcontainerstyle'))
            }
        }
         
        if(this.hasAttribute('switchcontainerinlinestyle')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.style.cssText =this.getAttribute('switchcontainerinlinestyle')
            }else{
                this.style.cssText += `; ${this.getAttribute('switchcontainerinlinestyle')}`;
            }
        } 
		/*bundle css object*/
		const style = document.createElement('style');
		style.setAttribute('id','thrinkle_switch')
		this.css = `
		/* Style for the toggle button */
            .thrinkle-switch-container,
            .thrinkle-toggle-container,
            .thrinkle-toggle-handle,
            .thrinkle-switch-label {
                padding:0px;
                margin:0px;
            }
			.thrinkle-switch-container{
				display: inline-flex;
				position: relative;
				width: fit-content;
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;
				margin: 5px;
				cursor: pointer;
			}
			.thrinkle-switch-container:focus{
				outline: transparent;
                border: 1px solid grey;
			}
			.thrinkle-switch-container:focus div.thrinkle-toggle-handle{
				/*border: 2px solid grey;*/
			}
            
			.thrinkle-toggle-container {
				display: inline-block;
				position: relative;
				width: 40px;
				height: 20px;
				border-radius: 10px;
				background-color: #ed0909;
			}
			.thrinkle-toggle-handle {
				display:inline-block;
				position: absolute;
				width: 14px;
				height: 14px;
				background-color: #fff;
				border-radius: 50%;
				transition: transform 0.2s;
                top:3px;                
			}							
			.thrinkle-switch-label{
				display: inline-block;
				position: relative;
				padding-left:5px;
				color: #ed0909;
				font-weight: bold;
				font-size: 1em;
				width: fit-content;
			}
            
			/* Styling for the on and off states */
			.thrinkle-on{
				transform: translateX(22px);
			}
			.thrinkle-off{
				transform: translateX(6px);
			}
			.thrinkle-red{								
				background-color: #ed0909;
			}							
			.thrinkle-green{								
				background-color: #5cb95c;
			}
			.thrinkle-green-font{
				color:#5cb95c;
			}
            /*disabled state*/
            
            .thrinkle-switch-container:disabled .thrinkle-red,
            .thrinkle-switch-container:disabled .thrinkle-green{
                background-color: #d5d5d5;
            }
            .thrinkle-switch-container:disabled .thrinkle-green-font,
            .thrinkle-switch-container:disabled .thrinkle-switch-label{
                color: #d5d5d5;
            }
		`;
		style.textContent = this.css;
		if(!document.head.querySelector("style#thrinkle_switch")){
			document.head.appendChild(style);
		}
		/*bundle css object*/
        /* append sub elements to the custom element*/
		this.appendChild(this.container);
		this.appendChild(this.switchLabel)
		this.container.appendChild(this.button)
        /* append sub elements to the custom element*/
    }
    /* setup the getters and setters of this custom element */
    get form() { return this._internals.form; }//needed for form elements
    get name() { return this.getAttribute('name'); }//needed for form elements
    get type() { return 'ThrinkleSwitchElement'; }//needed for form elements
    get value(){ return this.getAttribute('value')}//needed for form elements
    set value(val){this.setAttribute('value',val)}//needed for form elements
    get oldValue(){ return this.getAttribute('oldValue')}//needed for form elements
    /* setup the getters and setters of this custom element */

	setOldValue(val){
		/**
		 * Function used to set the old value of a thrinkle element as provided by the mutation observer
		 * @el - the thrinkle DOM element, this could be the target of a click event or a thrinkle custom element
		 * @val - the value you want to set the thrinkle DOM element to
		 */
		this.setAttribute("oldvalue",val)
	}
	
	// JavaScript function to toggle the button state 
    toggleValue(e) {
        /**
        * this function toggles (set) value of the switch based on 
        * @property value: this is the value appropriate for the switch
        * @property onStateValue: holds the value appropriate for the "on" state
        * @property offStateValue: holds the value appropriate for the "off" state
        */
        
        if( this.button.classList.contains('thrinkle-off') || !this.button.classList.contains('thrinkle-on')){
            //if the button is on off state or not biased turn on the switch
            this.setAttribute('value',this.getAttribute('onstatevalue'));
        }else{		
            //turn off the switch	
            this.setAttribute('value',this.getAttribute('offstatevalue'));				
        }						
    }
    
    //links the keyboard enter button press to the mouse click event for the visually impaired
    toggleKeypress(e){
        if(e.code === "Enter" || e.code === "Space") {
            e.preventDefault();
            //if the keypressed is the enter or space key
            this.toggleValue(e);
        }
    }
	
	attributeChangedCallback(name, oldValue, newValue) {
        //responds to changes in attribute
		switch (name) {
			case 'value':
                //execute these lines of code when there is a change in the value of this element
				const container = this.container
				const button = this.button
				const switchLabel = this.switchLabel
				this.toggleSwitchProps({container,button,switchLabel});
				this.setOldValue(oldValue);
                //set form value, this value is used for form related operations
                this._internals.setFormValue(newValue);
				break ;
            case 'disabled':
                if(!this.hasAttribute('disabled')){
                    this._internals.ariaDisabled = 'false';
                }else{
                    this._internals.ariaDisabled = 'true';
                }
		}
	}	
    toggleSwitchProps({container,button,switchLabel}){
		if(this.hasAttribute('value')){
			if(this.getAttribute('value')===this.getAttribute('onstatevalue')){//if the switch is initialized to the on state
				//turn on the switch
				this.toggleSwitchOnFunction({container,button,switchLabel});
			}else{			
				//turn off the switch
				this.toggleSwitchOffFunction({container,button,switchLabel});		
			}
		}
	}
    toggleSwitchOffFunction({container,button,switchLabel}){
		button.classList.remove("thrinkle-on");
		button.classList.add('thrinkle-off');
		container.classList.remove("thrinkle-green");
		container.classList.add('thrinkle-red');
		switchLabel.classList.remove("thrinkle-green-font");
		//set the label of the switch
		switchLabel.innerText=this.getAttribute('offstatelabel');
		//set the state of switch to off
		this.setAttribute('state','off');	
        //set this for aria
        this._internals.ariaChecked = 'false';	
	}
	toggleSwitchOnFunction({container,button,switchLabel}){
		button.classList.add("thrinkle-on");
		button.classList.remove('thrinkle-off');
		container.classList.add("thrinkle-green");
		container.classList.remove('thrinkle-red');
		switchLabel.classList.add("thrinkle-green-font");
		//set the label of the switch
		switchLabel.innerText=this.getAttribute('onstatelabel');						
		//set the state of the switch to on
		this.setAttribute('state','on');
        //set this for aria
        this._internals.ariaChecked = 'true';
	}
	connectedCallback() {
		//set the value (based on the state where needed) of the custom element as 
        //soon as custom element is mounted
		if(this.hasAttribute('value')){
            //if the data-value was provided return the data-value
            this.setAttribute('value',this.getAttribute('value'));
        }else if(this.hasAttribute('state')){
            //if data-value was not provide but data-state was provided use it to infer the data-value from the on and off state values
            if(this.getAttribute('state').trim()===''){
                //if data-state is provided but its value is blank that default to the off state 
                this.setAttribute('value',this.getAttribute('offstatevalue'));
            }else{
                //if the data-state value was provided then use it to infer the data-value from the on and off state values
                this.setAttribute('value',this.getAttribute('state').trim()==='on'? this.getAttribute('onstatevalue') : this.getAttribute('offstatevalue'));
            }
        }else{
            //default to the off state since neither the data-value nor data-state was provided
            this.setAttribute('value',this.getAttribute('offstatevalue'));
        }
	}	
	disconnectedCallback() {
		console.log("Custom element removed from page.");
	}	
	adoptedCallback() {
		// console.log("Custom element moved to new page.");
	}

	getValue(){
		return this.getAttribute('value');
	}
	setValue(val){
		this.setAttribute('value',val);
	}
	getOldValue(){
		return this.getAttribute('oldvalue');
	}
}