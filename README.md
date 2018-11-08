# Incredbot

Editable Content Management System based on Vue & own library for Facebook Messenger with awesome functions pre-coded!

## Installation

This process will be simplified in future.

#### Use CLI to initialize project
```
npm i -g maxtomczyk/incredbot-cli
cd my_projects
incredbot init <project_name>
```
#### Pre-configuration

1.  Fill in `config/config.js` file in your project directory.
2.  Execute database init script by running `incredbot database setup`

#### Starting development

To run main server of your bot run `incredbot dev bot` in your project directory. You will see some logs in command line. There will be your verify token for connecting facebook webhook. Webhook endpoint is `/webhook` If you need to develop new CMS functions run `incredbot dev cms` in another console.

## Few words about this docs
I'm aware that docs you are reading now is not perfect and that you may not found some important informations. If you want to start your project with incredbot-cms, but you aren't sure about some features, or you already stared feel free to contact me at m.tomczyk.dev@gmail.com

## Files in project

As you can see, in your project directory were created some incredbot files. Let's take a look at them.

### index.js

This file is an entrypoint of your bot. The incoming events are catched with events, like

```javascript
bot.on('text', async (message, user, raw) => {
  try {
    await cms.utils.handleText(message)
  } catch (e) {
    console.error(e)
  }
})
```

Each event provides value of message and raw request data. Some of events also provides user data.
A `message` parameter is message parameter from [incredbot](https://www.google.com "Incredbot Messenger Library") project from my repositories. Check it's docs to get more informations!

Events that can be catched:

| Event    | When                                                    | Parameters         |
| -------- | ------------------------------------------------------- | ------------------ |
| entry    | Emmited on each entry in received object                | entry              |
| message  | Any message received                                    | message, raw       |
| text     | Text message received (media messages in early version) | message, user, raw |
| payload  | Any payload received (button or quick reply)            | message, user, raw |
| echo     | On any message sent by bot                              | message, user, raw |
| location | Location received                                       | message, user, raw |
| image    | Image received                                          | message, user, raw |
| comment  | Someone commented a post on connected fanpage           | comment, raw       |

** Attention! ** Comment event works only with live facebook applications and feed webhook activated.

#### Message object

First parameter passed to event function is custom object created by incredbot server, if you need raw data from facebook it's passed as second parameter.

#### Message object properties

-   sender_id
-   timestamp
-   payload (if message contain any payload)
-   reply (Incredbot sender object with setted user_id to use it without user_id parameter)
-   location (if location event)
-   url (if media sended)

#### Sending message

```javascript
cms.incredbot.send.METHOD()
// OR
message.reply.METHOD()
```

Each method last parameter is option parameter, which is object. In this object you can pass `recipient_id` and `messaging_type`. (Options object will be propably changed soon)

It's recommended to use sender with Incredbot helpers which allows you to create messeges in a clean way.

All examples below are presented as replying to message

#### Methods

##### `text(message, options)`

Sends text to client

```javascript
await message.reply.text('Your message')
```

##### `quick_replies(message, replies, options)`

Sends quick replies to client.

```javascript
let qrs = [
  new bot.Helpers.QuickReply('text', 'Yes', 'ANSWER_YES')
  new bot.Helpers.QuickReply('text', 'No', 'ANSWER_NO')
]
await message.reply.quick_replies('Your message', qrs)
```

##### `buttons(text, buttons, options)`

Sends buttons template to user

```javascript
let buttons = [
  new bot.Helpers.Button('postback', 'Some postback', 'POSTBACK')
  new bot.Helpers.Button('web_url', 'Some link', 'http://example.com')
]
await message.reply.buttons('Your message', buttons)
```

##### `attachment(type, url, options)`

Sends attachment to user

```javascript
await message.reply.attachment('image', 'https://example.com/assets/image.png')
```

##### `generic(elements, options)`

Sends generic template to user.

```javascript
let buttons = [
    new bot.Helpers.Button('postback', 'Button no.1', 'PAYLOAD'),
    new bot.Helpers.Button('web_url', 'Button no.2', 'https://example.com/')
  ]

let card1 = {
  title: 'Card One',
  subtitle: 'Subtitle no. 1',
  image_url: 'https://example.com/images/1.png',
  buttons: buttons
}

let cards = [
  new bot.Helpers.Generic(card1),
  new bot.Helpers.Generic('Card Two', 'Subtitle no.2', 'https://example.com/images/2.png', buttons)

]
await message.reply.generic(cards)
```

### postbacks.js

This file is a suggested way of handling postbacks in your bot. There is no rocket science!

## Usage

Usage is as simple as `const cms = require('incredbot-cms')`

#### cms.bot.on()
You can use it to listen to events listed above.

#### cms.server
An Express instance which you can use if you need it.

#### cms.utils.handleText(message)
Function shich should be invoked at the end of your text message handler flow, it responds for text interactions in CMS system and collecting misunderstooded phrases, if enabled. `message` parameter must be message parameter from event listener.

#### cms.utils.handlePostback(message)
Same case as handleText but for postbacks. If you want your bot to respect any settings of postbacks from CMS panel you have to use it at the end of postback handler.

#### cms.knex()
Knex instantion, in case you need to get something from database. It uses database defined in `config.js`

#### cms.redis
Redis instantion with an async functions, so you can use it with async/await if you need to cache something of your data. You can set a prefix (recommended) for redis in `config.js` file.

#### cms.logger
Winston instance for logging in incredbot-cms style. Provides following functions:
* silly()
* debug()
* verbose()
* info()
* warn()
* error()

#### cms.incredbot
[Incredbot](https://www.google.com "Incredbot Messenger Library") library. You can use it to replaying to messages, creating messages with helpers and much more!

#### cms.User()
You can fetch user data with user id

`incredbot.User(this.data.messenger_id).getData(...fields)`

```javascript
let data = awiat incredbot.User(this.data.messenger_id).getData('first_name', 'last_name', 'id')
```

Remember that for some fields like gender you need special permissions from facebook, unless your request will fail with status code 400!

## CMS Panel
You can access your bot's CMS panel on `localhost:<port>`.

```
Login: owner
Password: password
```

## CMS Panel development
To start development server with Hot Reload for CMS Panel just run `incredbot dev cms`.

### Creating own view
Run command in your project directory

`incredbot create view <name>`

Then you will have to create a route in `cms/vue_router.js`. You can also create a link in a drawer in file `cms/App.vue`. Your views will be saved in `/cms/views/<name>.vue`

### Creating own component
Run command in your project directory

`incredbot create component <name>`

Then you need to register component in `cms/main.js`.  Your views will be saved in `/cms/components/<name>.vue`

### Creating own API route for cms
You can create your route in `cms/api_routes.js` in the same way as using express.

** One important thing here ** - every route you create in this file are available at localhost:<port>**/custom_api**/<route\>

##### Example

```javascript
router.get('/test', auth.authenticate(), async (req, res) => {
  logger.debug('Received request on "/custom/test!"')
  api.test(req, res)
})
```

Above example will create a route:
* available at localhost:<port>/custom_api/test
* protected against accessing it without JWT token (unlogged to CMS)
* executing method test() from object api

To keep your files clean and readable store routes in file `cms/api_routes.js` and methods in the other one - `cms/api.js`

## Development targets
- [ ] Code less flow edit
- [ ] Create more settings
- [ ] Connection with some NLP provider
- [ ] Improve message creator
- [ ] Implement statistics on dashboard

## Issues
If you found an issue (probably there is a lot) post it in issues, or send me an email. It's important to reproduce an issue on clean project (just after init). Don't forget to put as many useful informations (like incredbot version, operating system) as you can.

## Contributing
If you want to help with incredbot-cms development feel free. Just contact me at m.tomczyk.dev@gmail.com

## Support
Incredbot CMS is my side project and the only dev working on it is me, but it's under active development so I can use it in my job. Right now the best way to support me is to suggest what should be changed/added to this project or just to contribute and directly help me with development.
