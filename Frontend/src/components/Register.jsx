import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const API = "https://expense-tracker-9ahm.onrender.com";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/register`, { name, email, password });
      alert("Registered Successfully!");
      navigate("/login");
    } catch (err) {
      alert("Error while registering!");
    }
  };

  return (
    <div style={styles.center}>
      <Card sx={{ width: 300 }}>
        <CardContent>
          <Typography variant="h6">Register</Typography>

          <form onSubmit={handleRegister}>
            <TextField fullWidth margin="dense" label="Name"
              value={name} onChange={(e) => setName(e.target.value)} />

            <TextField fullWidth margin="dense" label="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField fullWidth margin="dense" type="password" label="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button fullWidth variant="contained" type="submit" sx={{ mt: 1 }}>
              Register
            </Button>

            <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/login")}>
              Login Instead
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
