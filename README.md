# What is CrowdPulse?
> CrowdPulse is software designed to analyse MongoDB databases containing AI-processed data.

**TODO**: continue the description...

## Global requirements
To use this software, you'll need to install the following software and components:
- [Node.js](https://nodejs.org/it/download/) version **14.18.x** is recommended
- [TypeScript](https://www.typescriptlang.org/): `npm install -g typescript`
- [MongoDB](https://www.mongodb.com/try/download/community): version **5.x.x** is recommended

Now you're ready to install and use CrowdPulse by following the documentation.

## Project structure
Firstly, CrowdPulse has been completely rewritten from the ground up in TypeScript using Node.js.
<br>In this repository you'll find two subprojects:
- **Backend**: An [Express](https://expressjs.com/) implementation for managing front-end requests hosted by default on port _4000_.
- **Frontend**: A [React](https://it.reactjs.org/) implementation using [Mantine](https://mantine.dev/) as a component framework hosted by default on port _3000_.
-------------------

### Backend
**Installation and usage**
<br>From the root folder type `cd backend` and then `npm install`.
<br>Configure your `.env` file by editing the following properties:
```
SERVER_PORT=4000
DATABASE_ACCESS="mongodb://localhost:27017/"
```
**Running**: type `npm start` to start it on the preferred port.

-------------------
### Frontend
- **Installation**: from the root folder type `cd frontend` and then `npm install`.
- **Running**: type `npm start` to start it.
<br>The software is now reachable on http://localhost:3000/
- **Building**: type `npm build` and you'll find a new folder called `build`
<br>If you want to use the built-in application, you will need a web server such as [nginx](https://www.nginx.com/).

-------------------
### Forever Run
[npm forever](https://www.npmjs.com/package/forever) is an option to run the software continuously without using a [screen](https://linuxize.com/post/how-to-use-linux-screen/) or anything else.

```bash
cd frontend
sudo npm install forever -g
forever start -c "npm start" ./

cd backend
sudo npm install forever -g
forever start -c "npm start" ./
```
-------------------
### Databases
CrowdPulse supports only MongoDB databases with these collections:
- **Message**: contains all the processed and analyzed data
- **Info** (optional): that contains info about the current database.
-------------------
#### Message collection document structure
The following properties are required:
```json
{
  "raw_text": "the raw message",
  "author_name": "the author name",
  "author_username": "the author username",
  "created_at": "YYYY-MM-DDTHH:MM:SS.000Z",
  "lang": "en",
  "possibly_sensitive": false,
  "twitter_entities": {
    "hashtags": [],
    "mentions": []
  },
  "geo": {
    "user_location": "Milano, Lombardia",
    "coordinates": {
      "latitude": "the geojson world latitude coordinate",
      "longitude": "the geojson world longitude coordinate"
    }
  },
  "processed": true,
  "sentiment": {
    "sent-it": {
      "sentiment": "positive, neutral or negative"
    },
    "feel-it": {
      "sentiment": "positive, neutral or negative",
      "emotion": "joy, sadness, anger or fear"
    }
  },
  "tags": {
    "tag_me": [
      "a tag : 123456 : a tag!!! : https://wikipedia.org/tag/... "
    ]
  },
  "spacy": {
    "processed_text": [
      "hello POS : ADJ",
      "world POS : ADJ"
    ]
  }
}
```
-------------------
#### Info collection document structure (optional)
Only one document is required in the following collection:
- **version**: The current collection version
- **targetVersion**: 0 for legacy twitter database, 1+ for newer
- **releaseDate**: A release date in YYYY-MM-DD format
- **lastUpdateDate**: The latest update date in YYYY-MM-DD format
- **htmlDescription**: An HTML description
- **icon**: You only have to add "iVBORw0KGgoAAAA..." to the data of the base 64 string, e.g. "data:image/png;base64,iVBORw0KGgoAAAA..." and it should be **128x128**.
```json
{
  "version": "1.0.0",
  "targetVersion": 0,
  "releaseDate": "2023-02-02",
  "lastUpdateDate": "2023-02-05",
  "htmlDescription": "<h3>Test html description</h3>",
  "icon": "base 64 icon"
}
```