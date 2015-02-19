marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: true,
  sanitize: true,
  smartLists: true,
  smartypants: true
})

var RenderedMarkdown = React.createClass({
  render: function() {
    return <section dangerouslySetInnerHTML={{__html: marked(this.props.md)}} {...this.props} />
  }
})

var CardEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    var state = {
      title: 'Card Name',
      kind: 'Condition Card',
      flavor: 'This is a card.',
      text: '* You\'re looking at a card.\n* The card is made of paper.',
      details: '# Reading\n* Your eyes move back and forth every 10s.\n* You begin to feel drowsy after 20 minutes.\n\n# Concentrating\n* Loud noises may interfere with your ability to read.\n* You become hungry at a decreased rate.\n',
    }
    return state
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (document.activeElement != this.refs.code.getDOMNode()) {
      this.updateJSON()
    }
  },

  parseJSON: function(ev) {
    var data
    try {
      data = JSON.parse(ev.target.value)
    } catch (e) {}

    if (!data) {
      return
    }

    this.setState(data)
  },

  updateJSON: function() {
    this.refs.code.getDOMNode().value = JSON.stringify(this.state)
  },

  render: function() {
    var card = (
      <div className="card preview">
        <div className="top">
          <h1>{this.state.title}</h1>
          <h2>{this.state.kind}</h2>
        </div>
        <div className="main">
          <p className="flavor">{this.state.flavor}</p>
          <RenderedMarkdown className="text" md={this.state.text} />
          <RenderedMarkdown className="details" md={this.state.details} />
        </div>
      </div>
    )

    return (
      <div>
        <div className="editor">
          <h1>Super Cool Card Creator</h1>

          <div className="display">
            <div className="preview">
              {card}
            </div>

            <div className="form">
              <input type="text" placeholder="title" valueLink={this.linkState('title')} />
              <input type="text" placeholder="kind" valueLink={this.linkState('kind')} />
              <input type="text" placeholder="flavor text" valueLink={this.linkState('flavor')} />
              <textarea placeholder="card text markdown." valueLink={this.linkState('text')} />
              <textarea placeholder="card details text markdown." valueLink={this.linkState('details')} />
            </div>
          </div>

          <button id="print-button" onClick={window.print}>Print a sheet of this card</button>

          <textarea ref="code" id="code" defaultValue={JSON.stringify(this.state)} onChange={this.parseJSON} onBlur={this.updateJSON} />
        </div>

        <div className="page">
          {_.times(12, _.constant(card))}
        </div>
      </div>
    )
  },
})

React.render(<CardEditor />, document.getElementById('container'))
