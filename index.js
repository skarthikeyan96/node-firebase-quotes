const functions = require('firebase-functions')
const admin = require('firebase-admin')
const app = require('express')()

// Dot env config
require('dotenv').config()

var serviceAccount = require(`../${process.env.SERVICE_NAME}`)

/**
 * Initialising the app with service account and db url
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
})

/**
 * Calling the firestore
 */

const db = admin.firestore()

/**
 * API call to create quote
 */

app.post('/create', (req, res) => {
  (async () => {
    try {
      await db.collection('quotes').doc('/' + req.body.id + '/')
        .create({ author: req.body.author, quote: req.body.quote })
      console.log('Record created')
      return res.status(200).send()
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

/**
 * Read Call
 */

app.get('/show', (req, res) => {
  (
    async () => {
      try {
        const query = db.collection('quotes')
        const response = []
        await query.get().then(querySnapshot => {
          const docs = querySnapshot.docs
          for (const doc of docs) {
            const quotes = {
              id: doc.id,
              author: doc.data().author,
              quote: doc.data().quote
            }
            response.push(quotes)
          }
        })
        return res.status(200).send(response)
      } catch (error) {
        console.log(error)
        return res.status(500).send(error)
      }
    }
  )()
})

exports.app = functions.https.onRequest(app)
