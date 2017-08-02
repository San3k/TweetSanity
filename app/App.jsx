import React, { Component } from 'react';
import { Button, Input, Checkbox } from 'semantic-ui-react';
import Tweets from './components/Tweets';
import Counter from './components/Counter';
import Labels from './components/Labels';
import Loading from './components/Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      tweets: [],
      newTweets: [],
      counter: [],
      rts: true,
      rpl: true,
      info: [],
      show: true,
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleCount = this.handleCount.bind(this);
    this.filterLabel = this.filterLabel.bind(this);
    this.handleRT = this.handleRT.bind(this);
    this.handleRPL = this.handleRPL.bind(this);
    this.handleTweets = this.handleTweets.bind(this);
  }

  componentDidMount() {
    this.textInput.focus();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ counter: [] });
    this.setState({ loading: !this.state.loading });
    let name = this.state.nickname;
    if (name === '' || name === ' ') {
      name = this.state.info.map(item => item.screen_name);
    } else {
      name = this.state.nickname.split(' ').join(',');
    }
    fetch(`http://localhost:3000/api/tweets?id=${name}`).then(res => res.json()).then((res) => {
      if (name.length === 2 && name[1] === ' ') {
        this.setState({ info: [...this.state.info, ...res[0]] });
      } else {
        this.setState({ info: [...this.state.info, ...res[0]] });
      }
      this.setState({ tweets: [...this.state.tweets, ...res[1]].sort((a, b) => b.id - a.id) });
      this.setState({ loading: !this.state.loading });
    });
    this.setState({ nickname: '' });
  }

  handleInput(e) {
    this.setState({ nickname: e.target.value });
  }

  handleCount(e) {
    e.preventDefault();
    const trap = this.state.tweets
      .map(item => item.text.replace(/([\,\!\$\.\*\+\?])/g, '').split(' '))
      .reduce((a, b) => a.concat(b))
      .filter(item => item.length >= 4 && item.charAt(0) !== '@')
      .reduce((r, k) => {
        r[k] = 1 + r[k] || 1;
        return r;
      }, {});
    const keysSorted = Object.entries(trap).sort((a, b) => b[1] - a[1]);
    keysSorted.length = 10;
    this.setState({ counter: keysSorted });
  }

  filterLabel(info) {
    const newInfo = this.state.info.filter(item => info !== item.screen_name);
    const newTweets = this.state.tweets.filter(item => info !== item.screen_name);
    this.setState({ info: newInfo });
    this.setState({ tweets: newTweets });
    this.setState({ counter: [] });
  }

  handleTweets() {
    if (this.state.rts === false && this.state.rpl === false) {
      this.setState({
        newTweets: [
          ...this.state.tweets.filter(item => item.text.substring(0, 2) !== 'RT' || item.text.charAt(0) !== '@'),
        ],
      });
    } else if (this.state.rts === false && this.state.rpl === true) {
      this.setState({
        newTweets: [...this.state.tweets.filter(item => item.text.substring(0, 2) !== 'RT')],
      });
    } else if (this.state.rts === true && this.state.rpl === false) {
      this.setState({
        newTweets: [...this.state.tweets.filter(item => item.text.charAt(0) !== '@')],
      });
    }
  }

  handleRT() {
    this.setState({ rts: !this.state.rts });
    this.handleTweets();
  }

  handleRPL() {
    this.setState({ rpl: !this.state.rpl });
    this.handleTweets();
  }
  render() {
    return (
      <div className="forms">
        <div className="forms__controls">
          <form onSubmit={this.handleSubmit}>
            <Input
              label="@"
              placeholder="Put nickname here"
              className="forms__input"
              type="text"
              onChange={this.handleInput}
              value={this.state.nickname}
              ref={(input) => {
                this.textInput = input;
              }}
            />
            <Button basic color="green" type="submit">
              Add!
            </Button>
          </form>
          <Checkbox
            toggle
            label={this.state.rts ? 'Exclude retweets' : 'Include retweets'}
            checked={this.state.rts}
            onChange={() => this.handleRT()}
          />
          <Checkbox
            toggle
            label={this.state.rpl ? 'Exclude replies' : 'Include replies'}
            checked={this.state.rpl}
            onChange={() => this.handleRPL()}
          />
          <div>
            <Button basic color="red" onClick={this.handleCount}>
              Count!
            </Button>
            {this.state.tweets.length > 0
              ? <Button basic color="blue" onClick={() => this.setState({ show: !this.state.show })}>
                {this.state.show ? 'Hide tweets!' : 'Show tweets!'}
              </Button>
              : null}
          </div>
          <Labels info={this.state.info} filterLabel={this.filterLabel} />
          {this.state.loading ? <Loading /> : null}
          <Counter count={this.state.counter} />
          {this.state.show
            ? <Tweets tweet={this.state.rts && this.state.rpl ? this.state.tweets : this.state.newTweets} />
            : null}
        </div>
      </div>
    );
  }
}

export default App;
