import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

const Labels = props =>
  (<div>
    {props.info.length === 0
      ? null
      : props.info.map(item =>
        (<Label image key={item.id} size="large">
          <img src={item.profile_image} alt="profile_image" />
            @{item.screen_name}
          <Icon name="delete" onClick={() => props.filterLabel(item.screen_name)} />
        </Label>),
        )}
  </div>);

export default Labels;
