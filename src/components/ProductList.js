import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './products.css'
import {IoMdAddCircleOutline} from "react-icons/io"
import {MdOutlineModeEditOutline, MdDeleteOutline} from "react-icons/md"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteid] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
  };

  const handleClickDelete = (productId) => {
    setDeleteid(productId);
    handleShow(true);
  };
  const deleteProduct = async (productId) => {
    handleShow(true)
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      getProducts();
    } catch (error) {
      console.log(error);
    }
    handleShow(false)
  };

  return (
    <div className="container">
      <Link  to="/add" >
      <button className="btn-add"><IoMdAddCircleOutline className="icon"/> Add</button>
      </Link>
      <div className="columns">
        {products.map((product) => (
          <div className="column" key={product.id}>
            <div className="card">   
                  <img src={product.url} alt="Image" />
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <strong className="title">{product.name}</strong>
                    <p>Stock : {product.stock}</p>
                  </div>
                </div>
              </div>
              <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah anda ingin menghapus <strong>{product.name}</strong></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => deleteProduct(product.id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
              <footer className="card-footer">
                <Link to={`edit/${product.id}`} className="card-footer-item1">
                  <MdOutlineModeEditOutline className="icon"/> Edit
                </Link>
                <a
                  onClick={() => handleClickDelete(product.id)}
                  className="card-footer-item2"
                >
                 <MdDeleteOutline /> Delete
                </a>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
