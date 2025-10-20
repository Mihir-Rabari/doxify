const fetch = require('node-fetch');

async function testRegister() {
  try {
    console.log('Testing register endpoint...');
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'test1234',
        name: 'Test User'
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRegister();
