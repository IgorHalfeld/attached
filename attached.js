
(function (window, undefined) {

  'use strict';

  var Observer = function() {
    this.subs = {};
  };

  /**
   * Notify a key calling your handler
   * @param  {String} key
   */
  Observer.prototype.notify = function(key) {
    if (!this.subs[key]) return;

    for (var item in this.subs[key]) {
      this.subs[key][item].handler();
    }
  }

  /**
   * Register a callback to a key
   * @param  {String} key
   * @param  {Function} handler
   */
  Observer.prototype.register = function(key, handler) {
    if (!this.subs[key]) this.subs[key] = []
    this.subs[key].push(handler);
  };

  function Attached(ob) {
    this.$subject = new Observer();
    this.initEngine(ob);
    this.parserViewToModel(ob);
    this.ob = ob;
  }

  /**
   * Check each property of object
   * @param  {Object} ob
   */
  Attached.prototype.initEngine = function(ob) {
    for (var key in ob) {
      if (ob.hasOwnProperty(key)) {
        this.makeReactive(ob, key);
      }
    }
  };

  /**
   * Make the object reactive to changes
   * @param  {Object} ob
   * @param  {Object} key
   */
  Attached.prototype.makeReactive = function(ob, key) {
    var _value = ob[key];
    var _self = this;

    Object.defineProperty(ob, key, {
      get: function() {
        return _value;
      },
      set: function(newValue) {
        _value = newValue;

        _self.$subject.notify(key);
      }
    });
    this.parserModelToView(ob);
  };

  /**
   * Parser all data from model to view
   * @param  {Object} ob
   */
  Attached.prototype.parserModelToView = function(ob) {
    var _nodes = document.querySelectorAll('[att-bind]');
    var _self = this;

    _nodes.forEach(function(node) {
      var key = node.attributes['att-bind'].value;

      node.textContent = ob[key];

      _self.$subject.register(key, function() {
        node.textContent = ob[key];
      });
    });
  };

  /**
   * Parser all data from view to model
   * @param  {Object} ob
   */
  Attached.prototype.parserViewToModel = function(ob) {
    var _nodes = document.querySelectorAll('[att-model]');
    var _self = this;

    _nodes.forEach(function(node) {
      var _key = node.attributes['att-model'].value;

      node.addEventListener('input', function(evt) {
        var _value = evt.target.value;
        _self.ob[_key] = _value;
      });
    });
  };

  /**
   * Init all applicatiom
   * @param  {Object} options
   */
  window.Attached = Attached;
})(window)
