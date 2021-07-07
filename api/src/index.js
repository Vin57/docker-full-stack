const server = require("express");
const MongoClient = require("mongodb").MongoClient;
const MonUrl = process.env.NODE_ENV === 'production' ? `mongodb://${process.env.MONGO_APP_USER}:${process.env.MONGO_APP_PWD}@db` : `mongodb://db`
let clientDb;

MongoClient.connect(`${MonUrl}`, {useUnifiedTopology: true}, (err, client) => {
    if(err) {
        console.log(err);
    } else {
        console.log('connection db ok !');
        clientDb = client;
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

const app = serv.listen(80); 

process.addListener('SIGINT', () => {
    app.close((err) => {
        if (err) {
            process.exit(1);
        } else {
            if (clientDb) {
                clientDb.close((err) => process.exit(err ? 1 : 0));
            } else {
                process.exit(0);
            }            
        }
    });
});