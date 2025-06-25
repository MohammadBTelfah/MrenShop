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
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    </div>
);

}