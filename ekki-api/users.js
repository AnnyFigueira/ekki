module.exports = function(app) {

  app.get('/users/:cpf', async (request, response) => {
    const cpf = request.params.cpf;
    const user = cpf == 'me' ? await app.database.collection('users').findOne({_id: 1}) : await app.database.collection('users').findOne({cpf: cpf})
    if (user) {
      const account = await app.database.collection('accounts').findOne({userId: user._id});
      if (account) { cpf == 'me' ? user.account = account : user.account = account.number; }
      response.json(user);
    }
    else {
      response.status(404).json({});
    }
  });
}
