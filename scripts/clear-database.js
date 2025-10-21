const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/doxify';

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    console.log(`📦 Found ${collections.length} collections`);
    
    // Drop each collection
    for (const collection of collections) {
      console.log(`🗑️  Dropping collection: ${collection.collectionName}`);
      await collection.drop();
    }
    
    console.log('✅ Database cleared successfully!');
    console.log('');
    console.log('🔄 Please restart your services:');
    console.log('   pm2 restart all');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

clearDatabase();
