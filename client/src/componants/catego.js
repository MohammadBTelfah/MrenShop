
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function Catego() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const response = await axios.get("http://127.0.0.1:5003/api/categories/getallcategories");
          console.log("Categories fetched:", response.data);
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);
    return (
      <>
        <h1>Categories</h1>
        <ul>
          {categories.map(category => (
            <li key={category._id}>
              {category.name}
            </li>
          ))}
        </ul>
      </>
    );
}