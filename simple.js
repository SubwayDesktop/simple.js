'use strict';


function $(selector){
    return document.querySelector(selector);
}


function $All(selector){
    return document.querySelectorAll(selector);
}


function assignGlobalObjects(list){
    for(let item of Object.getOwnPropertyNames(list))
	window[item] = $(list[item]);
}


function create(type, properties){
    var element = document.createElement(type);

    /* no property is set, return the new element without processing */
    if(!properties)
	return element;

    /* shortcut for textContent */
    if(typeof properties == 'string'){
	element.textContent = properties;
	return element;
    }

    /* shortcut for children */
    if(Array.isArray(properties)){
	let children = properties;
	properties = {};
	properties.children = children;
    }

    /* assign array-like data structures */
    if(properties.children){
	for(let child of properties.children){
	    if(!child)
		continue;
	    element.appendChild(child);
	}
	delete properties.children;
    }
    if(properties.classList){
	for(let className of properties.classList){
	    if(!className)
		continue;
	    element.classList.add(className);
	}
	delete properties.classList;
    }
    /* assign objects */
    ['style', 'dataset'].forEach(function(item){
	if(properties[item]){
	    for(let I of Object.getOwnPropertyNames(properties[item])){
		if(!properties[item][I])
		    continue;
		element[item][I] = properties[item][I];
	    }
	    delete properties[item];
	}
    });

    /* assign other properties */
    for(let I of Object.getOwnPropertyNames(properties)){
	if(!properties[I])
	    continue;
	element[I] = properties[I];
    }

    return element;
}


function duplicate(node){
    return document.importNode(node, true);
}


function hide(element){
    if(element.style.display == 'none')
	return false;
    if(element.style.display)
	element.dataset.style_display = element.style.display;
    element.style.display = 'none';
    return true;
}


function show(element){
    if(element.style.display != 'none')
	return false;
    if(element.dataset.style_display){
	element.style.display = element.dataset.style_display;
	delete element.dataset.style_display;
    }else{
	element.style.display = '';
    }
    return true;
}


function printf(args){
    var string = arguments[0];
    /* note that %n in the string must be in ascending order */
    /* like 'Foo %1 Bar %2 %3' */
    var i;
    for(i=arguments.length-1; i>0; i--){
	string = string.replace('%'+i, arguments[i]);
    }
    return string;
}
