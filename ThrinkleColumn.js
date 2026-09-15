/**
 * working thrinkle column class written on the 10/11/2023 by Bernard Ephraim
 * ThrinkleColumn element is a container that can be used to arrange items on a window 
 * creating a column grid which can be flexed at break points defined on their parent containers
 * Declared form:
 *  <thrinkle-container break="lg">
		<thrinkle-column size='3' offset='6'>
			<div style="height: 58px; background-color:tomato">rty</div>
			<div style="height: 58px; background-color:orange">rty</div>
		</thrinkle-column>
		<thrinkle-column size='5'>44</thrinkle-column>
	</thrinkle-container>
 *  the snippet above describes the html structure of the thrinkle container implementation
 * 	@method onclick (optional) - takes the reference to an event handler (note arguments should not be passed)
 *	@property size (optional) - takes values between 1 and 12 indicates the fraction of parent's internal space to occupy
 *  @property offset (optional) - takes values between 1 and 11 indicates the fraction of parent's internal space to use as left margin
 *	@property styleclass (optional) - accepts a valid css class for styling the swtich's outermost container. Note: when provided, it overrides the default style
 *	@property replacestyle - can either be true or false, indicates whether the user provided css classes should replace the default css class. true replaces, false appends
*/
import {
    getCssVariable,
    removeClassesStartingWith
} from './function.js'
export default class ThrinkleColumn extends HTMLElement {
    static observedAttributes = ["size","offset"];
    constructor() {
        super();
        /*set up this custom element attributes*/    
        // Your custom element initialization logic here            
        this.classList.add('thrinkle-column');                  
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
        // if(this.hasAttribute('size')){
        //     this.classList.add(`thrinkle-col-${this.getAttribute('size')}`)
        // }else{
        //     this.classList.add('thrinkle-col-4')
        // }   
        // if(this.hasAttribute('offset')){
        //     this.classList.add(`thrinkle-offset-${this.getAttribute('offset')}`)
        // }
        if(this.hasAttribute('break')){
            this.break = this.getAttribute('break')
        }else{
            this.break = 'sm'
        }
        /*bundle css object*/
        const style = document.createElement('style');
        style.setAttribute('id','thrinkle_column')
        this.css = `
        /* Style for the column */
        .thrinkle-column{
			padding: 0.3em;
			margin: 0px;				
		}
        `;
        style.textContent = this.css;
        if(!document.head.querySelector("style#thrinkle_column")){
            document.head.appendChild(style);
        }
        /*bundle css object*/
    }
    /* setup the getters and setters of this custom element */
    get type() { return 'ThrinkleColumnElement'; }//needed for form elements
    get size() { return this.getAttribute('size') }
    set size(val) { this.setAttribute('size',val) }
    get offset() { return this.getAttribute('offset') }
    set offset(val) { this.setAttribute('offset',val) }

    attributeChangedCallback(name, oldValue, newValue) {
        //responds to changes in attribute
		switch (name) {
			case 'size':
                /** remove old column class */
                this.classList.remove(`thrinkle-col-${oldValue}`)
                /** add new column class */
                this.classList.add(`thrinkle-col-${newValue}`)   
				break ;
            case 'offset':               
                /** remove old offset class */
                this.classList.remove(`thrinkle-offset-${oldValue}`)
                /** remove new offset class */
                this.classList.add(`thrinkle-offset-${newValue}`)                
		}
	}

    connectedCallback() {
        window.addEventListener('thrinkle-styles-loaded', function(e) {
            // Create media query matcher
            this.mediaQuery = window.matchMedia(`(width ${this.break==='lg'?'>=':'<'} ${getCssVariable(`--thrinkle-br-${this.break}`)})`);
            const t=getCssVariable(`--thrinkle-br-${this.break}`)
            this.handleBreakpoint = (e) => {
                if (e.matches) {
                    removeClassesStartingWith('thrinkle-col-', this);
                    this.classList.add(`thrinkle-col-12`);
                    removeClassesStartingWith('thrinkle-offset-', this);
                } else {
                    if(this.hasAttribute('size')){
                        this.classList.add(`thrinkle-col-${this.getAttribute('size')}`)
                    }else{
                        this.classList.add('thrinkle-col-4')
                    }   
                    if(this.hasAttribute('offset')){
                        this.classList.add(`thrinkle-offset-${this.getAttribute('offset')}`)
                    }
                }
            };
            // Listen for query changes
            this.mediaQuery.addEventListener('change', this.handleBreakpoint);
            // Initial check
            this.handleBreakpoint(this.mediaQuery);
        }.bind(this), true);
    }	
    disconnectedCallback() {
        this.mediaQuery.removeEventListener('change', this.handleBreakpoint);
    }	
    adoptedCallback() {
        
    }
}