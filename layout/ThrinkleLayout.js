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
        static observedAttributes = ["menu","type"];
        
        constructor() {
            super();
            /*set up this custom element attributes*/
            this._menu = []   
            
            this.id=this.hasAttribute('id') ? this.getAttribute('id') : `thrinkle-layout-${Math.floor(Math.random() * 1000000)}` 
            this.title = this.hasAttribute('title') ? this.getAttribute('title') : 'Site title' 
            this.setAttribute('title',this.title) 
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
            this.toggleOpenOnDesktop(this.sidebarContainer)
            this.sidebarMenuPad = document.createElement('div')
            this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad')
            this.sidebarContainer.appendChild(this.sidebarMenuPad)

            this.sidebarSiteTitleContainer = document.createElement('div')
            this.sidebarSiteTitleContainer.classList.add('thrinkle-sidebar-site-title-container')
            this.toggleOpenOnDesktop(this.sidebarSiteTitleContainer)
            this.sidebarMenuContainer.appendChild(this.sidebarSiteTitleContainer)

            this.sidebarSiteIconContainer = document.createElement('div')
            this.sidebarSiteIconContainer.classList.add('thrinkle-sidebar-site-icon-container')
            this.sidebarSiteTitleContainer.appendChild(this.sidebarSiteIconContainer)
            
            const logoUrl = this.hasAttribute('logourl') ? this.getAttribute('logourl') : null
            if(logoUrl){
                this.sidebarSiteIconContainer.style.backgroundImage = `url(${logoUrl})`
            }
            this.sidebarSiteTitle = document.createElement('div')
            this.sidebarSiteTitle.classList.add('thrinkle-sidebar-site-title')
            this.sidebarSiteTitleContainer.appendChild(this.sidebarSiteTitle)

            this.siteTitleScroll = document.createElement('div')
            this.siteTitleScroll.classList.add('thrinkle-site-title-scroll')
            this.siteTitleScroll.innerText = this.title

            const spanTitle = document.createElement('span')
            spanTitle.classList.add('thrinkle-site-title-span')
            this.toggleOpenOnDesktop(spanTitle)
            spanTitle.innerText = this.title
            this.siteTitleScroll.appendChild(spanTitle)

            this.sidebarSiteTitle.appendChild(this.siteTitleScroll)
            // add scrolling animation to the website title if
            // longer than 30 characters
            if (this.title.length > 30){
                setupAnimation({
                    element: this.siteTitleScroll,
                    animationName: 'scroll-left-animation',
                    animationDuration: '30s',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear'
                })
            }

            

            // organize the content of the head container
            // add sidebar control icon
            this.sidebarCloseIconContainer = document.createElement('div')
            this.sidebarCloseIconContainer.classList.add('thrinkle-sidebar-close-icon-container')
            
            if(window.innerWidth>=667){
                this.sidebarCloseIconContainer.setAttribute("shrinked","false")
                // this.sidebarContainer.classList.toggle('open')
            }else{
                this.sidebarCloseIconContainer.setAttribute("shrinked","true")
            }
            this.headContainer.appendChild(this.sidebarCloseIconContainer)
            this.iconSize = this.hasAttribute('iconsize') ? this.getAttribute('iconsize') : '24' 
            this.setAttribute('iconsize',this.iconSize)
             
            // add head content container
            this.headContentContainer = document.createElement('div')
            this.headContentContainer.classList.add('thrinkle-head-content-container')    
            
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
            .thrinkle-sidebar-container{
                /*padding: 20px; */ 
                              
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

            .thrinkle-sidebar-site-title-container{
                padding: 5px;
                padding-left: 8px;
                margin: 0px;
                width: 100%;
                height: 45px;
                display: flex;
                flex-direction: row;
                align-items: center;
                overflow: hidden;
                background-color: #f9fafb;
                transition: height 0.5s ease;
            }
            
            .thrinkle-sidebar-site-title-container:hover{
                border-radius: 0.5rem;
                background-color: #f3f4f6;
                cursor: pointer;
            }
            .thrinkle-sidebar-site-icon-container{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 0.5rem;
                min-width: 32px;
                min-height: 32px;
                width: 32px;
                height: 32px;
                border-radius: 0.5rem;
                overflow: hidden;
                background-color: black;
                background-size: contain;
                background-repeat: no-repeat;
            }
            .thrinkle-sidebar-site-title{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex: 1;
                min-width: 0px;
                height: 32px;
                overflow: hidden;
                font-weight: bold;
                white-space: nowrap;
            }
            .thrinkle-site-title-scroll{
                white-space: no-wrap;
            
            }



            .thrinkle-menu-container{
                display: flex;
                flex-direction: column;
                box-sizing: border-box; 
                background-color: transparent;
                overflow-y: auto;
                overflow-x: hidden;
                flex: 1;
                white-space: no-wrap;
            }
           
            .thrinkle-menu-group{
                width: 100%;
                padding-left: 0px;
                white-space: no-wrap;
                background-color: transparent;
            }
            
            .thrinkle-menu-item-group{
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: 1rem;
                padding-top: 8px;
                padding-bottom: 8px;
                margin-top: 5px;
                white-space: no-wrap;
                background-color: transparent;
            }
            .thrinkle-menu-item-group:hover,  
            .thrinkle-menu-item-group.active{
                background-color: #f3f4f6;
                border-radius: 0.5rem;
            }
            .thrinkle-menu-item-icon{
                width: 18px;
                height: 18px;
                background-color: transparent;
                display: inline-block;
                align-items: center;
                margin-right: 5px;
                overflow: hidden;
            }
            

            
            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-layout[data-thrinkle-loading] {
                display: none;
            }	
            
            @media screen and (width >= 667px){
                .thrinkle-sidebar-container{
                    display: flex;
                    flex-direction: row;
                    max-width: 20%;
                    width: 63px;
                    position: sticky;
                    top:0px;
                    padding: 18px;
                    padding-left: 10px;
                    padding-right: 10px;
                    overflow: hidden;
                    transition: width 0.5s ease;
                    background-color: transparent;
                }
                .thrinkle-sidebar-container.open{
                    width: min(300px,20%);
                    padding-left: 15px;
                    padding-right: 15px;
                } 

                .thrinkle-sidebar-site-title-container{                
                    justify-content: center;
                    padding-left: 13px;
                }
                .thrinkle-sidebar-site-title-container.open{
                    padding-right: 10px;
                    padding-left: 10px;
                    overflow: hidden;
                }
                .thrinkle-site-title-span{
                    display: none;
                }
                .thrinkle-site-title-span.open{
                    display: inline;
                }
                /* sidebar menu container*/
                .thrinkle-sidebar-menu-container{
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0px;
                    background-color: transparent;
                }
                
                .thrinkle-menu-group-title{
                    /*display: none;*/
                    height: 0px; 
                    padding-top: 0px;
                    padding-bottom: 0px; 
                    overflow: hidden;                  
                    transition: height 0.5s ease;
                }
                .thrinkle-menu-group-title.open{
                    display: block;
                    height: 30px;
                    font-size: 0.8rem;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 8px;
                }
                .thrinkle-menu-group{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .thrinkle-menu-group.open{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .thrinkle-menu-item-group{
                    width: 30px;                    
                }
                .thrinkle-menu-item-group.open{
                    width: 100%;
                }
                .thrinkle-menu-container{
                    padding-top: 10px;
                    align-items: center;
                }
                .thrinkle-menu-container.open{
                    width: 100%;
                    padding-top: 20px;                
                    scrollbar-gutter: stable;
                }
                
                .thrinkle-menu-item{
                    display: flex;
                    padding-left: 8px;
                    text-decoration: none;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    background-color: transparent;
                    white-space: no-wrap;
                }

                .thrinkle-menu-item.open{
                    display: inline-block;
                    width: 100%;
                    white-space: no-wrap;
                    background-color: transparent;
                }
                .thrinkle-menu-item-title-span{
                    display: none;
                }
                .thrinkle-menu-item-title-span.open{
                    display: inline;
                }
                .thrinkle-sidebar-menu-pad{
                    display: none;
                }
                /* sidebar menu container*/

                /*content container */
                .thrinkle-content-container{
                    box-sizing: border-box;             
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
                /*content container */
            }
            @media screen and (width < 667px){
                .thrinkle-sidebar-container{
                    display: flex;
                    flex-direction: row;
                    position:fixed;
                    top: 0px;
                    z-index: 99999;
                    width: 0px;
                    height: 100vh;
                    overflow: hidden;
                    padding: 0px;
                    background-color: transparent; /*#f9fafb;*/
                    transition: width 0.5s ease;
                }
                .thrinkle-sidebar-container.open{
                    width: 100vw;
                }
                /* sidebar menu container*/
                .thrinkle-sidebar-menu-container{
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: max(200px, 80%);
                    padding-top: 10px;  
                    padding-left: 10px; 
                    background-color: #f9fafb;
                }
                .thrinkle-menu-container.open{
                    padding-top: 20px;                
                    scrollbar-gutter: stable;
                }
                .thrinkle-menu-group{
                    padding-left: 5px;
                    padding-right: 5px;
                }
                .thrinkle-menu-group-title{
                    font-size: 0.8rem;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 5px;
                }
                .thrinkle-menu-item-group{
                    width: 100%;
                }
                .thrinkle-menu-item{
                    display: inline-block;
                    padding-left: 5px;
                    text-decoration: none;
                    align-items: center;
                    width: 100%;
                    background-color: transparent;
                    white-space: no-wrap;
                }
                .thrinkle-sidebar-menu-pad{
                    display: flex;
                    flex-grow: 1;
                    background-color: rgba(0,0,0,0.5);
                }
                /* sidebar menu container */

                /*content container */
                .thrinkle-content-container{
                    box-sizing: border-box;             
                    width: 100vw;
                }
                /* content container */
            }
            `;
            style.textContent = this.css;
            if(!document.head.querySelector("style#thrinkle_layout")){
                document.head.appendChild(style);
            }
            /*bundle css object*/
        }
        

        attributeChangedCallback(name, oldValue, newValue) {
            
        }
        connectedCallback() {
            window.addEventListener('thrinkle-styles-loaded', function(e) {
                this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                this.sidebarCloseIconContainer.addEventListener('click',(e)=>{
                    e.preventDefault()
                    if(window.innerWidth>=667){
                        this.toggleMenuContainersOpenState()
                    }else{
                        this.removeMenuContainersOpenState()
                        this.toggleOpenOnDesktop(this.sidebarContainer)
                        this.toggleOpenOnDesktop(this.menuContainer)
                    }
                    
                    const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked')
                    if(shrinked==='false'){              
                        this.sidebarCloseIconContainer.setAttribute("shrinked","true")
                    }else{
                        this.sidebarCloseIconContainer.setAttribute("shrinked","false")
                    }
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                })
                this.sidebarMenuPad.addEventListener('click',(e)=>{
                    e.preventDefault()
                    this.removeMenuContainersOpenState()
                    const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked')
                    if(shrinked==='false'){              
                        this.sidebarCloseIconContainer.setAttribute("shrinked","true")
                    }else{
                        this.sidebarCloseIconContainer.setAttribute("shrinked","false")
                    }
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon()
                })

                // retrieve values that are passed by user 
                // in javascript
                this._upgradeProperty('menu');
                
                // Create media query matcher
                this.mediaQuery = window.matchMedia(`(width >= ${getCssVariable(`--thrinkle-br-sm`)})`);
                // Listen for query changes
                this.mediaQuery.addEventListener('change', (e)=>this.handleMediaQueryMatch(this,this.mediaQuery));
                // this.handleMediaQueryMatch(this,this.mediaQuery)
                // remove the loading attribute to show the alert
                this.removeAttribute('data-thrinkle-loading');
            }.bind(this), true);
        }	
        disconnectedCallback() {
            
        }	
        adoptedCallback() {
            
        }
        toggleMenuContainersOpenState(){
            this.sidebarContainer.classList.toggle('open')
            this.menuContainer.classList.toggle('open')
            this.sidebarSiteTitleContainer.classList.toggle('open')
            
            const menuItems = document.querySelectorAll('.thrinkle-menu-item')
            menuItems.forEach(item => {
                item.classList.toggle('open')
            });

            const menuItemTitleSpans = document.querySelectorAll('.thrinkle-menu-item-title-span')
            menuItemTitleSpans.forEach(item => {
                item.classList.toggle('open')
            });
            
            const menuItemGroups = document.querySelectorAll('.thrinkle-menu-item-group')
            menuItemGroups.forEach(item => {
                item.classList.toggle('open')
            });

            const menuGroups = document.querySelectorAll('.thrinkle-menu-group')
            menuGroups.forEach(item => {
                item.classList.toggle('open')
            });
            const menuItemGroupTitles = document.querySelectorAll('.thrinkle-menu-group-title')
            menuItemGroupTitles.forEach(item => {
                item.classList.toggle('open')
            });
        }

        removeMenuContainersOpenState(){
            this.sidebarContainer.classList.remove('open')
            this.menuContainer.classList.remove('open')
            this.sidebarSiteTitleContainer.classList.remove('open')
            
            const menuItems = document.querySelectorAll('.thrinkle-menu-item')
            menuItems.forEach(item => {
                item.classList.remove('open')
            });

            const menuItemTitleSpans = document.querySelectorAll('.thrinkle-menu-item-title-span')
            menuItemTitleSpans.forEach(item => {
                item.classList.remove('open')
            });
            
            const menuItemGroups = document.querySelectorAll('.thrinkle-menu-item-group')
            menuItemGroups.forEach(item => {
                item.classList.remove('open')
            });

            const menuGroups = document.querySelectorAll('.thrinkle-menu-group')
            menuGroups.forEach(item => {
                item.classList.remove('open')
            });
            const menuItemGroupTitles = document.querySelectorAll('.thrinkle-menu-group-title')
            menuItemGroupTitles.forEach(item => {
                item.classList.remove('open')
            });
        }
        handleMediaQueryMatch(element,query){
            if(query.matches){
                if(this.sidebarCloseIconContainer.getAttribute('shrinked')==='true'){
                    this.removeMenuContainersOpenState()
                }else{
                    this.removeMenuContainersOpenState()
                    this.toggleMenuContainersOpenState()
                }
            }else{
                this.removeMenuContainersOpenState()
                if(this.sidebarCloseIconContainer.getAttribute('shrinked')==='false'){
                    this.sidebarContainer.classList.toggle('open')
                    this.menuContainer.classList.toggle('open')
                }
            }
        }
        getSidebarIcon (){
            const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked')
            if(shrinked==='false'){              
                // this.sidebarCloseIconContainer.setAttribute("shrinked","true")
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
                // this.sidebarCloseIconContainer.setAttribute("shrinked","false")
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

        // ensures values passed from plain javascript 
        // gets captured
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        set menu(value) {
            this._menu = value;
            this.renderMenu(); // Trigger an update in your component
        }

        get menu() {
            return this._menu;
        }

        toggleOpenOnDesktop(element){
            if(window.innerWidth>=667){
                element.classList.toggle('open')
            }
        }
        renderMenu() {
            
           // add menu 
            this.menuContainer = document.createElement('div')
            this.menuContainer.classList.add('thrinkle-menu-container')
            this.toggleOpenOnDesktop(this.menuContainer)
            this.sidebarMenuContainer.appendChild(this.menuContainer)
            this._menu.forEach((group)=>{
                const menuGroup = document.createElement('div')
                menuGroup.classList.add('thrinkle-menu-group')
                this.toggleOpenOnDesktop(menuGroup)
                this.menuContainer.appendChild(menuGroup) 

                const menuGroupTitle = document.createElement('div')
                menuGroupTitle.classList.add(
                    'thrinkle-menu-group-title',
                    'thrinkle-text-zinc-700'
                )
                this.toggleOpenOnDesktop(menuGroupTitle)
                menuGroupTitle.innerText = group.groupTitle
                menuGroup.appendChild(menuGroupTitle)
                group.menu.forEach((menu)=>{
                    const itemContainer = document.createElement('div')
                    itemContainer.classList.add('thrinkle-menu-item-group')
                    if(this.isActiveNavLink(menu.url)){
                        itemContainer.classList.add('active')
                    }
                    this.toggleOpenOnDesktop(itemContainer)
                    const itemIconContainer = document.createElement('div')
                    itemIconContainer.classList.add('thrinkle-menu-item-icon')
                    this.toggleOpenOnDesktop(itemIconContainer)
                    itemIconContainer.innerHTML=menu.icon? `<i data-lucide="${menu.icon}" style="width:18px;height:18px"></i>` : ''
                    const title = document.createElement('a')
                    title.classList.add(
                        'thrinkle-menu-item',
                        'thrinkle-text-gray-700'
                    )
                    this.toggleOpenOnDesktop(title)
                    title.appendChild(itemIconContainer)
                    const span = document.createElement('span')
                    span.classList.add('thrinkle-menu-item-title-span')
                    span.innerText = menu.title
                    this.toggleOpenOnDesktop(span)
                    title.appendChild(span)
                    title.href = menu.url
                    itemContainer.appendChild(title)
                    menuGroup.appendChild(itemContainer)
                })

            })
            // add menu
            
        }
        isActiveNavLink(href){
            try {
                const targetUrl = new URL(href, window.location.href)
                const currentPath = window.location.pathname.replace(/\$/,"") || "/"
                const targetPath = targetUrl.pathname.replace(/\$/,"") || "/"
                return targetUrl.origin === window.location.origin && targetPath === currentPath
            } catch (error) {
                return false
            }
        }
    }