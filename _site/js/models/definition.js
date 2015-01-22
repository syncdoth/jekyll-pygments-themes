(function(global) {
  'use strict';

  /**
   * Create a new theme instance
   *
   * @param {String} name         The name of the theme
   * @param {Object} definitions  The color and style definitions
   */
  function Definition(attrs) {
    if (!(this instanceof Definition)) {
      throw new Error('Definition must be created with `new`');
    }
    attrs = attrs || {};

    for (var a in Definition.attributes) {
      if (Definition.converters[Definition.attributes[a]]) {
        this[a] = Definition.converters[Definition.attributes[a]](attrs[a]);
      } else {
        this[a] = attrs[a];
      }
    }
  }

  Definition.attributes = {
    name: 'string',
    selector: 'string',
    colors: 'object',
    styles: 'object'
  };

  Definition.converters = {};

  Definition.serializers = {
    object: function(object) {
      var serialized = {};
      Object.keys(object).forEach(function(key) {
        if (object[key]) {
          serialized[key] = object[key];
        }
      });

      return serialized;
    }
  };

  /**
   * Get a serialized representation of this object, ready for storing.
   *
   * @return {Object}
   */
  Definition.prototype.serialize = function() {
    var serialized = {},
      type;

    for (var a in Definition.attributes) {
      type = Definition.attributes[a];

      if (Definition.serializers[type]) {
        serialized[a] = Definition.serializers[type](this.attr(a));
      } else {
        serialized[a] = this.attr(a);
      }
    }
    return serialized;
  };

  Definition.prototype.attr = function(name, value) {
    if (!Definition.attributes[name]) {
      throw new Error('Definition has no property `' + name + '`');
    }

    if (typeof value !== 'undefined') {
      this[name] = value;
      return this;
    }

    return this[name];
  };

  global.Definition = Definition;
})(window);
