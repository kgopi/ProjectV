/**
 * Created by kgopi on 01/02/17.
 */
define(["require", "exports"], function (require, exports) {
    var DomUtils;
    (function (DomUtils) {
        function getNodeFromStr(template) {
            var temp = document.createElement('div');
            temp.innerHTML = template;
            return temp.firstChild;
        }
        DomUtils.getNodeFromStr = getNodeFromStr;
    })(DomUtils || (DomUtils = {}));
    return DomUtils;
});
//# sourceMappingURL=DomUtil.js.map