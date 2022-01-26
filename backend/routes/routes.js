const express = require('express')
var mongoose = require('mongoose')
const router = express.Router()

const AnalyzedTweetTemplate = new mongoose.Schema({
    raw_text:{
        type:String
    },
    author_id:{
        type:String
    },
    author_name:{
        type:String
    },
    author_username:{
        type:String
    },
    created_at:{
        type:String
    },
    possibly_sensitive:{
        type:Boolean
    },
    complete_text:{
        type:Boolean
    },
    twitter_context_annotations:{
        type:Array
    },
    referenced_tweets:{
        type:Array
    },
    twitter_entities:{
        type:Object
    },
    metrics:{
        type:Object
    },
    processed:{
        type:Boolean
    },
    sentiment:{
        type:Object
    },
    tags:{
        type:Object
    },
    spacy:{
        type:Object
    },
})



router.get('/getAnalyzedData', (req, res) => {

    let db = req.query.db;

    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find({  })
        .then((data) => {
            
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/getTags', (req, res) => {

    let db = req.query.db;
    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find().distinct('tags')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/getHashtags', (req, res) => {

    let db = req.query.db;

    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find().distinct('twitter_entities')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});


router.get('/getText', (req, res) => {

    let db = req.query.db;

    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find().distinct('spacy')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});



router.get('/getDataSortByDate', (req, res) => {

    let db = req.query.db;

    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find().sort('created_at')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});


router.get('/getDataTimelines', (req, res) => {
    let db = req.query.db;
    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.aggregate(
        [
          {
            $group: {
              _id: { $dateToString: { format: "%y-%m-$d", date: ISODATE("$created_at") } },
            }
          }
        ],
    
        function(err, result) {
          if (err) {
            console.log(err)
            res.send(err);
          } else {
            console.log(result)
            res.json(result);
          }
        }
      );
   
});

router.get('/getAnalyzedSentiment', (req, res) => {
    let db = req.query.db;
    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find({  })
        .then((data) => {
            negative = 0
            positive = 0
            neutral = 0
            i=0
            while(i<data.length){
                if (data[i].sentiment['sent-it'].sentiment=='negative')
                    negative++
                else if (data[i].sentiment['sent-it'].sentiment=='positive')
                    positive ++
                else
                    neutral ++

                i++
            }

            var sentCounter = {
                positive: positive,
                negative: negative,
                neutral: neutral,
             }

            
            res.json(sentCounter);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.get('/getAnalyzedSentimentDates', (req, res) => {
    let db = req.query.db;
    var Test = mongoose.model(db, AnalyzedTweetTemplate);
    Test.find({  })
        .then((data) => {
            negative = 0
            positive = 0
            neutral = 0
            i=0
            while(i<data.length){
                if (data[i].sentiment['sent-it'].sentiment=='negative')
                    negative++
                else if (data[i].sentiment['sent-it'].sentiment=='positive')
                    positive ++
                else
                    neutral ++

                i++
            }

            var sentCounter = {
                positive: positive,
                negative: negative,
                neutral: neutral,
             }

            console.log('sent: ', sentCounter);
            res.json(sentCounter);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

module.exports = router