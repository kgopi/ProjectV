/**
 * Created by kgopi on 01/02/17.
 */

module DomUtils{

    export function getNodeFromStr(template: string){
        var temp = document.createElement('div');
        temp.innerHTML = template;
        return temp.firstChild;
    }

}

export = DomUtils;