/**
 * jsonpointer.js
 * A javascript implementation of the RFC 6901 Spec: http://tools.ietf.org/html/rfc6901
 */
var JSONPointer={};

JSONPointer._isArray=Array.isArray || function(obj) {
   return Object.prototype.toString.call(obj) == '[object Array]';
};

/**
 * Encodes the special characters of a given component according
 * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
 * @param {String} component The component to encode
 * @return {String} The encoded component
 */
JSONPointer.escapeComponent=function(component){
   return component.replace(/~(?![0])/g, "~0").replace(/~(?![1])/, "~1");
};

/**
 * Decodes the special characters of a given component according
 * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
 * @param {String} component The component to decode
 * @return {String} The decoded component
 */
JSONPointer.unescapeComponent=function(component){
   return component.replace(/~1/g, "/").replace(/~0/g, "~");
};

/**
 * Evaluates a single component against the given object
 * @param {String} component The pointer component to evaluate
 * @param {Mixed} doc The document to evaluate the component against
 * @return {Mixed} The value resolved by evaluating the pointer against the given document
 */
JSONPointer.evaluateComponent=function(component, doc){

   var debug=false;

   debug && console.group("evaluateComponent", arguments);

   if(JSONPointer._isArray(doc))
   {
      debug && console.log("isArray");

      if(component==="-") // new or something
      {
         console.warn("JSON Pointer component '-' is not yet supported");
      }
      else
      {
         var index=parseInt(component);

         debug && console.log("   index: ", index);

         if(isNaN(index))
         {
            throw new Error("Invalid JSON Pointer syntax: " + component);
         }
         else
         {
            if(index>=0 && index<doc.length)
            {
               doc=doc[index];
            }
            else
            {
               throw new Error("JSON Pointer references nonexistent value");
            }
         }
      }
   }
   else
   {
      debug && console.log("is not array");

      if(component!=="") // special case... no key evaluates to original doc
      {
         component==="/" && (component="");

         if(component in doc)
         {
            doc=doc[component];
         }
         else
         {
            throw new Error("JSON Pointer references nonexistent value");
         }
      }
   }

   debug && console.groupEnd();

   return doc;
};

/**
 * Evaluates a list of components against the given root object
 * @param {Array} components The pointer component to evaluate
 * @param {Mixed} doc The document to evaluate the component against
 * @return {Mixed} The value resolved by evaluating the pointer against the given document
 */
JSONPointer.evaluateComponents=function(components, doc){

   var index=0;
   var length=components.length;

   if(length!==0)
   {
      while(index<length)
      {
         doc=JSONPointer.evaluateComponent(components[index], doc);

         index++;
      }
   }

   return doc;
};

/**
 * Builds a function that resolves the pointer for a given object
 * @param {String} The pointer string
 * @return {Function} A function that returns the evaluation of the given *string* against a given document root
 */
JSONPointer.compile=function(string){

   var fn=(JSONPointer.cache || (JSONPointer.cache={}))[string];

   if(!fn)
   {
      var components=(string==="/" ? ["/"] : string.split("/").map(JSONPointer.unescapeComponent)); // handles special case where string is just a "/"

      components.length>0 && components[0]==="" && components.shift();

      // fn=(JSONPointer.cache[string]=JSONPointer.evaluateComponents.bind(null, components));
      fn=JSONPointer.evaluateComponents.bind(null, components);
   }

   return fn;
};

/**
 * Evaluates the given document against the pointer according
 * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-4
 * @param {String} pointer The pointer string
 * @param {Mixed} doc The root document to evaluate the pointer against
 * @return {Mixed} The evaluation of the given *string* against a given document root
 */
JSONPointer.evaluate=function(pointer, doc){
   return JSONPointer.compile(pointer)(doc);
};

// Expose to AMD or window
(typeof(module)!=="undefined" ? (module.exports=JSONPointer) : (window.JSONPointer=JSONPointer));
