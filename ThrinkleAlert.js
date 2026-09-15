/**
 * working thrinkle column class written on the 10/11/2023 by Bernard Ephraim
 * ThrinkleColumn element is a container that can be used to arrange items on a window
 * Declared form:
 *  <thrinkle-container break="lg">
		<thrinkle-column size='3' offset='6'>
			<div style="height: 58px; background-color:tomato">rty</div>
			<div style="height: 58px; background-color:orange">rty</div>
		</thrinkle-column>
		<thrinkle-column size='5'>44</thrinkle-column>
	</thrinkle-container>
 *  the snippet above describes the html structure of the thrinkle container implementation
 * 	@method {onclick} (optional) - takes the reference to an event handler (note arguments should not be passed)
 *  @attr {type} (optional) - takes values of either success, warning, danger, info or neutral. This attribute determines the color of the alert and the icon to use
 *  @attr {closable} (optional) - takes values of either true or false. This attribute determines if the alert can be closed by the user
 *  @attr {displaycaption} (optional) - takes values of either true or false. This attribute determines if the alert should display a caption
 *  @attr {caption} (optional) - takes a string value that will be used as the caption of the alert
 *  @attr {aligncaption} (optional) - takes values of either left, center or right. This attribute determines the alignment of the caption text
 *  @attr {animationname} (optional) - takes a string value that will be used as the name of the animation to use when the alert is displayed
 *  @attr {animationdirection} (optional) - takes values of either normal, reverse, forwards, backwards, infinite or alternate-reverse. This attribute determines the direction of the animation
 *  @attr {animationfillmode} (optional) - takes values of either none, forwards, backwards or both. This attribute determines the fill mode of the animation
 *  @attr {animationduration} (optional) - takes a string value that will be used as the duration of the animation
 *  @attr {animationtimingfunction} (optional) - takes a string value that will be used as the timing function of the animation: ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier(n,n,n,n)
 *  @attr {animationiterationcount} (optional) - takes a string value that will be used as the iteration count of the animation
 *  @attr {animationdelay} (optional) - takes a string value that will be used as the delay of the animation
 *  @param {color} (optional) - holds the reference color of the alert
 *  @param {bgdarker} (optional) - indicates if the bacground should be darker than the text
 *	@property {size} (optional) - takes values between 1 and 12 indicates the fraction of parent's internal space to occupy
 *  @property {offset} (optional) - takes values between 1 and 11 indicates the fraction of parent's internal space to use as left margin
 *	@property {styleclass} (optional) - accepts a valid css class for styling the swtich's outermost container. Note: when provided, it overrides the default style
 *	@property {replacestyle} - can either be true or false, indicates whether the user provided css classes should replace the default css class. true replaces, false appends
*/
import { 
    toTitleCase, 
    getCssVariable,
    generateContrastedDarkerColor, 
    generateContrastedLighterColor,
    setCssVariable
} from "./function.js";
export default class ThrinkleAlert extends HTMLElement {
    // static observedAttributes = ["size","offset"];
    constructor() {
        super();
        this.role='alert'      
        /*set up this custom element attributes*/    
        // Your custom element initialization logic here            
        this.classList.add('thrinkle-alert');            
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
                this.className = this.getAttribute('styleclass');
            }else{
                this.classList.add(this.getAttribute('styleclass'))
            }
        }                    
        if(this.hasAttribute('style')){
            if(this.hasAttribute('replacestyle') && this.getAttribute('replacestyle')==="true"){
                this.style.cssText = this.getAttribute('style')
            }else{
                this.style.cssText += `; ${this.getAttribute('style')}`;
            }
        }                   
        if(this.hasAttribute('size')){
            this.classList.add(`thrinkle-col-${this.getAttribute('size')}`)
        }else{
            this.classList.add('thrinkle-col-4')
        }   
        if(this.hasAttribute('offset')){
            this.classList.add(`thrinkle-offset-${this.getAttribute('offset')}`)
        }   
        this.iconSize = this.hasAttribute('iconsize') ? this.getAttribute('iconsize') : '24' 
        this.setAttribute('iconsize',this.iconSize)        
        /*copies the html content of the alert and saves it to 
        the htmlText variable*/
        this.htmlText = this.innerHTML
        //clear up the alert html content
        this.innerHTML = ``
        this.iconWrapper= document.createElement("div")
        this.iconWrapper.classList.add(`thrinkle-icon-wrapper`)
        // create the outer container for the alert
        this.iconContainer = document.createElement("div")
        this.iconContainer.classList.add(`thrinkle-alert-icon-container`)
        // Inside ThrinkleAlert.js
        
        

        this.alertTypeContainer = document.createElement("div")
        this.alertTypeContainer.classList.add(`thrinkle-alert-type-container`)
        this.alertTypeContainer.innerHTML = this.getAttribute('type') ? toTitleCase(this.getAttribute('type')) : 'Info' 
        
        this.iconWrapper.appendChild(this.iconContainer)
        this.iconWrapper.appendChild(this.alertTypeContainer)
        this.appendChild(this.iconWrapper)

        this.contentContainer = document.createElement("div")
        this.contentContainer.classList.add(`thrinkle-alert-content-container`)
        this.contentContainer.innerHTML = this.htmlText
        this.appendChild(this.contentContainer)
        if(this.hasAttribute('closable')){
            if(this.getAttribute('closable')==='true'){
                this.dismissContainer = document.createElement("div")
                this.dismissContainer.classList.add(`thrinkle-alert-dismiss-container`)
                               
                // Create SVG element
                this.closableIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this.closableIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                this.closableIcon.setAttribute("viewBox", "0 0 24 24");
                this.closableIcon.setAttribute("width", `${this.iconSize}`);
                this.closableIcon.setAttribute("height", `${this.iconSize}`);
                this.closableIcon.setAttribute("fill", "none");
                this.closableIcon.setAttribute("stroke-linecap", "round");
                this.closableIcon.setAttribute("stroke-linejoin", "round");
                this.closableIcon.setAttribute("class", "lucide lucide-x");
                this.closableIcon.setAttribute("stroke-width", "1");
                // Create path element
                this.path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                this.path1.setAttribute("d", "M18 6 6 18");
                this.path1.setAttribute("fill", "none");
                this.closableIcon.appendChild(this.path1);
                this.path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                this.path2.setAttribute("d", "m6 6 12 12");
                this.path2.setAttribute("fill", "none");
                this.closableIcon.appendChild(this.path2);
                this.dismissContainer.appendChild(this.closableIcon)
                /*this event listener removes the alert when the closable Icon
                is click*/
                this.closableIcon.addEventListener('click', function(e){
                    e.preventDefault()
                    this.parentElement.parentElement.remove()
                })
                this.appendChild(this.dismissContainer)
            }
        }
        /* creates a container for the innerHTML context of the alert,
            initializes the innerHTML content and appends to the 
            alert component
            */
        this.textContainer = document.createElement("div")
        this.textContainer.classList.add(`thrinkle-overflow-hidden`)
        this.textContainer.classList.add(`thrinkle-alert-text-full`)
        if(this.hasAttribute('displaycaption')){
            this.textContainer.appendChild(
                this.addCaption(
                    {
                        displaycaption : this.hasAttribute('displaycaption') ? true : false,
                        captiontext : this.getAttribute('caption'),
                        alerttype : this.getAttribute('type'),
                        aligncaption : this.getAttribute('aligncaption'),
                        captionlinestyle : this.getAttribute('captionlinestyle'),
                        captionline : this.getAttribute('captionline'),
                        captioneffect : this.getAttribute('captioneffect')
                    }
                )
            )
            //add a divider line
            const dividerLine = document.createElement("hr")
            this.textContainer.append(dividerLine)
        }
        
        this.textContainer.innerHTML += this.htmlText
        //set the alignment of text
        if(this.hasAttribute('alignment')){
            this.textContainer.classList.add(`thrinkle-text-${this.getAttribute('alignment')}`)
        }else{
            this.textContainer.classList.add(`thrinkle-text-left`)
        }
       
        /*bundle css object*/
        const style = document.createElement('style');
        style.setAttribute('id','thrinkle_alert')
        this.css = `
        
        /* Apply to your Web Component container */
        :host {
            display: block;
        }
        /* Style for the column */
        .thrinkle-alert{	
            /* Keep element hidden until styles and JavaScript layout finish loading */
            padding: 1rem;
			margin: 0px;
            display: flex;
            flex-direction: row;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            box-shadow: 
                0px 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0px 2px 4px -2px rgba(0, 0, 0, 0.1);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            
            /* Pre-animation hidden state */
            opacity: 0;
            visibility: hidden;
            /* Hardware-accelerated rendering*/
            /* will-change: transform, opacity, filter; */
        }

        .thrinkle-icon-wrapper{
            background-color: transparent;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            font-size: 0.875rem;
            margin-left: 0;
            height: max-content;
        }
        .thrinkle-alert-icon-container{
            background-color: transparent;
            height: max-content;
            width: max-content;
            font-weight: bold;
            align-content: center;
            font-size: 0.875rem;
            cursor: default;
        }
        .thrinkle-alert-type-container{
            background-color: transparent;
            height: max-content;
            width: max-content;
            font-weight: bold;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            text-align: left;
            align-content: center;
            font-size: 0.875rem;
            cursor: default;
        }
        .thrinkle-alert-content-container{
            background-color: transparent;
            height: max-content;
            width: 80%;
            font-size: 0.875rem;
            text-align: left;
            cursor: default;
        }
        .thrinkle-alert-dismiss-container{
            background-color: transparent;
            height: 15px;
            width: 15px;
            font-size: 0.875rem;
            cursor: pointer;
        }
        `;
        style.textContent = this.css;
        if(!document.head.querySelector("style#thrinkle_alert")){
            document.head.appendChild(style);
        }
        /*bundle css object*/
    }

    addCaption({
        displaycaption,
        captiontext,
        alerttype,
        aligncaption,
        captionlinestyle,
        captionline,
        captioneffect
    }){
        if(displaycaption){ 
            const captioncontainer = document.createElement("div")
            captioncontainer.classList.add(`thrinkle-alert-caption-container`)   
            captioncontainer.classList.add('thrinkle-overflow-hidden')        
            const caption = document.createElement("div")
            caption.classList.add('thrinkle-alert-caption')
            caption.classList.add('thrinkle-bold')
            //add caption line style
            if(captionlinestyle){
                caption.classList.add(`thrinkle-underline-${captionlinestyle}`)
            }
            //add caption line type
            if(captionline){
                caption.classList.add(`thrinkle-${captionline=="underline" ? "underline" : `underline-${captionline}`}`)
            }
            if(captioneffect){
                caption.classList.add(`thrinkle-effect-${captioneffect}`)
            }
            //add text alignment
            caption.classList.add(`thrinkle-text-${aligncaption ? aligncaption : 'left' }`)
            caption.innerText = captiontext ? toTitleCase(captiontext) : `${toTitleCase(alerttype)}!`
            captioncontainer.appendChild(caption)
            return captioncontainer
        }
        return false
    }
    /* setup the getters and setters of this custom element */
    get type() { return this.getAttribute('type'); }//needed for form elements
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
            let color = null
            if(this.hasAttribute('type')){
                switch (this.getAttribute('type')) {
                    case 'success':
                        color = this.hasAttribute('color') ? 
                            this.getAttribute('color') : getCssVariable('--thrinkle-green-700')
                        this.style.backgroundColor = this.hasAttribute('bgdarker') ?
                            generateContrastedDarkerColor(color) : generateContrastedLighterColor(color) 
                        this.style.color = color

                        // set icon
                        this.iconContainer.innerHTML = `
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="${this.iconSize}" 
                                height="${this.iconSize}" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                class="lucide lucide-circle-check">
                                <circle fill="${this.style.color}" stroke="${this.style.color}" cx="12" cy="12" r="10"/>
                                <path fill="none" stroke="${this.style.backgroundColor}" d="m16 9-5.5 5.5L8 12"/>
                            </svg>`;                            
                        break;
                    case 'warning':
                        color = this.hasAttribute('color') ? 
                            this.getAttribute('color') : getCssVariable('--thrinkle-orange-700')
                        this.style.backgroundColor = this.hasAttribute('bgdarker') ?
                            generateContrastedDarkerColor(color) : generateContrastedLighterColor(color) 
                        this.style.color = color
                        // set icon
                        this.iconContainer.innerHTML = `
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="${this.iconSize}" 
                                height="${this.iconSize}" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                class="lucide lucide-triangle-alert">
                                    <path fill="${this.style.color}" stroke="${this.style.color}" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                                    <path fill="none" stroke="${this.style.backgroundColor}" d="M12 9v4"/>
                                    <path fill="none" stroke="${this.style.backgroundColor}" d="M12 17h.01"/>
                            </svg>`;
                        break;
                    case 'danger':
                        color = this.hasAttribute('color') ? 
                            this.getAttribute('color') : getCssVariable('--thrinkle-pink-700')
                        this.style.backgroundColor = this.hasAttribute('bgdarker') ?
                            generateContrastedDarkerColor(color) : generateContrastedLighterColor(color) 
                        this.style.color = color
                        // set icon
                        this.iconContainer.innerHTML = `
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="${this.iconSize}" 
                                height="${this.iconSize}" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                class="lucide lucide-circle-x">
                                <circle fill="${this.style.color}" stroke="${this.style.color}" cx="12" cy="12" r="10"/>
                                <path  fill="none" stroke="${this.style.backgroundColor}" d="m15 9-6 6"/>
                                <path  fill="none" stroke="${this.style.backgroundColor}" d="m9 9 6 6"/>
                            </svg>`;
                        break;                
                    case 'info':
                        color = this.hasAttribute('color') ? 
                            this.getAttribute('color') : getCssVariable('--thrinkle-sky-700')
                        this.style.backgroundColor = this.hasAttribute('bgdarker') ?
                            generateContrastedDarkerColor(color) : generateContrastedLighterColor(color) 
                        this.style.color = color
                        // set icon
                        this.iconContainer.innerHTML =`
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="${this.iconSize}" 
                                height="${this.iconSize}" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                class="lucide lucide-info">
                                <circle fill="${this.style.color}" stroke="${this.style.color}" cx="12" cy="12" r="10"/>
                                <path fill="none" stroke="${this.style.backgroundColor}" d="M12 16v-4"/>
                                <path fill="none" stroke="${this.style.backgroundColor}" d="M12 8h.01"/>
                            </svg>`
                        break;               
                    case 'neutral':
                        color = this.hasAttribute('color') ? 
                            this.getAttribute('color') : getCssVariable('--thrinkle-neutral-700')
                        this.style.backgroundColor = this.hasAttribute('bgdarker') ?
                            generateContrastedDarkerColor(color,9) : generateContrastedLighterColor(color,9) 
                        this.style.color = color
                        // set icon
                        this.iconContainer.innerHTML =`
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="${this.iconSize}" 
                                height="${this.iconSize}" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                stroke-width="2" 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                class="lucide lucide-book-text">
                                <path fill="${this.style.color}" stroke="${this.style.color}" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                                <path fill="none" stroke="${this.style.backgroundColor}" d="M8 11h8"/>
                                <path fill="none" stroke="${this.style.backgroundColor}" d="M8 7h6"/>
                            </svg>`
                        break;
                    default:
                        break;
                }            
            }
            if(this.hasAttribute('closable')){
                if(this.getAttribute('closable')==='true'){
                    this.closableIcon.setAttribute("stroke", getCssVariable('--thrinkle-gray-400'));
                    this.path1.setAttribute("stroke", getCssVariable('--thrinkle-gray-400'));
                    this.path2.setAttribute("stroke", getCssVariable('--thrinkle-gray-400'));
                }
            }

            if(this.hasAttribute('borderline')){
                switch (this.getAttribute('borderline')) {
                    case 'top':
                        this.style.borderTop = `4px solid ${this.style.color}`
                        break;
                    case 'bottom':
                        this.style.borderBottom = `4px solid ${this.style.color}`
                        break;
                    case 'left':
                        this.style.borderLeft = `4px solid ${this.style.color}`
                        break;
                    case 'right':
                        this.style.borderRight = `4px solid ${this.style.color}`
                        break;
                    case 'all':
                        this.style.border = `4px solid ${this.style.color}`
                        break;
                    default:
                        this.style.borderLeft = `4px solid ${this.style.color}`
                        break;
                }
            }
            // Trigger animation strictly AFTER styles/theme are painted
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setCssVariable('--thrinkle-animation-name',this.hasAttribute('animationname') ? this.getAttribute('animationname') : 'slide-in-spring');
                    setCssVariable('--thrinkle-animation-direction',this.hasAttribute('animationdirection') ? this.getAttribute('animationdirection') : 'forwards');
                    setCssVariable('--thrinkle-animation-fill-mode',this.hasAttribute('animationfillmode') ? this.getAttribute('animationfillmode') : 'both');
                    setCssVariable('--thrinkle-animation-duration',this.hasAttribute('animationduration') ? this.getAttribute('animationduration') : '1s');
                    setCssVariable('--thrinkle-animation-timing-function',this.hasAttribute('animationtimingfunction') ? this.getAttribute('animationtimingfunction') : 'cubic-bezier(0.34, 1.56, 0.64, 1)'); 
                    setCssVariable('--thrinkle-animation-iteration-count',this.hasAttribute('animationiterationcount') ? this.getAttribute('animationiterationcount') : '1');
                    setCssVariable('--thrinkle-animation-delay',this.hasAttribute('animationdelay') ? this.getAttribute('animationdelay') : '0ms');
                    setCssVariable('--thrinkle-animation-play-state',this.hasAttribute('animationplaystate') ? this.getAttribute('animationplaystate') : 'running');
                    setCssVariable('--thrinkle-animation-timeline',this.hasAttribute('animationtimeline') ? this.getAttribute('animationtimeline') : 'running');
                    setCssVariable('--thrinkle-animation-rotation-angle',this.hasAttribute('animationrotationangle') ? this.getAttribute('animationrotationangle') : '360deg');
                    this.classList.add('animate-enter');
                });
            });
        }.bind(this), true);
    }	
    disconnectedCallback() {
        
    }	
    adoptedCallback() {
        
    }
}
