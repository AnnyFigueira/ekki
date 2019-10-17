module.exports = function(app) {

  app.get('/contacts', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const contacts = await app.database.collection('contacts').find({ownerId: me._id}).toArray();
    response.json(contacts);
  });

  app.post('/contacts', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const user = await app.database.collection('users').findOne({_id: request.body._id});
    if(user) {
      const {ops} = await app.database.collection('contacts').insertOne({ownerId: me._id, userId: user._id});
      const contact = await app.database.collection('contacts').findOne({_id: ops[0]._id});
      contact.user = user;
      response.json(contact);
    } else {
      response.status(404).json({});
    }
  });

  app.delete('/contacts/:id', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const {ops} = await app.database.collection('contacts').deleteOne({_id: request.params.id, ownerId: me._id});
    response.json(ops);
  });

}
