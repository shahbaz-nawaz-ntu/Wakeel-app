const mongoose = require('mongoose');
mongoose.connect('mongodb://jurisflow:jurisflow1234@ac-6qryidx-shard-00-00.4dr1jmr.mongodb.net:27017,ac-6qryidx-shard-00-01.4dr1jmr.mongodb.net:27017,ac-6qryidx-shard-00-02.4dr1jmr.mongodb.net:27017/jurisflow?ssl=true&replicaSet=atlas-g9wzt2-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => { 
  const db = mongoose.connection.db; 
  const missing = await db.collection('clients').find({ clientId: { $exists: false } }).toArray(); 
  const nulls = await db.collection('clients').find({ clientId: null }).toArray(); 
  const empty = await db.collection('clients').find({ clientId: '' }).toArray(); 
  console.log({ missing: missing.length, nulls: nulls.length, empty: empty.length }); 
  
  // Also, let's see what the route logic actually finds as lastClient:
  const lastClient = await db.collection('clients').find({}).sort({ clientId: -1 }).limit(1).toArray();
  console.log("Last client returned by sort:", lastClient);
  
  process.exit(0); 
}).catch(console.error);
