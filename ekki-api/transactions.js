module.exports = function(app) {

  app.get('/transactions/fav', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const transactions = await app.database.collection('transactions').find(
      {$or: [{sender: me._id}, {receiver: me._id}]},
      {slice: -2}
    ).sort({timestamp: -1}).toArray();

    let senderIds = transactions.map(transaction => transaction.sender);
    let receiverIds = transactions.map(transaction => transaction.receiver);

    let senders = await app.database.collection('users').find({_id: { $in: senderIds} }).toArray();
    let receivers = await app.database.collection('users').find({_id: { $in: receiverIds} }).toArray();
    
    for(let i = 0; i < transactions.length; i++) { 
      const sender = senders.find(user => user._id == transactions[i].sender);
      const receiver = receivers.find(user => user._id == transactions[i].receiver);
      transactions[i].sender = sender;
      transactions[i].receiver = receiver
    }
    
    response.json(transactions);
  });

  app.get('/transactions', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const transactions = await app.database.collection('transactions').find({
      $or: [{sender: me._id}, {receiver: me._id}]
    }).sort({timestamp: -1}).toArray();

    let senderIds = transactions.map(transaction => transaction.sender);
    let receiverIds = transactions.map(transaction => transaction.receiver);

    let senders = await app.database.collection('users').find({_id: { $in: senderIds} }).toArray();
    let receivers = await app.database.collection('users').find({_id: { $in: receiverIds} }).toArray();
    
    for(let i = 0; i < transactions.length; i++) { 
      const sender = senders.find(user => user._id == transactions[i].sender);
      const receiver = receivers.find(user => user._id == transactions[i].receiver);
      transactions[i].sender = sender;
      transactions[i].receiver = receiver
    }
    
    response.json(transactions);
  });

  app.post('/transactions', async (request, response) => {
    const timestamp = new Date();
    const timeLimit = new Date(timestamp.getTime());
    timeLimit.setMinutes(timeLimit.getMinutes() - 2);
    const me = await app.database.collection('users').findOne({_id: 1});
    const myAccount = await app.database.collection('accounts').findOne({userId: me._id});
    const receiver = await app.database.collection('users').findOne({_id: request.body.receiverId});
    const value = request.body.value;
    const success = true;
    if(myAccount) {
      if(receiver) {
        const receiverAccount = await app.database.collection('accounts').findOne({userId: receiver._id});
        if ((myAccount.balance + myAccount.limit) >= value) {
          const sameTransaction = await app.database.collection('transactions').findOne({senderId: me._id, receiverId: receiver._id, value: value, timestamp: {$gte: timeLimit}});
          if (sameTransaction) {
            await app.database.collection('transactions').deleteOne({_id: sameTransaction._id});
          }
          else {
            const updatedAccount = await app.database.collection('accounts').findOneAndUpdate({_id: myAccount._id}, {$inc: {balance: -value}}, {returnNewDocument : true});
            if (updatedAccount) {
              const updatedReceiverAccount = await app.database.collection('accounts').findOneAndUpdate({_id: receiverAccount._id}, {$inc: {balance: value}}, {returnNewDocument: true});
              if (!updatedReceiverAccount) { 
                success = false;
                /* roll back (not perfect because I can't garantee this operation won't fail as well >:)*/
                await app.database.collection('accounts').findOneAndUpdate({_id: myAccount._id}, {$inc: {balance: value}}, {new: true});
              }
            }
            else success = false;
          }
          /* Won't create the transaction in case didn't change the accounts' balances */
          if (success) {
            const {ops} = await app.database.collection('transactions').insertOne({sender: me._id, receiver: receiver._id, value: value, timestamp});
            const transaction = await app.database.collection('transactions').findOne({_id: ops[0]._id});
            transaction.sender = me;
            transaction.receiver = receiver;
            response.json(transaction);
          }
          else response.status(500).json({});
        }
        else {
          response.status(403).json({});
        }
      } else {
        response.status(404).json({});
      }   
    }
    else {response.status(500).json({});}
  });

}
