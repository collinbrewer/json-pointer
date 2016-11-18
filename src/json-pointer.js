/**
* jsonpointer.js
* A javascript implementation of the RFC 6901 Spec: http://tools.ietf.org/html/rfc6901
*/

function PointerFactory (config) {
	config || (config = {});

	var DELIMITER = config.delimiter || '/';

	/**
	 * Encodes the special characters of a given component according
	 * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
	 * @param {String} component The component to encode
	 * @return {String} The encoded component
	 */
	function escapeReferenceToken (component) { // eslint-disable-line
		return component.replace(/~(?![0])/g, '~0').replace(/~(?![1])/, '~1');
	}

	/**
	 * Decodes the special characters of a given component according
	 * to the RFC 6901 Specification: http://tools.ietf.org/html/rfc6901#section-3
	 * @param {String} component The component to decode
	 * @return {String} The decoded component
	 */
	function unescapeReferenceToken (component) {
		return component.replace(/~1/g, '/').replace(/~0/g, '~');
	}

	/**
	 * Evaluates a single component against the given object
	 * @param {String} component The pointer component to evaluate
	 * @param {Boolean} strict Error should be thrown in case of a misisng reference
	 * @param {Mixed} doc The document to evaluate the component against
	 * @return {Mixed} The value resolved by evaluating the pointer against the given document
	 */
	function evaluateReferenceToken (component, config, doc) {
		var debug = false;

		debug && console.group('evaluateReferenceToken', arguments);

		if (Array.isArray(doc)) {
			debug && console.log('isArray');

			if (component === '-') { // new or something
				console.warn("JSON Pointer component '-' is not yet supported");
			}
			else {
				var index = parseInt(component);

				debug && console.log('	index: ', index);

				if (isNaN(index)) {
					doc = config.defaultValue; // this will either be undefined or the defaultValue

					if (config.strict) {
						throw new ReferenceError("JSON Pointer '" + component + "' references nonexistent value");
					}
				}
				else {
					if (index >= 0 && index < doc.length) {
						doc = doc[index];
					}
					else {
						doc = config.defaultValue; // this will either be undefined or the defaultValue

						if (config.strict) {
							throw new ReferenceError("JSON Pointer '" + component + "' references nonexistent value");
						}
					}
				}
			}
		}
		else {
			debug && console.log('is not array');

			if (component !== '') { // special case... no key evaluates to original doc
				component === '/' && (component = '');

				if (component in doc) {
					doc = doc[component];
				}
				else {
					doc = config.defaultValue; // this will either be undefined or the defaultValue

					if (config.strict) {
						throw new ReferenceError("JSON Pointer '" + component + "' references nonexistent value");
					}
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
	function evaluateReferenceTokens (components, evaluateToken, config, doc) {
		var index = 0;
		var length = components.length;

		if (length !== 0) {
			while (doc && index < length) {
				doc = evaluateToken(components[index], config, doc);

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
	function compile (pointer, config) {
		config || (config = {strict: true});

		var fn;// =(JSONPointer.cache || (JSONPointer.cache={}))[string];
		var delimiter = (config.delimiter || DELIMITER);

		if (!fn) {
			// handles special case where string is just a DELIMITER
			var referenceTokens = (pointer === delimiter ? [delimiter] : pointer.split(delimiter).map(unescapeReferenceToken));
			var evaluateToken = config.evaluateToken || evaluateReferenceToken;

			referenceTokens.length > 0 && referenceTokens[0] === '' && referenceTokens.shift();

			// fn=(JSONPointer.cache[string]=JSONPointer.evaluateReferenceTokens.bind(null, components));
			fn = evaluateReferenceTokens.bind(null, referenceTokens, evaluateToken, config);
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
	function evaluate (representation, doc, config) {
		return compile(representation, config)(doc);
	}

	function tokenizer (representation, config) {
		config || (config = {strict: true});
		var delimiter = (config.delimiter || DELIMITER);

		var referenceTokens;

		if (representation === '') {
			referenceTokens = [];
		}
		else if (representation === delimiter) {
			referenceTokens = [delimiter];
		}
		else {
			referenceTokens = representation.substr(1).split(delimiter).map(unescapeReferenceToken);
		}

		return {
			tokenize: function () { return referenceTokens; }
		};
	}

	/**
	 * @class Pointer
	 */
	function Pointer (representation) {
		this.representation = representation;
	}

	Pointer.evaluate = evaluate;

	Pointer.prototype.evaluate = function (doc) {
		return evaluate(this.representation, doc);
	};

	Pointer.prototype.tokenizer = function () {
		return tokenizer(this.representation, this.config);
	};

	Pointer.Factory = PointerFactory;

	return Pointer;
}

var JSONPointer = PointerFactory();

JSONPointer.Factory = PointerFactory;

module.exports = JSONPointer;
