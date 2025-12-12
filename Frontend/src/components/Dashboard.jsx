import { useState, useEffect } from "react";
import { Button, TextField, Card, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const API = "http://localhost:3001";

  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // ✅ For Edit Mode
  const [editId, setEditId] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getExpenses = async () => {
    const res = await axios.get(`${API}/api/get-expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpenses(res.data);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    await axios.post(
      `${API}/api/add-expense`,
      { title, amount, category, date },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    resetForm();
    getExpenses();
  };

  // ✅ DELETE EXPENSE
  const deleteExpense = async (id) => {
    await axios.delete(`${API}/api/delete-expense/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getExpenses();
  };

  // ✅ LOAD DATA INTO FORM FOR EDITING
  const startEdit = (ex) => {
    setEditId(ex._id);
    setTitle(ex.title);
    setAmount(ex.amount);
    setCategory(ex.category);
    setDate(ex.date);
  };

  // ✅ UPDATE EXPENSE
  const updateExpense = async (e) => {
    e.preventDefault();
    await axios.put(
      `${API}/api/update-expense/${editId}`,
      { title, amount, category, date },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    resetForm();
    getExpenses();
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  useEffect(() => {
    getExpenses();
  }, []);
const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
// Output: "12 Dec 2025"

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f8f8ff",
        paddingBottom: "40px",
      }}
    >
      <Typography variant="h5">Dashboard</Typography>

      <Button variant="contained" color="error" onClick={logout} sx={{ mt: 2 }}>
        Logout
      </Button>

      {/* ✅ ADD / EDIT FORM */}
      <Card sx={{ mt: 3, p: 2, width: 500 }}>
        <Typography>{editId ? "Edit Expense" : "Add Expense"}</Typography>

        <form onSubmit={editId ? updateExpense : addExpense}>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button variant="contained" type="submit" sx={{ mt: 1 }}>
            {editId ? "Update" : "Add"}
          </Button>

          {editId && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 1, ml: 2 }}
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </form>
      </Card>


      {/* ✅ EXPENSE LIST */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Your Expenses
      </Typography>


    {expenses.map((ex, i) => (
  <Card key={i} sx={{ mt: 1, p: 1, width: 500 }}>
    <Typography>
      {ex.title} - ₹{ex.amount}
    </Typography>

    <Typography>
      {ex.category} - {formatDate(ex.date)}
    </Typography>

    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <Button variant="outlined" color="primary" onClick={() => startEdit(ex)}>
        Edit
      </Button>

      <Button variant="outlined" color="error" onClick={() => deleteExpense(ex._id)}>
        Delete
      </Button>
    </div>
  </Card>
))}

    </div>
  );
}
