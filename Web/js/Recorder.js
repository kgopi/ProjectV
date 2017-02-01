/**
 * Created by kgopi on 01/02/17.
 */
define(["require", "exports", "./../js/utils/DomUtil", "./../templates/RecorderTmplModule", "../lib/adapter"], function (require, exports, DomUtils, RecorderTmplModule) {
    var Recorder = (function () {
        function Recorder(options) {
            this.controls = {
                el: null,
                container: null,
                toolbar: {
                    startBtn: null,
                    stopBtn: null,
                    settingsBtn: null
                },
                recorder: null
            };
            this.options = {
                container: null
            };
            this.eventHandlers = {
                startRecordingHandler: this.startRecording.bind(this),
                stopRecordingHandler: this.stopRecording.bind(this),
                settingsBtnClickHandler: this.openSettingsPopup.bind(this)
            };
            this.data = {
                mediaStream: null,
                recorder: null,
                connection: null,
                fileName: null,
                websocketEndpoint: 'ws://localhost:7000'
            };
            this.options = options;
            /* WebSocket connection is independent of DOM*/
            this.getWebSocket();
            /* DOM construction */
            this.initControls();
            this.attachEvents();
            this.render();
        }
        Recorder.prototype.initControls = function () {
            this.controls.container = this.options.container;
            this.controls.el = DomUtils.getNodeFromStr(RecorderTmplModule.mainTmpl);
            this.controls.toolbar.startBtn = this.controls.el.querySelector('#startBtn');
            this.controls.toolbar.stopBtn = this.controls.el.querySelector('#stopBtn');
            this.controls.toolbar.settingsBtn = this.controls.el.querySelector('#settingsBtn');
            this.controls.recorder = this.controls.el.querySelector('#gs-recorder');
        };
        Recorder.prototype.attachEvents = function () {
            this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.startRecordingHandler);
            this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
            this.controls.toolbar.settingsBtn.addEventListener('click', this.eventHandlers.settingsBtnClickHandler);
        };
        Recorder.prototype.removeEvents = function () {
            this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.startRecordingHandler);
            this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.stopRecordingHandler);
            this.controls.toolbar.settingsBtn.removeEventListener('click', this.eventHandlers.settingsBtnClickHandler);
        };
        Recorder.prototype.getVideoStream = function () {
            var _this = this;
            var config = { video: true, audio: true };
            navigator['mediaDevices'].getUserMedia(config).then(function (stream) {
                _this.data.mediaStream = stream;
                _this.controls.recorder.setAttribute('src', window.URL.createObjectURL(_this.data.mediaStream));
                _this.getRecorder();
            });
        };
        ;
        Recorder.prototype.getRecorder = function () {
            var options = { mimeType: 'video/webm', audioBitsPerSecond: 128000 };
            this.data.recorder = new window['MediaRecorder'](this.data.mediaStream, options);
            this.data.recorder.ondataavailable = this.videoDataHandler;
        };
        ;
        Recorder.prototype.videoDataHandler = function (event) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsArrayBuffer(event.data);
            reader.onloadend = function (event) {
                _this.data.connection.send(reader.result);
            };
        };
        Recorder.prototype.getWebSocket = function () {
            var _this = this;
            this.data.connection = new WebSocket(this.data.websocketEndpoint);
            this.data.connection.binaryType = 'arraybuffer';
            this.data.connection.onmessage = function (message) {
                _this.data.fileName = message.data;
            };
        };
        Recorder.prototype.updateVideoFile = function () {
            var video = document.getElementById('recorded-video');
            var fileLocation = 'http://localhost:7000/uploads/'
                + this.data.fileName + '.webm';
            video.setAttribute('src', fileLocation);
        };
        ;
        Recorder.prototype.startRecording = function (eve) {
            this.data.recorder.start(1000);
        };
        Recorder.prototype.stopRecording = function (eve) {
            this.data.recorder.stop();
            this.updateVideoFile();
        };
        Recorder.prototype.openSettingsPopup = function (eve) {
            /* ##TODO */
        };
        Recorder.prototype.render = function () {
            this.controls.container.appendChild(this.controls.el);
        };
        Recorder.prototype.destroy = function () {
            this.removeEvents();
            delete this.controls;
        };
        return Recorder;
    })();
});
//# sourceMappingURL=Recorder.js.map