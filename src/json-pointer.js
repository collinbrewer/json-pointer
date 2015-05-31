/**
* jsonpointer.js
* A javascript implementation of the RFC 6901 Spec: http://tools.ietf.org/html/rfc6901
*/

(function(root){

   var isArray=Array.isArray || function(obj){
      return Object.prototype.toString.call(obj) == '[object Array]';
   };

   function PointerFactory(config)
   {
      var DELIMITER=config.delimiter || "/";

      /**
       * Encodes the special characters of a given component according
       * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
       * @param {String} component The component to encode
       * @return {String} The encoded component
       */
      function escapeReferenceToken(component)
      {
         return component.replace(/~(?![0])/g, "~0").replace(/~(?![1])/, "~1");
      }

      /**
       * Decodes the special characters of a given component according
       * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
       * @param {String} component The component to decode
       * @return {String} The decoded component
       */
      function unescapeReferenceToken(component){
         return component.replace(/~1/g, "/").replace(/~0/g, "~");
      }

      /**
       * Evaluates a single component against the given object
       * @param {String} component The pointer component to evaluate
       * @param {Mixed} doc The document to evaluate the component against
       * @return {Mixed} The value resolved by evaluating the pointer against the given document
       */
      function evaluateReferenceToken(component, doc){

         var debug=false;

         debug && console.group("evaluateReferenceToken", arguments);

         if(isArray(doc))
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
                     throw new Error("JSON Pointer '" + component + "' references nonexistent value");
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
                  throw new Error("JSON Pointer '" + component + "' references nonexistent value");
               }
            }
         }

         debug && console.groupEnd();

         return doc;
      }

      /**
       * Evaluates a list of components against the given root object
       * @param {Array} components The pointer component to evaluate
       * @param {Mixed} doc The document to evaluate the component against
       * @return {Mixed} The value resolved by evaluating the pointer against the given document
       */
      function evaluateReferenceTokens(components, doc){

         var index=0;
         var length=components.length;

         if(length!==0)
         {
            while(index<length)
            {
               doc=evaluateReferenceToken(components[index], doc);

               index++;
            }
         }

         return doc;
      }

      /**
       * Builds a function that resolves the pointer for a given object
       * @param {String} The pointer string
       * @return {Function} A function that returns the evaluation of the given *string* against a given document root
       */
      function compile(pointer, config){

         var fn;//=(JSONPointer.cache || (JSONPointer.cache={}))[string];
         var delimiter=(config ? config.delimiter : null) || DELIMITER;

         if(!fn)
         {
            // handles special case where string is just a "/"
            var referenceTokens=(pointer===delimiter ? [delimiter] : pointer.split(delimiter).map(unescapeReferenceToken));

            referenceTokens.length>0 && referenceTokens[0]==="" && referenceTokens.shift();

            // fn=(JSONPointer.cache[string]=JSONPointer.evaluateReferenceTokens.bind(null, components));
            fn=evaluateReferenceTokens.bind(null, referenceTokens);
         }

         return fn;
      }

      /**
       * Evaluates the given document against the pointer according
       * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-4
       * @param {String} pointer The pointer string
       * @param {Mixed} doc The root document to evaluate the pointer against
       * @return {Mixed} The evaluation of the given *string* against a given document root
       */
      function evaluate(representation, doc, config){
         return compile(representation, config)(doc);
      }

      /**
       * @class Pointer
       */
      function Pointer(representation)
      {
         this.representation=representation;
      }

      Pointer.evaluate=evaluate;

      Pointer.prototype.evaluate=function(doc){
         return evaluate(this.representation, doc);
      };

      Pointer.Factory=PointerFactory;

      return Pointer;
   }

   var JSONPointer=PointerFactory({delimiter:"/"});

   JSONPointer.Factory=PointerFactory;

   // expose
   (function(mod, name){
      (typeof(module)!=="undefined" ? (module.exports=mod) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return mod; }) : (window[name]=mod)));
      root[name]=mod;
   })(JSONPointer, "JSONPointer");

})(this);
