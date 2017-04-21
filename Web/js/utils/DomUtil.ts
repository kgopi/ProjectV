/**
 * Created by kgopi on 01/02/17.
 */

module DomUtils{

    export function getNodeFromStr(template: string){
        var temp = document.createElement('div');
        temp.innerHTML = template;
        return temp.firstChild;
    }

    export function hide(ele:HTMLElement){
        const styles = ele.ownerDocument.defaultView.getComputedStyle(ele, null);
        if(styles.display != 'none'){
            ele['__orgDisplay'] = styles.display;
            ele.style.display = 'none';
        }
    }

    export function show(ele:HTMLElement){
        const styles = ele.ownerDocument.defaultView.getComputedStyle(ele, null);
        if(styles.display == 'none'){
            ele.style.display = ele['__orgDisplay'] || '';
        }
    }

}

export = DomUtils;