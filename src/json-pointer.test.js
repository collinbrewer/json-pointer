var chai = require('chai');
var expect = chai.expect;
var JSONPointer = require('../src/json-pointer.js');

// tests built from examples provided at: http://tools.ietf.org/html/rfc6901
var doc = {
	'foo': ['bar', 'baz'],
	'': 0,
	'a/b': 1,
	'c%d': 2,
	'e^f': 3,
	'g|h': 4,
	'i\\j': 5,
	'k"l': 6,
	' ': 7,
	'm~n': 8,
	'asdf': {'qwer': 'poiu'}
};

describe('JSONPointer', function () {
	context('#tokenize', function () {
		it('should return an empty array', function () {
			expect(new JSONPointer('').tokenizer().tokenize()).to.have.length(0);
		});

		it('should return a three tokens', function () {
			expect(new JSONPointer('/path/to/value').tokenizer().tokenize()).to.have.length(3);
		});
	});

	context('evaluate', function () {
		it('returns the root document', function () {
			expect(JSONPointer.evaluate('', doc)).to.equal(doc);			  // ""			  // the whole document
		});

		it('returns the value at /foo', function () {
			expect(JSONPointer.evaluate('/foo', doc)).to.equal(doc.foo);	// "/foo"		 ["bar", "baz"]
		});

		it('returns the value at /foo/0', function () {
			expect(JSONPointer.evaluate('/foo/0', doc)).to.equal('bar'); //  "/foo/0"	  "bar"
		});

		it('returns the value at /', function () {
			expect(JSONPointer.evaluate('/', doc)).to.equal(0);					//  "/"			 0
		});

		it('returns the value at /a~1b', function () {
			expect(JSONPointer.evaluate('/a~1b', doc)).to.equal(1);		 //  "/a~1b"		1
		});

		it('returns the value at /c%d', function () {
			expect(JSONPointer.evaluate('/c%d', doc)).to.equal(2);			//  "/c%d"		 2
		});

		it('returns the /e^f', function () {
			expect(JSONPointer.evaluate('/e^f', doc)).to.equal(3);			//  "/e^f"		 3
		});

		it('returns the /g|h', function () {
			expect(JSONPointer.evaluate('/g|h', doc)).to.equal(4);			//  "/g|h"		 4
		});

		it('returns the /i\\j', function () {
			expect(JSONPointer.evaluate('/i\\j', doc)).to.equal(5);		 //  "/i\\j"		5
		});

		it('returns the value at /k"l ', function () {
			expect(JSONPointer.evaluate('/k"l', doc)).to.equal(6);		 //  "/k\"l"		6
		});

		it('returns the value at / ', function () {
			expect(JSONPointer.evaluate('/ ', doc)).to.equal(7);				 //  "/ "			7
		});

		it('returns the value at /m~0n', function () {
			expect(JSONPointer.evaluate('/m~0n', doc)).to.equal(8);		 //  "/m~0n"		8
		});

		it('returns a value referenced by a pointer in dot notation', function () {
			expect(JSONPointer.evaluate('asdf.qwer', doc, {delimiter: '.'})).to.equal('poiu');
		});

		it('should throw a reference error', function () {
			var fn = JSONPointer.evaluate.bind(null, 'asdf.qwer', {});

			expect(fn).to.throw(ReferenceError);
		});

		it('should throw a reference error', function () {
			var fn = JSONPointer.evaluate.bind(null, 'asdf.qwer', []);

			expect(fn).to.throw(ReferenceError);
		});

		it('should not throw a reference error (non-strict)', function () {
			expect(JSONPointer.evaluate.bind(null, 'asdf.qwer', {}, {strict: false})).to.not.throw(ReferenceError);
		});

		it('should throw a reference error (non-strict)', function () {
			expect(JSONPointer.evaluate.bind(null, 'asdf.qwer', [], {strict: false})).to.not.throw(ReferenceError);
		});

		it('should provide a default value', function () {
			expect(JSONPointer.evaluate('asdf.qwer', {}, {strict: false, defaultValue: 'foo'})).to.equal('foo');
		});
	});

	context('#constructor', function () {
		it('should return a pointer', function () {
			var pointer = new JSONPointer('/path.to.something');

			expect(pointer).to.exist;
		});
	});

	context('Configs', function () {
		var doc = {};

		it('should use a custom evaluator', function () {
			var evaluateToken = function () { return 'hello'; };

			expect(JSONPointer.evaluate('it+does/not^matter', doc, {evaluateToken: evaluateToken})).to.equal('hello');
		});
	});

	context('#Factory', function () {
		var DotPointer;

		beforeEach(function () {
			DotPointer = JSONPointer.Factory({'delimiter': '.', strict: true});
		});

		it('returns the root', function () {
			expect(DotPointer.evaluate('', doc)).to.equal(doc);
		});

		it('returns the value of asdf.qwer', function () {
			expect(DotPointer.evaluate('asdf.qwer', doc)).to.equal('poiu');
		});
	});
});
