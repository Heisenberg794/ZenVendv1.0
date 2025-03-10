import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'https://zenvendv10-production.up.railway.app'; // Replace with your Railway URL
const socket = io(API_URL);

function DeliveryDashboard({ token }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
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

    const handleStatusUpdate = async (id, status) => {
        await axios.put(
            `${API_URL}/api/orders/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchOrders();
    };

    return (
        <div className="dashboard">
            <h1>Delivery Dashboard</h1>
            <div className="orders">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <p>{order.customerName} - ₹{order.total}</p>
                        <p>Status: {order.status}</p>
                        {order.status === 'ready' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'picked')}>
                                Pick Up
                            </button>
                        )}
                        {order.status === 'picked' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'delivered')}>
                                Deliver
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeliveryDashboard;