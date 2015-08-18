'use strict';


/**
 * Alias of document.querySelector()
 * @param String selector
 * @return Element
 */
function $(selector){
    return document.querySelector(selector);
}


/**
 * Alias of document.querySelectorAll()
 * @param String selector
 * @return NodeList
 */
function $All(selector){
    return document.querySelectorAll(selector);
}


/**
 * Assigns elements matched by selector to global variables.
 * @param Object list
 * @return void
 */
function assignGlobalObjects(list){
    for(let item of Object.keys(list))
	window[item] = $(list[item]);
}


/**
 * Adds methods to a class by code written in constructor (for ES5-way).
 * @param Function constructor
 * @param Object methods
 * @return void
 */
function assignMethods(constructor, methods){
    for(let I of Object.keys(methods))
	constructor.prototype[I] = methods[I];
}


/**
 * Sets properties of the specified html element.
 * @param HTMLElement element
 * @param String|Array|Object properties
 * @return void
 */
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


/**
 * Creates a html element with specified value of properties.
 * @param String type
 * @param String|Array|Object properties
 * @return HTMLElement
 */
function create(type, properties){
    var element = document.createElement(type);
    elementAssign(element, properties);
    return element;
}


/**
 * Creates an instance of specified template and fill it with data.
 * @param HTMLTemplateElement template
 * @param Object data
 * @return DocumentFragment
 */
function inst(template, data){
    var instance = document.importNode(template, true).content;
    if(data)
	for(let selector of Object.keys(data))
	    elementAssign(instance.querySelector(selector), data[selector]);
    return instance;
}


/**
 * Another version of inst(), returns a <div> containing the template content
 * @param HTMLTemplateElement template
 * @param Object data
 * @return HTMLDivElement
 */
function inst_div(template, data, parent){
    var html = template.innerHTML;
    var instance = create('div', {
	innerHTML: html
    });
    if(data)
	for(let selector of Object.keys(data))
	    elementAssign(instance.querySelector(selector), data[selector]);
    return instance;
}


/**
 * Sets CSS property "display" of the specified html element to none.
 * @param HTMLElement element
 * @return Boolean
 */
function hide(element){
    if(element.style.display == 'none')
	return false;
    if(element.style.display)
	element.dataset.style_display = element.style.display;
    element.style.display = 'none';
    return true;
}


/**
 * Restores the specified hidden element.
 * @param HTMLElement element
 * @return Boolean
 */
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


/**
 * Inserts "newNode" before "referenceNode".
 * @param Node newNode
 * @param Node referenceNode
 * @return void
 */
function insertBefore(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}


/**
 * Inserts "newNode" after "referenceNode".
 * @param Node newNode
 * @param Node referenceNode
 * @return void
 */
function insertAfter(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


/**
 * Iterator of siblings of "element" toward the first child of its parent.
 * @param Element element
 */
function* previousElementIterator(element){
    while(element){
	element = element.previousElementSibling;
	/* yield if previous sibling element exists */
	if(element)
	    yield element;
    }
}


/**
 * Iterator of siblings of "element" toward the last child of its parent.
 * @param Element element
 */
function* nextElementIterator(element){
    while(element){
	element = element.nextElementSibling;
	/* yield if next sibling element exists */
	if(element)
	    yield element;
    }
}


/**
 * Fetches data of the specified form to an object (key-value pairs).
 * @param HTMLFormElement form
 * @return Object
 */
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


/**
 * Fills the specified form with data of the key-value pairs.
 * @param HTMLFormElement form
 * @param Object data
 * @return void
 */
function fillForm(form, data){
    for(let I of Object.keys(data)){
	let input = form.querySelector(printf('input[name="%1"]', I));
	if(input.type == 'checkbox' || input.type == 'radio')
	    input.checked = data[I];
	else
	    input.value = data[I];
    }
}


/**
 * Disables the specified form.
 * @param HTMLFormElement form
 * @return void
 */
function disableForm(form){
    for(let I of form.querySelectorAll('input'))
	I.disabled = true;
}


/**
 * Enables the specified form.
 * @param HTMLFormElement form
 * @return void
 */
function enableForm(form){
    for(let I of form.querySelectorAll('input'))
	I.disabled = false;
}


/**
 * Returns a copy of "str" with placeholders replaced by the rest arguments.
 * @param String str
 * @param String ...args
 * @return String
 */
function printf(args){
    var string = arguments[0];
    /* note that %n in the string must be in ascending order */
    /* like 'Foo %1 Bar %2 %3' */
    var i;
    for(i=arguments.length-1; i>0; i--)
	string = string.replace('%'+i, arguments[i]);
    return string;
}


/**
 * Returns a deep copy of the specified object.
 * @param Object obj
 * @return Object
 */
(function(){

var is_active_clone = Symbol('is_active_clone');

function clone(obj){
    /* code from stackoverflow #122102, much faster than other methods
     * modified for only cloning simple objects which only contain
     * primitive, array and object inheriting Object directly
     */
    var temp;
    if(obj === null || typeof(obj) !== 'object' || is_active_clone in obj)
	return obj;

    if(Array.isArray(obj))
	temp = [];
    else
	temp = {};

    for(let key of Object.keys(obj)){
	obj[is_active_clone] = null;
	temp[key] = clone(obj[key]);
	delete obj[is_active_clone];
    }

    return temp;
}

window.clone = clone;

})();


/* Polyfill NodeList.prototype[Symbol.iterator] */
if(!NodeList.prototype[Symbol.iterator]){
    NodeList.prototype[Symbol.iterator] = function* (){
	for(let i=0; i<this.length; i++)
	    yield this[i];
    };
}
