module.exports = function(app) {

  app.get('/transactions', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const myAccount = await app.database.collection('accounts').findOne({userId: me._id});
    const transactions = await app.database.collection('transactions').find({
      $or: [{senderId: myAccount._id}, {receiverId: myAccount._id}]
    }).sort({timestamp: -1}).toArray();

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
    if(receiver) {
      const receiverAccount = await app.database.collection('users').findOne({userId: receiver._id});
      if ((myAccount.balance + myAccount.limit) > value) {
        const sameTransaction = await app.database.collection('transactions').findOne({senderId: me._id, receiverId: receiver._id, value: value, $gte: {timestamp: timeLimit}});
        if (sameTransaction) {
          await app.database.collection('transactions').deleteOne({_id: sameTransaction._id});
        }
        else {
          await app.database.collection('accounts').updateOne({_id: myAccount._id, $inc: {balance: -value}});
          await app.database.collection('accounts').updateOne({_id: receiverAccount._id, $inc: {balance: value}});
        }
        const {ops} = await app.database.collection('transactions').insertOne({sender: me._id, receiver: receiver._id, value: value, timestamp});
        const transaction = await app.database.collection('transactions').findOne({_id: ops[0]._id});
        response.json(transaction);
      }
      else {
        response.status(401).json({});
      }
    } else {
      response.status(404).json({});
    }
  });

}
