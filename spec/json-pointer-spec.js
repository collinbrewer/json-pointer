var should=require("chai").should();
var JSONPointer=require("../index.js");

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

describe("JSONPointer", function(){

   context("#evaluate", function(){

      it("returns the root document", function(){
         JSONPointer.evaluate("", doc).should.equal(doc);           // ""           // the whole document
      });

      it("returns the value at /foo", function(){
         JSONPointer.evaluate("/foo", doc).should.equal(doc.foo);   // "/foo"       ["bar", "baz"]
      });

      it("returns the value at /foo/0", function(){
         JSONPointer.evaluate("/foo/0", doc).should.equal("bar"); //  "/foo/0"     "bar"
      });

      it("returns the value at /", function(){
         JSONPointer.evaluate("/", doc).should.equal(0);               //  "/"          0
      });

      it("returns the value at /a~1b", function(){
         JSONPointer.evaluate("/a~1b", doc).should.equal(1);       //  "/a~1b"      1
      });

      it("returns the value at /c%d", function(){
         JSONPointer.evaluate("/c%d", doc).should.equal(2);         //  "/c%d"       2
      });

      it("returns the /e^f", function(){
         JSONPointer.evaluate("/e^f", doc).should.equal(3);         //  "/e^f"       3
      });

      it("returns the /g|h", function(){
         JSONPointer.evaluate("/g|h", doc).should.equal(4);         //  "/g|h"       4
      });

      it("returns the /i\\j", function(){
         JSONPointer.evaluate("/i\\j", doc).should.equal(5);       //  "/i\\j"      5
      });

      it("returns the value at /k\"l ", function(){
         JSONPointer.evaluate("/k\"l", doc).should.equal(6);       //  "/k\"l"      6
      });

      it("returns the value at / ", function(){
         JSONPointer.evaluate("/ ", doc).should.equal(7);             //  "/ "         7
      });

      it("returns the value at /m~0n", function(){
         JSONPointer.evaluate("/m~0n", doc).should.equal(8);       //  "/m~0n"      8
      });

      it("returns a value referenced by a pointer in dot notation", function(){
         JSONPointer.evaluate("asdf.qwer", doc, {delimiter:"."}).should.equal("poiu");
      });
   });

   context("#Factory", function(){

      var DotPointer;

      beforeEach(function(){
         DotPointer=JSONPointer.Factory({"delimiter":"."});
      });

      it("returns the root", function(){
         DotPointer.evaluate("", doc).should.equal(doc);
      });

      it("returns the value of asdf.qwer", function(){
         DotPointer.evaluate("asdf.qwer", doc).should.equal("poiu");
      });
   });
});
