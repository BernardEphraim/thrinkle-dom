/*
this class declares an audio input. 
requirements are to provide 
    - name
    - id
    - accepts
    - required
    - label
instantiate an element this way

<script type="module" src="{{asset('storage/thrinkle-bs-dom/thrinkle-bs-dom.js')}}"></script>
<t-bs-audio-input
    name='audio'
    id="audio"
    required
></t-bs-audio-input>
*/
export default class ThrinkleAudioInput extends HTMLElement {
    constructor() {
        super();
        this.role='input';
        let inputName = "audio";
        if(this.hasAttribute('name')){
            inputName = this.getAttribute('name');
        }
        this.format = 'webm';
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
            this.format = 'mp4';
        }
        if (MediaRecorder.isTypeSupported('audio/webm')) {
           this.format = 'webm';
        } 
        let inputId = `audioBlob_${Date.now()}`;
        if(this.hasAttribute('id')){
            inputId = this.getAttribute('id');
        }
        let accepts = "audio/*";
        if(this.hasAttribute('accepts')){
            accepts = this.getAttribute('accepts');
        }
        this.required = false;
        if(this.hasAttribute('required')){
            this.required = true;
        }
        let label='Choose Audio';
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
        let recordLabel="Record";
        if(this.hasAttribute('recordlabel')){
            recordLabel = this.getAttribute('recordlabel');
        }
        let stopLabel="Stop";
        if(this.hasAttribute('stoplabel')){
            stopLabel = this.getAttribute('stoplabel');
        }
        let uploadLabel="Upload Audio";
        if(this.hasAttribute('uploadlabel')){
            uploadLabel = this.getAttribute('uploadlabel');
        }
        let errorMessage=[];
        if(this.hasAttribute('errormessage')){
            errorMessage =  JSON.parse(this.getAttribute('errormessage'));
        }
        let initialValue=null; // if there is an initial value
        if(this.hasAttribute('initialvalue')){
            initialValue = this.getAttribute('initialvalue');
        }        
        this.disabled = false;// this is disabled by default
        if(this.hasAttribute('disabled')){
            this.disabled = true;
        }

        this.mediaRecorder;
        this.audioChunks = [];
        this.audioContext;
        this.analyser;
        this.dataArray;
        this.animationId;
        this.source;
        
        this.container = document.createElement('div');  
        this.appendChild(this.container);
        this.container.classList.add(
            "position-relative",
            'mt-3'
        );
        
        // set up label
        if(label){
            this.label = document.createElement('label');
            this.label.textContent = label;
            this.label.className = labelClass;
            this.label.htmlFor = inputId;
            this.container.appendChild(this.label);
        }
        // add waveform
        const waveFormDiv = document.createElement('div');
        waveFormDiv.classList.add('my-3');
        this.waveForm = document.createElement('canvas');
        this.waveForm.style.height = "60px";
        this.waveForm.style.display = "none";
        this.waveForm.classList.add(
            "w-100", 
            "border", 
            "rounded", 
            "bg-white", 
            "shadow-sm"
        );
        this.waveForm.id = `waveform_${Date.now()}`;
        this.canvasCtx = this.waveForm.getContext('2d');
        waveFormDiv.appendChild(this.waveForm);
        this.container.appendChild(waveFormDiv);
        
        // add recording buttons

        // create the buttons container
        const buttonsContainerDiv = document.createElement('div');
        buttonsContainerDiv.classList.add(
            "d-flex", 
            "gap-2", 
            "mb-2"
        );
        // create the record button
        this.recordButton = document.createElement('button');
        this.recordButton.type = "button";
        this.recordButton.disabled = this.disabled;
        this.recordButton.classList.add(
            "btn",
            "btn-primary"
        );
        this.recordButton.id = `recordButton_${Date.now()}`;
        const recordIcon = document.createElement('i');
        recordIcon.classList.add(
            "bi", 
            "bi-mic"
        );
        this.recordButton.appendChild(recordIcon);
        const recordTextNode = document.createTextNode(` ${recordLabel}`);
        this.recordButton.appendChild(recordTextNode);
        buttonsContainerDiv.appendChild(this.recordButton);
        
        // create the stop button
        this.stopButton = document.createElement('button');
        this.stopButton.type = "button";
        this.stopButton.classList.add(
            "btn",
            "btn-secondary",
            "d-none"
        );
        this.stopButton.id = `stopButton_${Date.now()}`;
        const stopIcon = document.createElement('i');
        stopIcon.classList.add(
            "bi", 
            "bi-stop-circle"
        );
        // this.stopButton.disabled = true;
        this.stopButton.appendChild(stopIcon);
        const stopTextNode = document.createTextNode(` ${stopLabel}`);
        this.stopButton.appendChild(stopTextNode);
        buttonsContainerDiv.appendChild(this.stopButton);

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
            "bi-file-earmark-music"
        );
        this.uploadButton.appendChild(uploadIcon);
        const uploadTextNode = document.createTextNode(` ${uploadLabel}`);
        this.uploadButton.appendChild(uploadTextNode);
        buttonsContainerDiv.appendChild(this.uploadButton);
        this.container.appendChild(buttonsContainerDiv);

        // add the audio playback
        this.audioPlayback = document.createElement('audio');
        this.audioPlayback.classList.add(
            "w-100", 
            "mb-3", 
            "d-none"
        );
        if(initialValue){
            this.audioPlayback.classList.remove("d-none");
            this.audioPlayback.src= initialValue;
        }
        this.audioPlayback.controls = true;
        this.container.appendChild(this.audioPlayback);

        // add the upload file input
        this.uploadFileContainerDiv = document.createElement('div');
        this.uploadFileContainerDiv.classList.add(
            "mt-2", 
            "d-none"
        );
        this.uploadFileContainerDiv.id = `audioUploadDisplay_${Date.now()}`;
        const audioFileLabel = document.createElement('label');
        audioFileLabel.htmlFor = inputId;
        audioFileLabel.classList.add(
            "form-label"
        );
        audioFileLabel.textContent = uploadLabel;
        this.uploadFileContainerDiv.appendChild(audioFileLabel);
        this.audioBlob = document.createElement('input');
        this.audioBlob.type = "file";
        this.audioBlob.tabIndex = 0;
        this.audioBlob.required = this.required;
        this.audioBlob.classList.add(
            "form-control"
        );
        this.audioBlob.id = inputId;
        this.audioBlob.name = inputName;
        this.audioBlob.accept = accepts;
        this.uploadFileContainerDiv.appendChild(this.audioBlob);
        
        this.container.appendChild(this.uploadFileContainerDiv);

        // set up the error message if any
        this.errorOutputClass=errorOutputClass;
        this.errorMessageId = `error_${Date.now()}`;
        this.addErrorMessage(errorMessage);
        
        // add event listeners
        this.audioBlob.addEventListener('change',()=>{
            if(this.audioBlob.files.length>0){
                this.audioPlayback.controls = true;
                this.audioPlayback.src = URL.createObjectURL(this.audioBlob.files[0]);  
                this.audioPlayback.classList.remove('d-none');
            }else{           
                this.audioPlayback.controls = false;
                this.audioPlayback.src = '';
                this.audioPlayback.classList.add('d-none');
            }        
        });

        this.uploadButton.addEventListener('click',()=>{
            this.uploadFileContainerDiv.classList.remove('d-none');
            this.audioPlayback.classList.add('d-none');
            this.audioBlob.value = null;
        })

        this.recordButton.addEventListener('click', async () => {    
            this.uploadFileContainerDiv.classList.add('d-none');
            this.audioPlayback.classList.add('d-none');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Web Audio setup for waveform
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;

            this.dataArray = new Uint8Array(this.analyser.fftSize);
            this.source.connect(this.analyser);

            // Show canvas and start drawing
            this.waveForm.style.display = 'block';
            this.drawWaveform();

            // Recording setup
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = e => this.audioChunks.push(e.data);

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: `audio/${this.format}` });
                const audioFile = new File([audioBlob], `recording.${this.format}`, { type: `audio/${this.format}` });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(audioFile);
                this.audioBlob.files = dataTransfer.files;

                const audioURL = URL.createObjectURL(audioBlob);
                this.audioPlayback.src = audioURL;
                this.audioPlayback.classList.toggle('d-none');

                // Stop visualizer
                cancelAnimationFrame(this.animationId);
                this.canvasCtx.clearRect(0, 0, this.waveForm.width, this.waveForm.height);
                this.waveForm.style.display = 'none';
            };

            this.mediaRecorder.start();
            this.stopButton.classList.add('btn-recording');
            // this.recordButton.disabled = true;
            // this.stopButton.disabled = false;
            this.recordButton.classList.add('d-none');
            this.stopButton.classList.remove('d-none');
        });

        this.stopButton.addEventListener('click', () => {
            this.mediaRecorder.stop();
            // this.recordButton.disabled = false;
            // this.recordButton.classList.remove('btn-recording');
            // this.stopButton.disabled = true;
            
            this.recordButton.classList.remove('d-none');
            this.stopButton.classList.add('d-none');

            if (this.audioContext) {
                this.audioContext.close();
            }
        });
    }

    drawWaveform = () => {
        if (!this.analyser) return;

        const width = this.waveForm.width;
        const height = this.waveForm.height;

        requestAnimationFrame(this.drawWaveform);

        this.analyser.getByteTimeDomainData(this.dataArray);

        this.canvasCtx.fillStyle = '#fff';
        this.canvasCtx.fillRect(0, 0, width, height);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = '#0d6efd';

        this.canvasCtx.beginPath();
        const sliceWidth = width / this.analyser.fftSize;
        let x = 0;

        for (let i = 0; i < this.analyser.fftSize; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) this.canvasCtx.moveTo(x, y);
            else this.canvasCtx.lineTo(x, y);

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();
    };
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