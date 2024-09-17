const mongoose = require('mongoose');

 class MongoDatabase {

  static async connect( options ) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect( mongoUrl, {
        dbName: dbName,
      });

      console.log("Conexión a base de datos");
      return true;

    } catch (error) {
      console.log('Mongo connection error');
      throw error;
    }

  }
  static async disconnect() {
    await mongoose.disconnect();
  }

}


module.exports = MongoDatabase;




