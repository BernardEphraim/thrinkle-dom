import { getCssVariable, hexToOklch,oklchLightnessContrast, setupAnimation, getSVG } from "../function.js";
/**
 * working thrinkle container class written on the 9/11/2023 by Bernard Ephraim
 * @element thrinkle-layout 
 * @summary is a container that sets up a layout for a web application. 
 * It provides a sidebar, header, content area, and footer. The layout is responsive 
 * and can be customized through attributes and properties.
 * Declared form:
 * <thrinkle-layout>Some content</thrinkle-layout>
 *  Internal structure:
    <thrinkle-layout
        id="layout"
        toggleiconsize="16"
        title="Website title"
        page="Page title"
        logourl="./images/logo.svg"
        avatar="./images/photo.jpg"
        user="Bernard Ephraim John"
    ></thrinkle-layout>
 *   
 *   the snippet above describes the html structure of the thrinkle container implementation;
 * 	@method onclick (optional) - takes the reference to an event handler (note arguments should not be passed)
 *  @attr {string} id - a unique identifier for this element. Note: it is useful for setting up the sidebar menu and other settings in JavaScript
 *  @attr {integer} [16] toggleiconsize (optional) - sets the size of the sidebar toggle icons 
 *  @attr {string} page - the title of the page
 *  @attr {string} title - the name of the website
 *  @attr {string} logourl - the url of the website logo
 *  @attr {string} avatar - the url to the user photo
 *  @attr {string} user - the name of the user
 *  @prop {object} container - settings the layout 
 *  @prop {string} container.logoUrl - the url to the website logo. Note: this property takes precedence over the logourl attribute
 *  @prop {color} container.backgroundColor - the background color for the layout in general
 *  @prop {object} container.scrollbar - holds settings for the layout scrollbar
 *  @prop {color} container.scrollbar.backgroundColor - defines the color of the scroll bars
 *  @prop {object} container.head - sets the page header
 *  @prop {color} container.head.backgroundColor - sets the background color of the page header
 *  @prop {color} container.head.borderBottomColor - sets the page header bottom border color
 *  @prop {object} container.article - sets the color of the page article section
 *  @prop {color} container.article.backgroundColor - sets the background color of the article section
 *  @prop {color} container.article.boxShadowColor - sets the color of box shadow of the article window
 *  @prop {object} footer - sets the footer
 *  @prop {object} footer.settings - setting the general properties of the footer
 *  @prop {color} footer.settings.backgroundColor - sets the background color of the footer
 *  @prop {color} footer.settings.linkCategoryColor - sets the font color of the title of each group of links in the footer
 *  @prop {color} footer.settings.linkColor - sets the font color for each link in the footer
 *  @prop {color} footer.settings.linkHoverColor - sets the font color of for each link in the footer on hover
 *  @prop {object} footer.html - receives and sets any html like forms in the footer
 *  @prop {string} footer.html.id - the unique identifier for the html inserted in the footer
 *  @prop {object} footer.html.position - defines the location of the html in the footer
 *  @prop {string} footer.html.position.vertical ['within' | 'top' | 'bottom']- default 'top', defines the vertical location of the html inserted in the footer
 *  @prop {string} footer.html.position.horizontal ['left' | 'center' | 'right'] - default 'left', defines the horizontal location of the html inserted in the footer
 *  @prop {array of object} footer.policies [{title:'cookies', url: './settings'}], - defines useful company policy links
 *  @prop {string} footer.copyright - defines the copyright
 *  @prop {array of object} footer.socials [{icon: "facebook",url: 'https://facebook.com/thrinkle'}] - defines the social icons and links
 *  @prop {array of object} footer.links [{heading: 'Product',links: [{title: 'Overview',url: './overview'}]}]- defines footer links
 *  @prop {object} userProfile - sets the user profile and settings slab
 *  @prop {object} userProfile.user - sets user profile
 *  @prop {string} userProfile.user.avatar - sets the user profile photo
 *  @prop {string} userProfile.user.name - sets the name of the user
 *  @prop {string} userProfile.user.email - sets the username or email of the user
 *  @prop {array of objects} userProfile.user.menu [{title: 'settings',url:'/',icon:'settings'}] - defines user related links. Note: icon values are obtained from lucide icons
 *  @prop {object} userProfile.user.menuSettings - defines the layout of menu items in the user slab
 *  @prop {boolean} userProfile.user.menuSettings.needsContainer - when true adds a container around menu items for proper display
 *  @prop {boolean} userProfile.user.menuSettings.needsDivider - when true inserts divider lines between menu items
 *  @prop {object} quickAccessMenu - defines a special menu for quick access
 *  @prop {boolean} quickAccessMenu.menuSettings.needsContainer - when true adds a container around menu items for proper display
 *  @prop {boolean} quickAccessMenu.menuSettings.needsDivider - when true inserts divider lines between menu items
 *  @prop {array of object} quickAccessMenu.menu [{title: 'dashboard',url:'/graduation',icon:'users'}] - defines an array of menu items
 *  @prop {object} sidebarMenu - defines the main menu of the page placed at the sidebar
 *  @prop {object} sidebarMenu.menuSettings - defines the settings for the sidebar menu items
 *  @prop {boolean} sidebarMenu.menuSettings.needsContainer - when true adds a container around menu items for proper display
 *  @prop {boolean} sidebarMenu.menuSettings.needsDivider - when true inserts divider lines between menu items
 *  @prop {color} sidebarMenu.menuSettings.backgroundColor - sets the background color of the sidebar
 *  @prop {color} sidebarMenu.menuSettings.hoverBgColor - sets the background hover color for items in the sidebar
 *  @prop {color} sidebarMenu.menuSettings.avatarBgColor - sets the background color of the user avatar or photo
 *  @prop {color} sidebarMenu.menuSettings.toggleIconColor - set the color of the sidebar trigger icon found in the header of the page
 *  @prop {integer} sidebarMenu.menuSettings.toggleIconSize - default 16, sets the size of the sidebar trigger icon found in the header of the page
 *  @prop {object} sidebarMenu.menuSettings.toolTip - defines the colors of the dialog box for user links display
 *  @prop {color} sidebarMenu.menuSettings.toolTip.backgroundColor - sets the background color of the user links dialog box
 *  @prop {color} sidebarMenu.menuSettings.toolTip.boxShadowColor - sets the box shadow color of the user links dialog box
 *  @prop {color} sidebarMenu.menuSettings.toolTip.textColor - sets the text color of texts in the user dialog box that are not menu
 *  @prop {color} sidebarMenu.menuSettings.overlayColor - sets the overlay background color. This is visible when the sidebar is opened in mobile view
 *  @prop {array of object} sidebarMenu.menu 
 *  [{groupTitle:'Platform',
            menu:[
                {title: 'dashboard',url:'/',icon:'users'},
                {groupTitle:'Students',
                    menu:[
                        {title: 'name',url:'/',icon:'graduation-cap'},
                        {groupTitle:'Fees',
                            menu:[
                                {title: 'Term',url:'/',icon:'graduation-cap'},
                                {title: 'session',url:'./images/logo.jfif'}
                            ]},
                    ]},
                {title: 'logout',url:'./logout', icon:'log-out', method:'post'}
            ]
    }]- defines the user menu in the sidebar
 *  
*/
    export default class ThrinkleLayout extends HTMLElement {
        static observedAttributes = ["sidebarMenu","type"];
        constructor() {
            super();
            /*set up this custom element attributes*/
            this._sidebarMenu = [];
            
            /*setup this custom element attributes*/
           
        }

        attributeChangedCallback(name, oldValue, newValue) {

        }
        connectedCallback() {
             /*bundle css object*/
            const containerBgColor = this.container?.backgroundColor || 'var(--thrinkle-gray-100)';
            const headContainerBgColor = this.container?.head?.backgroundColor || containerBgColor;
            const headBorderBottomColor = this.container?.head?.borderBottomColor || `oklch(from ${headContainerBgColor} calc(l - 0.05) c h /0.5)`;
            const articleBgColor = this.container?.article?.backgroundColor || headContainerBgColor;
            const articleBoxShadowColor = this.container?.article?.boxShadowColor || `oklch(from ${articleBgColor} calc(l * 0.5) c h /0.3)`;
            const toolTipBgColor = this.sidebarMenu?.menuSettings?.toolTip?.backgroundColor || headContainerBgColor;
            const toolTipBoxShadowColor = this.sidebarMenu?.menuSettings?.toolTip?.boxShadowColor || `oklch(from ${toolTipBgColor} calc(l * 0.5) c h /0.3)`;
            const sidebarMenuBgColor = this.sidebarMenu?.menuSettings?.backgroundColor || headContainerBgColor;
            const sidebarOverlayColor = this.sidebarMenu?.menuSettings?.overlayColor || `oklch(from ${sidebarMenuBgColor} calc(l * 0.5) c h /0.3)`;
            const sidebarIconColor = this.sidebarMenu?.menuSettings?.toggleIconColor || oklchLightnessContrast(sidebarMenuBgColor).contrast;
            const scrollbarColor = this.container?.scrollbar?.backgroundColor || `oklch(from ${containerBgColor} calc(l * 0.5) c h /0.3)`;
            const hoverBgColor = this.sidebarMenu?.menuSettings?.hoverBgColor || `oklch(from ${sidebarMenuBgColor} calc(l * 0.5) c h /0.05)`;
            const menuItemColor = this.sidebarMenu?.menuSettings?.menuItemColor || oklchLightnessContrast(sidebarMenuBgColor).midContrast;
            const avatarBgColor = this.sidebarMenu?.menuSettings?.avatarBgColor || oklchLightnessContrast(sidebarMenuBgColor).contrast;
            const toolTipTextColor = this.sidebarMenu?.menuSettings?.toolTip?.textColor || oklchLightnessContrast(toolTipBgColor).contrast;
            const toolTipTextDeepContrastColor = this.sidebarMenu?.menuSettings?.toolTip?.textDeepContrastColor || oklchLightnessContrast(toolTipBgColor).darker;

            this.footerBgColor = "#000000";
            this.footerHeadingColor = "#000000";
            this.footerLinkColor = "#000000";
            this.footerLinkHoverColor = "#ffffff";
            if(this.footer?.settings?.backgroundColor){
                this.footerBgColor = hexToOklch(this.footer.settings.backgroundColor).color;
            }else{
                this.footerBgColor = 'oklch(9% 0 0)';
            }
            this.footerColor = oklchLightnessContrast(this.footerBgColor);
            this.footerHeadingColor = this.footer?.settings?.linkCategoryColor || this.footerColor.contrast;
            this.footerLinkColor = this.footer?.settings?.linkColor || this.footerColor.deepContrast;
            this.footerLinkHoverColor = this.footer?.settings?.linkHoverColor || this.footerColor.midContrast;
           
            /*bundle css object*/
            this.id=this.hasAttribute('id') ? this.getAttribute('id') : `thrinkle-layout-${Math.floor(Math.random() * 1000000)}`;
            this.title = this.hasAttribute('title') ? this.getAttribute('title') : 'Site title';
            this.setAttribute('title',this.title);
            this.page = this.hasAttribute('page') ? this.getAttribute('page') : 'Site page';
            this.setAttribute('page',this.page);
            this.classList.add("thrinkle-layout");
            // keep this element invisible till css is fully loaded
            this.setAttribute('data-thrinkle-loading', '');
            // create the sidebar container
            this.sidebarContainer = document.createElement("div");
            this.sidebarContainer.classList.add('thrinkle-sidebar-container');
            this.toggleOpenOnDesktop(this.sidebarContainer);

            // create the content container 
            this.dummyContentContainer = document.createElement('div');
            this.dummyContentContainer.classList.add('thrinkle-dummy-content-container');
            this.contentContainer = document.createElement("div");
            this.contentContainer.classList.add('thrinkle-content-container');
            this.dummyContentContainer.appendChild(this.contentContainer);
            // create the head container
            this.headContainer = document.createElement('div');
            this.headContainer.classList.add('thrinkle-head-container');
            // create a container to hold the footer and article
            this.articleFooterContainer = document.createElement('div');
            this.articleFooterContainer.classList.add('thrinkle-article-footer-container');
            // create the article container
            this.articleContainer = document.createElement('div');
            this.articleContainer.classList.add('thrinkle-article-container');
            // transfer children in the thrinkle layout to the article container
            while(this.firstChild){
                this.articleContainer.appendChild(this.firstChild);
            }
            this.articleFooterContainer.appendChild(this.articleContainer);
            // append the head container and the article container to the content
            // container
            this.contentContainer.appendChild(this.headContainer);
            this.contentContainer.appendChild(this.articleFooterContainer);
            // append the siderbar container and the content container to the
            // thrinkle layout
            this.appendChild(this.sidebarContainer);
            this.appendChild(this.dummyContentContainer);
    
            this.sidebarMenuContainer = document.createElement('div');
            this.sidebarMenuContainer.classList.add('thrinkle-sidebar-menu-container');
            this.sidebarContainer.appendChild(this.sidebarMenuContainer);
            
            this.sidebarMenuPad = document.createElement('div');
            this.sidebarMenuPad.classList.add('thrinkle-sidebar-menu-pad');
            this.sidebarContainer.appendChild(this.sidebarMenuPad);

            this.sidebarSiteTitleContainer = document.createElement('div');
            this.sidebarSiteTitleContainer.classList.add('thrinkle-sidebar-site-title-container');
            this.toggleOpenOnDesktop(this.sidebarSiteTitleContainer);
            this.sidebarMenuContainer.appendChild(this.sidebarSiteTitleContainer);

            this.sidebarSiteIconContainer = document.createElement('div');
            this.sidebarSiteIconContainer.classList.add('thrinkle-sidebar-site-icon-container');
            this.sidebarSiteTitleContainer.appendChild(this.sidebarSiteIconContainer);
            
            if(this.container?.logoUrl){
                this.sidebarSiteIconContainer.style.backgroundImage = `url(${this.container.logoUrl})`;
            }else if(this.hasAttribute('logourl')){
                this.sidebarSiteIconContainer.style.backgroundImage = `url(${this.getAttribute('logourl')})`;
            }
            this.sidebarSiteTitle = document.createElement('div');
            this.sidebarSiteTitle.classList.add('thrinkle-sidebar-site-title');
            this.sidebarSiteTitleContainer.appendChild(this.sidebarSiteTitle);

            this.siteTitleScroll = document.createElement('div');
            this.siteTitleScroll.classList.add('thrinkle-site-title-scroll');
            
            const spanTitle = document.createElement('span');
            spanTitle.classList.add('thrinkle-site-title-span');
            this.toggleOpenOnDesktop(spanTitle);
            spanTitle.innerText = this.title;
            this.siteTitleScroll.appendChild(spanTitle);

            this.sidebarSiteTitle.appendChild(this.siteTitleScroll);
            // add scrolling animation to the website title if
            // longer than 30 characters
            if (this.title.length > 30){
                setupAnimation({
                    element: this.siteTitleScroll,
                    animationName: 'scroll-left-animation',
                    animationDuration: '30s',
                    animationIterationCount: 'infinite',
                    animationTimingFunction: 'linear'
                });
            }

            // organize the content of the head container
            // add sidebar control icon
            this.sidebarCloseIconContainer = document.createElement('div');
            this.sidebarCloseIconContainer.classList.add('thrinkle-sidebar-close-icon-container');
            
            if(window.innerWidth>=667){
                this.sidebarCloseIconContainer.setAttribute("shrinked","false");
            }else{
                this.sidebarCloseIconContainer.setAttribute("shrinked","true");
            }
            this.headContainer.appendChild(this.sidebarCloseIconContainer);
            
            if(this.sidebarMenu?.menuSettings?.toggleIconSize){
                this.iconSize = this.sidebarMenu.menuSettings.toggleIconSize;
            }else if(this.hasAttribute('toggleiconsize')){
                this.iconSize = this.getAttribute('toggleiconsize');
            }else{
                this.iconSize = 16;
            }
            
            this.setAttribute('toggleiconsize',this.iconSize);
             
            // add head content container;
            this.headContentContainer = document.createElement('div');
            this.headContentContainer.classList.add('thrinkle-head-content-container')    ;
            
            this.headContentContainer.innerHTML = this.page;
            this.headContainer.appendChild(this.headContentContainer);
            // Your custom element initialization logic here            

            //add the click event listener on the toggleButton function
            //bind to external handlers if provided
            if(this.hasAttribute('onclick')){
                // Convert the string to a function reference
                let onclk = window[this.getAttribute('onclick')];
                // Check if the function exists
                if (typeof onclk === 'function') {
                    // Creating a custom event;
                    const myClickEvent = new CustomEvent('myClickEvent');
                    this.addEventListener('myClickEvent',function(e) {
                        e.preventDefault();
                        //attach the external onclick handler here
                        //this enables us pass a custom event argument that has the
                        //this custom element as the target
                        onclk(e);
                    }.bind(this),true);

                    //add the click event listener on the custom function
                    //return as argument the instance of this object
                    this.addEventListener('click',function(e) {
                        e.preventDefault();
                        //dispatch the custom click event on the custom element
                        this.dispatchEvent(myClickEvent);
                    }.bind(this),true);
                    //add the keypress event listener on the custom function
                    this.addEventListener('keypress',function(e) {
                        e.preventDefault(); // Prevent the default form submission
                        onclk(e);
                    }.bind(this),true);
                }
            }

            this.css = `
            /* Style for the container */
            .thrinkle-layout{
                position: relative;
                display: flex;
                flex-direction: row;
                padding: 0px;
                margin: 0px;
                height: 100vh;
                width: 100%;
                background-color: ${containerBgColor};
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
            
            }

            .thrinkle-dummy-content-container{
                box-sizing: border-box;
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                overflow-y: auto;
                scrollbar-color: ${scrollbarColor} transparent;
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
                border-bottom-color: ${headBorderBottomColor};
                background-color: ${headContainerBgColor};
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
                background-color: ${hoverBgColor};
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

            .thrinkle-article-footer-container{
                display: flex;
                flex-direction: column;
                background-color: ${articleBgColor};
                width: 100%;
                height: max-content;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
            }

            .thrinkle-article-container{
                flex: 1;
                width: 100%;
                padding: 0.5rem;
                background-color: ${articleBgColor};
            }

            /* footer */
            .thrinkle-footer{
                background-color: ${this.footerBgColor};
                width: 100%;
                min-height: 100px;
                height: max-content;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
            }
            .thrinkle-footer-heading{
                font-weight: 600;
                font-size: 1rem;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 8px;
                padding-right: 8px;
                color: ${this.footerHeadingColor};
                display: block;
            }
            .thrinkle-footer-link,
            .thrinkle-policy a{
                display: block;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 8px;
                padding-right: 8px;
                font-size: 0.8rem;
                color: ${this.footerLinkColor};
                transition: color 0.3s ease,
                            font-size 0.3s ease;
            }
            a.thrinkle-footer-link,
            a.thrinkle-social-icon,
            .thrinkle-policy a{
                text-decoration: none;
            }
            a.thrinkle-footer-link:hover,
            .thrinkle-policy a:hover{
                color: ${this.footerLinkHoverColor};
                font-size: 0.75rem;
            }
            
            .thrinkle-copyright{
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                height: max-content;
                padding: 5px;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
                background-color: transparent;
                color: ${this.footerLinkColor};
            }
            .thrinkle-policy{
                display: flex;
                flex: 1;
                justify-content: left;
                align-items: left;
                height: max-content;
                padding: 5px;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
                background-color: transparent;
                color: ${this.footerLinkColor};
            }

            .thrinkle-socials{
                display: flex;
                flex: 1;
                justify-content: left;
                height: max-content;
                padding: 5px;
                border-bottom-right-radius: 0.5rem;
                border-bottom-left-radius: 0.5rem;
                background-color: transparent;
                color: ${this.footerLinkColor};
            }
            .thrinkle-social-icon{
                margin-left: 5px;
                margin-right: 5px;
                width: 20px;
                height: 20px;
                fill: ${this.footerLinkColor};
                stroke: ${this.footerLinkColor};
                transition: fill 0.3s ease,
                            stroke 0.3s ease,
                            width 0.3s ease,
                            height 0.3s ease;
            }
            .thrinkle-social-icon:hover{
                width: 18px;
                height: 18px;
                cursor: pointer;
                fill: ${this.footerLinkHoverColor};
                stroke: ${this.footerLinkHoverColor};
            }
            /* footer */

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
                background-color: ${hoverBgColor};
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
            .thrinkle-sidebar-close-icon{
                width: ${this.iconSize}px;
                height: ${this.iconSize}px;
                fill: none;
                stroke: ${sidebarIconColor};
                transition: fill 0.3s ease,
                            stroke 0.3s ease,
                            width 0.3s ease,
                            height 0.3s ease;
            }
            .thrinkle-sidebar-site-title{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex: 1;
                min-width: 0px;
                height: 32px;
                overflow: hidden;
                font-weight: 600;
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
                scrollbar-color: ${scrollbarColor} transparent;
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
            .thrinkle-menu-sub-group-pad{
                margin-left: 15px;
                width: calc(100% - 15px);
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
                background-color: ${hoverBgColor};
                border-radius: 0.5rem;
                font-weight: 500;
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
            
            .thrinkle-quick-access-menu-container{
                display: flex;
                flex-direction: column;
                width: calc(100% - 15px);
                max-height: 150px;
                scrollbar-color: ${scrollbarColor} transparent;
                scrollbar-gutter: stable;
                scrollbar-width: thin;
                overflow-x: hidden;
                overflow-y: auto;
                margin-top: 15px;
                margin-left: 15px;
                margin-right: 15px;
                background-color: transparent;
            }
            div.thrinkle-quick-access-menu-container a{
                color: ${menuItemColor};
                font-weight: 400;
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
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
                background-color: ${hoverBgColor};
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
                background-color: ${avatarBgColor};
            }
            .thrinkle-username{
                display: flex;
                flex: 1;
                margin-left: 10px;
                font-weight: 500;
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
                background-color: ${toolTipBgColor};
                box-shadow:
                    0px 4px 6px -1px ${toolTipBoxShadowColor},
                    0px 2px 4px -2px ${toolTipBoxShadowColor},
                    0px -1px 1px -1px ${toolTipBoxShadowColor}, 
                    0px -1px 1px -1px ${toolTipBoxShadowColor};
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
                border-bottom-color: ${headBorderBottomColor};
                cursor: default;
            }

            .thrinkle-username-container{
                display: block;
                flex: 1;
                margin-left: 10px;
                font-weight: bold;
                color: ${toolTipTextDeepContrastColor};
            }
            .thrinkle-username-container span{
                display: block;
                font-weight: normal;
                color: ${toolTipTextColor};
            }

            .thrinkle-divider{
                border-bottom-width: 1px;
                border-bottom-style: solid;
                border-bottom-color: ${headBorderBottomColor};
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
                    background-color: ${sidebarMenuBgColor};
                }
                .thrinkle-menu-group-title{
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
                    flex: 1;
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
                    color: ${menuItemColor};
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
                    color: ${menuItemColor};
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
                    margin-left: 5px;
                    margin-right: 10px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    border-radius: 0.5rem;
                    box-shadow:
                    0px 4px 6px -1px ${articleBoxShadowColor},
                    0px 2px 4px -2px ${articleBoxShadowColor},
                    0px -1px 1px -1px ${articleBoxShadowColor},
                    0px -1px 1px -1px ${articleBoxShadowColor};
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
                    background-color: transparent;
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
                    background-color: ${sidebarMenuBgColor};
                }
                
                .thrinkle-menu-container.open{
                    padding-top: 20px;
                    min-height: 20%;
                    max-height: 57%;
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
                    color: ${menuItemColor};
                }
                .thrinkle-menu-item-button{
                    width: 100%;
                    background-color: transparent;
                    border-width: 0px;
                    text-align: left;
                    font-size: 1rem;
                    color: ${menuItemColor};
                }
                .thrinkle-sidebar-menu-pad{
                    display: flex;
                    flex: 1;
                    background-color: ${sidebarOverlayColor};
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

            const style = document.createElement('style');
            style.setAttribute('id','thrinkle_container');
            style.textContent = this.css;
            if(!document.head.querySelector("style#thrinkle_layout")){
                document.head.appendChild(style);
            }

            window.addEventListener('thrinkle-styles-loaded', function(e) {
                this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon();
                this.sidebarCloseIconContainer.addEventListener('click',(e)=>{
                    e.preventDefault();
                    if(window.innerWidth>=667){
                        this.toggleMenuContainersOpenState();
                    }else{
                        this.removeMenuContainersOpenState();
                        this.toggleOpenOnMobile(this.sidebarContainer);
                        this.toggleOpenOnMobile(this.menuContainer);
                    }
                    
                    const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked');
                    if(shrinked==='false'){
                        this.sidebarCloseIconContainer.setAttribute("shrinked","true");
                    }else{
                        this.sidebarCloseIconContainer.setAttribute("shrinked","false");
                    }
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon();
                });
                this.sidebarMenuPad.addEventListener('click',(e)=>{
                    e.preventDefault();
                    this.removeMenuContainersOpenState();
                    const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked');
                    if(shrinked==='false'){
                        this.sidebarCloseIconContainer.setAttribute("shrinked","true");
                    }else{
                        this.sidebarCloseIconContainer.setAttribute("shrinked","false");
                    }
                    this.sidebarCloseIconContainer.innerHTML= this.getSidebarIcon();
                });

                // retrieve values that are passed by user
                // in javascript
                this._upgradeProperty('sidebarMenu');
                this._upgradeProperty('userProfile');
                this._upgradeProperty('footer');

                // Create media query matcher
                this.mediaQuery = window.matchMedia(`(width >= ${getCssVariable(`--thrinkle-br-sm`)})`);
                // Listen for query changes
                this.mediaQuery.addEventListener('change', (e)=>this.handleMediaQueryMatch(this,this.mediaQuery));
                // remove the loading attribute to show the alert
                this.removeAttribute('data-thrinkle-loading');
            }.bind(this), true);
        }
        disconnectedCallback() {}	
        adoptedCallback() {}
        toggleMenuContainersOpenState(){
            this.sidebarContainer.classList.toggle('open');
            this.menuContainer.classList.toggle('open');
            this.sidebarSiteTitleContainer.classList.toggle('open');
            document.querySelector('.thrinkle-site-title-span').classList.toggle('open');

            const menuItems = document.querySelectorAll('.thrinkle-menu-item');
            menuItems.forEach(item => {
                item.classList.toggle('open');
            });

            const menuItemTitleSpans = document.querySelectorAll('.thrinkle-menu-item-title-span');
            menuItemTitleSpans.forEach(item => {
                item.classList.toggle('open');
            });

            const menuItemGroups = document.querySelectorAll('.thrinkle-menu-item-group');
            menuItemGroups.forEach(item => {
                item.classList.toggle('open');
            });

            const menuGroups = document.querySelectorAll('.thrinkle-menu-group');
            menuGroups.forEach(item => {
                item.classList.toggle('open');
            });
            const menuItemGroupTitles = document.querySelectorAll('.thrinkle-menu-group-title');
            menuItemGroupTitles.forEach(item => {
                item.classList.toggle('open');
            });

            this.username.classList.toggle('open');
            this.usernameClick.classList.toggle('open');
        }

        removeMenuContainersOpenState(){
            this.sidebarContainer.classList.remove('open');
            this.menuContainer.classList.remove('open');
            this.sidebarSiteTitleContainer.classList.remove('open');
            document.querySelector('.thrinkle-site-title-span').classList.remove('open');

            const menuItems = document.querySelectorAll('.thrinkle-menu-item');
            menuItems.forEach(item => {
                item.classList.remove('open');
            });

            const menuItemTitleSpans = document.querySelectorAll('.thrinkle-menu-item-title-span');
            menuItemTitleSpans.forEach(item => {
                item.classList.remove('open');
            });

            const menuItemGroups = document.querySelectorAll('.thrinkle-menu-item-group');
            menuItemGroups.forEach(item => {
                item.classList.remove('open');
            });

            const menuGroups = document.querySelectorAll('.thrinkle-menu-group');
            menuGroups.forEach(item => {
                item.classList.remove('open');
            });
            const menuItemGroupTitles = document.querySelectorAll('.thrinkle-menu-group-title');
            menuItemGroupTitles.forEach(item => {
                item.classList.remove('open');
            });

            this.username.classList.remove('open');
            this.usernameClick.classList.remove('open');
        }
        handleMediaQueryMatch(element,query){
            if(query.matches){
                if(this.sidebarCloseIconContainer.getAttribute('shrinked')==='true'){
                    this.removeMenuContainersOpenState();
                }else{
                    this.removeMenuContainersOpenState();
                    this.toggleMenuContainersOpenState();
                }
            }else{
                this.removeMenuContainersOpenState();
                if(this.sidebarCloseIconContainer.getAttribute('shrinked')==='false'){
                    this.toggleOpenOnMobile(this.sidebarContainer);
                    this.toggleOpenOnMobile(this.menuContainer);
                    this.toggleOpenOnMobile(this.username);
                    this.toggleOpenOnMobile(this.usernameClick);
                }
            }
        }
        getSidebarIcon (){
            const shrinked = this.sidebarCloseIconContainer.getAttribute('shrinked');
            let svg = null;
            if(shrinked==='false'){
                svg = getSVG('sidebar-close').replace('<svg',`<svg class="thrinkle-sidebar-close-icon"`);
                return svg;
            }else{
                svg = getSVG('sidebar-open').replace('<svg',`<svg class="thrinkle-sidebar-close-icon"`);
                return svg;
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
            this.renderMenu(); // Trigger an update in your component;
            this.renderQuickAccessMenu();
            this.renderUserProfileSlab();
            this.renderFooter();
        }

        get sidebarMenu() {
            return this._sidebarMenu;
        }

        set userProfile(value){
            this._userProfile = value;
        }
        get userProfile(){
            return this._userProfile;
        }

        set footer(value){
            this._footer = value;
        }
        get footer(){
            return this._footer;
        }
        
        toggleOpenOnDesktop(element){
            if(window.innerWidth >= 667){
                element.classList.toggle('open');
            }
        }
        toggleOpenOnMobile(element){
            if(window.innerWidth < 667){
                element.classList.toggle('open');
            }
        }
        renderMenu() {
           // add menu
            this.menuContainer = document.createElement('div');
            this.menuContainer.classList.add('thrinkle-menu-container');
            this.toggleOpenOnDesktop(this.menuContainer);
            this.sidebarMenuContainer.appendChild(this.menuContainer);
            this._sidebarMenu.menu.forEach((group)=>{
                // this generates the menu group container
                const menuGroupContainer = this.generateMenuGroupContainer({group:group});
                // this generates the menu items in the above group
                this.generateMenu({
                    menuGroupContainer: menuGroupContainer,
                    group: group,
                    needsContainer: this._sidebarMenu?.menuSettings?.needsContainer ?? false,
                    needsDivider: this._sidebarMenu?.menuSettings?.needsDivider ?? false
                });
            });
            // add menu            
        }
        generateMenuGroupContainer({
            group, // the menu group object
            isSubGroup = false, // indicates if this is a sub menu
        }){
            // creates the group container;
            const menuGroupContainer = document.createElement('div');
            menuGroupContainer.classList.add('thrinkle-menu-group');
            if(isSubGroup){
               menuGroupContainer.classList.add('thrinkle-menu-sub-group-pad');
            }
            this.toggleOpenOnDesktop(menuGroupContainer);
            // appends the group container to the menu container
            this.menuContainer.appendChild(menuGroupContainer);
            // creates the container for the group title
            const menuGroupTitle = document.createElement('div');
            menuGroupTitle.classList.add(
                'thrinkle-menu-group-title',
                'thrinkle-text-zinc-700'
            );
            this.toggleOpenOnDesktop(menuGroupTitle);
            menuGroupTitle.innerText = group.groupTitle;
            menuGroupContainer.appendChild(menuGroupTitle);
            menuGroupContainer.id = `thrinkle_menu_group_${Date.now()}`;
            return menuGroupContainer;
        }
        generateMenu({
            menuGroupContainer, // the container to hold this group of menus
            group, // the object holding the menus in this group
            isSubMenu=false, // indicates if this is a sub menu
            subMenuGroupContainer=null, // required if this is sub menu
            needsContainer=false, // indicates if each menu should be placed in a padded container
            needsDivider=false // indicates if a divider is needed between menu items
        }){
            // gets the total number of menu items in this group
            const menuCount = group.menu.length;
            // tracks the sequence of menu item generation
            let count = 0;
            group.menu.forEach((menu, index, array)=>{
                if(!menu.title && menu.groupTitle){
                    // this generates the sub menu group container
                    if(isSubMenu){
                        // generate the sub menu group
                        let subMenuGroup = this.generateMenuGroupContainer({
                            group: menu,
                            isSubGroup: true
                        });
                        // append the sub menu group to the previous sub menu group
                        subMenuGroupContainer.appendChild(subMenuGroup);
                        // append the parent sub menu group to the main menu group
                        menuGroupContainer.appendChild(subMenuGroupContainer);
                        // this generates the menu items in the above group
                        this.generateMenu({
                            subMenuGroupContainer: subMenuGroup, // append the menu to
                            // the sub sub menu
                            menuGroupContainer: menuGroupContainer,
                            group: menu,
                            isSubMenu: true,
                            needsContainer: this._sidebarMenu?.menuSettings?.needsContainer ?? false,
                            needsDivider: this._sidebarMenu?.menuSettings?.needsDivider ?? false
                        });
                    }else{
                        subMenuGroupContainer = this.generateMenuGroupContainer({
                            group: menu,
                            isSubGroup: true
                        });

                        // this generates the menu items in the above group
                        this.generateMenu({
                            subMenuGroupContainer: subMenuGroupContainer,
                            menuGroupContainer: menuGroupContainer,
                            group: menu,
                            isSubMenu: true,
                            needsContainer: this._sidebarMenu?.menuSettings?.needsContainer ?? false,
                            needsDivider: this._sidebarMenu?.menuSettings?.needsDivider ?? false
                        });
                    }
                }else{
                    // creates the menu item container
                    const itemContainer = document.createElement('div');
                    itemContainer.classList.add('thrinkle-menu-item-group');
                    // sets the active item
                    if(this.isActiveNavLink(menu.url)){
                        itemContainer.classList.add('active');
                    }
                    this.toggleOpenOnDesktop(itemContainer);
                    // add menu item icon
                    const itemIconContainer = document.createElement('div');
                    itemIconContainer.classList.add('thrinkle-menu-item-icon');
                    this.toggleOpenOnDesktop(itemIconContainer);
                    itemIconContainer.innerHTML=menu.icon? `<i data-lucide="${menu.icon}" style="width:18px;height:18px"></i>` : '';
                    // add menu item title
                    let title;
                    if(menu?.method){
                        // if the menu item is expected to use a specific http method
                        // use a form instead
                        title = document.createElement('form');
                        title.classList.add('thrinkle-menu-item');
                        title.action = menu.url;
                        title.method = menu.method;
                        // add a button to the form to enable sending the request
                        const button = document.createElement('button');
                        button.classList.add(
                            'thrinkle-menu-item-button',
                            // 'thrinkle-text-gray-700'
                        );
                        this.toggleOpenOnDesktop(button);
                        button.appendChild(itemIconContainer);
                        // add the menu title to the button
                        const span = document.createElement('span');
                        span.classList.add('thrinkle-menu-item-title-span');
                        span.innerText = menu.title;
                        this.toggleOpenOnDesktop(span);
                        button.appendChild(span);
                        title.appendChild(button);
                    }else{
                        // if the menu item is a normal hyperlink, create an anchor
                        // tag instead
                        title = document.createElement('a');
                        title.classList.add(
                            'thrinkle-menu-item',
                            // 'thrinkle-text-gray-700'
                        );
                        this.toggleOpenOnDesktop(title);
                        title.appendChild(itemIconContainer);
                        // add the title of the menu item
                        const span = document.createElement('span');
                        span.classList.add('thrinkle-menu-item-title-span');
                        span.innerText = menu.title;
                        this.toggleOpenOnDesktop(span);
                        title.appendChild(span);
                        title.href = menu.url;
                    }
                    // append the menu item title (anchor tag or form) to the 
                    // menu itemcontainer
                    itemContainer.appendChild(title);
                    // add a divider line if needed
                    if(needsDivider && count < menuCount && count > 0){
                        let divider = document.createElement('div');
                        divider.classList.add('thrinkle-divider');
                        if(isSubMenu){
                            subMenuGroupContainer.appendChild(divider);
                        }else{
                            menuGroupContainer.appendChild(divider);
                        }
                    }
                    count++;
                    // sometimes the menu item may require a container around
                    // it for better presentation, if this is the case then
                    // add one
                    if(needsContainer){
                        const extraItemContainer = document.createElement('div');
                        extraItemContainer.classList.add('thrinkle-extra-item-container');
                        extraItemContainer.appendChild(itemContainer);
                        if(isSubMenu){
                            subMenuGroupContainer.appendChild(extraItemContainer);
                        }else{
                            menuGroupContainer.appendChild(extraItemContainer);
                        }
                    }else{
                        if(isSubMenu){
                            subMenuGroupContainer.appendChild(itemContainer);
                        }else{
                            menuGroupContainer.appendChild(itemContainer);
                        }
                    }
                }
            });
        }

        getInitials(string=''){
            return string.split(' ').map(word=>word.charAt(0)).toString().replaceAll(',','').toUpperCase();
        }
        addHtmlToFooter(html,htmlHorizontalPosition){
            const htmlContainer = document.createElement('div');
            this.thrinklefooter.appendChild(htmlContainer);
            html.classList.add(htmlHorizontalPosition);
            htmlContainer.appendChild(html);
        }
        renderFooter(){
            this.thrinklefooter = document.createElement('div');
            this.thrinklefooter.classList.add('thrinkle-footer');
            this.articleFooterContainer.appendChild(this.thrinklefooter);
            // add html if there is any
            let html = null;
            if(this.footer?.html?.id !='' || this.footer?.html?.id != null){
                html = document.getElementById(this.footer?.html.id);
            }
            const htmlVerticalPosition = this.footer?.html?.position?.vertical ? this.footer?.html.position.vertical.toLowerCase() : 'top';
            let htmlHorizontalPosition = this.footer?.html?.position?.horizontal ? this.footer?.html.position.horizontal.toLowerCase() : 'left';
            switch (htmlHorizontalPosition) {
                case 'left':
                    htmlHorizontalPosition = 'thrinkle-horizontal-left-self';
                    html.style.margin = "13px";
                    break;
                case 'center':
                    htmlHorizontalPosition = 'thrinkle-horizontal-center-self';
                    break;
                case 'right':
                    htmlHorizontalPosition = 'thrinkle-horizontal-right-self';
                    html.style.margin = "13px";
                    break;
                default:;
                    htmlHorizontalPosition = 'thrinkle-horizontal-left-self';
                    html.style.margin = "13px";
                    break;
            }

            // add html at the top
            if(html && htmlVerticalPosition === 'top'){
                this.addHtmlToFooter(html,htmlHorizontalPosition)
            }
            // add footer links in columns
            if(this.footer.links.length != 0){
                this.thrinkleContainer = document.createElement('thrinkle-container');
                this.thrinkleContainer.setAttribute('type','fluid');
                this.thrinklefooter.appendChild(this.thrinkleContainer);
                // check for menu groups
                this.footer.links.forEach((group)=>{
                    const thrinkleColumn = document.createElement('thrinkle-column');
                    this.thrinkleContainer.appendChild(thrinkleColumn);
                    const heading = document.createElement('label');
                    heading.classList.add('thrinkle-footer-heading');
                    heading.textContent = group.heading;
                    thrinkleColumn.appendChild(heading);
                    group.links.forEach((link)=>{
                        const footerLink = document.createElement('a');
                        footerLink.classList.add('thrinkle-footer-link');
                        footerLink.href = link.url;
                        footerLink.textContent = link.title;
                        thrinkleColumn.appendChild(footerLink);
                    });
                });
                // add html beside links
                if(html && htmlVerticalPosition === 'within'){
                    const htmlContainer = document.createElement('thrinkle-column');
                    this.thrinkleContainer.appendChild(htmlContainer);
                    html.classList.add(htmlHorizontalPosition);
                    // htmlContainer.style.margin = "auto";
                    htmlContainer.appendChild(html);
                }
            }
            // add social links
            if(this.footer.socials.length!==0) {
                this.thrinkleSocials = document.createElement('div');
                this.thrinkleSocials.classList.add('thrinkle-socials');
                this.thrinklefooter.appendChild(this.thrinkleSocials);
                this.footer.socials.forEach(social => {
                    const thrinkleSocial = document.createElement('a');
                    thrinkleSocial.innerHTML = getSVG(social.icon).replace('<svg',`<svg class="thrinkle-social-icon"`);
                    // format special urls
                    const iconLowerCase = social.icon.toLowerCase();
                    if(iconLowerCase.includes('tel') ||
                        iconLowerCase.includes('phone') ||
                        iconLowerCase.includes('call') ||
                        iconLowerCase.includes('handset')
                    ){
                        thrinkleSocial.href = `tel:${social.url.replace(/[^\d+]/g, '')}`;
                    }else if(iconLowerCase.includes('sms')){
                        thrinkleSocial.href = `sms:${social.url.replace(/[^\d+]/g, '')}`;
                    }else if(iconLowerCase.includes('whatsapp')){
                        thrinkleSocial.href = `https://wa.me/${social.url.replace(/\D/g, '')}`;
                    }else{
                        thrinkleSocial.href = social.url;
                    }
                    thrinkleSocial.target = '_blank';
                    this.thrinkleSocials.appendChild(thrinkleSocial);
                });
            }
            // add html at the bottom
            if(html && htmlVerticalPosition === 'bottom'){
                this.addHtmlToFooter(html,htmlHorizontalPosition)
            }
            // add policy links
            if(this.footer.policies.length !== 0){
                this.thrinklePolicies = document.createElement('div');
                this.thrinklePolicies.classList.add('thrinkle-policy');
                this.footer.policies.forEach(policy => {
                    const policyLink = document.createElement('a');
                    policyLink.textContent = policy.title;
                    policyLink.href = policy.url;
                    this.thrinklePolicies.appendChild(policyLink);
                });
                this.thrinklefooter.appendChild(this.thrinklePolicies);
            }
            // add copyright
            if(this.footer.copyright){
                this.thrinkleCopyright = document.createElement('div');
                this.thrinkleCopyright.classList.add('thrinkle-copyright');
                this.thrinkleCopyright.textContent = this.footer.copyright;
                this.thrinklefooter.appendChild(this.thrinkleCopyright);
            }
        }

        renderQuickAccessMenu(){
            this.quickAccessMenuContainer = document.createElement('div');
            this.quickAccessMenuContainer.classList.add('thrinkle-quick-access-menu-container');
            this.sidebarMenuContainer.appendChild(this.quickAccessMenuContainer);
            // add settings
            this.generateMenu({
                menuGroupContainer:this.quickAccessMenuContainer,
                group:this.quickAccessMenu,
                needsContainer: this.quickAccessMenu?.menuSettings?.needsContainer ?? true,
                needsDivider: this.quickAccessMenu?.menuSettings?.needsDivider ?? true
                });
            // add settings
        }
        setAvatar(avaterContainer){
            // set the user avatar
            if(this.userProfile?.user?.avatar){
                avaterContainer.style.backgroundImage = `url(${this.userProfile.user.avatar})`;
            }else if (this.hasAttribute('avatar')){
                avaterContainer.style.backgroundImage = `url(${this.getAttribute('avatar')})`;
            }else{
                if(this.userProfile?.user?.name){
                    avaterContainer.innerText = this.getInitials(this.userProfile.user.name);
                }else{
                    avaterContainer.innerText = this.getInitials('User Photo');
                }
            }
        }
        renderUserProfileSlab(){
            // add user profile slab
            this.userProfileSlab = document.createElement('div');
            this.userProfileSlab.classList.add('thrinkle-user-profile-slab');
            this.sidebarMenuContainer.appendChild(this.userProfileSlab);
            // add user profile slab
            
            this.userAvater = document.createElement('div');
            this.userAvater.classList.add('thrinkle-user-avatar');
            
            this.setAvatar(this.userAvater)
        
            this.userAvater.addEventListener('click',(e)=>{
                this.popUpToolTip();
            });
            this.userProfileSlab.appendChild(this.userAvater);

            this.username = document.createElement('div');
            this.username.classList.add('thrinkle-username');
            this.toggleOpenOnDesktop(this.username);
            this.username.innerText = this.userProfile.user.name ? this.userProfile.user.name : 'username';

            this.username.addEventListener('click',(e)=>{
                this.popUpToolTip();
            });
            this.userProfileSlab.appendChild(this.username);

            this.usernameClick = document.createElement('div');
            this.usernameClick.classList.add('thrinkle-username-click');
            this.usernameClick.innerHTML = `<i data-lucide="chevrons-up-down" style="width:18px;height:18px"></i>`;
            this.toggleOpenOnDesktop(this.usernameClick);
            this.usernameClick.addEventListener('click',(e)=>{
                this.popUpToolTip();
            });
            this.userProfileSlab.appendChild(this.usernameClick);
            this.renderToolTip();
        }
        popUpToolTip(){
            this.toolTipContainer.classList.add('open');
            const position = this.getToolTipPosition(this.toolTipContainer,this.userProfileSlab);
            this.toolTipContainer.style.top = `${position.top}px`;
            this.toolTipContainer.style.left = `${position.left}px`;
        }
        isActiveNavLink(href){
            try {
                const targetUrl = new URL(href, window.location.href);
                const currentPath = window.location.pathname.replace(/\$/,"") || "/";
                const targetPath = targetUrl.pathname.replace(/\$/,"") || "/";
                return targetUrl.origin === window.location.origin && targetPath === currentPath;
            } catch (error) {
                return false;
            }
        }
        renderToolTip(){
            this.toolTipContainer = document.createElement('div');
            this.toolTipContainer.classList.add('thrinkle-tool-tip-container');
            document.addEventListener('click',(e)=>{
                if(
                    !this.toolTipContainer.contains(e.target) &&
                    !this.username.contains(e.target) &&
                    !this.userAvater.contains(e.target) &&
                    !this.usernameClick.contains(e.target) &&
                    !this.userProfileSlab.contains(e.target))
                {
                    if(this.toolTipContainer.classList.contains('open')){
                        this.toolTipContainer.classList.remove('open');
                    }
                }
            });
            this.userProfileSlab.appendChild(this.toolTipContainer);
            // add user profile slab

            this.userDisplay = document.createElement('div');
            this.userDisplay.classList.add('thrinkle-user-display');
            this.toolTipContainer.appendChild(this.userDisplay);
            
            this.avater = document.createElement('div');
            this.avater.classList.add('thrinkle-user-avatar');

            this.setAvatar(this.avater)

            this.userDisplay.appendChild(this.avater);

            this.usernameDisplay = document.createElement('div');
            this.usernameDisplay.classList.add('thrinkle-username-container');
            this.toggleOpenOnDesktop(this.usernameDisplay);
            this.usernameDisplay.appendChild(document.createTextNode(this.userProfile?.user?.name ? this.userProfile.user.name : 'username'));

            this.usernameEmail = document.createElement('span');
            this.usernameEmail.appendChild(document.createTextNode(this.userProfile?.user?.email ? this.userProfile.user.email : 'email'));
            this.usernameDisplay.appendChild(this.usernameEmail);

            this.userDisplay.appendChild(this.usernameDisplay);

            // add user profile slab
            
            // add settings
            this.generateMenu({
                menuGroupContainer:this.toolTipContainer,
                group:this.userProfile?.user,
                needsContainer: this.userProfile?.user?.menuSettings?.needsContainer ?? true,
                needsDivider: this.userProfile?.user?.menuSettings?.needsDivider ?? true
                });
            // add settings
        }
        getToolTipPosition(toolTip,target){
            let targetRect = target.getBoundingClientRect();
            let toolTipRect = toolTip.getBoundingClientRect();
            let top = targetRect.top - (toolTipRect.height + 5);
            let left = 5;
            let right = targetRect.right - (toolTipRect.right + 5);
            let bottom = targetRect.bottom - (toolTipRect.bottom + 5);

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
                    left = targetRect.left;
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