
(function (window, undefined) {

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
    this.$subject = new Observer(ob);
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

      _self.checkObjectDepth(key, ob[key]);
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

  Attached.prototype.checkObjectDepth = function(property, value) {
    console.log('Value without data treated', property);
    var _keys = property.split(/\./g);
    var _self = this;
    // var _ob = {};
    // _ob[_keys[0]] = {};
    // _ob[_keys[0]][_keys[1]] = value;

    console.log('Array', _self);
    console.log('Final value', _keys);
    // return _ob;

    function _getTheRightNestedProperty (context, array) {
      var finalToReturn = null;

      for (var property in array) {
        // context.$subject
      }
    }
  };

  /**
   * Init all applicatiom
   * @param  {Object} options
   */
  window.Attached = Attached;
})(window)
