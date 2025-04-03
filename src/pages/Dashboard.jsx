import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import { addOrderAPI, getUserOrderAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const [newOrder, setNewOrder] = useState({
        items: [{ name: "", quantity: 1 }],
        totalPrice: "",
        status: "Pending",
    });
    const [editShow, setEditShow] = useState(false);
    const [editOrder, setEditOrder] = useState(null);

    useEffect(() => {
        getUserOrder();
    }, []);

    const handleEdit = (order) => {
        setEditOrder({ ...order }); 
        setEditShow(true);
      };
      
      
      const handleEditClose = () => {
        setEditShow(false);
        setEditOrder(null);
      };
      
      
      const handleEditChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
          const updatedItems = [...editOrder.items];
          updatedItems[index][name] = value;
          setEditOrder({ ...editOrder, items: updatedItems });
        } else {
          setEditOrder({ ...editOrder, [name]: value });
        }
      };
      
      
      const addEditItem = () => {
        setEditOrder({
          ...editOrder,
          items: [...editOrder.items, { name: "", quantity: 1 }]
        });
      };
      
      
      const removeEditItem = (index) => {
        const updatedItems = editOrder.items.filter((_, i) => i !== index);
        setEditOrder({ ...editOrder, items: updatedItems });
      };
      
      
      const saveEditOrder = () => {
        const updatedOrders = orders.map((order) =>
          order.id === editOrder.id ? editOrder : order
        );
        setOrders(updatedOrders);
        setEditShow(false);
      };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e, index = null) => {
        if (index !== null) {
        const updatedItems = [...newOrder.items];
        updatedItems[index][e.target.name] = e.target.value;
        setNewOrder({ ...newOrder, items: updatedItems });
        } else {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
        }
    };

    const addItem = () => {
        setNewOrder({ ...newOrder, items: [...newOrder.items, { name: "", quantity: 1 }] });
    };

    const removeItem = (index) => {
        const updatedItems = newOrder.items.filter((_, i) => i !== index);
        setNewOrder({ ...newOrder, items: updatedItems });
    };

    const addOrder = async () => {
        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!token || !user?._id) {
        alert("You are not authorized. Please log in again.");
        return;
        }

        const reqHeader = {
        Authorization: `Bearer ${token}`,
        };

        if (newOrder.items.length > 0 && newOrder.totalPrice) {
        try {
            const orderData = {
            userId: user._id,
            items: newOrder.items,
            totalPrice: newOrder.totalPrice,
            status: "Pending",
            };

            const result = await addOrderAPI(orderData, reqHeader);

            if (result.status === 201) {
            alert("Order added successfully!");
            setNewOrder({ items: [{ name: "", quantity: 1 }], totalPrice: "", status: "Pending" });
            handleClose();
            getUserOrder();
            } else {
            alert("Failed to add order.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while adding the order.");
        }
        } else {
        alert("Please fill in all order details.");
        }
    };

    const getUserOrder = async () => {
        console.log("Fetching user orders...");

        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (token && user?._id) {
        const reqHeader = {
            Authorization: `Bearer ${token}`,
        };

        try {
            const result = await getUserOrderAPI(user._id, reqHeader);
            console.log(result);

            if (result.status === 200) {
            setOrders(result.data);
            }
        } catch (err) {
            console.log(err);
        }
        } else {
        console.error("User ID or token is missing");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/')
    };
  

  return (

    <>
    <div className="w-full d-flex justify-content-between">
        <h2>Order Management</h2>
        <Button className="mb-2" variant="danger" onClick={handleLogout}>Logout</Button>
    </div>
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Container className="p-4 bg-white shadow rounded w-100 h-100">
        
        <Button variant="primary" onClick={handleShow} className="mb-3 d-flex">
          Add Order
        </Button>
    
        <Table striped bordered hover responsive className="mt-3">
  <thead className="table-dark">
    <tr>
      <th>#</th>
      <th>Items</th>
      <th>Total Price</th>
      <th>Status</th>
      <th>Created At</th>
      <th>Updated At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          {order.items.map((item, i) => (
            <div key={i}>{item.name} (x{item.quantity})</div>
          ))}
        </td>
        <td>${order.totalPrice}</td>
        <td>
          <span className={`badge ${order.status === "Pending" ? "bg-warning" : order.status === "Shipped" ? "bg-primary" : "bg-success"}`}>
            {order.status}
          </span>
        </td>
        <td>{order.createdAt}</td>
        <td>{order.updatedAt}</td>
        <td>
          <Button variant="warning" size="sm" onClick={() => handleEdit(order)}>
            Edit
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
        </Table>

        {/* Edit Order Modal */}
        <Modal show={editShow} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            {editOrder?.items.map((item, index) => (
                <Row key={index} className="mb-2">
                <Col xs={5}>
                    <Form.Control
                    type="text"
                    placeholder="Product Name"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleEditChange(e, index)}
                    />
                </Col>
                <Col xs={4}>
                    <Form.Control
                    type="number"
                    placeholder="Quantity"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleEditChange(e, index)}
                    />
                </Col>
                <Col xs={3} className="text-end">
                    <Button variant="danger" onClick={() => removeEditItem(index)}> - </Button>
                </Col>
                </Row>
            ))}
            <Button variant="secondary" onClick={addEditItem} className="mb-3">
                Add Item
            </Button>
            <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                type="number"
                placeholder="Enter Total Price"
                name="totalPrice"
                value={editOrder?.totalPrice}
                onChange={handleEditChange}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={editOrder?.status} onChange={handleEditChange}>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                </Form.Select>
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleEditClose}>
            Close
            </Button>
            <Button variant="success" onClick={saveEditOrder}>
            Save Changes
            </Button>
        </Modal.Footer>
        </Modal>

    
        {/* Order Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {newOrder.items.map((item, index) => (
                <Row key={index} className="mb-2">
                  <Col xs={5}>
                    <Form.Control
                      type="text"
                      placeholder="Product Name"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, index)}
                    />
                  </Col>
                  <Col xs={3} className="text-end">
                    <Button variant="danger" onClick={() => removeItem(index)}> - </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addItem} className="mb-3">
                Add Item
              </Button>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Total Price"
                  name="totalPrice"
                  value={newOrder.totalPrice}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={newOrder.status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addOrder}>
              Save Order
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
    </>


  );
}

export default Dashboard;
