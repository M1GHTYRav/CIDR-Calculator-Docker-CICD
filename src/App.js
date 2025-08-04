import React, { useState } from 'react';
import './App.css';

function calculateCIDR(cidr) {
  const [ip, prefix] = cidr.split('/');
  const ipParts = ip.split('.').map(Number);
  const prefixNum = parseInt(prefix);

  if (ipParts.length !== 4 || prefixNum < 0 || prefixNum > 32) return null;

  const ipInt = ipParts.reduce((acc, part) => (acc << 8) + part, 0);
  const mask = 0xffffffff << (32 - prefixNum);
  const network = ipInt & mask;
  const broadcast = network | (~mask >>> 0);
  const hostCount = prefixNum === 32 ? 1 : Math.max(0, (1 << (32 - prefixNum)) - 2);

  const toIP = (int) => [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');

  return {
    network: toIP(network),
    broadcast: toIP(broadcast),
    mask: toIP(mask),
    hosts: hostCount
  };
}

function App() {
  const [cidr, setCidr] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = calculateCIDR(cidr);
    setResult(res || { error: 'Invalid CIDR' });
  };

  return (
    <div className="App">
      <h1>CIDR Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="e.g. 192.168.1.0/24"
        />
        <button type="submit">Calculate</button>
      </form>

      {result && (
        <div>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <ul>
              <li><strong>Network:</strong> {result.network}</li>
              <li><strong>Broadcast:</strong> {result.broadcast}</li>
              <li><strong>Subnet Mask:</strong> {result.mask}</li>
              <li><strong>Usable Hosts:</strong> {result.hosts}</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
