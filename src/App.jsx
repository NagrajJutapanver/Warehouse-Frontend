import React, { useState, useEffect } from 'react';

function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [aisles, setAisles] = useState([]);
  const [products, setProducts] = useState([]);
  const [moves, setMoves] = useState([]);
  const [allRawData, setAllRawData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');

  const [aisleNumber, setAisleNumber] = useState('');
  const [aisleWarehouseId, setAisleWarehouseId] = useState('');

  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('');
  const [productQty, setProductQty] = useState('');

  const [moveProductId, setMoveProductId] = useState('');
  const [sourceAisle, setSourceAisle] = useState('');
  const [destinationAisle, setDestinationAisle] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setErrorMsg('');
      
      const whRes = await fetch('http://localhost:3000/api/warehouses');
      if (whRes.ok) setWarehouses(await whRes.json());

      // Fetch Aisles (Assuming your backend has /api/aisles, if not you can add it or pull via warehouses)
      const aisleRes = await fetch('http://localhost:3000/api/aisles');
      if (aisleRes.ok) setAisles(await aisleRes.json());

      const prodRes = await fetch('http://localhost:3000/api/products');
      if (prodRes.ok) setProducts(await prodRes.json());

      const moveRes = await fetch('http://localhost:3000/api/moves');
      if (moveRes.ok) setMoves(await moveRes.json());

      const allRes = await fetch('http://localhost:3000/api/debug/all-data');
      if (allRes.ok) setAllRawData(await allRes.json());
    } catch (err) {
      console.error('Error fetching data from backend:', err);
      setErrorMsg('Failed to connect to backend server. Make sure node app.js is running!');
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: warehouseName, location: warehouseLocation })
      });
      setWarehouseName('');
      setWarehouseLocation('');
      fetchAllData();
    } catch (err) {
      console.error('Error adding warehouse:', err);
    }
  };

  const handleAddAisle = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/aisles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aisleNumber, warehouseId: parseInt(aisleWarehouseId) })
      });
      setAisleNumber('');
      setAisleWarehouseId('');
      fetchAllData();
    } catch (err) {
      console.error('Error adding aisle:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName, sku: productSku, quantity: parseInt(productQty) || 0 })
      });
      setProductName('');
      setProductSku('');
      setProductQty('');
      fetchAllData();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleAddMove = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/moves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(moveProductId),
          sourceAisleId: parseInt(sourceAisle),
          destinationAisleId: parseInt(destinationAisle)
        })
      });
      setMoveProductId('');
      setSourceAisle('');
      setDestinationAisle('');
      fetchAllData();
    } catch (err) {
      console.error('Error recording stock move:', err);
    }
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
  const thStyle = { background: '#007BFF', color: '#white', padding: '10px', border: '1px solid #ddd', textAlign: 'left' };
  const tdStyle = { padding: '8px', border: '1px solid #ddd' };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: 'auto', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Warehouse Stock Move Management</h1>

      {errorMsg && (
        <div style={{ background: '#ffdddd', color: '#990000', padding: '15px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ff8888' }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {/* Warehouse Section */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Manage Warehouses</h2>
        <form onSubmit={handleAddWarehouse} style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="Warehouse Name" value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '200px' }} />
          <input type="text" placeholder="Location" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '200px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Warehouse</button>
        </form>
        <h3>Existing Warehouses:</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#007BFF', color: '#fff' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Location</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w) => (
              <tr key={w.id}>
                <td style={tdStyle}>{w.id}</td>
                <td style={tdStyle}>{w.name}</td>
                <td style={tdStyle}>{w.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Aisles Section */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Manage Aisles</h2>
        <form onSubmit={handleAddAisle} style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="Aisle Number / Code" value={aisleNumber} onChange={(e) => setAisleNumber(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '180px' }} />
          <input type="number" placeholder="Warehouse ID" value={aisleWarehouseId} onChange={(e) => setAisleWarehouseId(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '150px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Aisle</button>
        </form>
        <h3>Existing Aisles:</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#17a2b8', color: '#fff' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Aisle Number</th>
              <th style={thStyle}>Warehouse ID</th>
            </tr>
          </thead>
          <tbody>
            {aisles.map((a) => (
              <tr key={a.id}>
                <td style={tdStyle}>{a.id}</td>
                <td style={tdStyle}>{a.aisleNumber || a.number}</td>
                <td style={tdStyle}>{a.warehouseId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Section */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Manage Products</h2>
        <form onSubmit={handleAddProduct} style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '180px' }} />
          <input type="text" placeholder="SKU" value={productSku} onChange={(e) => setProductSku(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '150px' }} />
          <input type="number" placeholder="Quantity" value={productQty} onChange={(e) => setProductQty(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '100px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Product</button>
        </form>
        <h3>Existing Products:</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#28a745', color: '#fff' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.sku}</td>
                <td style={tdStyle}>{p.quantity ?? p.qty ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Move Form Section */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Record Stock Movement</h2>
        <form onSubmit={handleAddMove} style={{ marginBottom: '15px' }}>
          <input type="number" placeholder="Product ID" value={moveProductId} onChange={(e) => setMoveProductId(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '110px' }} />
          <input type="number" placeholder="Source Aisle ID" value={sourceAisle} onChange={(e) => setSourceAisle(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '130px' }} />
          <input type="number" placeholder="Destination Aisle ID" value={destinationAisle} onChange={(e) => setDestinationAisle(e.target.value)} required style={{ marginRight: '10px', padding: '8px', width: '150px' }} />
          <button type="submit" style={{ padding: '8px 15px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Record Move</button>
        </form>
      </div>

      {/* Stock Moves Log Section */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Stock Movements Log</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#ffc107', color: '#333' }}>
              <th style={thStyle}>Move ID</th>
              <th style={thStyle}>Product ID</th>
              <th style={thStyle}>Source Aisle ID</th>
              <th style={thStyle}>Destination Aisle ID</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((m) => (
              <tr key={m.id}>
                <td style={tdStyle}>{m.id}</td>
                <td style={tdStyle}>{m.productId}</td>
                <td style={tdStyle}>{m.sourceAisleId}</td>
                <td style={tdStyle}>{m.destinationAisleId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;