// Quick test to verify the admin login endpoint
const testAdminLogin = async () => {
  const credentials = {
    username: "superwis",
    password: "testtest123"
  };

  try {
    const response = await fetch('http://localhost:5000/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('Token:', data.token?.substring(0, 30) + '...');
      console.log('User:', data.user);
    } else {
      console.log('\n❌ LOGIN FAILED');
      console.log('Message:', data.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAdminLogin();
