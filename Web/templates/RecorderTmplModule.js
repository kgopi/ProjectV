/**
 * Created by kgopi on 01/02/17.
 */
define(["require", "exports"], function (require, exports) {
    var RecorderTmplModule;
    (function (RecorderTmplModule) {
        RecorderTmplModule.mainTmpl = "<div class=\"gs-recorder-container\">\n            <div class=\"gs-recorder-toolbar\">\n                <button id=\"startBtn\">Start</button>\n                <button style=\"display: none\" id=\"stopBtn\">Stop</button>\n                <button id=\"publishBtn\">Publish</button>\n                <button style=\"display: none\" id=\"settingsBtn\">Settings</button>\n            </div>\n            <div class=\"gs-recorder-main\">\n                <video id=\"gs-recorder\" src=\"\" autoplay muted></video>\n            </div>\n        </div>";
        RecorderTmplModule.settingsTmpl = "\n        <div class=\"gs-recorder-settings-container\">\n            <select id=\"audioInput\"></select>\n            <select id=\"videoInput\"></select>\n        <div>\n    ";
    })(RecorderTmplModule || (RecorderTmplModule = {}));
    return RecorderTmplModule;
});
//# sourceMappingURL=RecorderTmplModule.js.map