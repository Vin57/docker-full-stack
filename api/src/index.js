const server = require("express");
const MongoClient = require("mongodb").MongoClient;
const MonUrl = process.env.NODE_ENV === 'production' ? `mongodb://${process.env.MONGO_APP_USER}:${process.env.MONGO_APP_PWD}@db` : `mongodb://db`

MongoClient.connect(`${MonUrl}`, {useUnifiedTopology: true}, (err, client) => {
    if(err) {
        console.log(err);
    } else {
        console.log('connection db ok !');
        count = client.db('test').collection("count");
    }
});

const serv = server(); 

serv.get('/api/count', (req, res) => {
        count.findOneAndUpdate({}, {$inc: {count: 1}}, {returnNewDocument: true }).then((doc) => {
            const count = doc.value;
            res.json(count.count).status(200).end();
        });
    }
)



serv.listen(80); 