import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import { addOrderAPI, getUserOrderAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [orderData, setOrderData] = useState({ items: [{ name: "", quantity: 1 }], totalPrice: "", status: "Pending" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { getUserOrder(); }, []);

  const toggleModal = (edit = false, order = null) => {
    setIsEditing(edit);
    setShow(true);
    setOrderData(order ? { ...order } : { items: [{ name: "", quantity: 1 }], totalPrice: "", status: "Pending" });
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...orderData.items];
      updatedItems[index][name] = value;
      setOrderData({ ...orderData, items: updatedItems });
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };

  const modifyItem = (action, index = null) => {
    if (action === "add") setOrderData({ ...orderData, items: [...orderData.items, { name: "", quantity: 1 }] });
    if (action === "remove") setOrderData({ ...orderData, items: orderData.items.filter((_, i) => i !== index) });
  };

  const saveOrder = async () => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!token || !user?._id) return alert("Unauthorized. Please log in again.");
    
    try {
      const result = isEditing ? orders.map(order => order.id === orderData.id ? orderData : order) : await addOrderAPI({ ...orderData, userId: user._id }, { Authorization: `Bearer ${token}` });
      if (result.status === 201 || isEditing) {
        setOrders(isEditing ? result : [...orders, result.data]);
        setShow(false);
      } else alert("Failed to save order.");
    } catch (err) {
      console.error(err);
      alert("Error while saving the order.");
    }
  };

  const getUserOrder = async () => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (token && user?._id) {
      try {
        const result = await getUserOrderAPI(user._id, { Authorization: `Bearer ${token}` });
        if (result.status === 200) setOrders(result.data);
      } catch (err) { console.log(err); }
    }
  };

  return (
    <Container className="p-4 bg-white shadow rounded w-100 h-100">
      <div className="d-flex justify-content-between">
        <h2>Order Management</h2>
        <Button variant="danger" onClick={() => { sessionStorage.clear(); navigate('/') }}>Logout</Button>
      </div>
      <Button variant="primary" onClick={() => toggleModal()} className="mb-3">Add Order</Button>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr><th>#</th><th>Items</th><th>Total Price</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.items.map((item, i) => (<div key={i}>{item.name} (x{item.quantity})</div>))}</td>
              <td>${order.totalPrice}</td>
              <td><span className={`badge ${order.status === "Pending" ? "bg-warning" : order.status === "Shipped" ? "bg-primary" : "bg-success"}`}>{order.status}</span></td>
              <td><Button variant="warning" size="sm" onClick={() => toggleModal(true, order)}>Edit</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>{isEditing ? "Edit Order" : "Add Order"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            {orderData.items.map((item, index) => (
              <Row key={index} className="mb-2">
                <Col xs={5}><Form.Control type="text" placeholder="Product Name" name="name" value={item.name} onChange={(e) => handleChange(e, index)} /></Col>
                <Col xs={4}><Form.Control type="number" placeholder="Quantity" name="quantity" value={item.quantity} onChange={(e) => handleChange(e, index)} /></Col>
                <Col xs={3} className="text-end"><Button variant="danger" onClick={() => modifyItem("remove", index)}> - </Button></Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={() => modifyItem("add")} className="mb-3">Add Item</Button>
            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Form.Control type="number" placeholder="Enter Total Price" name="totalPrice" value={orderData.totalPrice} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={orderData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={saveOrder}>{isEditing ? "Save Changes" : "Save Order"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;
