import { getSVG, padLeft } from "../function.js";
/**
 * @element thrinkle-input
 * @summary it's a self-contained styled input component
 * @attr {string} id - a unique identifier for this component
 * @attr {string} name - a name given to the component, this is important for form operations
 * @attr {string} label - the visible description/title of the input component
 * @attr {string} placeholder - a text that describes the nature of the value required, it is only visible when no value is passed
 * @attr {string} [text|email|password|number|url] type - defines the type of the input component to be displayed
 * @attr {string} value - defines the value of the component. This is the value passed to the serve during a form submission routine
 * @attr {boolean} rounded - when present defines makes the left and right ends of the component rounded
 * @attr {string} lefticon - Any lucide icon name. Defines the icon to be displayed to the left of the component
 * @attr {string} righticon - Any lucide icon name. Defines the icon to be displayed to the right of the component
 * @attr {boolean} icon - When present displays icons based on the corresponding input type
 * @attr {boolean} trimmed - for string types, ensures that the submitted value contains no whitespaces at the beginning and end of the string
 * @attr {number} max - applicable to date, month, week, time, datetime-local, number, range types, defines the maximum value for the input
 * @attr {number} min - applicable to date, month, week, time, datetime-local, number, range types, defines the minimum value for the input
 * @attr {number} maxlength - applicable to text, search, url, tel, email, password types, defines the maximun number of characters for the input
 * @attr {number} minlength - applicable to text, search, url, tel, email, password types, defines the minimun number of characters for the input
 * @attr {boolean} multiple - applicable to email, file, defines whether to allow multiple values
 * @attr {boolean} hidden - when present keeps the component hidden, however values still gets submitted to serve during form submit operation
 * @attr {string} pattern - a regular expression used in matching input
 * @attr {number} size - indicates how many characters wide the input field should be
 * @attr {boolean} international - when present, indicates that the phone number should be in international format
 */
export default class ThrinkleInput extends HTMLElement {
    static formAssociated = true;//needed for form elements
	static observedAttributes = ["value","disabled","label"];
    constructor() {
        super();
        /*set up this custom element attributes*/
        this._internals = this.attachInternals();//need for form elements
        this._initialized = false;   
        this.displayedErrorMessage = false;
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
        value = this.hasAttribute('trimmed') ? value.trim() : value;
        this._internals.setFormValue(value);
    }

    validatePassword(password) {
        let score = 0;
        let message = "";
        // Check password length
        if (password.length >= 8) {
            score++;
        }else{
            message += "<li>Password length should be greater than 8</li>";
        }
        if (password.length >= 12) {
            score++;
        }

        // Check character types
        // Lowercase
        if (/[a-z]/.test(password)) {
            score++;
        } else{
            message += "<li>Password should contain at least one lower case letter</li>";
        }    
        // Uppercase 
        if (/[A-Z]/.test(password)) {
            score++;
        } else{
            message += "<li>Password should contain at least one uppercase letter</li>";
        }   
        // Number  
        if (/[0-9]/.test(password)) {
            score++;
        } else{
            message += "<li>Password should contain at least one number</li>";
        } 
        // Special character     
        if (/[^a-zA-Z0-9\s]/.test(password)) {
            score++;
        } else{
            message += "<li>Password should contain at least one special character</li>";
        }

        // Categorize password
        let category = "";
        if (score <= 3) {
            category = "Weak";
            this.feedback.classList.add('thrinkle-feedback-weak');
            this.feedback.classList.remove('thrinkle-feedback-excellent');
            this.feedback.classList.remove('thrinkle-feedback-strong');

            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
        } else if (score <= 5) {
            category = "Strong";
            this.feedback.classList.add('thrinkle-feedback-strong');
            this.feedback.classList.remove('thrinkle-feedback-weak');
            this.feedback.classList.remove('thrinkle-feedback-excellent');

            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
        } else {
            category = "Excellent";
            this.feedback.classList.add('thrinkle-feedback-excellent');
            this.feedback.classList.remove('thrinkle-feedback-strong');
            this.feedback.classList.remove('thrinkle-feedback-weak');

            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
        }
        
        if(this.hasAttribute('error') && !this.displayedErrorMessage){
            this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML}<br/>This password is <b>${category}</b><br/>${message !== "" ? "<ul>" + message + "</ul>" : ""}`;
            this.displayedErrorMessage = true;
            this.feedback.classList.add('thrinkle-feedback-weak');
            this.feedback.classList.remove('thrinkle-feedback-excellent');
            this.feedback.classList.remove('thrinkle-feedback-strong');

            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            
        }else{
            this.feedback.innerHTML = `This password is <b>${category}</b><br/>${message !== "" ? "<ul>" + message + "</ul>" : ""}`;
        }
    }
    validateURL(url) {
        // initialize error messages
        let message = `<li>URL should contain either <b>http:</b> or <b>https:</b></li>
                       <li>URL should contain a <b>domain name</b> or <b>IP address</b></li>
                       <li>URL <b>domain name</b> should contain a <b>dot (.)</b> or a <b>top-level domain</b></li>
                       <li>URL <b>domain name</b> should end with a <b>top-level domain</b> and not a <b>dot (.)</b></li>`;
        try {
            const parsedURL = new URL(url);
            // remove error message if condition was met
            if(parsedURL.protocol === "http:" || parsedURL.protocol === "https:"){
                message = message.replace("<li>URL should contain either <b>http:</b> or <b>https:</b></li>","");
            }
            // remove error message if condition was met
            if(parsedURL.hostname){
                message = message.replace("<li>URL should contain a <b>domain name</b> or <b>IP address</b></li>","");
            }
            // remove error message if condition was met
            if(parsedURL.hostname.includes('.')){
                message = message.replace("<li>URL <b>domain name</b> should contain a <b>dot (.)</b> or a <b>top-level domain</b></li>","");
            }
            const topLevelDomain = parsedURL.hostname.split('.').pop().trim();
             // remove error message if top level domain name is found after the dot
            if(parsedURL.hostname.split('.').length > 1 && /^[a-zA-Z]{2,}$/.test(topLevelDomain)){
                message = message.replace("<li>URL <b>domain name</b> should end with a <b>top-level domain</b> and not a <b>dot (.)</b></li>","");
            }
            if(message.trim() === ""){ 
                // remove error indicator classes
                this.feedback.classList.remove('thrinkle-feedback-weak');               
                this.thrinkleInputContainer.classList.remove('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
                // this.feedback.innerHTML = "";
                if(this.hasAttribute('error') && !this.displayedErrorMessage){
                    this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                    this.displayedErrorMessage = true;
                    this.feedback.classList.add('thrinkle-feedback-weak');  
                    this.thrinkleInputContainer.classList.add('thrinkle-error');
                    this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                    this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
                }else{
                    this.feedback.innerHTML = "";
                }
            } else{
                // add error indicator classes
                this.feedback.classList.add('thrinkle-feedback-weak');         
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
                // this.feedback.innerHTML = `<ul>${message}</ul>`;
                if(this.hasAttribute('error') && !this.displayedErrorMessage){
                    this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML}<br/><ul>${message}</ul>`;
                    this.displayedErrorMessage = true;
                }else{
                    this.feedback.innerHTML = `<ul>${message}</ul>`;
                }
            }
        } catch {   
            // this segment catches exception for either incompletely formed URL   
            // or wrong URL
            // remove error message if condition was met    
            if(url.includes("http:") || url.includes("https:")){
                message = message.replace("<li>URL should contain either <b>http:</b> or <b>https:</b></li>","");
            }    
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }
        }
    }
    validateEmail(email) {
        // initialize error messages
        let message = "";
        
        // remove error message if the condition is met
        if(email.trim().length > 255){
            message += "<li>Email length should be less than <b>255</b> characters</li>";
        }
        if (/[^a-zA-Z0-9@._\s]/.test(email)){
            message += "<li>Email should not contain special characters</li>";
        } 
        if (/[A-Z]/.test(email)){
            message += "<li>Email should be lower case characters</li>";
        } 
        if (email.includes(' ') || email.startsWith(' ') || email.endsWith(' ')){
            message += "<li><b>Spaces</b> in email should be replaced with <b>underscore (_)</b> or <b>dot (.)</b></li>";
        }       
        if (email.trim() !== "" && (email.match(/@/g) || []).length !== 1){
            message += "<li>Email should contain one @ character</li>";
        }
        // Username cannot contain consecutive dots
        if (email.includes("..")) {
            message += "<li>Email cannot contain consecutive <b>dot (.)</b> character</li>";
        }
        if (email.startsWith('@')){
            message += "<li>Email username should precede the <b>@</b> character</li>";
        }
        if (email.endsWith('@')){
            message += "<li>Email domain should come after the <b>@</b> character</li>";
        }
        const [username, domain] = email.split("@");
        if (username.length > 64){
            message += "<li>Email username should be less than <b>64</b> characters</li>";
        }
        // Username cannot start or end with a dot
        if (username.startsWith(".") || username.endsWith(".")){
            message += "<li>Email username cannot start or end with a <b>dot (.)</b> character</li>";
        }
        // Check domain
        if (domain && !domain.includes(".")){
            message += "<li>Email domain should contain a <b>dot (.)</b> character</li>";
        }
        // Domain cannot start or end with a dot
        if (domain && (domain.startsWith(".") || domain.endsWith("."))){
            message += "<li>Email domain cannot start or end with a <b>dot (.)</b> character</li>";
        }
        // domain cannot contain consecutive dots
        if (domain && domain.includes("..")) {
            message += "<li>Email domain cannot contain consecutive <b>dot (.)</b> character</li>";
        }
        // Validate domain characters
        if (/[^a-zA-Z0-9._\s]/.test(domain)){
            message += "<li>Email domain should not contain special characters</li>";
        }
        const topLevelDomain = domain?.split('.').pop().trim();
        // remove error message if top level domain name is found after the dot
        if(domain?.split('.').length > 1 && /^[a-zA-Z]{2,}$/.test(topLevelDomain)){
            message = message.replace("<li>Email <b>domain name</b> should end with a <b>top-level domain</b> and not a <b>dot (.)</b></li>","");
        }
        // remove error message if condition was met
        const required = this.hasAttribute('required') ? true : false;
        if(email.trim() === "" &&  required){
            message += "<li>No Email provided</li>";
        }

        if(message.trim() === ""){ 
            // remove error indicator classes
            this.feedback.classList.remove('thrinkle-feedback-weak');               
            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                this.displayedErrorMessage = true;
                this.feedback.classList.add('thrinkle-feedback-weak');  
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            }else{
                this.feedback.innerHTML = "";
            }
        } else{
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }            
        }
    }
    validateNumber(number) {
        // initialize error messages
        let message = "";
        
        // remove error message if the condition is met
        if(number > parseFloat(this.input.max)){
            message += `<li>Entry ${number} must not be greater than <b>${this.input.max}</b></li>`;
        }
        if(number < parseFloat(this.input.min)){
            message += `<li>Entry ${number} must not be less than <b>${this.input.min}</b></li>`;
        }

        if(message.trim() === ""){ 
            // remove error indicator classes
            this.feedback.classList.remove('thrinkle-feedback-weak');               
            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                this.displayedErrorMessage = true;
                this.feedback.classList.add('thrinkle-feedback-weak');  
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            }else{
                this.feedback.innerHTML = "";
            }
        } else{
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }            
        }
    }
    validateText(text) {
        // initialize error messages
        let message = "";
        
        // remove error message if the condition is met
        if(text.length > parseFloat(this.input.maxLength)){
            message += `<li>Entry ${text} must not be greater than <b>${this.input.maxLength}</b> characters</li>`;
        }
        if(text.length < parseFloat(this.input.minLength)){
            message += `<li>Entry ${text} must not be less than <b>${this.input.minLength}</b> characters</li>`;
        }

        if(message.trim() === ""){ 
            // remove error indicator classes
            this.feedback.classList.remove('thrinkle-feedback-weak');               
            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                this.displayedErrorMessage = true;
                this.feedback.classList.add('thrinkle-feedback-weak');  
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            }else{
                this.feedback.innerHTML = "";
            }
        } else{
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }            
        }
    }
    validateDate(date) {
        // initialize error messages
        let message = "";
        
        // remove error message if the condition is met
        let inputDate = new Date(date);
        const maxDate = new Date(this.input.max);
        const minDate = new Date(this.input.min);
        const year = padLeft(inputDate.getFullYear());
        const month = padLeft(inputDate.getMonth() + 1);
        const day = padLeft(inputDate.getDate());
        if(inputDate > maxDate){
            message += `<li>Entry date <b>${year}-${month}-${day}</b> cannot not be later than <b>${this.input.max}</b> characters</li>`;
        }
        if(inputDate < minDate){
            message += `<li>Entry date <b>${year}-${month}-${day}</b> cannot be earlier than <b>${this.input.min}</b> characters</li>`;
        }         
        if(year === 'NaN'){
            message += `<li>Please enter a valid year</li>`;
        }       
        if(month === 'NaN'){
            message += `<li>Please enter a valid month</li>`;
        }        
        if(day === 'NaN'){
            message += `<li>Please enter a valid day</li>`;
        }
        if(message.trim() === ""){ 
            // remove error indicator classes
            this.feedback.classList.remove('thrinkle-feedback-weak');               
            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                this.displayedErrorMessage = true;
                this.feedback.classList.add('thrinkle-feedback-weak');  
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            }else{
                this.feedback.innerHTML = "";
            }
        } else{
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }            
        }
    }
    
    validateTel(number) {
        // initialize error messages
        let message = "";
        number = number.trim();
        // remove error message if the condition is met
        if(/[^0-9@()+-\s]/.test(number)){
            message += `<li>Entry can only contain the numbers <b>0-9</b>, the characters <b>"(", ")", "+", and "-"</b></li>`;
        }
        if(this.hasAttribute('international') && number.indexOf('+') > 0){
            message += `<li>Phone number written in international format must begin with a <b>+</b> character</li>`;
        }
        // Remove formatting characters
        const digits = number.replace(/\D/g, "");        
        if(digits.length < 7){
            message += `<li>Phone number characters are below range</li>`;
        }
        if(digits.length > 15){
            message += `<li>Phone number characters are above range</li>`;
        }
        if(number.startsWith("+") && digits.startsWith("0")){
            message += `<li>Phone number cannot start with zero when using international format</li>`;
        }
        if(this.hasAttribute('required') && number ===""){
            message += `<li>Phone number not provided</li>`;
        }
        if(message.trim() === ""){ 
            // remove error indicator classes
            this.feedback.classList.remove('thrinkle-feedback-weak');               
            this.thrinkleInputContainer.classList.remove('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.remove('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.remove('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.feedback.innerHTML}`;
                this.displayedErrorMessage = true;
                this.feedback.classList.add('thrinkle-feedback-weak');  
                this.thrinkleInputContainer.classList.add('thrinkle-error');
                this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
                this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            }else{
                this.feedback.innerHTML = "";
            }
        } else{
            // add error indicator classes
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
            if(this.hasAttribute('error') && !this.displayedErrorMessage){
                this.feedback.innerHTML = `${this.displayedErrorMessage ? '' : this.feedback.innerHTML} <br/><ul>${message}</ul>`;
                this.displayedErrorMessage = true;
            }else{
                this.feedback.innerHTML = `<ul>${message}</ul>`;
            }            
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
        // create the input element within the component
        this.input = document.createElement('input');
        // initialize the input
        this.input.value = this.hasAttribute('value') ? this.getAttribute('value') : ''; 
        if(this.hasAttribute('max')){
            this.input.max = this.getAttribute('max');
            this._internals.ariaValueMax = this.input.max; 
        }
        if(this.hasAttribute('min')){
            this.input.min = this.getAttribute('min'); 
            this._internals.ariaValueMin = this.input.min; 
        }
        if(this.hasAttribute('maxlength')){
            this.input.maxLength = this.getAttribute('maxlength'); 
        }
        if(this.hasAttribute('minlength')){
            this.input.minLength = this.getAttribute('minlength'); 
        }
        if(this.hasAttribute('size')){
            this.input.size = this.getAttribute('size'); 
        }
        if(this.hasAttribute('multiple')){
            this.input.multiple = true; 
        }
        if(this.hasAttribute('pattern')){
            this.input.pattern = this.getAttribute('pattern'); 
        }
        if(this.hasAttribute('hidden')){
            this.input.hidden = true ; 
            this._internals.ariaHidden = this.input.hidden;
            this.style.display = "none";
        }
        if(this.hasAttribute('disabled')){
            this._internals.ariaDisabled = 'true';
            this.input.disabled = true;
        }
        if(this.hasAttribute('required')){
            this._internals.ariaRequired = true;
            this.input.required = true;
        }
        if(this.hasAttribute('readonly')){
            this._internals.ariaReadOnly = true;
            this.input.readOnly = true;
        }
        if(this.hasAttribute('step')){
            this.input.step = this.getAttribute('step');
        }
        // listen to the input operation and update the associated form internals
        this.input.addEventListener('input', (e)=>{
            this.updateFormValue(e.target.value);
        });
        // add placeholder is provided
        this.input.placeholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : (this.getAttribute('label')||''); 
        // set the aria placeholder
        this._internals.ariaPlaceholder = this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : (this.getAttribute('label')||''); 
        
        this.input.classList.add('thrinkle-input')
        
        // set the element type and role
        if(this.hasAttribute("type")){
            this._internals.role = this.getAttribute("type");
            this.input.type = this.getAttribute("type");
        }else{
            this._internals.role = 'text';
        }
        // generate an ID for the input
        this.input.id = `thrinkle-input-${Date.now()}`;
        // link the input to the label via the ID
        this.label.htmlFor = this.input.id;
        // set the label
        this.label.textContent = this.getAttribute('label') || '';
       
		this.appendChild(this.label);
        // create the container to hold the icons (if any) and input element
        this.thrinkleInputContainer = document.createElement('div');
        this.thrinkleInputContainer.classList.add('thrinkle-input-container');
        // create the containers for the icons
        this.thrinkleLeftIconDiv = document.createElement('div');        
        this.thrinkleRightIconDiv = document.createElement('div');
        // create the container for feedback and error messages
        this.feedback = document.createElement("div");
        this.feedback.classList.add('thrinkle-feedback');
        if(this.hasAttribute('error')){
            this.feedback.innerHTML = this.getAttribute('error'); 
            this.feedback.classList.add('thrinkle-feedback-weak');         
            this.thrinkleInputContainer.classList.add('thrinkle-error');
            this.thrinkleLeftIconDiv.classList.add('thrinkle-error-icon');
            this.thrinkleRightIconDiv.classList.add('thrinkle-error-icon');
        }
        
        // perform validation for types that require validation
        if(this.hasAttribute('value')){            
            switch (this.input.type.toLowerCase()) {
                case 'password':
                    this.validatePassword(this.getAttribute('value'));
                    break;
                case 'url':
                    this.validateURL(this.getAttribute('value'));
                    break;
                case 'email':
                    this.validateEmail(this.getAttribute('value'));
                    break;
                case 'tel':
                    this.validateTel(this.getAttribute('value'));
                    break;
                case 'date':
                    this.validateDate(this.getAttribute('value'));
                    break;
                case 'month':
                    // do nothing
                    break;
                case 'week':
                    // do nothing
                    break;
                case 'time':
                    // do nothing
                    break;
                case 'text':
                default:
                    this.validateText(this.getAttribute('value'));
                    break;
            }
        }
        // create icon based on the component type
        let defaultLeftIcon = false;
        let defaultRightIcon = false; 
        if(this.hasAttribute('icon')){
            switch (this.getAttribute('type').toLowerCase()) {
                case 'password':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('shield-check');
                    this.thrinkleRightIconDiv.innerHTML = getSVG('eye');
                    this.thrinkleRightIconDiv.style.cursor = "pointer";
                    // add the click event listener to enable
                    // toggling the visibility of the password text
                    this.thrinkleRightIconDiv.addEventListener('click',(e)=>{
                        if(this.input.type === 'password'){
                            this.input.type = 'text';
                            this.thrinkleRightIconDiv.innerHTML = getSVG('eye-off');
                        }else{
                            this.input.type = 'password';
                            this.thrinkleRightIconDiv.innerHTML = getSVG('eye');
                        }                        
                    });
                    // listen to input operation and validate the input
                    this.input.addEventListener('input',(e)=>{
                        this.validatePassword(this.input.value);                        
                    });
                    defaultLeftIcon = true;
                    defaultRightIcon = true; 
                    break;
                case 'email':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('mail');
                    this.input.addEventListener('input',(e)=>{
                        this.validateEmail(this.input.value);                        
                    });
                    defaultLeftIcon = true; 
                    break;
                case 'search':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('search');
                    defaultLeftIcon = true;
                    break;
                case 'url':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('link');
                    this.input.addEventListener('input',(e)=>{
                        this.validateURL(this.input.value);                        
                    });
                    defaultLeftIcon = true; 
                    break;
                case 'number':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('arrow-up-0-1');
                    this.input.addEventListener('input',(e)=>{
                        this.validateNumber(this.input.value);                        
                    });
                    defaultLeftIcon = true;
                    break;
                case 'tel':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('phone');
                    this.input.addEventListener('input',(e)=>{
                        this.validateTel(this.input.value);                        
                    });
                    defaultLeftIcon = true; 
                    break;
                case 'date':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('calendar-days');
                    this.input.addEventListener('input',(e)=>{
                        this.validateDate(this.input.value);                        
                    });
                    defaultLeftIcon = true;
                    break;
                case 'month':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('calendar-1');
                    defaultLeftIcon = true;  
                    break;
                case 'week':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('calendar-range');
                    defaultLeftIcon = true;  
                    break;
                case 'time':
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('watch');
                    defaultLeftIcon = true;  
                    break;
                case 'text':
                default:
                    this.thrinkleLeftIconDiv.innerHTML = getSVG('case-sensitive');
                    this.input.addEventListener('input',(e)=>{
                        this.validateText(this.input.value);                        
                    });
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
        this.appendChild(this.feedback);
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
                border-color: oklch(0.811 0.02 256);
                border-top-left-radius: ${radius}px;
                border-bottom-left-radius: ${radius}px;
                border-top-right-radius: ${radius}px;
                border-bottom-right-radius: ${radius}px;
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
			
            .thrinkle-feedback{
                width: 100%;
                margin-left: 15px;
                margin-top: 10px;
            }
            .thrinkle-feedback-weak{
                color: oklch(0.647 0.176 17);
            }
            .thrinkle-feedback-strong{
                color: oklch(0.67 0.185 55);
            }            
            .thrinkle-feedback-excellent{
                color: oklch(0.623 0.178 145);
            }
            .thrinkle-error{            
                border-style: solid;
                border-width: 1px;
                border-color: oklch(0.647 0.176 17);
            }
            .thrinkle-error:focus-within{				
                font-weight: bold;     
                box-shadow: 0px 0px 2px 4px oklch(from oklch(0.647 0.176 17) l c h/0.35);         
			}
            
            .thrinkle-error-icon svg,
            .thrinkle-error-icon svg{
                stroke: oklch(0.647 0.176 17);
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