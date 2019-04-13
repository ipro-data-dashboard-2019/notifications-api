# IPRO Redcross - Notificaitons API
This notificaitons API aggregates and consolidates notification streams used by the Red Cross in their fire relief services.

The following streams are used and exposed via the API:
  - radioman
  - gmail
  - text
  - twitter

# How to Use
The API exposes these notifications as endpoints that a POST request can be sent to. These take the format `{url}/{stream}/{mode}/{number}`. For example, `http://localhost/radioman/last/5` will return the last 5 notifications from the Radioman stream. 
NOTE: All endpoints are exposed through POST requests. GET requests will be issued a 404.

## Modes
| Mode | Description | Example |
| ---- | ----------- | ------- |
| /{stream}/ (none) | Returns all notifications for the given stream that are currently stored.  | `POST http://localhost/twitter/` |
| /{stream}/last/x | Returns the most recent X notifications for a given stream. Useful when appication is starting and does not need to download all existing notificaitons. | `POST http://localhost/twitter/last/10` |
| /{stream}/since/x | Returns all notifications with an _id > x. These are notifications that are newer than a notification with the _id = x. | `POST http://localhost/twitter/since/75` |

## Streams
Since each notification type is so different, they return payloads with different fields, which are described below. 

### Radioman
The Radioman notification stream polls the Radioman911.com website and logs the most recent incidents reported. Poll time: 1 minute.
Example request: `POST http://localhost/radioman/last/1` with response:
```
[
  {
    "_id": 246,
    "rid": 1343,
    "notes_url": "http://www.radioman911.com/pages/CAD/details1.php?inci_num=2019-1343",
    "date": "04-13",
    "time": "12:55:01",
    "city": "Chicago",
    "address": "6000 S Western Ave",
    "level": "Police",
    "calltype": "2 People Shot",
    "agency": "Chicago",
    "dispatcher": "HICSTE",
    "created_at": "2019-04-13T18:41:59.738Z",
    "updatedAt": "2019-04-13T18:41:59.738Z",
    "__v": 0
  }
]
```

| Field | Description | 
| ----- | ----------- | 
| _id | The ID of the notification relative to other notifications of the same type. Use this ID in the `/since/x` mode. Note: ID is not at all related to the IDs of other streams, there will be notifications in other streams with an ID of 5.|
| rid | The ID of the original incident report assigned by Radioman. Used for checking if the incident is already logged in the database. |
| notes_url | The URL of the full notes added to the incident report. Requires a Radioman login to access. |
| date | The date (without the year) that the incident was reported. |
| time | The time that the incident was reported at |
| city | The city where the incident took place. |
| address | The address where the incident took place. |
| level | A more general description of the incident. |
| calltype | The full description of the incident that took place |
| agency | The agency attached to the incident (I don't really know what this means.) |
| dispatcher | The username of the user who submited the incident. |
| created_at | The timestamp of when the notification was saved into the API database. This can be used to order notificaitons of different types. |
| updatedAt | Time timestamp of when the notification was last updated (should always be the same as created_at) |
| __v | Used for internal versioning, ignore. |


### Twitter
The Twitter notification stream aggregates the most recent tweets from a set of specific Chicago Twitter accounts. Poll time: 1 minute. The uses the [twitter-fire-scraper](https://github.com/raaraa/IPRO497-Analytics-Team/tree/master/coding/twitter-fire-scraper) python library and the associated web-api. 
Example request: `POST http://localhost/twitter/last/1` with response:
```
[
  {
    "_id": 96,
    "tid": "1117127558317969411",
    "user_name": "Nifgalerts",
    "user_handle": "NIFGALERTS",
    "text": "Chicago | Gunshot + | 6000 s Western. 2 people shot",
    "favorite_count": 0,
    "retweet_count": 0,
    "created_at": "2019-04-13T18:41:59.738Z",
    "updatedAt": "2019-04-13T18:41:59.738Z",
    "__v": 0
  }
]
```

| Field | Description | 
| ----- | ----------- | 
| _id | The ID of the notification relative to other notifications of the same type. Use this ID in the `/since/x` mode. Note: ID is not at all related to the IDs of other streams, there will be notifications in other streams with an ID of 5.|
| tid | The ID of the original Tweet, assigned by twitter. Used for checking if the Tweet is already stored in the database. |
| user_name | The display name of the user who sent the tweet.
| user\_handle | The handle of the user who sent the tweet. @user_handle is the normal twitter username. |
| text | The body of the tweet, which may contain links. Original content, not sanitized. (TODO: field is truncated by the API ... fix this) |
| favorite_count | The number of favorites the Tweet has. |
| retweet_count | The number of retweet the Tweet has. |
| created_at | The timestamp of when the notification was saved into the API database. This can be used to order notificaitons of different types. |
| updatedAt | Time timestamp of when the notification was last updated (should always be the same as created_at) |
| __v | Used for internal versioning, ignore. |

### Text
The Text notification stream uses the Twilio API to listen for texts to a specific phone number. When a text is received it is saved in real time. 
Example request: `POST http://localhost/text/last/1` with response:

```
[
  {
    "_id": 7,
    "mid": "SM765cc6897a66722e786e0021881e90b4",
    "from": "+12025550117",
    "body": "This is a test notifications for the texting stream",
    "created_at": "2019-04-13T18:41:59.738Z",
    "updatedAt": "2019-04-13T18:41:59.738Z",
    "__v": 0
  }
]
```

| Field | Description | 
| ----- | ----------- | 
| _id | The ID of the notification relative to other notifications of the same type. Use this ID in the `/since/x` mode. Note: ID is not at all related to the IDs of other streams, there will be notifications in other streams with an ID of 5.|
| mid | The ID assigned to the text from Twilio. Used to check for redundency. |
| from | The phone number that sent the text. |
| body | The full content of the text. | 
| created_at | The timestamp of when the notification was saved into the API database. This can be used to order notificaitons of different types. |
| updatedAt | Time timestamp of when the notification was last updated (should always be the same as created_at) |
| __v | Used for internal versioning, ignore. |


### Gmail
The Gmail notification stream uses the Gmail API to pull emails from a specified email address. Poll time: 1 minutes. 
Example request: `POST http://localhost/gmail/last/1` with response:

```
[
  {
    "_id": 9,
    "mid": "16a17d818b4d41b7",
    "snippet": "This is a new test on Saturday",
    "body": "This is a new test on Saturday\r\n\n\n\n",
    "subject": "Test notif",
    "from": "James McGee <james.mcgee@gmail.com>",
    "created_at": "2019-04-13T17:56:41.443Z",
    "updatedAt": "2019-04-13T17:56:41.443Z",
    "__v": 0
  }
]
```

| Field | Description | 
| ----- | ----------- | 
| _id | The ID of the notification relative to other notifications of the same type. Use this ID in the `/since/x` mode. Note: ID is not at all related to the IDs of other streams, there will be notifications in other streams with an ID of 5.|
| mid | The ID of the email assigned by Gmail. Used to check for redundancy. |
| snippet | A plaintext preview of the message. When a message is long, this shows the first part of it. When a message is short they are the same. |
| body | The plaintext content of the email. NOTE: This parsing is extremely limited and is currently only suited to do emails send in plaintext, without HTML. |
| subject | The subject line of the email |
| from | The email address that sent the email | 
| created_at | The timestamp of when the notification was saved into the API database. This can be used to order notificaitons of different types. |
| updatedAt | Time timestamp of when the notification was last updated (should always be the same as created_at) |
| __v | Used for internal versioning, ignore. |
