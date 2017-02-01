/**
 * Created by kgopi on 01/02/17.
 */

///<amd-dependency path="../lib/adapter" />

import DomUtils = require("./../js/utils/DomUtil");
import RecorderTmplModule = require("./../templates/RecorderTmplModule");

class Recorder{

    private controls = {
        el: null,
        container: null,
        toolbar: {
            startBtn: null,
            stopBtn: null,
            settingsBtn: null
        },
        recorder: null
    };
    private options = {
        container: null
    };
    private eventHandlers = {
        startRecordingHandler: this.startRecording.bind(this),
        stopRecordingHandler: this.stopRecording.bind(this),
        settingsBtnClickHandler: this.openSettingsPopup.bind(this)
    };
    private data = {
        mediaStream: null,
        recorder: null,
        connection: null,
        fileName: null,
        websocketEndpoint: 'ws://localhost:7000'
    };

    constructor(options:{container:HTMLElement}){
        this.options = options;

        /* WebSocket connection is independent of DOM*/
        this.getWebSocket();

        /* DOM construction */
        this.initControls();
        this.attachEvents();
        this.render();
    }

    private initControls(){
        this.controls.container = this.options.container;
        this.controls.el = DomUtils.getNodeFromStr(RecorderTmplModule.mainTmpl);
        this.controls.toolbar.startBtn = this.controls.el.querySelector('#startBtn');
        this.controls.toolbar.stopBtn = this.controls.el.querySelector('#stopBtn');
        this.controls.toolbar.settingsBtn = this.controls.el.querySelector('#settingsBtn');
        this.controls.recorder = this.controls.el.querySelector('#gs-recorder');
    }

    private attachEvents(){
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
        this.controls.toolbar.settingsBtn.addEventListener('click', this.eventHandlers.settingsBtnClickHandler);
    }

    private removeEvents(){
        this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.stopRecordingHandler);
        this.controls.toolbar.settingsBtn.removeEventListener('click', this.eventHandlers.settingsBtnClickHandler);
    }

    private getVideoStream() {
        var config = { video: true, audio: true };
        navigator['mediaDevices'].getUserMedia(config).then((stream) => {
            this.data.mediaStream = stream;
            this.controls.recorder.setAttribute('src', window.URL.createObjectURL(this.data.mediaStream));
            this.getRecorder();
        });
    };

    private getRecorder() {
        var options = {mimeType: 'video/webm', audioBitsPerSecond: 128000};
        this.data.recorder = new window['MediaRecorder'](this.data.mediaStream, options);
        this.data.recorder.ondataavailable = this.videoDataHandler;
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
        var fileLocation = 'http://localhost:7000/uploads/'
            + this.data.fileName + '.webm';
        video.setAttribute('src', fileLocation);
    };

    private startRecording(eve){
        this.data.recorder.start(1000);
    }

    private stopRecording(eve){
        this.data.recorder.stop();
        this.updateVideoFile();
    }

    private openSettingsPopup(eve){
        /* ##TODO */
    }

    private render(){
        this.controls.container.appendChild(this.controls.el);
    }

    public destroy(){
        this.removeEvents();
        delete this.controls;
    }

}