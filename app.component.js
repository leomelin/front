class AppComponent extends Front.Component {
  constructor(props) {
    super(props);
  }

  handleClick(ev) {
    this.setState({ name: 'Pena' });
  }

  handleInput(ev) {
    this.setState({ name: ev.target.value });
    setTimeout(() => {
      ev.target.focus();
    }, 1);
  }

  render() {
    return `
      <div>
        <h1>Hello, ${this.props.name}!</h1>
        <p>This is a demo app</p>
        <input value="${this.props.name}" onkeyup="handleInput($event)" />
        <button onclick="handleClick($event)">Test button</button>
      </div>
    `;
  }
};
