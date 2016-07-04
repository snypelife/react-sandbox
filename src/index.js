import { createElement } from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass as findWithClass,
  findRenderedDOMComponentWithTag as findWithTag,
  scryRenderedDOMComponentsWithClass as scryWithClass,
  scryRenderedDOMComponentsWithTag as scryWithTag,
  findAllInRenderedTree as findAll,
  isDOMComponent,
  Simulate as SyntheticEvents
} from 'react-addons-test-utils';
import { sandbox, useFakeTimers as clock } from 'sinon';
import { inspect } from 'util';

// handy custom debug logging
console.inspect = function () {
  console.log(...Array.prototype.slice.call(arguments).map((arg) => {
    return inspect(arg, false, 10, true);
  }));
};

class ReactSandbox {
  constructor(ReactClass) {
    this.spies = {};
    this.sinonSandbox = sandbox.create();

    // this little bit of magic right here spies on all of
    // the React components methods and exposes them through a
    // spies hash off of the ReactSandbox instance.
    // Methods still function as expected, it just makes it possible
    // now to be able to assert that the methods have been called
    // and with args, etc.

    // React v15
    if (ReactClass.prototype.__reactAutoBindPairs) {
      ReactClass.prototype.__reactAutoBindPairs.forEach((prop, i) => {
        if (typeof prop === 'function') {
          this.spies[prop.name] = ReactClass.prototype.__reactAutoBindPairs[i] = this.sinonSandbox.spy(ReactClass.prototype.__reactAutoBindPairs[i]);
        }
      });
    } else if (ReactClass.prototype.__reactAutoBindMap) { // React < v15
      Object.keys(ReactClass.prototype.__reactAutoBindMap)
      .filter((key) => {
        return typeof ReactClass.prototype.__reactAutoBindMap[key] === 'function';
      })
      .forEach((key) => {
        this.spies[key] = ReactClass.prototype.__reactAutoBindMap[key] = this.sinonSandbox.spy(ReactClass.prototype.__reactAutoBindMap[key]);
      });
    }

    this.class = ReactClass;

    Object.keys(SyntheticEvents).forEach((key) => {
      this[key] = SyntheticEvents[key];
    });
  }

  render(props) {
    return this.component = renderIntoDocument(createElement(this.class, props));
  }

  update(props) {
    return this.component = render(
      createElement(this.class, props),
      findDOMNode(this.component).parentNode
    );
  }

  findWithClass(klass) {
    return findWithClass(this.component, klass);
  }

  findWithTag(tag) {
    return findWithTag(this.component, tag);
  }

  findWithId(id) {
    return findAll(this.component, (node) => {
      return isDOMComponent(node) && node.id === id;
    })[0];
  }

  scryWithClass(klass) {
    return scryWithClass(this.component, klass);
  }

  scryWithTag(tag) {
    return scryWithTag(this.component, tag);
  }

  scryWithId(id) {
    return findAll(this.component, (node) => {
      return isDOMComponent(node) && node.id === id;
    });
  }

  spy(func) {
    return this.sinonSandbox.spy(func);
  }

  stub(obj, funcName, spy) {
    return this.sinonSandbox.stub(obj, funcName, spy);
  }

  mock(obj) {
    return this.sinonSandbox.mock(obj);
  }

  get element() {
    return findDOMNode(this.component);
  }

  clock() {
    this.sinonClock = clock();
  }

  tick(time) {
    if (!this.sinonClock) {
      return;
    }
    this.sinonClock.tick(time);
  }

  restore() {
    this.sinonSandbox.restore();
    if (this.sinonClock) {
      this.sinonClock.restore();
    }
    Object.keys(this.spies).forEach((key) => this.spies[key].reset());
    unmountComponentAtNode(findDOMNode(this.component).parentNode);
  }

}

export default ReactSandbox;
