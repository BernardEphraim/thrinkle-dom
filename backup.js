/**
 * thrinkle Toggle Switch implementation 
 * 
 * <div class="thrinkle-switch-container" 
		data-onclick="setSystemState" 
		data-onstatelabel="Live" 
		data-offstatelabel="Test" 
		data-onstatevalue="1" 
		data-offstatevalue="0"
		data-value="" 
		data-state="on"
		data-buttonstyle="style_class"
		data-buttoncontainerstyle="style_class"
		data-switchlabelstyle="style_class"
		data-switchcontainerstyle="style_class"
		>
		<div class="thrinkle-toggle-container">
			<div class="thrinkle-toggle-handle"></div>
		</div>
		<div class="thrinkle-switch-label"></div>
	</div>
 * the snippet above describes the html structure of the thrinkle toggle switch implementation
 * 	@data-onclick (optional) - takes the reference to an event handler (note arguments should not be passed)
	@data-onstatelabel (optional) - label for the switch's on state
	@data-offstatelabel (optional) - label for the switch's off state 
	@data-onstatevalue (optional) - the value of the switch's on state
	@data-offstatevalue (optional) - the value of the switch's off state
	@data-value (optional) - the value of the current state of the switch. If switch is in the on state, this takes on the data-onstatevalue
	@data-oldvalue (optional) - the value of the previous state of the switch. This is useful when there is a change in state and there is need to revert back to the previous state
	@data-state (optional) - can either be on or off, indicates the current state of the switch. Null values evaluate to the off state
	@data-buttonstyle (optional) - accepts a valid css class for styling the swtich button. Note: when provided, it overrides the default style
	@data-buttoncontainerstyle (optional) - accepts a valid css class for styling the swtich button container. Note: when provided, it overrides the default style
	@data-switchlabelstyle (optional) - accepts a valid css class for styling the swtich label. Note: when provided, it overrides the default style
	@data-switchcontainerstyle (optional) - accepts a valid css class for styling the swtich's outermost container. Note: when provided, it overrides the default style
	getValue(el) - function- takes one argument el which can be any member of the switch tree: gets the current value of the switch
	getOldValue(el) - function- takes one argument el which can be any member of the switch tree: gets the previous value of the switch before the change of state
	setValue(el,val) - function- takes two arguments el which can be any member of the switch tree and val the value: sets the current value of the switch
	setOldValue(el,val) function- takes two arguments el which can be any member of the switch tree and val the value: sets the previous value of the switch
 * 
 */
    toggleButtonInitializer();
    
    function toggleButtonInitializer() {
        /**
            * this function initializes all thrinkle toggle switches in a page
            * @data-value: this is the value appropriate for the switch
            * @data-state: indicates the state of the toggle switch values can either be "on" or "off"
            * @data-onStateLabel: holds the value to be displayed when the toggle switch is in the "on" state
            * @data-onStateValue: holds the value appropriate for the "on" state
            * @data-offStateLabel: holds the value to be displayed when the toggle switch is in the "off" state
            * @data-offStateValue: holds the value appropriate for the "off" state
            */
        //get all divs with the thrinkle-toggle-container class name
        const containerParents = document.querySelectorAll('div.thrinkle-switch-container');
        // Loop through the NodeList and access each element
        containerParents.forEach(function(containerParent) {
            //get the outermost container
            let container = containerParent.querySelector('div.thrinkle-toggle-container');
            containerParent.role = "button";
            containerParent.tabIndex="0";
            //add the click event listener on the toggleButton function
            containerParent.addEventListener('click',toggleButton,true); 
            //add the keypress event listener on the parent container to and tab focus and enter
            //keypress execute similar action as click would
            containerParent.addEventListener('keypress',toggleKeypress,true); 
            if(containerParent.hasAttribute('data-onclick')){
                // Convert the string to a function reference
                let onclk = window[containerParent.getAttribute('data-onclick')];
                // Check if the function exists
                if (typeof onclk === 'function') {
                    //add the click event listener on the custom function
                    containerParent.addEventListener('click',onclk,true); 
                    //add the keypress event listener on the custom function
                    containerParent.addEventListener('keypress',function(e) {
                        if (e.keyCode === 13) {
                            //if this is the enter button then process the function below
                            //this helps to execute the click events using the keyboard press
                            //for the visually impaired
                              onclk(e);
                        } else{
                            e.preventDefault(); // Prevent the default form submission
                        }
                      },true); 
                }									
            }
            //get button div
            let button = container.querySelector('div.thrinkle-toggle-handle'); 
            //get the label div
            let switchLabel = containerParent.querySelector('div.thrinkle-switch-label'); 
            //ensure these custom attribute a initialized
            if(!containerParent.hasAttribute('data-onstatevalue')){
                containerParent.setAttribute('data-onstatevalue','');
            }
            if(!containerParent.hasAttribute('data-offstatevalue')){
                containerParent.setAttribute('data-offstatevalue','');
            }
            if(!containerParent.hasAttribute('data-onstatelabel')){
                containerParent.setAttribute('data-onstatelabel','');
            }
            if(!containerParent.hasAttribute('data-offstatelabel')){
                containerParent.setAttribute('data-offstatelabel','');
            }
    
            //Use MutationObserver to monitor changes
            const observer = new MutationObserver(attributeSwitchOnStateChangeHandler({container,containerParent,button,switchLabel}));
            // Configure the observer to watch for attribute changes
            observer.observe(containerParent, { attributes: true, attributeFilter: ['data-value'],attributeOldValue:true });
            //reset attributes that need to trigger a process here
            //set the data-value custom attribute
            if(containerParent.hasAttribute('data-value')){
                //if the data-value was provided return the data-value
                containerParent.setAttribute('data-value',containerParent.getAttribute('data-value'));
            }else if(containerParent.hasAttribute('data-state')){
                //if data-value was not provide but data-state was provided use it to infer the data-value from the on and off state values
                if(containerParent.getAttribute('data-state').trim()===''){
                    //if data-state is provided but its value is blank that default to the off state 
                    containerParent.setAttribute('data-value',containerParent.getAttribute('data-offstatevalue'));
                }else{
                    //if the data-state value was provided then use it to infer the data-value from the on and off state values
                    containerParent.setAttribute('data-value',containerParent.getAttribute('data-state').trim()==='on'? containerParent.getAttribute('data-onstatevalue') : containerParent.getAttribute('data-offstatevalue'));
                }
            }else{
                //default to the off state since neither the data-value nor data-state was provided
                containerParent.setAttribute('data-value',containerParent.getAttribute('data-offstatevalue'));
            }
            //set the data-value custom attribute end
            if(containerParent.hasAttribute('data-buttonstyle')){
                button.classList.add(containerParent.getAttribute('data-buttonstyle'))
            }
            if(containerParent.hasAttribute('data-buttoncontainerstyle')){
                container.classList.add(containerParent.getAttribute('data-buttoncontainerstyle'))
            }
            if(containerParent.hasAttribute('data-switchlabelstyle')){
                switchLabel.classList.add(containerParent.getAttribute('data-switchlabelstyle'))
            }
            if(containerParent.hasAttribute('data-switchcontainerstyle')){
                containerParent.classList.add(containerParent.getAttribute('data-switchcontainerstyle'))
            }
        });	
    }
    // JavaScript function to toggle the button state 
    function toggleButton(e) {
        /**
        * this function handles the click event of the toggle switch
        * @data-value: this is the value appropriate for the switch
        * @data-state: indicates the state of the toggle switch values can either be "on" or "off"
        * @data-onStateLabel: holds the value to be displayed when the toggle switch is in the "on" state
        * @data-onStateValue: holds the value appropriate for the "on" state
        * @data-offStateLabel: holds the value to be displayed when the toggle switch is in the "off" state
        * @data-offStateValue: holds the value appropriate for the "off" state
        */
        
        //get the outermost container,e.currentTarget was used because the capturing mode (true) 
        //for addEventListener was used to ensure that only the parent container is accessed directly
        let containerParent = e.currentTarget;
        let container = containerParent.querySelector('div.thrinkle-toggle-container');//get the button container
        //get the button div
        let button = container.querySelector('div.thrinkle-toggle-handle');
        //get the label div
        if( button.classList.contains('thrinkle-off') || !button.classList.contains('thrinkle-on')){
            //if the button is on off state or not biased turn on the switch
            containerParent.setAttribute('data-value',containerParent.getAttribute('data-onstatevalue'));
        }else{		
            //turn off the switch	
            containerParent.setAttribute('data-value',containerParent.getAttribute('data-offstatevalue'));						
        }						
    }
    //links the keyboard enter button press to the mouse click event for the visually impaired
    function toggleKeypress(e){
        if(e.keyCode === 13) {
            //if the keypressed is the enter key
            toggleButton(e);
        }
    }
    function toggleSwitchOffFunction({container,containerParent,button,switchLabel}){
        button.classList.remove("thrinkle-on");
        button.classList.add('thrinkle-off');
        container.classList.remove("thrinkle-green");
        container.classList.add('thrinkle-red');
        switchLabel.classList.remove("thrinkle-green-font");
        //set the label of the switch
        switchLabel.innerText=containerParent.getAttribute('data-offstatelabel');
        //set the state of switch to off
        containerParent.setAttribute('data-state','off');
    }
    function toggleSwitchOnFunction({container,containerParent,button,switchLabel}){
        button.classList.add("thrinkle-on");
        button.classList.remove('thrinkle-off');
        container.classList.add("thrinkle-green");
        container.classList.remove('thrinkle-red');
        switchLabel.classList.add("thrinkle-green-font");
        //set the label of the switch
        switchLabel.innerText=containerParent.getAttribute('data-onstatelabel');						
        //set the state of the switch to on
        containerParent.setAttribute('data-state','on');
    }
    function setToggleSwitchValue({container,containerParent,button,switchLabel}){
        if(containerParent.hasAttribute('data-value')){
            if(containerParent.getAttribute('data-value')===containerParent.getAttribute('data-onstatevalue')){//if the switch is initialized to the on state
                //turn on the switch
                toggleSwitchOnFunction({container,button,switchLabel,containerParent});
            }else{			
                //turn off the switch
                toggleSwitchOffFunction({container,button,switchLabel,containerParent});		
            }
        }
    }
    function getValue(el){
        /**
         * Function used to get the value of a thrinkle element
         * @el - the thrinkle DOM element, this could be the target of a click event or a thrinkle custom element
         */
        if(el.classList.contains("thrinkle-toggle-handle")){
            return el.parentElement.parentElement.getAttribute("data-value")
        }else if(el.classList.contains("thrinkle-toggle-container") || el.classList.contains("thrinkle-switch-label")){	
            return el.parentElement.getAttribute("data-value")
        }else if(el.classList.contains("thrinkle-switch-container")){	
            return el.getAttribute("data-value")
        }else{
            throw TypeError(`The object passed does not have the correct CSS classes. Please ensure that the object is a thrinkle toggle switch`)
        }
    }
    function setValue(el,val){
        /**
         * Function used to set the value of a thrinkle element
         * @el - the thrinkle DOM element, this could be the target of a click event or a thrinkle custom element
         * @val - the value you want to set the thrinkle DOM element to
         */
        if(el.classList.contains("thrinkle-toggle-handle")){
            return el.parentElement.parentElement.setAttribute("data-value",val)
        }else if(el.classList.contains("thrinkle-toggle-container") || el.classList.contains("thrinkle-switch-label")){	
            return el.parentElement.setAttribute("data-value",val)
        }else if(el.classList.contains("thrinkle-switch-container")){	
            return el.setAttribute("data-value")
        }else{
            throw TypeError(`The object passed does not have the correct CSS classes. Please ensure that the object is a thrinkle toggle switch`)
        }
    }
    
    function getOldValue(el){
        /**
         * Function used to get the old value of a thrinkle element as provided by the mutation observer
         * @el - the thrinkle DOM element, this could be the target of a click event or a thrinkle custom element
         */
        if(el.classList.contains("thrinkle-toggle-handle")){
            return el.parentElement.parentElement.getAttribute("data-oldvalue")
        }else if(el.classList.contains("thrinkle-toggle-container") || el.classList.contains("thrinkle-switch-label")){	
            return el.parentElement.getAttribute("data-oldvalue")
        }else if(el.classList.contains("thrinkle-switch-container")){	
            return el.getAttribute("data-oldvalue")
        }else{
            throw TypeError(`The object passed does not have the correct CSS classes. Please ensure that the object is a thrinkle toggle switch`)
        }
    }
    function setOldValue(el,val){
        /**
         * Function used to set the old value of a thrinkle element as provided by the mutation observer
         * @el - the thrinkle DOM element, this could be the target of a click event or a thrinkle custom element
         * @val - the value you want to set the thrinkle DOM element to
         */
        if(el.classList.contains("thrinkle-toggle-handle")){
            return el.parentElement.parentElement.setAttribute("data-oldvalue",val)
        }else if(el.classList.contains("thrinkle-toggle-container") || el.classList.contains("thrinkle-switch-label")){	
            return el.parentElement.setAttribute("data-oldvalue",val)
        }else if(el.classList.contains("thrinkle-switch-container")){	
            return el.setAttribute("data-oldvalue")
        }else{
            throw TypeError(`The object passed does not have the correct CSS classes. Please ensure that the object is a thrinkle toggle switch`)
        }
    }
    // Define a function to handle the change monitored by MutationObserver
    function attributeSwitchOnStateChangeHandler({container,...props}) {
        return function (mutationsList, observer) {	
            outerLoop:for(const mutation of mutationsList) {
                switch (mutation.type) {
                    case 'attributes':
                        switch (mutation.attributeName) {
                            case 'data-value':
                                setToggleSwitchValue({container,...props});
                                setOldValue(container,mutation.oldValue);
                                break outerLoop;
                        }
                        break;
                }
            }
        };
    }  
    
    let style = document.createElement('style');
    let css = `
    /* Style for the toggle button */
        .thrinkle-switch-container{
            display: inline-block;
            position: relative;
            width: fit-content;
            margin: 5px;
            cursor: pointer;
        }
        div.thrinkle-switch-container:focus{
            outline: transparent;
        }
        div.thrinkle-switch-container:focus div.thrinkle-toggle-handle{
            border: 2px solid grey;
        }
        .thrinkle-toggle-container {
            display: inline-block;
            position: relative;
            width: 40px;
            height: 20px;
            border-radius: 10px;
            background-color: #ed0909;
            padding-top:3px;
            padding-bottom: 3px;
            top: 5px;
        }
        .thrinkle-toggle-handle {
            display:inline-block;
            position: absolute;
            width: 14px;
            height: 14px;
            background-color: #fff;
            border-radius: 50%;
            transition: transform 0.2s;
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
    `;
    style.textContent = css;
    document.head.appendChild(style);
    
    /**
     * thrinkle Toggle Switch implementation 
     * 
     */