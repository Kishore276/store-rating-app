const bcrypt = require('bcrypt');
const db = require('./database/db');

async function seedDatabase() {
  console.log('🌱 Seeding database with demo data...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    await runQuery('DELETE FROM Ratings');
    await runQuery('DELETE FROM Stores');
    await runQuery('DELETE FROM Users');
    console.log('✅ Cleared existing data\n');

    // Create demo users
    const users = [
      {
        name: 'Administrator User Account',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin@123', 10),
        address: '123 Admin Street, City Center, State 12345',
        role: 'admin'
      },
      {
        name: 'Regular Customer User Account',
        email: 'user@example.com',
        password: await bcrypt.hash('User@123', 10),
        address: '456 User Avenue, Suburb Area, State 67890',
        role: 'user'
      },
      {
        name: 'Store Owner Business Account',
        email: 'owner@example.com',
        password: await bcrypt.hash('Owner@123', 10),
        address: '789 Business Boulevard, Commercial District, State 11111',
        role: 'owner'
      },
      {
        name: 'Second Store Owner Account Name',
        email: 'owner2@example.com',
        password: await bcrypt.hash('Owner@456', 10),
        address: '321 Commerce Street, Shopping District, State 22222',
        role: 'owner'
      },
      {
        name: 'Another Regular User Account',
        email: 'user2@example.com',
        password: await bcrypt.hash('User@456', 10),
        address: '654 Customer Lane, Residential Area, State 33333',
        role: 'user'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const id = await runQuery(
        'INSERT INTO Users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [user.name, user.email, user.password, user.address, user.role]
      );
      userIds.push(id);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

    console.log('\n📦 Created 5 demo users\n');

    // Create demo stores (owned by owner users)
    const stores = [
      {
        name: 'Premium Coffee Shop Downtown',
        email: 'contact@premiumcoffee.com',
        address: '100 Main Street, Downtown, City 10001',
        owner_id: userIds[2] // First owner
      },
      {
        name: 'Electronics Retail Store Megamart',
        email: 'info@electronicsstore.com',
        address: '200 Tech Avenue, Innovation District, City 10002',
        owner_id: userIds[2] // First owner
      },
      {
        name: 'Fashion Boutique Trendy Styles',
        email: 'contact@fashionboutique.com',
        address: '300 Style Street, Fashion District, City 10003',
        owner_id: userIds[3] // Second owner
      },
      {
        name: 'Organic Grocery Market Fresh Foods',
        email: 'hello@organicgrocery.com',
        address: '400 Health Boulevard, Wellness Area, City 10004',
        owner_id: userIds[3] // Second owner
      },
      {
        name: 'Sports Equipment Super Store',
        email: 'support@sportsequipment.com',
        address: '500 Athletic Avenue, Sports Complex, City 10005',
        owner_id: userIds[2] // First owner
      }
    ];

    const storeIds = [];
    for (const store of stores) {
      const id = await runQuery(
        'INSERT INTO Stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [store.name, store.email, store.address, store.owner_id]
      );
      storeIds.push(id);
      console.log(`✅ Created store: ${store.name}`);
    }

    console.log('\n🏪 Created 5 demo stores\n');

    // Create demo ratings
    const ratings = [
      { user_id: userIds[1], store_id: storeIds[0], rating: 5 },
      { user_id: userIds[1], store_id: storeIds[1], rating: 4 },
      { user_id: userIds[1], store_id: storeIds[2], rating: 5 },
      { user_id: userIds[4], store_id: storeIds[0], rating: 4 },
      { user_id: userIds[4], store_id: storeIds[1], rating: 3 },
      { user_id: userIds[4], store_id: storeIds[3], rating: 5 },
      { user_id: userIds[4], store_id: storeIds[4], rating: 4 }
    ];

    for (const rating of ratings) {
      await runQuery(
        'INSERT INTO Ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [rating.user_id, rating.store_id, rating.rating]
      );
    }

    console.log(`✅ Created ${ratings.length} demo ratings\n`);

    console.log('=' .repeat(50));
    console.log('✅ Database seeded successfully!\n');
    console.log('Demo Accounts:');
    console.log('  Admin:  admin@example.com / Admin@123');
    console.log('  User:   user@example.com / User@123');
    console.log('  User2:  user2@example.com / User@456');
    console.log('  Owner:  owner@example.com / Owner@123');
    console.log('  Owner2: owner2@example.com / Owner@456');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    db.close();
  }
}

// Helper function to promisify db.run
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Run the seed
seedDatabase();
