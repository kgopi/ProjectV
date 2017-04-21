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
        function hide(ele) {
            var styles = ele.ownerDocument.defaultView.getComputedStyle(ele, null);
            if (styles.display != 'none') {
                ele['__orgDisplay'] = styles.display;
                ele.style.display = 'none';
            }
        }
        DomUtils.hide = hide;
        function show(ele) {
            var styles = ele.ownerDocument.defaultView.getComputedStyle(ele, null);
            if (styles.display == 'none') {
                ele.style.display = ele['__orgDisplay'] || '';
            }
        }
        DomUtils.show = show;
    })(DomUtils || (DomUtils = {}));
    return DomUtils;
});
//# sourceMappingURL=DomUtil.js.map