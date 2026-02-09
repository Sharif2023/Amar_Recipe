// Vercel Serverless Function - Proxy to Bytehost API
// This bypasses Bytehost's anti-bot security by making server-side requests

export default async function handler(req, res) {
  // Set CORS headers for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const BYTEHOST_API = 'https://amar-recipe.byethost7.com/src/api';
  
  // Get the endpoint from query parameter
  const { endpoint, ...queryParams } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ success: false, message: 'Missing endpoint parameter' });
  }
  
  try {
    // Build URL with query parameters
    const url = new URL(`${BYTEHOST_API}/${endpoint}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Forward the request to Bytehost
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    };
    
    // Include body for POST/PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.text();
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(data);
      return res.status(response.status).json(jsonData);
    } catch {
      // If not valid JSON, return as text
      return res.status(response.status).send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Proxy error: ' + error.message 
    });
  }
}
