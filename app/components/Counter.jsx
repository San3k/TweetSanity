import React from 'react';
import { List } from 'semantic-ui-react';

const Counter = (props) => {
  const count = props.count.map(item =>
    (<List.Item key={item[0]}>
      {item[0]}: {item[1]} times
    </List.Item>),
  );
  return (
    <List relaxed size="large">
      {count}
    </List>
  );
};

export default Counter;
