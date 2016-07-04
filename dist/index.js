'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactDom = require('react-dom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _sinon = require('sinon');

var _util = require('util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// handy custom debug logging
console.inspect = function () {
  var _console;

  (_console = console).log.apply(_console, _toConsumableArray(Array.prototype.slice.call(arguments).map(function (arg) {
    return (0, _util.inspect)(arg, false, 10, true);
  })));
};

var ReactSandbox = function () {
  function ReactSandbox(ReactClass) {
    var _this = this;

    _classCallCheck(this, ReactSandbox);

    this.spies = {};
    this.sinonSandbox = _sinon.sandbox.create();

    // this little bit of magic right here spies on all of
    // the React components methods and exposes them through a
    // spies hash off of the ReactSandbox instance.
    // Methods still function as expected, it just makes it possible
    // now to be able to assert that the methods have been called
    // and with args, etc.

    // React v15
    if (ReactClass.prototype.__reactAutoBindPairs) {
      ReactClass.prototype.__reactAutoBindPairs.forEach(function (prop, i) {
        if (typeof prop === 'function') {
          _this.spies[prop.name] = ReactClass.prototype.__reactAutoBindPairs[i] = _this.sinonSandbox.spy(ReactClass.prototype.__reactAutoBindPairs[i]);
        }
      });
    } else if (ReactClass.prototype.__reactAutoBindMap) {
      // React < v15
      Object.keys(ReactClass.prototype.__reactAutoBindMap).filter(function (key) {
        return typeof ReactClass.prototype.__reactAutoBindMap[key] === 'function';
      }).forEach(function (key) {
        _this.spies[key] = ReactClass.prototype.__reactAutoBindMap[key] = _this.sinonSandbox.spy(ReactClass.prototype.__reactAutoBindMap[key]);
      });
    }

    this.class = ReactClass;

    Object.keys(_reactAddonsTestUtils.Simulate).forEach(function (key) {
      _this[key] = _reactAddonsTestUtils.Simulate[key];
    });
  }

  _createClass(ReactSandbox, [{
    key: 'render',
    value: function render(props) {
      return this.component = (0, _reactAddonsTestUtils.renderIntoDocument)((0, _react.createElement)(this.class, props));
    }
  }, {
    key: 'update',
    value: function update(props) {
      return this.component = (0, _reactDom.render)((0, _react.createElement)(this.class, props), (0, _reactDom.findDOMNode)(this.component).parentNode);
    }
  }, {
    key: 'findWithClass',
    value: function findWithClass(klass) {
      return (0, _reactAddonsTestUtils.findRenderedDOMComponentWithClass)(this.component, klass);
    }
  }, {
    key: 'findWithTag',
    value: function findWithTag(tag) {
      return (0, _reactAddonsTestUtils.findRenderedDOMComponentWithTag)(this.component, tag);
    }
  }, {
    key: 'findWithId',
    value: function findWithId(id) {
      return (0, _reactAddonsTestUtils.findAllInRenderedTree)(this.component, function (node) {
        return (0, _reactAddonsTestUtils.isDOMComponent)(node) && node.id === id;
      })[0];
    }
  }, {
    key: 'scryWithClass',
    value: function scryWithClass(klass) {
      return (0, _reactAddonsTestUtils.scryRenderedDOMComponentsWithClass)(this.component, klass);
    }
  }, {
    key: 'scryWithTag',
    value: function scryWithTag(tag) {
      return (0, _reactAddonsTestUtils.scryRenderedDOMComponentsWithTag)(this.component, tag);
    }
  }, {
    key: 'scryWithId',
    value: function scryWithId(id) {
      return (0, _reactAddonsTestUtils.findAllInRenderedTree)(this.component, function (node) {
        return (0, _reactAddonsTestUtils.isDOMComponent)(node) && node.id === id;
      });
    }
  }, {
    key: 'spy',
    value: function spy(func) {
      return this.sinonSandbox.spy(func);
    }
  }, {
    key: 'stub',
    value: function stub(obj, funcName, spy) {
      return this.sinonSandbox.stub(obj, funcName, spy);
    }
  }, {
    key: 'mock',
    value: function mock(obj) {
      return this.sinonSandbox.mock(obj);
    }
  }, {
    key: 'clock',
    value: function clock() {
      this.sinonClock = (0, _sinon.useFakeTimers)();
    }
  }, {
    key: 'tick',
    value: function tick(time) {
      if (!this.sinonClock) {
        return;
      }
      this.sinonClock.tick(time);
    }
  }, {
    key: 'restore',
    value: function restore() {
      var _this2 = this;

      this.sinonSandbox.restore();
      if (this.sinonClock) {
        this.sinonClock.restore();
      }
      Object.keys(this.spies).forEach(function (key) {
        return _this2.spies[key].reset();
      });
      (0, _reactDom.unmountComponentAtNode)((0, _reactDom.findDOMNode)(this.component).parentNode);
    }
  }, {
    key: 'element',
    get: function get() {
      return (0, _reactDom.findDOMNode)(this.component);
    }
  }]);

  return ReactSandbox;
}();

exports.default = ReactSandbox;