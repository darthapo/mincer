/**
 *  class Template
 *
 *  Template provides a base class for engines and processors. Think of it as of
 *  Ruby's `Tilt::Template` class, that provides unified interface for template
 *  renderers.
 *
 *
 *  ##### Example
 *
 *      // Create subclass
 *      function MyProcessor() { Template.apply(this, arguments); }
 *      require('util').inherits(MyProcessor, Template);
 *
 *      // Define evaluate method
 *      MyProcessor.prototype.evaluate = function (context, locals) {
 *        var data = this.data.toLowerCase();
 *        return data;
 *      };
 **/


'use strict';


// internal
var prop = require('./common').prop;


////////////////////////////////////////////////////////////////////////////////


/**
 *  new Template(file[, reader])
 *  - file (String)
 *  - data (String)
 *
 *  Creates new instance of template and fills it with some base properties.
 **/
var Template = module.exports = function Template(file, data) {
  /** internal
   *  Template#data -> String
   *
   *  A source string to be compiled.
   *
   *  ##### See Also
   *
   *  - [[Template#evaluate]]
   **/
  prop(this, 'data', data, {writable: true});
  prop(this, 'file', file);
};


/**
 *  Template#evaluate(context, locals) -> data
 *  - context (Context)
 *  - locals (Object)
 *
 *  Real renderer function.
 *
 *  You _MUST_ redefine this method in your template. By default this method is
 *  throws an Error that it's not implemented.
 *
 *
 *  ##### Example
 *
 *      MyProcessor.prototype.evaluate = function (context, locals) {
 *        var data = this.data.replace(this.secret, '***TOP-SECRET***');
 *        return data;
 *      };
 **/
Template.prototype.evaluate = function (/*context, locals*/) {
  throw new Error((this.constructor.name || '') +
                  '#evaluate() is not implemented.');
};


/**
 *  Template.libs -> Object
 *
 *  Third-party libs.
 *
 *  ##### Example
 *
 *      Mincer.Template.libs["ejs"] = require("ejs");
 **/
Template.libs = {};


/**
 *  Template#require(name) -> Mixed
 *  - name (String)
 *
 *  Wrapper over native `require()` method, that produces beautified errors.
 *
 *  Used for engines and processors which depends on 3rd-party modules (e.g.
 *  [[StylusEngine]] needs `stylus` module). Once such engine initialized
 *  (if associated file is being processed) and required module not found this
 *  will rethrow Error with some clarification why error happened.
 **/
Template.prototype.require = function (name) {
  try {
    return require(name);
  } catch (err) {
    throw new Error("Cannot find module `" + name +
                    "` required for file '" + this.file + "'");
  }
};
