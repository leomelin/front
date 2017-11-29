const applyEvents = (target, Component) => {
  for (child of target.children) {
    for (attr of child.attributes) {
      if (attr.name === 'onclick' || attr.name === 'onkeyup') {
        const re = /[^,()]+/g;
        const matches = [];
        while (match = re.exec(attr.value)) {
          matches.push(match[0]);
        }

        if (matches.length) {
          let args = [...matches.splice(1)];
          const eventObjectIndex = args.findIndex(arg => arg === '$event');
          child[attr.name] = (event) => {
            if (eventObjectIndex !== -1) {
              args[eventObjectIndex] = event;
            }
            Component.prototype[matches[0]].apply(Component.prototype, args);
          };
        }
      }
    }
    applyEvents(child, Component);
  }
};

function Front() {
  this._root = null;
  this._rootComponent = null;
  this._state = null;
  this._renderer = null;
};

Front.render = function (target, Component, state) {
  if (!this._root || !this._rootComponent || !this._state || !this._renderer) {

    this._root = target;
    this._rootComponent = Component;
    this._state = state;
    this._renderer = window.morphdom;
  }
  if (!this._root.childNodes.length) {
    const div = document.createElement('div');
    this._root.appendChild(div);
  }
  this._renderer(this._root.childNodes[0], (new Component(state[Component.name])).render().trim(), {
    onNodeAdded: () => {
      applyEvents(this._root, Component);
    },
  });
};

Front.Component = class {
  constructor(props) {
    this.props = props;
  }

  setState(patch) {
    Front.setState(this.constructor.name, patch);
  }
};

Front.setState = function (namespace, patch) {
  this._state[namespace] = {
    ...this._state[namespace],
    ...patch
  };
  this.render(this._root, this._rootComponent, this._state);
};
