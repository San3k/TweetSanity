const express = require('express');
const cors = require('cors');
const Twitter = require('twitter');
const bodyParser = require('body-parser');
const q = require('q');
const { auth } = require('./auth');

const app = express();
app.use(express.static('static'));
app.use(cors());
app.use(bodyParser.json());

const client = new Twitter(auth);

app.get('/api/tweets', (req, res) => {
  const twitterId = req.query.id.split(',');
  const findTweets = (searchList) => {
    const promises = searchList.map((item) => {
      const params = {
        screen_name: item,
        include_rts: true,
        exclude_replies: false,
        count: 200,
      };
      return client.get('statuses/user_timeline', params);
    });
    return q.all(promises).then((data) => {
      let response;
      const tweets = [];
      const profiles = [];
      data.forEach((item) => {
        const meh = item
          .map(it => ({
            id: it.id,
            screen_name: it.user.screen_name,
            name: it.user.name,
            date: it.created_at.split(' '),
            text: it.text,
            photo: it.user.profile_image_url,
            retweet_count: it.retweet_count,
            favorite_count: it.favorite_count,
          }))
          .forEach((i) => {
            tweets.push(i);
          });
        const me = {
          id: item[0].user.id,
          name: item[0].user.name,
          screen_name: item[0].user.screen_name,
          profile_image: item[0].user.profile_image_url,
        };
        profiles.push(me);
        response = [profiles, tweets];
      });
      res.send(response);
    });
  };
  findTweets(twitterId);
});

app.listen(3000, () => {
  console.log('App started on port 3000');
});
