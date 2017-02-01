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
            stopBtn: null
        }
    };
    private options = {
        container: null
    };
    private eventHandlers = {
        startRecordingHandler: this.startRecording.bind(this),
        stopRecordingHandler: this.stopRecording.bind(this)
    };

    constructor(options:{container:HTMLElement}){
        this.options = options;
    }

    private init(){
        this.controls.container = this.options.container;
        this.controls.el = DomUtils.getNodeFromStr(RecorderTmplModule.mainTmpl);
        this.controls.toolbar.startBtn = this.controls.el.querySelector('#startBtn');
        this.controls.toolbar.stopBtn = this.controls.el.querySelector('#stopBtn');
        this.controls.toolbar.settingsBtn = this.controls.el.querySelector('#settingsBtn');
    }

    private attachEvents(){
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
        this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
    }

    private removeEvents(){
        this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.startRecordingHandler);
        this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.stopRecordingHandler);
    }

    private startRecording(eve){

    }

    private stopRecording(eve){

    }

    private render(){
        this.controls.container.appendChild(this.controls.el);
    }

    public destroy(){
        this.removeEvents();
        delete this.controls;
    }

}