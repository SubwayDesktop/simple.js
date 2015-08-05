'use strict';


function $(selector){
    return document.querySelector(selector);
}


function $All(selector){
    return document.querySelectorAll(selector);
}


function assignGlobalObjects(list){
    for(let item of Object.keys(list))
	window[item] = $(list[item]);
}


function assignMethods(constructor, methods){
    for(let I of Object.keys(methods))
	constructor.prototype[I] = methods[I];
}


function elementAssign(element, properties){
    /* no property is set, exit without processing */
    if(!properties)
	return;

    /* shorthand for textContent */
    if(typeof properties == 'string'){
	element.textContent = properties;
	return;
    }

    /* shorthand for children */
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
	    for(let I of Object.keys(properties[item])){
		if(!properties[item][I])
		    continue;
		element[item][I] = properties[item][I];
	    }
	    delete properties[item];
	}
    });

    /* assign other properties */
    for(let I of Object.keys(properties)){
	if(!properties[I])
	    continue;
	element[I] = properties[I];
    }
}


function create(type, properties){
    var element = document.createElement(type);
    elementAssign(element, properties);
    return element;
}


function inst(template, data){
    var instance = document.importNode(template, true).content;
    for(let selector of Object.keys(data))
	elementAssign(instance.querySelector(selector), data[selector]);
    return instance;
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


function* previousElementIterator(element){
    while(element){
	element = element.previousElementSibling;
	/* yield if previous sibling element exists */
	if(element)
	    yield element;
    }
}


function* nextElementIterator(element){
    while(element){
	element = element.nextElementSibling;
	/* yield if next sibling element exists */
	if(element)
	    yield element;
    }
}


function printf(args){
    var string = arguments[0];
    /* note that %n in the string must be in ascending order */
    /* like 'Foo %1 Bar %2 %3' */
    var i;
    for(i=arguments.length-1; i>0; i--)
	string = string.replace('%'+i, arguments[i]);
    return string;
}


/* Polyfill */
if(!NodeList.prototype[Symbol.iterator]){
    NodeList.prototype[Symbol.iterator] = function* (){
	for(let i=0; i<this.length; i++)
	    yield this[i];
    };
}
