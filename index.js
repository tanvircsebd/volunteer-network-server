const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
//middleware
app.use(bodyParser.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://volunteerdbuser:S8oDhQ0YMONjfx6x@cluster0.kilwo.mongodb.net/volunteerdb?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kilwo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db(process.env.DB_NAME).collection("volunteerDonation");
  app.post('/addDonations', (req, res) => {
    const donation = req.body;
    volunteerCollection.insertOne(donation)
      .then(result => {
        res.send(true);
      })
  })

  app.get('/allDonations', (req, res) => {
    const bearer = req.headers.authorization;
    if( bearer && bearer.startsWith('Bearer ')){
      const idToken = bearer.split(' ')[1];
      console.log({idToken});
      admin.auth().verifyIdToken(idToken)
      .then(function (decodedToken) {
        let tokenEmail = decodedToken.email;
        if(tokenEmail == req.query.email){
          volunteerCollection.find({ email: req.query.email })
          .toArray((err, documents) => {
            res.send(documents);
          })
        }
      }).catch(function (error) {

      });
    }
  })

  app.delete('/donationDelete/:id', (req, res) => {
    volunteerCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
  })
});



app.get('/', (req, res) => {
  res.send('it is OK now')
})

app.listen(process.env.PORT || port)