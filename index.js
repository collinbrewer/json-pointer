var JSONPointer=require("./src/json-pointer.js");

// expose
(function(mod, name){
   (typeof(module)!=="undefined" ? (module.exports=mod) : ((typeof(define)!=="undefined" && define.amd) ? define(function(){ return mod; }) : (window[name]=mod)));
})(JSONPointer, "JSONPointer");
