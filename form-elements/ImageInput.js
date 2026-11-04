/*
this class declares an audio input. 
requirements are to provide 
instantiate an element this way

 <t-bs-image-input
    name='ephraim'
    id="ojone"
    errormessage="{{ $userJson }}"
    required
    width="500"
></t-bs-image-input>
*/
export default class ImageInput extends HTMLElement {
    constructor() {        
        super();
        this.role='input';
        let inputName = "image";
        if(this.hasAttribute('name')){
            inputName = this.getAttribute('name');
        }
        let inputId = `imageBlob_${Date.now()}`;
        if(this.hasAttribute('id')){
            inputId = this.getAttribute('id');
        }
        let accepts = "image/*";
        if(this.hasAttribute('accepts')){
            accepts = this.getAttribute('accepts');
        }
        this.required = false;
        if(this.hasAttribute('required')){
            this.required = true;
        }
        let label='Choose Image';
        if(this.hasAttribute('label')){
            label = this.getAttribute('label');
        }
        let labelClass="form-label";
        if(this.hasAttribute('labelclass')){
            labelClass = this.getAttribute('labelclass');
        }
        let errorOutputClass="text-danger mt-2";
        if(this.hasAttribute('errormessageclass')){
            errorOutputClass = this.getAttribute('errormessageclass');
        }
        let errorMessage=[];
        if(this.hasAttribute('errormessage')){
            errorMessage =  JSON.parse(this.getAttribute('errormessage'));
        }
        let cameraLabel="Camera";
        if(this.hasAttribute('cameralabel')){
            cameraLabel = this.getAttribute('cameralabel');
        }
        let captureLabel="Capture";
        if(this.hasAttribute('capturelabel')){
            captureLabel = this.getAttribute('capturelabel');
        }
        let uploadLabel="Upload Image";
        if(this.hasAttribute('uploadlabel')){
            uploadLabel = this.getAttribute('uploadlabel');
        }
        let autoplay=true;
        if(this.hasAttribute('autoplay') && this.getAttribute('autoplay')==='false'){
            autoplay = false;
        }
        let playsInline=true;
        if(this.hasAttribute('playsinline') && this.getAttribute('playsinline')==='false'){
            playsInline = false;
        }

        let initialValue=null; // if there is an initial value
        if(this.hasAttribute('initialvalue')){
            initialValue = this.getAttribute('initialvalue');
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

        this.container = document.createElement('div');  
        this.appendChild(this.container);
        this.container.classList.add(
            "position-relative",
            'mt-3'
        );
        this.usingFrontCamera = true;
        this.currentStream = null;
        // set up label
        if(label){
            this.label = document.createElement('label');
            this.label.textContent = label;
            this.label.className = labelClass;
            this.label.htmlFor = inputId;
            this.container.appendChild(this.label);
        }
        // add video
        this.videoDiv = document.createElement('div')
        this.videoDiv.classList.add(
            'mb-3',
            'd-none'
        );

        this.video = document.createElement('video');
        this.video.autoplay=autoplay;
        this.video.playsInline=playsInline;
        this.video.classList.add(
            "video", 
            "shadow-sm"
        );
        this.video.id = `video_${Date.now()}`;
        this.videoDiv.appendChild(this.video);
        this.container.appendChild(this.videoDiv);
        
        // add recording buttons

        // create the buttons container
        const buttonsContainerDiv = document.createElement('div');
        buttonsContainerDiv.classList.add(
            "d-flex", 
            "gap-2", 
            "mb-2"
        );
        // create the camera button
        this.cameraButton = document.createElement('button');
        this.cameraButton.type = "button";
        this.cameraButton.disabled = this.disabled;
        this.cameraButton.classList.add(
            "btn",
            "btn-primary"
        );
        this.cameraButton.id = `cameraButton_${Date.now()}`;
        const cameraIcon = document.createElement('i');
        cameraIcon.classList.add(
            "bi", 
            "bi-camera"
        );
        this.cameraButton.appendChild(cameraIcon);
        const cameraTextNode = document.createTextNode(` ${cameraLabel}`);
        this.cameraButton.appendChild(cameraTextNode);
        buttonsContainerDiv.appendChild(this.cameraButton);
        
        // create the camera flip button
        this.cameraFlipButton = document.createElement('button');
        this.cameraFlipButton.type = "button";
        this.cameraFlipButton.classList.add(
            "btn",
            "btn-primary",
            "d-none"
        );
        this.cameraFlipButton.id = `cameraFlipButton_${Date.now()}`;
        const cameraFlipIcon = document.createElement('i');
        cameraFlipIcon.classList.add(
            "bi", 
            "bi-phone-flip"
        );
        // this.cameraFlipButton.disabled = true;
        this.cameraFlipButton.appendChild(cameraFlipIcon);
        buttonsContainerDiv.appendChild(this.cameraFlipButton);

        // create the capture button
        this.captureButton = document.createElement('button');
        this.captureButton.type = "button";
        this.captureButton.classList.add(
            "btn",
            "btn-secondary",
            "btn-recording",
            "d-none"
        );
        this.captureButton.id = `captureButton_${Date.now()}`;
        const captureIcon = document.createElement('i');
        captureIcon.classList.add(
            "bi", 
            "bi-camera2"
        );
        // this.captureButton.disabled = true;
        this.captureButton.appendChild(captureIcon);
        const captureTextNode = document.createTextNode(` ${captureLabel}`);
        this.captureButton.appendChild(captureTextNode);
        buttonsContainerDiv.appendChild(this.captureButton);

        // create the upload button
        this.uploadButton = document.createElement('button');
        this.uploadButton.type = "button";
        this.uploadButton.disabled = this.disabled;
        this.uploadButton.classList.add(
            "btn",
            "btn-warning"
        );
        this.uploadButton.id = `uploadButton_${Date.now()}`;
        const uploadIcon = document.createElement('i');
        uploadIcon.classList.add(
            "bi", 
            "bi-card-image"
        );
        this.uploadButton.appendChild(uploadIcon);
        const uploadTextNode = document.createTextNode(` ${uploadLabel}`);
        this.uploadButton.appendChild(uploadTextNode);
        buttonsContainerDiv.appendChild(this.uploadButton);
        this.container.appendChild(buttonsContainerDiv);

        // add the canvas
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add(
            "canvas", 
            "d-none"
        );        
        this.context = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // add the upload file input
        this.uploadFileContainerDiv = document.createElement('div');
        this.uploadFileContainerDiv.classList.add(
            "mt-2", 
            "d-none"
        );
        this.uploadFileContainerDiv.id = `imageUploadDisplay_${Date.now()}`;
        const imageFileLabel = document.createElement('label');
        imageFileLabel.htmlFor = inputId;
        imageFileLabel.classList.add(
            "form-label"
        );
        imageFileLabel.textContent = uploadLabel;
        this.uploadFileContainerDiv.appendChild(imageFileLabel);
        this.imageBlob = document.createElement('input');
        this.imageBlob.type = "file";
        this.imageBlob.required = this.required;
        this.imageBlob.classList.add(
            "form-control"
        );
        this.imageBlob.id = inputId;
        this.imageBlob.name = inputName;
        this.imageBlob.accept = accepts;
        this.uploadFileContainerDiv.appendChild(this.imageBlob);
        this.container.appendChild(this.uploadFileContainerDiv);
        // add image previewer
        this.preview = document.createElement('img');
        this.preview.classList.add(
            'preview-img',
            'd-none'
        )
        if(initialValue){
            this.preview.classList.remove("d-none");
            this.preview.src= initialValue;
        }
        this.preview.alt= `${inputName} preview`;
        this.container.appendChild(this.preview);

        // set up the error message if any
        this.errorOutputClass=errorOutputClass;
        this.errorMessageId = `error_${Date.now()}`;
        this.addErrorMessage(errorMessage);
        
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
            this.uploadFileContainerDiv.classList.add('d-none');
            this.preview.classList.add('d-none');
            this.videoDiv.classList.remove('d-none');
            this.captureButton.classList.toggle('d-none');
            this.cameraFlipButton.classList.remove('d-none');
            this.cameraButton.classList.toggle('d-none');
            // Start the webcam stream
            this.startStream();
        });

        this.cameraFlipButton.addEventListener('click', () => {
            this.cameraFlipButton.classList.toggle("btn-primary");
            this.cameraFlipButton.classList.toggle("btn-warning");
            this.usingFrontCamera = !this.usingFrontCamera;
            // Stop existing tracks
            if (this.currentStream) {
                this.currentStream.getTracks().forEach(track => track.stop());
            }
            this.startStream();
        });
        
        // Capture image
        this.captureButton.addEventListener('click', () => {      
            this.uploadFileContainerDiv.classList.add('d-none');
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
            this.preview.classList.remove('d-none');

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
            this.videoDiv.classList.add('d-none');
            this.captureButton.classList.add('d-none');
            this.cameraButton.classList.remove('d-none');
            this.cameraFlipButton.classList.add('d-none');
            this.preview.src = '';
            this.preview.classList.add('d-none');
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.clearFiles(this.imageBlob);
            this.uploadFileContainerDiv.classList.remove('d-none');

        });
        this.imageBlob.addEventListener('change',()=>{
            const file = this.imageBlob.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    this.preview.src = e.target.result;
                    this.preview.classList.remove('d-none');
                };
                
                reader.readAsDataURL(file);
            }
        });       
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