const express = require('express')
var mongoose = require('mongoose')
const router = express.Router()
Admin = mongoose.mongo.Admin;

//Require and config credentials
const dotenv = require('dotenv');
dotenv.config();

//Disable auto-pluralize Moongose
mongoose.pluralize(null);

var mongodb;

//Create User connection
var conn = mongoose.createConnection(process.env.DATABASE_ACCES ,function(err, db) {
  if(err) {
    console.log(err)
  } else {
    console.log("connected to Database");
  }
});


//Create admin Connection
var url = process.env.DATABASE_ACCES + 'admin';
var adminConn = mongoose.createConnection(url, () => console.log("DB admin connesso")); //connect to mongodb using .env


/*
Data Schema
*/

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
},
{synchronize: false})

/*
Route: '/tweet/collection'
Description: Extract all collections from a pre-selected Db
*/
router.get('/collections', (req, res) => {


  mongodb.db.listCollections().toArray(function (err, names) {

        module.exports.Collection = names;
        res.json(names);        

    });

    

    
});

/*
Route: '/tweet/setDbs'
Description: Set var mongodb 
*/
router.get('/setDbs', (req, res) => {
    
  let db = req.query.mongodb;
  //TODO fix bug switch db
  mongodb = conn.useDb(db);
  

  res.json(true);
 
 });

 /*
Route: '/tweet/dbs'
Description: Get all dbs 
*/

router.get('/dbs', (req, res) => {
 
    // connection established
    new Admin(adminConn.db).listDatabases(function(err, result) {
    
      // database list stored in result.databases
      res.json(result);
    });  

  
  
});

 /*
Route: '/tweet/getAnalyzedData'
Description: Get all Data 
*/

router.get('/getAnalyzedData', (req, res) => {

    let db = req.query.db;
    
    var Test = mongodb.model(db, AnalyzedTweetTemplate);
    
    
    Test.find({  },{ timeout: false }).lean()
        .then((data) => {            
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });

});

 /*
Route: '/tweet/getTags'
Description: Get all Tags 
*/

router.get('/getTags', (req, res) => {
  

    let db = req.query.db;
    var Test =   mongodb.model(db, AnalyzedTweetTemplate);
   
    Test.aggregate(
        [
          {$unwind : "$tags"},
          {
            $group: {
              _id: "$tags",
            }
          }
        ],
    
        function(err, data) {
          if (err) {
            console.log(err)
            res.send(err);
          } else {
            //console.log(data)
            res.json(data);
          }
        },
        
      ).allowDiskUse(true);
      /*
    Test.find().lean().distinct('tags')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
        */
});

 /*
Route: '/tweet/getHashtags'
Description: Get all Hashtags 
*/

router.get('/getHashtags', (req, res) => {

    let db = req.query.db;
    

    var Test =  mongodb.model(db, AnalyzedTweetTemplate);
    Test.aggregate(
        [
          {
            $group: {
              _id: "$twitter_entities",
            }
          }
        ],
    
        function(err, data) {
          if (err) {
            console.log(err)
            res.send(err);
          } else {
            //console.log(data)
            res.json(data);
          }
        },
       
      ).allowDiskUse(true);
      /*
    Test.find().lean().distinct('twitter_entities')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
        */
});

 /*
Route: '/tweet/getUsers'
Description: Get all Users 
*/
router.get('/getUsers', (req, res) => {

    let db = req.query.db;

   
    var Test =  mongodb.model(db, AnalyzedTweetTemplate);

    Test.aggregate(
        [
          {
            $group: {
              _id: "$author_name",
            }
          }
        ],
    
        function(err, data) {
          if (err) {
            console.log(err)
            res.send(err);
          } else {
            //console.log(data)
            res.json(data);
          }
        },
       
      ).allowDiskUse(true);
      /*

    Test.find().lean().distinct('spacy')
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
        */
});

 /*
Route: '/tweet/getText'
Description: Get all Text 
*/
router.get('/getText', (req, res) => {

  let db = req.query.db;

 
  var Test =  mongodb.model(db, AnalyzedTweetTemplate);

  Test.aggregate(
      [
        {
          $group: {
            _id: "$spacy",
          }
        }
      ],
  
      function(err, data) {
        if (err) {
          console.log(err)
          res.send(err);
        } else {
          //console.log(data)
          res.json(data);
        }
      },
     
    ).allowDiskUse(true);
    /*

  Test.find().lean().distinct('spacy')
      .then((data) => {
          res.json(data);
      })
      .catch((error) => {
          console.log('error: ', error);
      });
      */
});


 /*
Route: '/tweet/getDataSortByDate'
Description: Get all Data sorted by Date 
*/

router.get('/getDataSortByDate', (req, res) => {

    let db = req.query.db;

    var Test =   mongodb.model(db, AnalyzedTweetTemplate);
    Test.find().lean().sort('created_at').allowDiskUse(true)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

 /*
Route: '/tweet/getDataTimelines'
Description: Get all Data group by Date 
*/

router.get('/getDataTimelines', (req, res) => {
    let db = req.query.db;
    var Test =  mongodb.model(db, AnalyzedTweetTemplate);
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
            //console.log(result)
            res.json(result);
          }
        }
        
      ).allowDiskUse(true);
   
});

 /*
Route: '/tweet/getAnalyzedSentiment'
Description: Get all Sentiment info 
*/
router.get('/getAnalyzedSentiment', (req, res) => {
    
    let db = req.query.db;
    var Test =   mongodb.model(db, AnalyzedTweetTemplate);
    Test.find({  },{ timeout: false }).lean()
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

 /*
Route: '/tweet/getAnalyzedSentimentDates'
Description: Get all Sentiment info group by Date
*/
router.get('/getAnalyzedSentimentDates', (req, res) => {
    let db = req.query.db;
    var Test =   mongodb.model(db, AnalyzedTweetTemplate);
    Test.find({  },{ timeout: false }).lean()
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

            //console.log('sent: ', sentCounter);
            res.json(sentCounter);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

module.exports = router