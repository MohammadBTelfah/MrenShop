import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5003/api/products/getallproduct");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Optionally, you can redirect to login or show an error message
        navigate('/login');
      }
    };
    fetchProducts();
  }, [navigate]);

const [openModal, setOpenModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const [updatedProduct, setUpdatedProduct] = useState({ name: '', description: '', price: '' });

const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
        name: product.name,
        description: product.description,
        price: product.price
    });
    setOpenModal(true);
};

const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
};

const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({
        ...prev,
        [name]: value
    }));
};

const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(
            `http://127.0.0.1:5003/api/products/updateProduct/${selectedProduct._id}`,
            updatedProduct,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p._id === selectedProduct._id ? { ...p, ...updatedProduct } : p
            )
        );
        alert("Product updated successfully");
        handleCloseModal();
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
    }
};

return (
    <div>
        <h1>Products</h1>
        <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Image</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Description</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Price</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>View</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Delete</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                {product.image && (
                                    <img src={product.image} alt={product.name} width={80} />
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                <Typography variant="body1">{product.name}</Typography>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                <Typography variant="body2">{product.description}</Typography>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                ${product.price}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                <Button variant="contained" color="primary" onClick={() => navigate(`/product/${product._id}`)}>
                                    View
                                </Button>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                <Button variant="contained" color="secondary" onClick={async () => {
                                    try {
                                        await axios.delete(
                                            `http://127.0.0.1:5003/api/products/deleteProduct/${product._id}`,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }
                                            }
                                        );
                                        setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id));
                                        alert("Product deleted successfully");
                                    } catch (error) {
                                        console.error("Error deleting product:", error);
                                        alert("Failed to delete product");
                                    
                                    }
                                }}>
                                    Delete  
                                </Button>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                <Button variant="contained" color="warning" onClick={() => handleOpenModal(product)}>
                                    Update
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
        {/* Modal for Update */}
        {openModal && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        minWidth: 300,
                        boxShadow: 24
                    }}
                >
                    <Typography variant="h6" mb={2}>Update Product</Typography>
                    <form onSubmit={handleUpdateSubmit}>
                        <Box mb={2}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedProduct.name}
                                    onChange={handleUpdateChange}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </label>
                        </Box>
                        <Box mb={2}>
                            <label>
                                Description:
                                <input
                                    type="text"
                                    name="description"
                                    value={updatedProduct.description}
                                    onChange={handleUpdateChange}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </label>
                        </Box>
                        <Box mb={2}>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    name="price"
                                    value={updatedProduct.price}
                                    onChange={handleUpdateChange}
                                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                                    required
                                />
                            </label>
                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="contained" color="primary" type="submit">
                                Save
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        )}
    </div>
);

}