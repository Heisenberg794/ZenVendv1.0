import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000'; // Replace with your Railway URL
const socket = io(API_URL);

function VendorDashboard({ token }) {
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [deliveryPersons] = useState([{ _id: 'mock-id', email: 'delivery@example.com' }]); // Mock for demo

    useEffect(() => {
        fetchOrders();
        fetchInventory();
        socket.on('orderUpdate', (updatedOrder) => {
            setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
        });
        return () => socket.off('orderUpdate');
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchInventory = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/inventory`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInventory(res.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleAccept = async (id) => {
        await axios.put(
            `${API_URL}/api/orders/${id}/accept`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchOrders();
    };

    const handleAssign = async (id, deliveryId) => {
        await axios.put(
            `${API_URL}/api/orders/${id}/assign`,
            { deliveryPersonId: deliveryId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchOrders();
    };

    const handleAddInventory = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const quantity = parseInt(e.target.quantity.value);
        await axios.post(
            `${API_URL}/api/inventory`,
            { name, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchInventory();
        e.target.reset();
    };

    return (
        <div className="dashboard">
            <h1>Vendor Dashboard</h1>
            <div className="dashboard-grid">
                <div className="orders">
                    <h2>Orders</h2>
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <p>{order.customerName} - ₹{order.total}</p>
                            <p>Status: {order.status}</p>
                            {order.status === 'pending' && (
                                <button onClick={() => handleAccept(order._id)}>Accept</button>
                            )}
                            {order.status === 'ready' && (
                                <select onChange={(e) => handleAssign(order._id, e.target.value)}>
                                    <option value="">Assign Delivery</option>
                                    {deliveryPersons.map((dp) => (
                                        <option key={dp._id} value={dp._id}>
                                            {dp.email}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>
                <div className="inventory">
                    <h2>Inventory</h2>
                    {inventory.map((item) => (
                        <p key={item._id} className={item.quantity < 5 ? 'low-stock' : ''}>
                            {item.name}: {item.quantity}
                        </p>
                    ))}
                    <form onSubmit={handleAddInventory}>
                        <input name="name" placeholder="Item Name" required />
                        <input name="quantity" type="number" placeholder="Quantity" required />
                        <button type="submit">Add</button>
                    </form>
                </div>
                <div className="ondc-status">
                    <h2>ONDC Status</h2>
                    <p>Connected to ONDC Network (Mock)</p>
                </div>
            </div>
        </div>
    );
}

export default VendorDashboard;