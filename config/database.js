module.exports = (uri) => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://' + uri);

  mongoose.connection.on('connected', () => {
    console.log('Conectado ao banco de dados MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    console.log('Erro na conexão: ' + error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Disconectado do MongoDB');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Conexão fechada pelo término da aplicação');
      process.exit(0);
    });
  });
}
