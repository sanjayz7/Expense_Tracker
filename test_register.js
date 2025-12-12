const API = "http://localhost:3001";

async function testRegister() {
  try {
    const email = `test${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";

    console.log(`Attempting to register with email: ${email}`);

    const response = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Registration successful:", data);
    } else {
      console.error("Registration failed:", data);
    }
  } catch (error) {
    console.error("Network error:", error.message);
  }
}

testRegister();
