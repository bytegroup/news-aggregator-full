## News Aggregator - (demo version)
 
- set news preferences
- See daily news feeds based on preferences
- Search news instantly from different sources

## Page Descriptions

- **Settings:** 
  - Sources: Currently 3 sources are workable - NewsAPI.org, The Guardian, New York Times
  - Search Key: keyword in news
  - Tags: Author(ex. Pal Callings, Adams) or news publishers (ex: new york times, BBC news) etc. Only one tags are allowed in demo version
- **News Feeds:** See daily news feed based on Settings you saved
- **Search:** You can search news based on source and keyword instantly.

## Installation

```bash
$ git clone git@github.com:bytegroup/news-aggregator-full.git
$ cd news-aggregator-full
$ docker-compose up -d
```

## Running the app

- Open url http://localhost:3000 in browser
- Click on Register (top right corner) for signup
- After signing up, login to the application. 
- Click on Settings page. 
- Set your news preferences here first. 
- Your news feed will be generated once in time daily (current cron time is 1 AM. it is configurable in backend code. ).

## Test News feeds instantly

- You can trigger news feeds instantly for testing purpose by accessing API /news/feeds-trigger. 
- In this demo version this API is publicly accessible (to keep testing smoothly). 
- Open swagger url http://localhost:4001/api-docs#/news/NewsController_triggerNewsFeed 
- Trigger /news/feeds-trigger api
