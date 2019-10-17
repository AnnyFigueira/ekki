const seed = function(id, name) {
  const user = {
    _id: id,
    name: name,
    cpf: Math.floor(Math.random() * 10000000000),
    phone: '51' + Math.floor(Math.random() * 100000000)
  }
  const account = {
    _id: id,
    userId: user._id,
    number: Math.floor(Math.random() * 100000),
    initialBalance: 1000,
    balance: 1000,
    limit: 500
  }
  return [user, account];
};

module.exports = function(app) {

  app.get('/seed', (request, response) => {
    const names = ["Anny", "Fulano", "Ciclano"];
    names.forEach((name, id) => {
      const [user, account] = seed(id+1, name);
      app.database.collection('users').insertOne(user);
      app.database.collection('accounts').insertOne(account);
    });
    response.json({status: 'success'});
  });

}
