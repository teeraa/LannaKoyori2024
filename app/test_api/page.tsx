"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (material: string | null = null) => {
    try {
      const params: Record<string, any> = {};
      if (material) params.material = material;

      const response = await axios.get('/api/products', { params });
      setFilteredProducts(response.data);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // This ensures the API call is made when the component mounts

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Render your products here */}
      <ul>
        {filteredProducts.map((product: any) => (
          <li key={product.ID}>{product.productName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;
