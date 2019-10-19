module.exports = function(app) {

  app.get('/contacts', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    let contacts = await app.database.collection('contacts').find({ownerId: me._id}).toArray();
    
    /* this is done so I can get all users with only one query, as opposed to maping the contacts and making one query for each user id */
    let userIds = contacts.map(contact => contact.userId);

    let users = await app.database.collection('users').find({_id: { $in: userIds} }).toArray();
    
    for(let i = 0; i < contacts.length; i++) { 
      const user = users.find(user => user._id == contacts[i].userId);
      contacts[i].user = user;
    }
    response.json(contacts);
  });

  app.post('/contacts', async (request, response) => {
    const me = await app.database.collection('users').findOne({_id: 1});
    const user = await app.database.collection('users').findOne({_id: request.body.id});
    if(user) {
      // to-do: verificar se o usuário já não está nos contatos e se não está tentando adicionar a si mesmo
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
