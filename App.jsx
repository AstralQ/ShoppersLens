import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch stores from API
  useEffect(() => {
    axios.get('http://localhost:3001/comeshop')
      .then(response => {
        setStores(response.data);
        setFilteredStores(response.data);
      })
      .catch(error => {
        console.error('Error fetching stores:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = stores.filter(store =>
      (store.name && store.name.toLowerCase().includes(searchValue)) ||
      (store.description && store.description.toLowerCase().includes(searchValue))
    );
    setFilteredStores(filtered);
  };

  const handleStoreSubmit = (event) => {
    event.preventDefault();
    const newStore = {
      name: storeName,
      description: storeDescription
    };

    axios.post('http://localhost:3001/comeshop', newStore)
      .then(response => {
        setStores(prevStores => [...prevStores, response.data]);
        setFilteredStores(prevStores => [...prevStores, response.data]); // Update filtered stores
        setStoreName('');
        setStoreDescription('');
      })
      .catch(error => {
        console.error('Error adding store:', error);
      });
  };

  const handleNameChange = (event) => {
    setStoreName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setStoreDescription(event.target.value);
  };

  return (
    <div>
      <h1>Shopper's Lens</h1>
      <h5>Everything you need to know about Everything you need!</h5>
      <form>
        <div>Enter name of the store or description here:</div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </form>
      <div>
        <p>Submit Store here and add it to our database, valued customer!</p>
        <form onSubmit={handleStoreSubmit}>
          <label>
            Enter name of the store:
            <input
              type="text"
              value={storeName}
              onChange={handleNameChange}
            />
          </label>
          <label>
            Enter description of items sold:
            <textarea
              value={storeDescription}
              onChange={handleDescriptionChange}
            />
          </label>
          <button type='submit'>Submit</button>
        </form>
      </div>
      <p>Search store via description or store name!</p>
      <ul>
        {filteredStores.map(store => (
          <li key={store.id}>
            <h3>{store.name}</h3>
            <p>{store.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
