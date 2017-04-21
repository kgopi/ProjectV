/**
 * Created by kgopi on 01/02/17.
 */

///<amd-dependency path="js/lib/adapter.js" />

import DomUtils = require("./../js/utils/DomUtil");
import RecorderTmplModule = require("./../templates/RecorderTmplModule");

class Recorder{

    private controls = {
        el: null,
        container: null,
        toolbar: {
            startBtn: null,
            stopBtn: null,
            publishBtn: null,
            settingsBtn: null
        },
        recorder: null
    };
    private options = {
        container: null,
        userId: "00561000000qD8IAAU",
        sessionId: "00D610000006JXp!ARoAQJN2MWql8Dc136n96KJFnSli6Q0RkM.TLdjxt.2AhAlnGaPtbDP72_X8PIHr6LlaiKbDr7VGvsh7tQHwNMRvG835EURc"
    };
    private eventHandlers = {
        startRecordingHandler: this.startRecording.bind(this),
        stopRecordingHandler: this.stopRecording.bind(this),
        onPublishHandler: this.publishTheVideo.bind(this),
        settingsBtnClickHandler: this.openSettingsPopup.bind(this)
    };
    private data = {
        mediaStream: null,
        recorder: null,
        connection: null,
        fileName: null,
        websocketEndpoint: 'ws://' + this.options.sessionId + '__' + this.options.userId + '@localhost:7000'
    };

    constructor(options:{container:HTMLElement, userId:string, sessionId: string}){
        for(var attrname in options) {
            this.options[attrname] = options[attrname];
        }

        /* WebSocket connection is independent of DOM*/
        this.getWebSocket();

        /* DOM construction */
        this.initControls();
        this.getVideoStream();
        this.attachEvents();
        this.render();
    }

    private initControls(){
        this.controls.container = this.options.container;
        this.controls.el = DomUtils.getNodeFromStr(RecorderTmplModule.mainTmpl);
        this.controls.toolbar.startBtn = this.controls.el.querySelector('#startBtn');
        this.controls.toolbar.stopBtn = this.controls.el.querySelector('#stopBtn');
        this.controls.toolbar.publishBtn = this.controls.el.querySelector('#publishBtn');
        this.controls.toolbar.settingsBtn = this.controls.el.querySelector('#settingsBtn');
        this.controls.recorder = this.controls.el.querySelector('#gs-recorder');

        var mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', ()=>{
            mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        }, false);
    }

    private attachEvents(){
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.stopBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
        this.controls.toolbar.publishBtn.addEventListener('click', this.eventHandlers.onPublishHandler);
        this.controls.toolbar.settingsBtn.addEventListener('click', this.eventHandlers.settingsBtnClickHandler);
    }

    private removeEvents(){
        this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.stopBtn.removeEventListener('click', this.eventHandlers.stopRecordingHandler);
        this.controls.toolbar.publishBtn.removeEventListener('click', this.eventHandlers.onPublishHandler);
        this.controls.toolbar.settingsBtn.removeEventListener('click', this.eventHandlers.settingsBtnClickHandler);
    }

    private getVideoStream() {
        var config = { video: true, audio: true };
        navigator['mediaDevices'].getUserMedia(config).then((stream) => {
            this.data.mediaStream = stream;
            this.controls.recorder.setAttribute('src', window.URL.createObjectURL(this.data.mediaStream));
        });
    };

    private videoDataHandler(event) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(event.data);
        reader.onloadend = (event) => {
            this.data.connection.send(reader.result);
        };
    }

    private getWebSocket() {
        this.data.connection = new WebSocket(this.data.websocketEndpoint);
        this.data.connection.binaryType = 'arraybuffer';
        this.data.connection.onmessage = (message) => {
            this.data.fileName = message.data;
        }
    }

    private updateVideoFile() {
        var video = document.getElementById('recorded-video');
        var fileLocation = 'https://localhost:7000/uploads/'
            + this.data.fileName + '.webm';
        video.setAttribute('src', fileLocation);
    };

    private beforeRecordStart(){
        if(!this.controls.toolbar.startBtn.classList.contains('disable')){
            this.controls.toolbar.startBtn.classList.add('disable');
        }
        if(this.controls.toolbar.stopBtn.classList.contains('disable')){
            this.controls.toolbar.stopBtn.classList.remove('disable');
        }
    }

    private afterRecordStop(){
        if(this.controls.toolbar.startBtn.classList.contains('disable')){
            this.controls.toolbar.startBtn.classList.remove('disable');
        }
        if(!this.controls.toolbar.stopBtn.classList.contains('disable')){
            this.controls.toolbar.stopBtn.classList.add('disable');
        }
    }

    private getRecorder() {
        var options = {mimeType: 'video/webm', bitsPerSecond: 100000};
        this.data.recorder = new window['MediaRecorder'](this.data.mediaStream, options);
        this.data.recorder.ondataavailable = this.videoDataHandler.bind(this);
    };

    private startRecording(eve){
        this.beforeRecordStart();
        this.getRecorder();
        this.data.connection.send(JSON.stringify({
            command: 'FILE_TOKEN',
            token: this.data.fileName
        }));
        this.data.recorder.start(10);
    }

    private stopRecording(eve){
        this.data.recorder.stop();
        this.updateVideoFile();
        this.afterRecordStop();
    }

    private publishTheVideo(eve){
        this.data.connection.send(JSON.stringify({
            command: 'PUBLISH',
            token: this.data.fileName
        }));
    }

    private openSettingsPopup(eve){
        /* ##TODO */
    }

    private render(){
        this.controls.container.appendChild(this.controls.el);
    }

    public destroy(){
        this.removeEvents();
        this.data.connection && this.data.connection.close(1000, 'View got destroyed');
        delete this.controls;
    }

}

export = Recorder;