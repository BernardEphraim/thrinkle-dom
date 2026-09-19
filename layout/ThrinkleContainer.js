/**
 * working thrinkle container class written on the 9/11/2023 by Bernard Ephraim
 * ThrinkleContainer element is a container that can be used to arrange items on a window
 * Declared form:
 * <thrinkle-container break="lg" type='padded'>Some content</thrinkle-container>
 *  Internal structure:
    <thrinkle-container break="lg">
		<thrinkle-column size='3' offset='6'>
			<div style="height: 58px; background-color:tomato">rty</div>
			<div style="height: 58px; background-color:orange">rty</div>
		</thrinkle-column>
		<thrinkle-column size='5'>44</thrinkle-column>
	</thrinkle-container>
 *   
 *   the snippet above describes the html structure of the thrinkle container implementation
 * 	@method onclick (optional) - takes the reference to an event handler (note arguments should not be passed)
	@property break (optional) - takes on xl, lg, md, sm, xs, and xxs as break points 
    @property type (optional) - takes padded, fluid,unpadded as values defaults to fluid, padded adds some padding to the container, fluid stretches the full width of parent container, unpadded takes the fluid form without inner padding
	@property style (optional) - accepts a valid css class for styling the swtich's outermost container. Note: when provided, it overrides the default style
	@property replacestyle - can either be true or false, indicates whether the user provided css classes should replace the default css class. true replaces, false appends
*/
    export default class ThrinkleContainer extends HTMLElement {
        static observedAttributes = ["break","type"];
        constructor() {
            super();
            /*set up this custom element attributes*/    
            // Your custom element initialization logic here            
            if(this.hasAttribute('type')){
                if(this.getAttribute('type')==='padded'){
                    this.classList.add('thrinkle-container');
                }else if (this.getAttribute('type')==='unpadded'){
                    this.classList.add('thrinkle-container-unpadded');
                }else if (this.getAttribute('type')==='fluid'){
                    this.classList.add('thrinkle-container-fluid');
                }else{
                    this.classList.add('thrinkle-container-fluid');
                }
            }else{
                this.classList.add('thrinkle-container-fluid');
            }
    
            //add the click event listener on the toggleButton function                      
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
                        onclk(e);
                    }.bind(this),true); 
                }									
            }    
            /*setup this custom element attributes*/    
            //setup css classes            
            if(this.hasAttribute('styleclass')){
                if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                    this.className=this.getAttribute('styleclass');
                }else{
                    this.classList.add(this.getAttribute('styleclass'))
                }
            } 
            if(this.hasAttribute('style')){
                if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                    this.style.cssText =this.getAttribute('style')
                }else{
                    this.style.cssText += `; ${this.getAttribute('style')}`;
                }
            }                       
            if(this.hasAttribute('break')){
                this.classList.add(`thrinkle-br-${this.getAttribute('break')}`)
            }else{
                this.classList.add('thrinkle-br-sm')
            }   
            /*bundle css object*/
            const style = document.createElement('style');
            style.setAttribute('id','thrinkle_container')
            this.css = `
            /* Style for the container */
            .thrinkle-container,
            .thrinkle-container-fluid,
            .thrinkle-container-unpadded{
                padding:0px;
                margin:0px;
                min-height: fit-content;
                display: flex;
                flex-direction: row;
                background-color: transparent;
            }
            .thrinkle-container-fluid{
                width: 100%;
                padding: 0px;
            }		
            .thrinkle-container{
                width: 80%;
                padding: 10px;
                margin-left: 10%;
                margin-right: 10%;
            }
            .thrinkle-container-unpadded{
                width: 100%;
                padding: 10px;
            }
            `;
            style.textContent = this.css;
            if(!document.head.querySelector("style#thrinkle_container")){
                document.head.appendChild(style);
            }
            /*bundle css object*/
        }
        /* setup the getters and setters of this custom element */
        // get type() { return 'ThrinkleContainerElement'; }//needed for form elements
        get break() { return this.getAttribute('break') }
        set break(val) { this.setAttribute('break',val) }
        get type() { return this.getAttribute('type') }
        set type(val) { this.setAttribute('type',val) }

        attributeChangedCallback(name, oldValue, newValue) {
            //responds to changes in attribute
            switch (name) {
                case 'break':
                    /** remove old break class */
                    this.classList.remove(`thrinkle-br-${oldValue}`)
                    /** add new break class */
                    this.classList.add(`thrinkle-br-${newValue}`)   
                    break ;
                case 'type':               
                    /** remove old type class */
                    if(oldValue==='padded'){
                        this.classList.remove('thrinkle-container');
                    }else if (oldValue==='unpadded'){
                        this.classList.remove('thrinkle-container-unpadded');
                    }else{
                        this.classList.remove('thrinkle-container-fluid');
                    }
                    /** remove new type class */ 
                    if(newValue==='padded'){
                        this.classList.add('thrinkle-container');
                    }else if (newValue==='unpadded'){
                        this.classList.add('thrinkle-container-unpadded');
                    }else{
                        this.classList.add('thrinkle-container-fluid');
                    }              
            }
        }
        connectedCallback() {
            
        }	
        disconnectedCallback() {
            
        }	
        adoptedCallback() {
            
        }
    }