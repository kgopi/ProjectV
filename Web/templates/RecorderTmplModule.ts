/**
 * Created by kgopi on 01/02/17.
 */

module RecorderTmplModule{

    export var mainTmpl =
        `<div class="gs-recorder-container">
            <div class="gs-recorder-toolbar">
                <button id="startBtn">Start</button>
                <button id="stopBtn">Stop</button>
                <button id="publishBtn">Publish</button>
                <button id="settingsBtn">Settings</button>
            </div>
            <div class="gs-recorder-main">
                <video id="gs-recorder" src="" autoplay muted></video>
            </div>
        </div>`;

    export var settingsTmpl = `
        <div class="gs-recorder-settings-container">
            <select id="audioInput"></select>
            <select id="videoInput"></select>
        <div>
    `;

}

export = RecorderTmplModule;