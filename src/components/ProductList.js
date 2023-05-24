import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './products.css'
import {IoMdAddCircleOutline} from "react-icons/io"
import {MdOutlineModeEditOutline, MdDeleteOutline} from "react-icons/md"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState(0);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteid] = useState("");
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Navigate = useNavigate()
  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveProduct = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append('stock', stock)
    try {
      await axios.post("http://localhost:5000/products", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      getProducts()
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    saveProduct()
    setTitle('')
    setStock(0)
    setFile('')
    setPreview('')
  }, [])
  
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
     <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={saveProduct}>
          <div className="field">
            <label className="label">Product Name</label>
            <div className="control">
              <input
                type="text"
                className="input-form"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Name"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Stock</label>
            <div className="control">
              <input
                type="number"
                className="input-form"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose a file...</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}
            
          <div className="field">
            <div className="d-grid gap-1">
              <Button type="submit" variant="success" size="lg">
                Submit
              </Button>
            </div>
          </div>
        </form>
        </Modal.Body>
      </Modal>

      <button onClick={handleShowAdd} className="btn-add"><IoMdAddCircleOutline className="icon"/> Add</button>
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