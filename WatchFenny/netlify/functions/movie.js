// Use native fetch (Node.js 18+)
exports.handler = async function(event, context) {
  // Add CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const { endpoint } = event.queryStringParameters;

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing endpoint parameter" }),
        headers
      };
    }

    const apiKey = process.env.TMDB_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "TMDB API key not configured" }),
        headers
      };
    }

    // FIX: Handle URL construction properly
    const separator = endpoint.includes('?') ? '&' : '?';
    const tmdbUrl = `https://api.themoviedb.org/3${endpoint}${separator}api_key=${apiKey}`;

    console.log('Fetching from TMDB:', tmdbUrl);

    const response = await fetch(tmdbUrl);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: " + error.message }),
      headers
    };
  }
}