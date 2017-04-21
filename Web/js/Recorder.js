/**
 * Created by kgopi on 01/02/17.
 */
define(["require", "exports", "./../js/utils/DomUtil", "./../templates/RecorderTmplModule", "js/lib/adapter.js"], function (require, exports, DomUtils, RecorderTmplModule) {
    var Recorder = (function () {
        function Recorder(options) {
            this.controls = {
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
            this.options = {
                container: null,
                userId: "00561000000qD8IAAU",
                sessionId: "00D610000006JXp!ARoAQJN2MWql8Dc136n96KJFnSli6Q0RkM.TLdjxt.2AhAlnGaPtbDP72_X8PIHr6LlaiKbDr7VGvsh7tQHwNMRvG835EURc"
            };
            this.eventHandlers = {
                startRecordingHandler: this.startRecording.bind(this),
                stopRecordingHandler: this.stopRecording.bind(this),
                onPublishHandler: this.publishTheVideo.bind(this),
                settingsBtnClickHandler: this.openSettingsPopup.bind(this)
            };
            this.data = {
                mediaStream: null,
                recorder: null,
                connection: null,
                fileName: null,
                websocketEndpoint: 'ws://' + this.options.sessionId + '__' + this.options.userId + '@localhost:7000'
            };
            for (var attrname in options) {
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
        Recorder.prototype.initControls = function () {
            this.controls.container = this.options.container;
            this.controls.el = DomUtils.getNodeFromStr(RecorderTmplModule.mainTmpl);
            this.controls.toolbar.startBtn = this.controls.el.querySelector('#startBtn');
            this.controls.toolbar.stopBtn = this.controls.el.querySelector('#stopBtn');
            this.controls.toolbar.publishBtn = this.controls.el.querySelector('#publishBtn');
            this.controls.toolbar.settingsBtn = this.controls.el.querySelector('#settingsBtn');
            this.controls.recorder = this.controls.el.querySelector('#gs-recorder');
            var mediaSource = new MediaSource();
            mediaSource.addEventListener('sourceopen', function () {
                mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
            }, false);
        };
        Recorder.prototype.attachEvents = function () {
            this.controls.toolbar.startBtn.addEventListener('click', this.eventHandlers.startRecordingHandler);
            this.controls.toolbar.stopBtn.addEventListener('click', this.eventHandlers.stopRecordingHandler);
            this.controls.toolbar.publishBtn.addEventListener('click', this.eventHandlers.onPublishHandler);
            this.controls.toolbar.settingsBtn.addEventListener('click', this.eventHandlers.settingsBtnClickHandler);
        };
        Recorder.prototype.removeEvents = function () {
            this.controls.toolbar.startBtn.removeEventListener('click', this.eventHandlers.startRecordingHandler);
            this.controls.toolbar.stopBtn.removeEventListener('click', this.eventHandlers.stopRecordingHandler);
            this.controls.toolbar.publishBtn.removeEventListener('click', this.eventHandlers.onPublishHandler);
            this.controls.toolbar.settingsBtn.removeEventListener('click', this.eventHandlers.settingsBtnClickHandler);
        };
        Recorder.prototype.getVideoStream = function () {
            var _this = this;
            var config = { video: true, audio: true };
            navigator['mediaDevices'].getUserMedia(config).then(function (stream) {
                _this.data.mediaStream = stream;
                _this.controls.recorder.setAttribute('src', window.URL.createObjectURL(_this.data.mediaStream));
            });
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
            var fileLocation = 'https://localhost:7000/uploads/'
                + this.data.fileName + '.webm';
            video.setAttribute('src', fileLocation);
        };
        ;
        Recorder.prototype.beforeRecordStart = function () {
            if (!this.controls.toolbar.startBtn.classList.contains('disable')) {
                this.controls.toolbar.startBtn.classList.add('disable');
            }
            if (this.controls.toolbar.stopBtn.classList.contains('disable')) {
                this.controls.toolbar.stopBtn.classList.remove('disable');
            }
        };
        Recorder.prototype.afterRecordStop = function () {
            if (this.controls.toolbar.startBtn.classList.contains('disable')) {
                this.controls.toolbar.startBtn.classList.remove('disable');
            }
            if (!this.controls.toolbar.stopBtn.classList.contains('disable')) {
                this.controls.toolbar.stopBtn.classList.add('disable');
            }
        };
        Recorder.prototype.getRecorder = function () {
            var options = { mimeType: 'video/webm', bitsPerSecond: 100000 };
            this.data.recorder = new window['MediaRecorder'](this.data.mediaStream, options);
            this.data.recorder.ondataavailable = this.videoDataHandler.bind(this);
        };
        ;
        Recorder.prototype.startRecording = function (eve) {
            this.beforeRecordStart();
            this.getRecorder();
            this.data.connection.send(JSON.stringify({
                command: 'FILE_TOKEN',
                token: this.data.fileName
            }));
            this.data.recorder.start(10);
        };
        Recorder.prototype.stopRecording = function (eve) {
            this.data.recorder.stop();
            this.updateVideoFile();
            this.afterRecordStop();
        };
        Recorder.prototype.publishTheVideo = function (eve) {
            this.data.connection.send(JSON.stringify({
                command: 'PUBLISH',
                token: this.data.fileName
            }));
        };
        Recorder.prototype.openSettingsPopup = function (eve) {
            /* ##TODO */
        };
        Recorder.prototype.render = function () {
            this.controls.container.appendChild(this.controls.el);
        };
        Recorder.prototype.destroy = function () {
            this.removeEvents();
            this.data.connection && this.data.connection.close(1000, 'View got destroyed');
            delete this.controls;
        };
        return Recorder;
    })();
    return Recorder;
});
//# sourceMappingURL=Recorder.js.map