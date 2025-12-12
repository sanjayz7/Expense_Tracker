import { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const API = "http://localhost:3001";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in → go to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div style={styles.center}>
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography variant="h6">Login</Typography>

          <form onSubmit={handleLogin}>
            <TextField fullWidth margin="dense" label="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField fullWidth margin="dense" type="password" label="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button fullWidth variant="contained" type="submit" sx={{ mt: 1 }}>
              Login
            </Button>

            <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const styles = {
  center: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
