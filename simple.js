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


function create(type, properties, ignore_invalid){
    var element = document.createElement(type);

    /* no property is set, return the new element without processing */
    if(!properties)
	return element;

    /* assign array-like data structures */
    if(properties.children){
	for(let child of properties.children){
	    if(!child && ignore_invalid)
		continue;
	    element.appendChild(child);
	}
	delete properties.children;
    }
    if(properties.classList){
	for(let className of properties.classList){
	    if(!className && ignore_invalid)
		continue;
	    element.classList.add(className);
	}
	delete properties.classList;
    }
    /* assign objects */
    ['style', 'dataset'].forEach(function(item){
	if(properties[item]){
	    for(let I of Object.getOwnPropertyNames(properties[item])){
		if(!properties[item][I] && ignore_invalid)
		    continue;
		element[item][I] = properties[item][I];
	    }
	    delete properties[item];
	}
    });

    /* assign other properties */
    for(let I of Object.getOwnPropertyNames(properties)){
	if(!properties[I] && ignore_invalid)
	    continue;
	element[I] = properties[I];
    }

    return element;
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
    var i;
    for(i=1; i<arguments.length; i++){
	string = string.replace('%'+i, arguments[i]);
    }
    return string;
}
