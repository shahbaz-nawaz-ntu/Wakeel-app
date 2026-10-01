const mongoose = require('mongoose');

mongoose.connect('mongodb://jurisflow:jurisflow1234@ac-6qryidx-shard-00-00.4dr1jmr.mongodb.net:27017,ac-6qryidx-shard-00-01.4dr1jmr.mongodb.net:27017,ac-6qryidx-shard-00-02.4dr1jmr.mongodb.net:27017/jurisflow?ssl=true&replicaSet=atlas-g9wzt2-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => { 
  const db = mongoose.connection.db; 
  
  const clientSchema = new mongoose.Schema({
    clientId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' },
    company: { type: String, default: '' },
    type: { 
      type: String, 
      enum: ['Individual', 'Company', 'Law Firm', 'Government', 'Other'],
      default: 'Individual' 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'archived'],
      default: 'active' 
    },
    notes: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { collection: 'clients' });
  
  const Client = mongoose.model('Client', clientSchema);

  // Generate client ID - find the highest existing client ID
  const lastClient = await Client.findOne({})
    .sort({ clientId: -1 })
    .select('clientId');
  
  let nextNumber = 1;
  if (lastClient && lastClient.clientId) {
    const match = lastClient.clientId.match(/CLI-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }
  
  const clientId = `CLI-${String(nextNumber).padStart(4, '0')}`;
  console.log("Generated Client ID:", clientId);
  
  const clientData = {
    clientId: clientId,
    name: 'Test Client',
    userId: new mongoose.Types.ObjectId('6a747e12a97a26696771c895')
  };
  
  const newClient = new Client(clientData);
  try {
    const savedClient = await newClient.save();
    console.log("Successfully saved client:", savedClient.clientId);
    // clean up
    await Client.deleteOne({ _id: savedClient._id });
  } catch(e) {
    console.error("Error saving client:", e);
  }
  
  process.exit(0); 
}).catch(console.error);
