/**
 * @element thrinkle-image-input
 * @summary it's a self-contained styled input component for image capture and upload, with a preview feature.
 * @description The `thrinkle-image-input` component is a custom HTML element that provides a user-friendly interface for capturing or uploading images. It includes a video stream for live camera capture, a file input for image uploads, and a preview of the selected image. The component is designed to be easily integrated into web forms and applications.
 * structure:
    <thrinkle-image-input
        id="image" 
        label = "Select Image"
        radius = "20"
        cameralabel = "camera Image1"
        uploadlabel = "Upload Image1"
        capturelabel = "Capture Image"
    ></thrinkle-image-input>
 * @attr {string} label - the label text displayed above the input
 * @attr {string} id - a unique identifier for this component
 * @attr {integer} radius - in px, defines the radius of the corners of the video, canvas, and preview image. Default is 5px.
 * @attr {string} name - the name attribute for the file input, used when submitting forms
 * @attr {string} accept - specifies the types of files that the server accepts (default is "image/*")
 * @attr {boolean} required - indicates whether the input is required (default is false)
 * @attr {string} labelclass - CSS class for the label element
 * @attr {string} errormessageclass - CSS class for the error message output
 * @attr {string} errormessage - JSON array of error messages to display
 * @attr {string} cameralabel - label for the camera button
 * @attr {string} capturelabel - label for the capture button
 * @attr {string} uploadlabel - label for the upload button
 * @attr {boolean} autoplay - indicates whether the video should autoplay (default is true)
 * @attr {boolean} playsinline - indicates whether the video should play inline (default is true)
 * @attr {string} initialvalue - initial value for the image preview (base64 or URL)
 * @attr {string} mime - MIME type for the captured image (default is "image/jpeg")
 * @attr {string} width - in px, width of the video and canvas elements (default is "200")
 * @attr {boolean} disabled - indicates whether the input is disabled (default is false)
 */
export default class ThrinkleImageInput extends HTMLElement {
    static formAssociated = true;//needed for form elements
	static observedAttributes = ["disabled","accept","name","marginleft","label","cameralabel","uploadlabel","capturelabel","errormessage","errormessageclass","labelclass"];
    
    constructor() {        
        super();
        this._internals = this.attachInternals();//need for form elements
        this._initialized = false;   
        this.role='input';        
        
        if(this.hasAttribute('radius')){
            this.radius = this.getAttribute('radius');
        }
        if(this.radius){
            this.setAttribute('radius',this.radius);
        }
        if(!this.hasAttribute('radius') && !this.radius){
            this.radius = 5;
        }

        if(this.hasAttribute('name')){
            this.name = this.getAttribute('name');
        }
        if(!this.hasAttribute('name') && !this.name){
            this.name = `thrinkle_image_${Date.now()}`;
        }
        if(this.name){
            this.setAttribute('name',this.name);
        }
        
        if(this.hasAttribute('id')){
            this.id = this.getAttribute('id');
        }
        if(this.id){
            this.setAttribute('id',this.id);
        }
        if(!this.hasAttribute('id') && !this.id){
            this.id = `thrinkle_imageBlob_${Date.now()}`;
        }
        
        if(this.hasAttribute('accept')){
            this.accept = this.getAttribute('accept');
        }
        if(this.accept){
            this.setAttribute('accept',this.accept);
        }
        if(!this.hasAttribute('accept') && !this.accept){
            this.accept = "image/*";
        }

        if(this.hasAttribute('required')){
            this.required = true;
            this._internals.required = true;
            this._internals.ariaRequired = true;
        }
        if(this.required){
            this.setAttribute('required',this.required);
            this._internals.required = true;
            this._internals.ariaRequired = true;
        }

        if(this.hasAttribute('label')){
            this.label = this.getAttribute('label');
        }
        if(!this.hasAttribute('label') && !this.label){
            this.label = 'Choose Image';
        }
        
        this.labelClass="thrinkle-image-input-label";
        if(this.hasAttribute('labelclass')){
            this.labelClass = this.getAttribute('labelclass');
        }
        this.errorOutputClass="text-danger mt-2";
        if(this.hasAttribute('errormessageclass')){
            this.errorOutputClass = this.getAttribute('errormessageclass');
        }
        this.errorMessage=[];
        if(this.hasAttribute('errormessage')){
            this.errorMessage =  JSON.parse(this.getAttribute('errormessage'));
        }

        // this.cameraLabel="Camera";
        if(this.hasAttribute('cameralabel')){
            this.cameraLabel = this.getAttribute('cameralabel');
        }
        if(!this.hasAttribute('cameralabel') && !this.cameraLabel){
            this.cameraLabel = "Camera";
        }

        // this.captureLabel="Capture";
        if(this.hasAttribute('capturelabel')){
            this.captureLabel = this.getAttribute('capturelabel');
        }
        if(!this.hasAttribute('capturelabel') && !this.captureLabel){
            this.captureLabel = "Capture";
        }
        // this.uploadLabel="Upload Image";
        if(this.hasAttribute('uploadlabel')){
            this.uploadLabel = this.getAttribute('uploadlabel');
        }
        if(!this.hasAttribute('uploadlabel') && !this.uploadLabel){
            this.uploadLabel = "Upload Image";
        }
        this.autoplay =true;
        if(this.hasAttribute('autoplay') && this.getAttribute('autoplay')==='false'){
            this.autoplay = false;
        }
        this.playsInline=true;
        if(this.hasAttribute('playsinline') && this.getAttribute('playsinline')==='false'){
            this.playsInline = false;
        }

        // this.initialValue=null; // if there is an initial value
        if(this.hasAttribute('initialvalue')){
            this.initialValue = this.getAttribute('initialvalue');
        }
        this.mime = 'image/jpeg';
        if(this.hasAttribute('mime')){
            this.mime = this.getAttribute('mime');
        }
        this.width = '200';
        if(this.hasAttribute('width')){
            this.width = this.getAttribute('width');
        }        
        this.disabled = false;// this is disabled by default
        if(this.hasAttribute('disabled')){
            this.disabled = true;
        }
        this.streaming = false;
    }

    connectedCallback() {  
        if(this._initialized) return;
        this._initialized = true;

        this.container = document.createElement('div');  
        this.appendChild(this.container);
        this.container.classList.add(
            "thrinkle-image-input"
        );
        this.usingFrontCamera = true;
        this.currentStream = null;
        // set up label
        if(this.label){
            this.labelElem = document.createElement('label');
            this.labelElem.textContent = this.label;
            this.labelElem.className = this.labelClass;
            this.labelElem.htmlFor = this.id;
            this.container.appendChild(this.labelElem);
        }
        // add video
        this.videoDiv = document.createElement('div')
        this.videoDiv.classList.add(
            'thrinkle-image-input-video-container',
            'thrinkle-d-none'
        );
        this.videoDiv.style.borderTopLeftRadius = `${this.radius}px`;
        this.videoDiv.style.borderBottomLeftRadius = `${this.radius}px`;
        this.videoDiv.style.borderTopRightRadius = `${this.radius}px`;
        this.videoDiv.style.borderBottomRightRadius = `${this.radius}px`;

        this.video = document.createElement('video');
        this.video.autoplay= this.autoplay;
        this.video.playsInline= this.playsInline;
        this.video.classList.add(
            "video", 
            "shadow-sm"
        );
        
        this.video.style.borderTopLeftRadius = `${this.radius}px`;
        this.video.style.borderBottomLeftRadius = `${this.radius}px`;
        this.video.style.borderTopRightRadius = `${this.radius}px`;
        this.video.style.borderBottomRightRadius = `${this.radius}px`;
        this.video.id = `video_${Date.now()}`;
        this.videoDiv.appendChild(this.video);
        this.container.appendChild(this.videoDiv);
        
        // add recording buttons

        // create the buttons container
        const buttonsContainerDiv = document.createElement('div');
        buttonsContainerDiv.classList.add(
            "thrinkle-d-flex", 
            "thrinkle-flex-v-center",
            // "thrinkle-button-container"
        );
        // create the camera button
        this.cameraButton = document.createElement('thrinkle-button');
        this.cameraButton.type = "button";
        this.cameraButton.icon = 'camera';
        this.cameraButton.label = this.cameraLabel;
        this.cameraButton.kind = "primary";
        this.cameraButton.disabled = this.disabled;
        this.cameraButton.marginLeft = '5px';
        this.cameraButton.id = `cameraButton_${Date.now()}`;
        buttonsContainerDiv.appendChild(this.cameraButton);
        
        // create the camera flip button
        this.cameraFlipButton = document.createElement('thrinkle-button');
        this.cameraFlipButton.type = "button";
        this.cameraFlipButton.icon = 'flip-phone';
        this.cameraFlipButton.kind = "primary";
        this.cameraFlipButton.marginLeft = '5px';
        this.cameraFlipButton.classList.add("thrinkle-d-none");
        this.cameraFlipButton.id = `cameraFlipButton_${Date.now()}`;
        buttonsContainerDiv.appendChild(this.cameraFlipButton);

        // create the capture button
        this.captureButton = document.createElement('thrinkle-button');
        this.captureButton.type = "button";
        this.captureButton.icon = 'camera2';
        this.captureButton.label = this.captureLabel;
        this.captureButton.kind = "danger";
        this.captureButton.classList.add("thrinkle-d-none");
        this.captureButton.id = `captureButton_${Date.now()}`;
        buttonsContainerDiv.appendChild(this.captureButton);

        // create the upload button
        this.uploadButton = document.createElement('thrinkle-button');
        this.uploadButton.type = "button";
        this.uploadButton.icon = 'card-image';
        this.uploadButton.label = this.uploadLabel;
        this.uploadButton.kind = "warning";
        this.uploadButton.disabled = this.disabled;
        this.uploadButton.id = `uploadButton_${Date.now()}`;
        buttonsContainerDiv.appendChild(this.uploadButton);
        this.container.appendChild(buttonsContainerDiv);

        // add the canvas
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add(
            "canvas", 
            "thrinkle-d-none"
        );         
        this.canvas.style.borderTopLeftRadius = `${this.radius}px`;
        this.canvas.style.borderBottomLeftRadius = `${this.radius}px`;
        this.canvas.style.borderTopRightRadius = `${this.radius}px`;
        this.canvas.style.borderBottomRightRadius = `${this.radius}px`;      
        this.context = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // add the upload file input
        this.uploadFileContainerDiv = document.createElement('div');
        this.uploadFileContainerDiv.classList.add(
            "thrinkle-mt-2", 
            "thrinkle-d-none"
        );
        this.uploadFileContainerDiv.id = `imageUploadDisplay_${Date.now()}`;

        this.imageBlob = document.createElement('thrinkle-input');
        this.imageBlob.type = "file";
        this.imageBlob.label = this.uploadLabel;
        this.imageBlob.icon = true;
        this.imageBlob.required = this.required;
        this.imageBlob.id = this.id;
        this.imageBlob.name = this.name;
        this.imageBlob.accept = this.accept;
        this.imageBlob.margin = '0px';
        this.uploadFileContainerDiv.appendChild(this.imageBlob);
        this.container.appendChild(this.uploadFileContainerDiv);
        // add image previewer
        this.preview = document.createElement('img');
        this.preview.classList.add(
            'preview-img',
            'thrinkle-d-none'
        )        
        this.preview.style.borderTopLeftRadius = `${this.radius}px`;
        this.preview.style.borderBottomLeftRadius = `${this.radius}px`;
        this.preview.style.borderTopRightRadius = `${this.radius}px`;
        this.preview.style.borderBottomRightRadius = `${this.radius}px`;
        if(this.initialValue){
            this.preview.classList.remove("thrinkle-d-none");
            this.preview.src= this.initialValue;
        }
        this.preview.alt= `${this.name} preview`;
        this.container.appendChild(this.preview);

        // set up the error message if any
        this.errorMessageId = `error_${Date.now()}`;
        this.addErrorMessage(this.errorMessage);
        
        // add event listeners
        this.video.addEventListener('canplay',()=>{
            if (!this.streaming) {
                let height = (this.video.videoHeight / this.video.videoWidth) * this.width;

                this.video.setAttribute("width", this.width);
                this.video.setAttribute("height", height);
                this.canvas.setAttribute("width", this.width);
                this.canvas.setAttribute("height", height);
                this.streaming = true;
            }
        });
        this.cameraButton.addEventListener('click', async () => {    
            this.clearFiles(this.imageBlob);
            this.uploadFileContainerDiv.classList.add('thrinkle-d-none');
            this.preview.classList.add('thrinkle-d-none');
            this.videoDiv.classList.remove('thrinkle-d-none');
            this.captureButton.classList.toggle('thrinkle-d-none');
            this.cameraFlipButton.classList.remove('thrinkle-d-none');
            this.cameraButton.classList.toggle('thrinkle-d-none');
            // Start the webcam stream
            this.startStream();
        });

        this.cameraFlipButton.addEventListener('click', () => {
            this.cameraFlipButton.classList.toggle("thrinkle-btn-primary");
            this.cameraFlipButton.classList.toggle("thrinkle-btn-warning");
            this.usingFrontCamera = !this.usingFrontCamera;
            // Stop existing tracks
            if (this.currentStream) {
                this.currentStream.getTracks().forEach(track => track.stop());
            }
            this.startStream();
        });
        
        // Capture image
        this.captureButton.addEventListener('click', () => {      
            this.uploadFileContainerDiv.classList.add('thrinkle-d-none');
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.context.drawImage(
                this.video, 
                0, 
                0, 
                this.canvas.width, 
                this.canvas.height
            );
            
            const dataUrl = this.canvas.toDataURL(this.mime);
            this.preview.src = dataUrl;
            this.preview.classList.remove('thrinkle-d-none');

            // Save the image data to hidden input (base64 format)
            const arr = dataUrl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : this.mime;
            const bstr = atob(arr[1]); // Decode base64
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([u8arr], `image.${this.mime.split('/')[1]}`, { type: mime }));
            this.imageBlob.files = dataTransfer.files;
        });

        this.uploadButton.addEventListener('click',()=>{
            this.videoDiv.classList.add('thrinkle-d-none');
            this.captureButton.classList.add('thrinkle-d-none');
            this.cameraButton.classList.remove('thrinkle-d-none');
            this.cameraFlipButton.classList.add('thrinkle-d-none');
            this.preview.src = '';
            this.preview.classList.add('thrinkle-d-none');
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.clearFiles(this.imageBlob);
            this.uploadFileContainerDiv.classList.remove('thrinkle-d-none');

        });
        this.imageBlob.addEventListener('change',(e)=>{
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.preview.src = e.target.result;
                    this.preview.classList.remove('thrinkle-d-none');
                };                
                reader.readAsDataURL(file);
            }
        });    
        
        const style = document.createElement('style');
		style.setAttribute('id','thrinkle_image_input')
		this.css = ` 
            .thrinkle-image-input{
                display: flex;
                flex-direction: column;
                margin-top: 10px;
                margin-bottom: 5px;
                margin-left: 5px;
                margin-right: 5px;
            }
            .thrinkle-image-input-label{
                display: block;
                margin-left: 5px;
                margin-bottom: 0px;
                font-weight: 500;
            }
            .thrinkle-image-input-video-container{
                width: 100%;    
                margin-left: 5px;  
            }            
            .preview-img {
                max-width: 200px;
                max-height: 200px;
                margin-top: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .video, 
            .canvas{
                max-width: 500px;
                max-height: 500px;
                margin-bottom: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }       

            /* Hide the alert when the data-thrinkle-loading attribute is present */
            .thrinkle-image-input[data-thrinkle-loading] {
                display: none;
            }
		`;
		style.textContent = this.css;
		if(!document.head.querySelector("style#thrinkle_image_input")){
			document.head.appendChild(style);
		}

    }

    // get label(){ return this.inputLabel.textContent;}//needed for form elements
    set label(val){
        this.setAttribute('label',val);
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
			case 'accept':
                //set form accept, this accept is used for form related operations
                if(this.input?.accept) {
                    this.input.accept = newValue;
                }
                this.updateFormValue(newValue)
				break ;
			case 'type':
                //set form type, this type is used for form related operations
                if(this.input?.type) {
                    this.input.type = newValue;
                }
                this.updateFormValue(newValue)
				break ;
			case 'name':
                //set form name, this name is used for form related operations
                if(this.input?.name) {
                    this.input.name = newValue;
                }
				break;
			case 'margin':
                //set form name, this name is used for form related operations
                this.style.margin = newValue;
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
    async startStream(){
        // Toggle facing mode
        const facingMode = this.usingFrontCamera ? "user" : "environment";
        try {
            this.currentStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: facingMode } }
            });

            this.video.srcObject = this.currentStream;
        } catch (err) {
            alert("Failed to switch camera", err);
            console.error("Failed to switch camera", err);
        }
    }
    clearFiles(input){
        const dataTransfer = new DataTransfer();
        input.files = dataTransfer.files;
    }
    removeErrorMessage(){
        if(document.getElementById(this.errorMessageId)){
            document.getElementById(this.errorMessageId).remove();
        }
    }
    addErrorMessage(errorMessage){
        this.removeErrorMessage();
        if(errorMessage){
            this.errorOutput = document.createElement('ul');            
            this.errorOutput.className = this.errorOutputClass;           
            this.errorOutput.id = this.errorMessageId;
            errorMessage.forEach((message)=>{
                const error = document.createElement('li');
                error.textContent=message;
                this.errorOutput.appendChild(error);
            });
            this.container.appendChild(this.errorOutput);
        }
    }   
}