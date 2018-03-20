
(function (window, undefined) {

  var Observer = function() {
    this.subs = {}
  }

  /**
   * Notify a key calling your handler
   * @param  {String} key
   */
  Observer.prototype.notify = function(key) {
    if (!this.subs[key]) return
    this.subs[key].forEach(function(handler) {
      handler()
    })
  }

  /**
   * Register a callback to a key
   * @param  {String} key
   * @param  {Function} handler
   */
  Observer.prototype.register = function(key, handler) {
    if (!this.subs[key]) this.subs[key] = []
    this.subs[key].push(handler)
  }

  function Attached(ob) {
    this.$subject = new Observer()
    this.ob = ob
    this.makeReactive()
    this.parserViewToModel()
  }

  /**
   * Make the object reactive to changes
   */
  Attached.prototype.makeReactive = function() {
    var _self = this

    const handler = {
      get(target, propertyKey) {
        return target[propertyKey]
      },

      set(target, propertyKey, newValue) {
        target[propertyKey] = newValue

        _self.$subject.notify(propertyKey)
      }
    }

    this.ob = new Proxy(this.ob, handler)
    this.parserModelToView()
  }

  /**
   * Parser all data from model to view
   */
  Attached.prototype.parserModelToView = function() {
    var _nodes = document.querySelectorAll('[att-bind]')
    var _self = this

    _nodes.forEach(function(node) {
      var key = node.attributes['att-bind'].value

      node.textContent = _self.ob[key]

      _self.$subject.register(key, function() {
        node.textContent = _self.ob[key]
      })
    })
  }

  /**
   * Parser all data from view to model
   */
  Attached.prototype.parserViewToModel = function() {
    var _nodes = document.querySelectorAll('[att-model]')
    var _self = this

    _nodes.forEach(function(node) {
      var _key = node.attributes['att-model'].value

      node.addEventListener('input', function(evt) {
        var _value = evt.target.value
        _self.ob[_key] = _value
      })
    })
  }

  /**
   * Init all applicatiom
   * @param  {Object} options
   */
  window.Attached = Attached
})(window)