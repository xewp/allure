// Test with both users
const testBothUsers = async () => {
  const users = [
    { username: "superwis", password: "testtest123" },
    { username: "superadmin", password: "test123" }
  ];

  for (const credentials of users) {
    console.log(`\n=== Testing ${credentials.username} ===`);
    
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
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      
      if (response.ok) {
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('Token received:', !!data.token);
        console.log('User role:', data.user?.role);
      } else {
        console.log('❌ LOGIN FAILED');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
};

testBothUsers();
