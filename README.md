# JSONPointer
A javascript implementation of the RFC 6901 Spec: http://tools.ietf.org/html/rfc6901

There are many fine implementations of the spec but JSONPointer offers additional functionality.

## Basic Usage
```javascript
var doc={
   "foo" : {
      "bar" : "value"
   }
};

var pointer=new JSONPointer("/foo/bar");

pointer.evaluate(doc); // returns "value"
```

## Extensibility
JSONPointer can be extended to support various needs.

```javascript
var pointer=new JSONPointer("foo.bar", {delimiter:"."});

pointer.evaluate(doc); // returns "value"
```

### Class Factory
JSONPointer also offers a class factory for creating custom pointer types.

```javascript
var DotPointer=JSONPointer.Factory({delimiter:"."});

var pointer=new DotPointer("foo.bar");

pointer.evaluate(doc); // returns "value"
```
