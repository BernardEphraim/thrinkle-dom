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
        static observedAttributes = ["sidebarMenu","type"];
        
        constructor() {
            super();
            /*set up this custom element attributes*/
            this._sidebarMenu = []   
            
            this.id=this.hasAttribute('id') ? this.getAttribute('id') : `thrinkle-layout-${Math.floor(Math.random() * 1000000)}` 
            this.title = this.hasAttribute('title') ? this.getAttribute('title') : 'Site title' 
            this.setAttribute('title',this.title) 
            this.classList.add("thrinkle-layout"); 
            // keep this element invisible till css is fully loaded
            this.setAttribute('data-thrinkle-loading', '');
            // create the sidebar container
            // this.sidebarDummyContainer = document.createElement('div')
            // this.sidebarDummyContainer.classList.add('thrinkle-sidebar-dummy-container')
            // this.toggleOpenOnDesktop(this.sidebarDummyContainer)
            this.sidebarContainer = document.createElement("div");
            this.sidebarContainer.classList.add('thrinkle-sidebar-container') 
            this.toggleOpenOnDesktop(this.sidebarContainer)
            // this.sidebarDummyContainer.appendChild(this.sidebarContainer)

            // create the content container 
            
            this.dummyContentContainer = document.createElement('div')
            this.dummyContentContainer.classList.add('thrinkle-dummy-content-container')
            
            this.contentContainer = document.createElement("div");
            this.contentContainer.classList.add('thrinkle-content-container')
            
            this.dummyContentContainer.appendChild(this.contentContainer)
            
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
            this.appendChild(this.dummyContentContainer)  
            // this.appendChild(this.contentContainer)
            
            this.sidebarMenuContainer = document.createElement('div')
            this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container')
            this.sidebarContainer.appendChild(this.sidebarMenuContainer)
            
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
                /*overflow-y: auto;
                scrollbar-gutter: stable;*/
                padding: 0px;
                margin: 0px;
                /*min-height: 100vh;*/
                height: 100vh;
                width: 100%;
                background-color: #f8f8f8; 
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

            .thrinkle-dummy-content-container{
                box-sizing: border-box;             
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                overflow-y: auto;
                scrollbar-color: #c8cdd8 transparent;
                scrollbar-gutter: stable;
                scrollbar-width: thin;
                background-color: transparent;
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
                border-bottom-color: #f3f4f6;/*--thrinkle-gray-100*/
                background-color: #f9fafb; /*--thrinkle-gray-50*/
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
                background-color: transparent;
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
                scrollbar-color: #c8cdd8 transparent;
                scrollbar-gutter: stable;
                scrollbar-width: thin;
                overflow-x: hidden;
                white-space: no-wrap;
                margin-top: 10px;
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
            .thrinkle-extra-item-container{
                padding-left: 5px;
                padding-right: 5px;
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
            
            .thrinkle-user-profile-slab{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 40px;
                padding: 5px;
                margin-top: 20px;
                margin-bottom: 10px;
                background-color: transparent;
                border-radius: 0.5rem;
                cursor: pointer;

            }
            .thrinkle-user-profile-slab:hover{
                background-color: #f3f4f6;
            }
                
            .thrinkle-user-avatar{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                border-radius: 15px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                background-color: #e5e7eb;
            }
            .thrinkle-username{
                display: flex;
                flex: 1;
                margin-left: 10px;
                font-weight: bold;
            }
            .thrinkle-username-click{

            }

            
            .thrinkle-tool-tip-container{
                display: none;
                opacity: 0;
                max-width: 300px;
                width: max-content;
                height: max-content;
                position: absolute;
                z-index: 9999;     
                padding-bottom: 5px;           
                border-radius: 0.5rem;
                background-color: #f9fafb;
                box-shadow: 
                    0px 4px 6px -1px rgba(0, 0, 0, 0.1), 
                    0px 2px 4px -2px rgba(0, 0, 0, 0.1),
                    0px -1px 1px -1px rgba(0, 0, 0, 0.1), 
                    0px -1px 1px -1px rgba(0, 0, 0, 0.1);                
            }
            .thrinkle-tool-tip-container.open{
                display: block;
                opacity: 1;
                transition: opacity 1s ease;
                transition-behavior: allow-discrete;
                @starting-style {
                    opacity: 0;
                }
            }

            .thrinkle-user-display{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: max-content;
                padding: 10px;
                background-color: transparent;
                border-top-radius: 0.5rem;                
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #e5e7eb;
                cursor: default;
            }
            
            .thrinkle-username-container{
                display: block;
                flex: 1;
                margin-left: 10px;
                font-weight: bold;
            }
            .thrinkle-username-container span{
                display: block;
                font-weight: normal;
                color: #6b7280;
            }

            .thrinkle-divider{
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: #e5e7eb;
                width: 100%;
                padding-top: 2px;
                padding-bottom: 2px;
            }
            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-layout[data-thrinkle-loading] {
                display: none;
            }	
            
            @media screen and (width >= 667px){
                .thrinkle-sidebar-container{
                    display: flex;
                    flex-direction: row;
                    /*max-width: 20%;*/
                    width: 63px;
                    top:0px;
                    height: 100vh;
                    padding: 18px;
                    padding-left: 5px;
                    padding-right: 0px;
                    overflow: none;
                    transition: width 0.5s ease;
                    background-color: transparent;
                }
                .thrinkle-sidebar-container.open{
                    width: max(400px,20%);
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
                .thrinkle-menu-container{
                    flex: 1;
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
                    flex: 1;
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
                .thrinkle-menu-item-button{
                    width: 100%;
                    background-color: transparent;
                    border-width: 0px;
                    text-align: left;
                    font-size: 1rem;
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
                
                .thrinkle-user-profile-slab.open{
                
                }
                .thrinkle-user-avatar.open{

                }
                                
                .thrinkle-username{
                    display: none;
                }                
                .thrinkle-username.open{
                    display: flex;
                }
                .thrinkle-username-click{
                    display: none;
                }
                .thrinkle-username-click.open{
                    display: flex;
                }
                /* sidebar menu container*/

                /*content container */
                .thrinkle-content-container{
                    box-sizing: border-box;             
                    display: flex;
                    flex-grow: 1;
                    flex-direction: column;
                    /*min-width: 80%;
                    width: 80%;
                    min-height: 0px;*/
                    margin-left: 5px;
                    margin-right: 10px;
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
                    height: 80%;                
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
                .thrinkle-menu-item-button{
                    width: 100%;
                    background-color: transparent;
                    border-width: 0px;
                    text-align: left;
                    font-size: 1rem;
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
                        this.toggleOpenOnMobile(this.sidebarContainer)
                        this.toggleOpenOnMobile(this.menuContainer)
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
                this._upgradeProperty('sidebarMenu');
                this._upgradeProperty('userProfile');
                
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
            document.querySelector('.thrinkle-site-title-span').classList.toggle('open')
            
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

            this.username.classList.toggle('open')
            this.usernameClick.classList.toggle('open')
        }

        removeMenuContainersOpenState(){
            this.sidebarContainer.classList.remove('open')
            this.menuContainer.classList.remove('open')
            this.sidebarSiteTitleContainer.classList.remove('open')
            document.querySelector('.thrinkle-site-title-span').classList.remove('open')
            
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

            this.username.classList.remove('open')
            this.usernameClick.classList.remove('open')
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
                    this.toggleOpenOnMobile(this.sidebarContainer)
                    this.toggleOpenOnMobile(this.menuContainer)
                    this.toggleOpenOnMobile(this.username)
                    this.toggleOpenOnMobile(this.usernameClick)
                }
            }
        }
        getSidebarIcon (){
            const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked')
            if(shrinked==='false'){              
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
        set sidebarMenu(value) {
            this._sidebarMenu = value;
            this.renderMenu(); // Trigger an update in your component
            this.renderUserProfileSlab()
        }

        get sidebarMenu() {
            return this._sidebarMenu;
        }

        set userProfile(value){
            this._userProfile = value
        }
        get userProfile(){
            return this._userProfile
        }
        toggleOpenOnDesktop(element){
            if(window.innerWidth >= 667){
                element.classList.toggle('open')
            }
        }
        toggleOpenOnMobile(element){
            if(window.innerWidth < 667){
                element.classList.toggle('open')
            }
        }
        renderMenu() {            
           // add menu 
            this.menuContainer = document.createElement('div')
            this.menuContainer.classList.add('thrinkle-menu-container')
            this.toggleOpenOnDesktop(this.menuContainer)
            this.sidebarMenuContainer.appendChild(this.menuContainer)
            this._sidebarMenu.menu.forEach((group)=>{
                console.log(group)
                // const menuGroupContainer = document.createElement('div')
                // menuGroupContainer.classList.add('thrinkle-menu-group')
                // this.toggleOpenOnDesktop(menuGroupContainer)
                // this.menuContainer.appendChild(menuGroupContainer) 

                // const menuGroupTitle = document.createElement('div')
                // menuGroupTitle.classList.add(
                //     'thrinkle-menu-group-title',
                //     'thrinkle-text-zinc-700'
                // )
                // this.toggleOpenOnDesktop(menuGroupTitle)
                // menuGroupTitle.innerText = group.groupTitle
                // menuGroupContainer.appendChild(menuGroupTitle)
                const menuGroupContainer = this.generateMenuGroupContainer(group)
                this.generateMenu({
                    menuGroupContainer: menuGroupContainer,
                    group: group
                })
                // group.menu.forEach((menu)=>{
                //     const itemContainer = document.createElement('div')
                //     itemContainer.classList.add('thrinkle-menu-item-group')
                //     if(this.isActiveNavLink(menu.url)){
                //         itemContainer.classList.add('active')
                //     }
                //     this.toggleOpenOnDesktop(itemContainer)
                //     const itemIconContainer = document.createElement('div')
                //     itemIconContainer.classList.add('thrinkle-menu-item-icon')
                //     this.toggleOpenOnDesktop(itemIconContainer)
                //     itemIconContainer.innerHTML=menu.icon? `<i data-lucide="${menu.icon}" style="width:18px;height:18px"></i>` : ''
                //     const title = document.createElement('a')
                //     title.classList.add(
                //         'thrinkle-menu-item',
                //         'thrinkle-text-gray-700'
                //     )
                //     this.toggleOpenOnDesktop(title)
                //     title.appendChild(itemIconContainer)
                //     const span = document.createElement('span')
                //     span.classList.add('thrinkle-menu-item-title-span')
                //     span.innerText = menu.title
                //     this.toggleOpenOnDesktop(span)
                //     title.appendChild(span)
                //     title.href = menu.url
                //     itemContainer.appendChild(title)
                //     menuGroup.appendChild(itemContainer)
                // })

            })
            // add menu            
        }
        generateMenuGroupContainer(group){
            const menuGroupContainer = document.createElement('div')
            menuGroupContainer.classList.add('thrinkle-menu-group')
            this.toggleOpenOnDesktop(menuGroupContainer)
            this.menuContainer.appendChild(menuGroupContainer) 

            const menuGroupTitle = document.createElement('div')
            menuGroupTitle.classList.add(
                'thrinkle-menu-group-title',
                'thrinkle-text-zinc-700'
            )
            this.toggleOpenOnDesktop(menuGroupTitle)
            menuGroupTitle.innerText = group.groupTitle
            menuGroupContainer.appendChild(menuGroupTitle)
            return menuGroupContainer
        }
        generateMenu({
            menuGroupContainer, // the container to hold this group of menus
            group, // the object holding the menus in this group
            needsContainer=false, // indicates if each menu should be placed in a padded container
            needsDivider=false // indicates if a divider is needed between menu items
        }){
            const menuCount = group.menu.length
            let count = 0
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
                let title;
                if(menu?.method){
                    title = document.createElement('form')
                    title.classList.add('thrinkle-menu-item')
                    title.action = menu.url
                    title.method = menu.method

                    const button = document.createElement('button')
                    button.classList.add(
                        // 'thrinkle-menu-item',
                        'thrinkle-menu-item-button',
                        'thrinkle-text-gray-700'
                    )
                    this.toggleOpenOnDesktop(button)
                    button.appendChild(itemIconContainer)
                    
                    const span = document.createElement('span')
                    span.classList.add('thrinkle-menu-item-title-span')
                    span.innerText = menu.title
                    this.toggleOpenOnDesktop(span)
                    button.appendChild(span)
                    
                    title.appendChild(button)
                }else{
                    title = document.createElement('a')
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
                }

                // const title = document.createElement('a')
                // title.classList.add(
                //     'thrinkle-menu-item',
                //     'thrinkle-text-gray-700'
                // )
                // this.toggleOpenOnDesktop(title)
                // title.appendChild(itemIconContainer)
                
                // const span = document.createElement('span')
                // span.classList.add('thrinkle-menu-item-title-span')
                // span.innerText = menu.title
                // this.toggleOpenOnDesktop(span)
                // title.appendChild(span)
                // title.href = menu.url
                itemContainer.appendChild(title)
                if(needsDivider && count < menuCount && count > 0){
                    let divider = document.createElement('div')
                    divider.classList.add('thrinkle-divider')
                    menuGroupContainer.appendChild(divider)
                }
                count++
                if(needsContainer){
                    const extraItemContainer = document.createElement('div')
                    extraItemContainer.classList.add('thrinkle-extra-item-container')
                    extraItemContainer.appendChild(itemContainer)
                    menuGroupContainer.appendChild(extraItemContainer)
                }else{
                    menuGroupContainer.appendChild(itemContainer)
                }
                
            })
        }
        getInitials(string=''){
            return string.split(' ').map(word=>word.charAt(0)).toString().replaceAll(',','').toUpperCase()
        }
        renderUserProfileSlab(){
            // add user profile slab
            this.userProfileSlab = document.createElement('div')
            this.userProfileSlab.classList.add('thrinkle-user-profile-slab')   
            this.sidebarMenuContainer.appendChild(this.userProfileSlab)            
            // add user profile slab
            
            this.userAvater = document.createElement('div')
            this.userAvater.classList.add('thrinkle-user-avatar') 
            
            // if(this.hasAttribute('avatar')){
            //     this.userAvater.style.backgroundImage = `url(${this.getAttribute('avatar')})`
            // }else{
            //     if(this.hasAttribute('user')){
            //         this.userAvater.innerText = this.getInitials(this.getAttribute('user'))
            //     }
            // }
            if(this.userProfile.user.avatar){
                this.userAvater.style.backgroundImage = `url(${this.userProfile.user.avatar})`
            }else{
                if(this.userProfile.user.name){
                    this.userAvater.innerText = this.getInitials(this.userProfile.user.name)
                }else{
                    this.userAvater.innerText = this.getInitials('User Photo')
                }
            }           
            this.userAvater.addEventListener('click',(e)=>{
                this.popUpToolTip()    
            })
            this.userProfileSlab.appendChild(this.userAvater)

            this.username = document.createElement('div')
            this.username.classList.add('thrinkle-username') 
            this.toggleOpenOnDesktop(this.username)
            this.username.innerText = this.userProfile.user.name ? this.userProfile.user.name : 'username'
            
            this.username.addEventListener('click',(e)=>{
                this.popUpToolTip()    
            })

            this.userProfileSlab.appendChild(this.username)

            this.usernameClick = document.createElement('div')
            this.usernameClick.classList.add('thrinkle-username-click') 
            this.usernameClick.innerHTML = `<i data-lucide="chevrons-up-down" style="width:18px;height:18px"></i>`
            this.toggleOpenOnDesktop(this.usernameClick)
            this.usernameClick.addEventListener('click',(e)=>{
                this.popUpToolTip()    
            })
            this.userProfileSlab.appendChild(this.usernameClick)
            this.renderToolTip()
        }
        popUpToolTip(){
            this.toolTipContainer.classList.add('open')
            const position = this.getToolTipPosition(this.toolTipContainer,this.userProfileSlab)
            this.toolTipContainer.style.top = `${position.top}px`
            this.toolTipContainer.style.left = `${position.left}px`
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
        renderToolTip(){
            this.toolTipContainer = document.createElement('div')
            this.toolTipContainer.classList.add('thrinkle-tool-tip-container')
            document.addEventListener('click',(e)=>{
                if(
                    !this.toolTipContainer.contains(e.target) && 
                    !this.username.contains(e.target) && 
                    !this.userAvater.contains(e.target) && 
                    !this.usernameClick.contains(e.target) && 
                    !this.userProfileSlab.contains(e.target))
                {
                    if(this.toolTipContainer.classList.contains('open')){
                        this.toolTipContainer.classList.remove('open')
                    }                   
                }
            })            
            this.userProfileSlab.appendChild(this.toolTipContainer)
            


            
            // add user profile slab
            this.userDisplay = document.createElement('div')
            this.userDisplay.classList.add('thrinkle-user-display')   
            this.toolTipContainer.appendChild(this.userDisplay)            
            
            
            this.avater = document.createElement('div')
            this.avater.classList.add('thrinkle-user-avatar') 
            
            if(this.userProfile.user.avatar){
                this.avater.style.backgroundImage = `url(${this.userProfile.user.avatar})`
            }else{
                if(this.userProfile.user.name){
                    this.avater.innerText = this.getInitials(this.userProfile.user.name)
                }else{
                    this.avater.innerText = this.getInitials('User Photo')
                }
            }           
            
            this.userDisplay.appendChild(this.avater)

            this.usernameDisplay = document.createElement('div')
            this.usernameDisplay.classList.add('thrinkle-username-container') 
            this.toggleOpenOnDesktop(this.usernameDisplay)
            this.usernameDisplay.appendChild(document.createTextNode(this.userProfile.user.name ? this.userProfile.user.name : 'username'))
            
            this.usernameEmail = document.createElement('span')
            this.usernameEmail.appendChild(document.createTextNode(this.userProfile.user.email ? this.userProfile.user.email : 'email'))
            this.usernameDisplay.appendChild(this.usernameEmail)
            
            this.userDisplay.appendChild(this.usernameDisplay)

            
            // add user profile slab
            
            // add settings
            this.generateMenu({
                menuGroupContainer:this.toolTipContainer,
                group:this.userProfile.user,
                needsContainer: this.userProfile?.user?.menuSettings?.needsContainer ?? true,
                needsDivider: this.userProfile?.user?.menuSettings?.needsDivider ?? true
                })
            // add settings
        }
        getToolTipPosition(toolTip,target){
            let targetRect = target.getBoundingClientRect()
            let toolTipRect = toolTip.getBoundingClientRect()
            let top = targetRect.top - (toolTipRect.height + 5)
            // let left = targetRect.left - (toolTipRect.left + 5)
            let left = 5;
            let right = targetRect.right - (toolTipRect.right + 5)
            let bottom = targetRect.bottom - (toolTipRect.bottom + 5)
            
            if(top <= 0 ){    
                // check along the y-axis
                if(targetRect.bottom + toolTipRect.height + 5 < window.innerHeight){
                    top = targetRect.bottom + 5;
                }else{
                    top = 5; 
                }
                // check along the x axis
                if(targetRect.right + toolTipRect.width + 5 < window.innerWidth){
                    left = targetRect.right + 5;
                }else{
                    left = targetRect.right - toolTipRect.width;
                }                
            }else{
                if(targetRect.left - (toolTipRect.width + 5) < 0){
                    left = targetRect.left
                }
            }
            return {
                top: top, 
                left: left, 
                right: right, 
                bottom: bottom
            }
        }
    }