module.exports = function(app) {

  app.get('/users/:id', async (request, response) => {
    const id = request.params.id == 'me' ? 1 : request.params.id
    const user = await app.database.collection('users').findOne({_id: id});
    if(request.params.id == 'me') {
      const account = await app.database.collection('accounts').findOne({userId: user._id});
      user.account = account;
    }
    response.json(user);
  });

}
