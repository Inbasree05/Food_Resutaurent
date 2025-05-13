const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/stationeryOrders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to stationeryOrders database'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Order Schema
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  customMsg: String,
  deliveryDate: String,
  payment: String,
  items: [
    {
      item: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  previousOrderId: String  // For tracking versioned orders
});

// Create Order model
const Order = mongoose.model('Order', orderSchema);

// POST: Create new order
app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: 'Order placed successfully!', orderId: order._id });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// PUT: Update existing order (optional route, if you use it)
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully!', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// DELETE: Delete order by ID
async function deleteUser() {
  const username = document.getElementById('username').value;
  if (!username) {
    output.textContent = 'Enter username to delete user.';
    output.style.color = 'red';
    return;
  }
  try {
    const res = await fetch(`${api}/user/${username}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    output.textContent = result.message;
    output.style.color = result.success ? 'green' : 'red';
  } catch {
    output.textContent = 'Error deleting user.';
    output.style.color = 'red';
  }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Order server is running on port ${PORT}`);
});
