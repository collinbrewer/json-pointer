("group" in console) || (console.group=(console.groupEnd=console.log));

var MochiComparators={
   "==" : "equal to",
   "===" : "exactly equal to",
   "!=" : "not equal to",
   "!==" : "exactly not equal to",
   ">" : "greater than",
   ">=" : "greater than or equal",
   "<" : "less than",
   "<=" : "less than or equal ",
   "in" : "in"
};

function mochi(title, a, comparator, b)
{
   /* jshint evil:true */
   if(arguments.length===1)
   {
      it(title);
   }
   else
   {
      if(typeof(a)==="function")
      {
         it(title + ": function return should " + MochiComparators[comparator] + " " + b, function(){ a=a(); eval("if(!(a " + comparator + " b)) throw new Error(a + ' is not ' + MochiComparators[comparator] + ' ' + b);"); });
      }
      else
      {
         it(title + ": " + a + " should be " + MochiComparators[comparator] + " " + b, function(){ eval("if(!(a " + comparator + " b)) throw new Error(a + ' is not ' + MochiComparators[comparator] + ' ' + b);"); });
      }
   }
}

var JSONPointer=require("../jsonpointer.js");

describe("JSON Pointer", function(){

   // tests built from examples provided at: http://tools.ietf.org/html/rfc6901
   var doc={
      "foo": ["bar", "baz"],
      "": 0,
      "a/b": 1,
      "c%d": 2,
      "e^f": 3,
      "g|h": 4,
      "i\\j": 5,
      "k\"l": 6,
      " ": 7,
      "m~n": 8,
      "asdf": {"qwer":"poiu"}
   };

   describe("#evaluate", function(){

      // mochi("''", JSONPointer.evaluate("''", doc), "===", doc);           // ""           // the whole document
      // mochi("/foo", JSONPointer.evaluate("/foo", doc), "===", doc.foo);   // "/foo"       ["bar", "baz"]
      // mochi("/foo/0", JSONPointer.evaluate("/foo/0", doc), "===", "bar"); //  "/foo/0"     "bar"
      // mochi("/", JSONPointer.evaluate("/", doc), "===", 0);               //  "/"          0
      // mochi("/a~1b", JSONPointer.evaluate("/a~1b", doc), "===", 1);       //  "/a~1b"      1
      // mochi("/c%d", JSONPointer.evaluate("/c%d", doc), "===", 2);         //  "/c%d"       2
      // mochi("/e^f", JSONPointer.evaluate("/e^f", doc), "===", 3);         //  "/e^f"       3
      // mochi("/g|h", JSONPointer.evaluate("/g|h", doc), "===", 4);         //  "/g|h"       4
      // mochi("/i\\j", JSONPointer.evaluate("/i\\j", doc), "===", 5);       //  "/i\\j"      5
      // mochi("/k\"l", JSONPointer.evaluate("/k\"l", doc), "===", 6);       //  "/k\"l"      6
      // mochi("/ ", JSONPointer.evaluate("/ ", doc), "===", 7);             //  "/ "         7
      // mochi("/m~0n", JSONPointer.evaluate("/m~0n", doc), "===", 8);       //  "/m~0n"      8

      mochi("''", JSONPointer.evaluate.bind(null, "", doc), "===", doc);           // ""           // the whole document
      mochi("/foo", JSONPointer.evaluate.bind(null, "/foo", doc), "===", doc.foo);   // "/foo"       ["bar", "baz"]
      mochi("/foo/0", JSONPointer.evaluate.bind(null, "/foo/0", doc), "===", "bar"); //  "/foo/0"     "bar"
      mochi("/", JSONPointer.evaluate.bind(null, "/", doc), "===", 0);               //  "/"          0
      mochi("/a~1b", JSONPointer.evaluate.bind(null, "/a~1b", doc), "===", 1);       //  "/a~1b"      1
      mochi("/c%d", JSONPointer.evaluate.bind(null, "/c%d", doc), "===", 2);         //  "/c%d"       2
      mochi("/e^f", JSONPointer.evaluate.bind(null, "/e^f", doc), "===", 3);         //  "/e^f"       3
      mochi("/g|h", JSONPointer.evaluate.bind(null, "/g|h", doc), "===", 4);         //  "/g|h"       4
      mochi("/i\\j", JSONPointer.evaluate.bind(null, "/i\\j", doc), "===", 5);       //  "/i\\j"      5
      mochi("/k\"l", JSONPointer.evaluate.bind(null, "/k\"l", doc), "===", 6);       //  "/k\"l"      6
      mochi("/ ", JSONPointer.evaluate.bind(null, "/ ", doc), "===", 7);             //  "/ "         7
      mochi("/m~0n", JSONPointer.evaluate.bind(null, "/m~0n", doc), "===", 8);       //  "/m~0n"      8
      mochi("/asdf/qwer", JSONPointer.evaluate.bind(null, "/asdf/qwer", doc), "===", "poiu");  //  "/asdf/qwer" "poiu"
   });

});

// window.mochaPhantomJS ? mochaPhantomJS.run() : mocha.run();
