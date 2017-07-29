import React, { Component } from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';

class Tweets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bra: 1,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tweet !== nextProps.tweet) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className="cards">
        {this.props.tweet.map(item =>
          (<Card className="cards__card" key={item.id}>
            <Card.Content>
              <a href={`https://twitter.com/${item.screen_name}`} target="_blank">
                <Image floated="right" size="mini" src={item.photo} />
              </a>
              <Card.Header>
                {item.name}
              </Card.Header>
              <Card.Meta>
                {item.screen_name}
              </Card.Meta>
              <Card.Description>
                {item.text}
              </Card.Description>
            </Card.Content>
            <Card.Content className="cards__content" extra>
              {item.date.filter(it => item.date.indexOf(it) > 0 && item.date.indexOf(it) <= 3).join(' ')}
              <div>
                <Icon name="retweet" /> {item.retweet_count}
              </div>
              <div>
                <Icon name="favorite" /> {item.favorite_count}
              </div>
            </Card.Content>
          </Card>),
        )}
      </div>
    );
  }
}

export default Tweets;
