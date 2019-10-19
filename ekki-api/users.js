module.exports = function(app) {

  app.get('/users/:cpf', async (request, response) => {
    const cpf = request.params.cpf;
    const user = cpf == 'me' ? await app.database.collection('users').findOne({_id: 1}) : await app.database.collection('users').findOne({cpf: cpf})
    const account = await app.database.collection('accounts').findOne({userId: user._id});

    cpf == 'me' ? user.account = account : user.account = account.number;

    response.json(user);
  });
}
