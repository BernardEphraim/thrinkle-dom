import { getCssVariable, setupAnimation } from "../function.js";

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
    export default class ThrinkleLayout extends HTMLElement {
        static observedAttributes = ["break","type"];
        
        constructor() {
            super();
            /*set up this custom element attributes*/   
            
            this.id=this.hasAttribute('id') ? this.getAttribute('id') : `thrinkle-layout-${Math.floor(Math.random() * 1000000)}` 
            this.classList.add("thrinkle-layout"); 
            // keep this element invisible till css is fully loaded
            this.setAttribute('data-thrinkle-loading', '');
            // create the sidebar container
            this.sidebarContainer = document.createElement("div");
            this.sidebarContainer.classList.add('thrinkle-sidebar-container') 
            // create the content container 
            this.contentContainer = document.createElement("div");
            this.contentContainer.classList.add('thrinkle-content-container')
            // create the head container
            this.headContainer = document.createElement('div')
            this.headContainer.classList.add('thrinkle-head-container')
            // create the article container
            this.articleContainer = document.createElement('div')
            this.articleContainer.classList.add('thrinkle-article-container')
            // transfer children in the thrinkle layout to the article container
            while(this.firstChild){
                this.articleContainer.appendChild(this.firstChild)
            }
            // append the head container and the article container to the content
            // container
            this.contentContainer.appendChild(this.headContainer)  
            this.contentContainer.appendChild(this.articleContainer)
            // append the siderbar container and the content container to the 
            // thrinkle layout
            this.appendChild(this.sidebarContainer)  
            this.appendChild(this.contentContainer)
            
            this.sidebarMenuContainer = document.createElement('div')
            this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container')
            this.sidebarContainer.appendChild(this.sidebarMenuContainer)
            this.sidebarMenuPad = document.createElement('div')
            this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-mobile')
            this.sidebarContainer.appendChild(this.sidebarMenuPad)

            // organize the content of the head container
            // add sidebar control icon
            this.sidebarCloseIconContainer = document.createElement('div')
            this.sidebarCloseIconContainer.classList.add('thrinkle-sidebar-close-icon-container')
            if(window.innerWidth>=667){
                this.sidebarCloseIconContainer.setAttribute("shrink","false")
            }else{
                this.sidebarCloseIconContainer.setAttribute("shrink","true")
            }
            this.headContainer.appendChild(this.sidebarCloseIconContainer)
            this.iconSize = this.hasAttribute('iconsize') ? this.getAttribute('iconsize') : '24' 
            this.setAttribute('iconsize',this.iconSize)
             
            // add head content container
            this.headContentContainer = document.createElement('div')
            this.headContentContainer.classList.add('thrinkle-head-content-container')    
            this.title = this.hasAttribute('title') ? this.getAttribute('title') : 'title' 
            this.setAttribute('title',this.title) 
            this.headContentContainer.innerHTML = this.title
            this.headContainer.appendChild(this.headContentContainer)
            // Your custom element initialization logic here            
    
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
            /*bundle css object*/
            const style = document.createElement('style');
            style.setAttribute('id','thrinkle_container')
            this.css = `
            /* Style for the container */
            .thrinkle-layout{
                position: relative;
                display: flex;
                flex-direction: row;
                overflow-y: auto;
                scrollbar-gutter: stable;
                padding: 0px;
                margin: 0px;
                min-height: 100vh;
                width: 100%;
                background-color: #f9fafb;
                /*border:2px solid green;*/

                
            }	
            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-layout[data-thrinkle-loading] {
                display: none;
            }	
            .thrinkle-sidebar-container{
                display: flex;
                flex-direction: row;
                transition: width 0.5s ease;
            }
            
            .thrinkle-sidebar-container-layout-mobile{
                width: 0px;
                padding: 0;
                
            }

            .thrinkle-sidebar-container-layout-desktop{
                max-width: 20%;
                width: 20%;
                padding: 10px;
                position: sticky;
                top:0;
            }
            .thrinkle-sidebar-container-layout-desktop-shrink{
                width: 60px;
            }
            .thrinkle-sidebar-container-layout-desktop-expand{
                width: 20%;
            }

            .thrinkle-sidebar-container-layout-mobile-shrink{
                width: 0px;
            }
            .thrinkle-sidebar-container-layout-mobile-expand{
                width: 100vw;
                height: 100vh;
                background-color: transparent;
                position:fixed;
                z-index: 99999;
                
            }

            /* sidebar menu container*/
            .thrinkle-sidebar-menu-container{
                height: 100%;
                background-color: white;
            }
            .thrinkle-sidebar-menu-container-layout-mobile{
                transition: width 0.5s ease;
                width: 0px;
                padding: 0px;
            }
            .thrinkle-sidebar-menu-container-layout-desktop{
                width: 100%;
                padding: 0px;
            }
            .thrinkle-sidebar-menu-container-layout-desktop-shrink{
                width: 100%;
            }
            .thrinkle-sidebar-menu-container-layout-desktop-expand{
                width: 100%;
            }
            .thrinkle-sidebar-menu-container-layout-mobile-shrink{
                width: 0px;
            }
            .thrinkle-sidebar-menu-container-layout-mobile-expand{
                width: max(200px, 80%);
            }
            .thrinkle-sidebar-menu-pad-layout-desktop{
                display: none;
            }
            .thrinkle-sidebar-menu-pad-layout-mobile{
                display: flex;
                flex-grow: 1;
                background-color: rgba(0,0,0,0.5);
            }
            /* sidebar menu container */


            .thrinkle-content-container{
                box-sizing: border-box;             
                 
            }
            .thrinkle-content-container-layout-mobile{
                width: 100vw;
            
            }
            .thrinkle-content-container-layout-desktop{
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                min-width: 80%;
                width: 80%;
                margin-left: 10px;
                margin-right: 5px;
                margin-top: 10px;
                margin-bottom: 10px;
                border-radius: 0.5rem;
                box-shadow: 
                0px 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0px 2px 4px -2px rgba(0, 0, 0, 0.1),
                0px -1px 1px -1px rgba(0, 0, 0, 0.1), 
                0px -1px 1px -1px rgba(0, 0, 0, 0.1);
            }
            
            .thrinkle-head-container{
                display: flex;
                align-items: center;
                min-height: 60px;
                height: 60px;
                width: 100%;
                border-top-right-radius: 0.5rem;
                border-top-left-radius: 0.5rem;
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #f3f4f6;//--thrinkle-gray-100
                background-color: #f9fafb; //--thrinkle-gray-50
            }
            .thrinkle-sidebar-close-icon-container{
                width: 28px;
                height: 28px;
                margin-left: 10px;
                margin-right: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent;
            }
            .thrinkle-sidebar-close-icon-container:hover{
                border-radius: 10px;
                background-color: #f3f4f6; /*--thrinkle-gray-100 */
                
            }
            .thrinkle-head-content-container{
                display: flex;
                flex-grow: 1;
                flex-direction: row;
                align-items: center;
                height: 50px;
                padding-right: 0.5rem;
                background-color: transparent;
                font-family: 'Instrument Sans', 
                    ui-sans-serif, 
                    system-ui, 
                    sans-serif, 
                    'Apple Color Emoji', 
                    'Segoe UI Emoji', 
                    'Segoe UI Symbol', 
                    'Noto Color Emoji';
                font-weight: 400;
                font-size: 0.9rem;
            }
            .thrinkle-article-container{
                /*display: flex;
                flex-grow: 1;
                min-height: 350px;
                height: max-content;  
                
                overflow-y: auto;
                scrollbar-gutter: stable;*/   
                width: 100%;
                padding: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
                background-color: #f9fafb;
            }
            `;
            style.textContent = this.css;
            if(!document.head.querySelector("style#thrinkle_Layout")){
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
            
        }
        connectedCallback() {
            window.addEventListener('thrinkle-styles-loaded', function(e) {
                this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                this.sidebarCloseIconContainer.addEventListener('click',(e)=>{
                    e.preventDefault()
                    console.log('shrink',this.sidebarCloseIconContainer.getAttribute('shrink'))
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                })
                this.sidebarMenuPad.addEventListener('click',(e)=>{
                    e.preventDefault()
                    console.log('shrink',this.sidebarCloseIconContainer.getAttribute('shrink'))
                    this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-mobile-shrink')
                    this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-mobile-shrink')
                    this.sidebarContainer.classList.remove('thrinkle-sidebar-container-layout-mobile-expand')
                    this.sidebarMenuContainer.classList.remove('thrinkle-sidebar-menu-container-layout-mobile-expand')
                    e.target.classList.add('thrinkle-sidebar-menu-pad-layout-desktop')
                    e.target.classList.remove('thrinkle-sidebar-menu-pad-layout-mobile')
                    // this.sidebarCloseIconContainer.setAttribute("shrink","true")
                    // this.switchDeviceModes()
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                })

                // Create media query matcher
                this.mediaQuery = window.matchMedia(`(width >= ${getCssVariable(`--thrinkle-br-sm`)})`);
                // Listen for query changes
                this.mediaQuery.addEventListener('change', (e)=>this.handleMediaQueryMatch(this,this.mediaQuery));
                this.handleMediaQueryMatch(this,this.mediaQuery)
                // remove the loading attribute to show the alert
                this.removeAttribute('data-thrinkle-loading');
            }.bind(this), true);
        }	
        disconnectedCallback() {
            
        }	
        adoptedCallback() {
            
        }
        
        handleMediaQueryMatch(element,query){
            if(query.matches){
                this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-desktop')
                this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-mobile',
                        'thrinkle-sidebar-container-layout-mobile-expand',
                        'thrinkle-sidebar-container-layout-mobile-shrink'
                    )
                
                
                this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-desktop')
                this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-mobile',
                        'thrinkle-sidebar-menu-container-layout-mobile-expand',
                        'thrinkle-sidebar-menu-container-layout-mobile-shrink'
                    )
                this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-desktop')
                this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-mobile')

                this.contentContainer.classList.add('thrinkle-content-container-layout-desktop')
                this.contentContainer.classList.remove('thrinkle-content-container-layout-mobile')
                
                
            }else{                        
                this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-mobile')
                this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-desktop',
                        'thrinkle-sidebar-container-layout-desktop-expand',
                        'thrinkle-sidebar-container-layout-desktop-shrink'
                    )

                this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-mobile')
                this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-desktop',
                        'thrinkle-sidebar-menu-container-layout-desktop-expand',
                        'thrinkle-sidebar-menu-container-layout-desktop-shrink'
                    )


                this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-mobile')
                this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-desktop')


                this.contentContainer.classList.add('thrinkle-content-container-layout-mobile')
                this.contentContainer.classList.remove('thrinkle-content-container-layout-desktop')
            }
        }

        switchDeviceModes(){
            const shrink = this.sidebarCloseIconContainer.getAttribute('shrink')
            if(shrink==='false'){
                this.sidebarCloseIconContainer.setAttribute("shrink","true")
                if(window.innerWidth>=667){
                    this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-desktop-expand')
                    this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-desktop-shrink',
                        'thrinkle-sidebar-container-layout-mobile-expand',
                        'thrinkle-sidebar-container-layout-mobile-shrink'
                    )

                    this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-desktop-expand')
                    this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-desktop-shrink',
                        'thrinkle-sidebar-menu-container-layout-mobile-expand',
                        'thrinkle-sidebar-menu-container-layout-mobile-shrink'
                    )

                    this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-desktop')
                    this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-mobile')


                }else{
                    this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-mobile-expand')
                    this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-mobile-shrink',
                        'thrinkle-sidebar-container-layout-desktop-expand',
                        'thrinkle-sidebar-container-layout-desktop-shrink'
                    )

                    this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-mobile-expand')
                    this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-mobile-shrink',
                        'thrinkle-sidebar-menu-container-layout-desktop-expand',
                        'thrinkle-sidebar-menu-container-layout-desktop-shrink'
                    )

                    this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-mobile')
                    this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-desktop')
                }
            }else{
                this.sidebarCloseIconContainer.setAttribute("shrink","false")
                if(window.innerWidth>=667){   
                    this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-desktop-shrink')           
                    this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-desktop-expand',
                        'thrinkle-sidebar-container-layout-mobile-expand',
                        'thrinkle-sidebar-container-layout-mobile-shrink'
                    )

                    this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-desktop-shrink')           
                    this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-desktop-expand',
                        'thrinkle-sidebar-menu-container-layout-mobile-expand',
                        'thrinkle-sidebar-menu-container-layout-mobile-shrink'
                    )

                    this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-desktop')
                    this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-mobile')

                }else{
                    this.sidebarContainer.classList.add('thrinkle-sidebar-container-layout-mobile-shrink')           
                    this.sidebarContainer.classList.remove(
                        'thrinkle-sidebar-container-layout-mobile-expand',
                        'thrinkle-sidebar-container-layout-desktop-expand',
                        'thrinkle-sidebar-container-layout-desktop-shrink'
                    )

                    this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container-layout-mobile-shrink')           
                    this.sidebarMenuContainer.classList.remove(
                        'thrinkle-sidebar-menu-container-layout-mobile-expand',
                        'thrinkle-sidebar-menu-container-layout-desktop-expand',
                        'thrinkle-sidebar-menu-container-layout-desktop-shrink'
                    )
                    
                    this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad-layout-mobile')
                    this.sidebarMenuPad.classList.remove('thrinkle-sidebar-menu-pad-layout-desktop')
                }
            }
        }
        getSidebarIcon (){
            const shrink = this.sidebarCloseIconContainer.getAttribute('shrink')
            console.log(window.innerWidth)
            console.log(this.sidebarContainer)
            console.log(this.sidebarMenuContainer)
            if(shrink==='false'){
                this.switchDeviceModes()
                return `
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
                        class="lucide lucide-panel-left-close">
                        <rect width="18" height="18" fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" x="3" y="3" rx="2"/>
                        <path fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" d="M9 3v18"/>
                        <path fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" d="m16 15-3-3 3-3"/>
                    </svg>`
            }else{ 
                this.switchDeviceModes()
                return `
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
                        class="lucide lucide-panel-right-close">
                        <rect width="18" height="18" fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" x="3" y="3" rx="2"/>
                        <path fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" d="M15 3v18"/>
                        <path fill="none" stroke="${getCssVariable('thrinkle-gray-750')}" d="m8 9 3 3-3 3"/>
                    </svg>`
            }
        }
    }