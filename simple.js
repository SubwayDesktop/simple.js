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


function insertBefore(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}


function insertAfter(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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


function fetchFormData(form){
    var data = {};
    var input_elements = form.querySelectorAll('input');
    for(let I of input_elements){
	if(!I.name)
	    continue;
	if(I.type == 'checkbox' || I.type == 'radio')
	    data[I.name] = I.checked;
	else
	    data[I.name] = I.value;
    }
    return data;
}


function fillForm(form, data){
    for(let I of Object.keys(data)){
	let input = form.querySelector(printf('input[name="%1"]', I));
	if(input.type == 'checkbox' || input.type == 'radio')
	    input.checked = data[I];
	else
	    input.value = data[I];
    }
}


function disableForm(form){
    for(let I of form.querySelectorAll('input'))
	I.disabled = true;
}


function enableForm(form){
    for(let I of form.querySelectorAll('input'))
	I.disabled = false;
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


function clone(obj){
    /* code from stackoverflow #122102, much faster than other methods
     * modified for only cloning simple JSON-like object
     */
    if(obj === null || typeof(obj) !== 'object' || 'isActiveClone_' in obj)
	return obj;

    var temp = {};

    for(let key of Object.keys(obj)){
	obj['isActiveClone_'] = null;
	temp[key] = clone(obj[key]);
	delete obj['isActiveClone_'];
    }

    return temp;
}


/* Polyfill */
if(!NodeList.prototype[Symbol.iterator]){
    NodeList.prototype[Symbol.iterator] = function* (){
	for(let i=0; i<this.length; i++)
	    yield this[i];
    };
}
