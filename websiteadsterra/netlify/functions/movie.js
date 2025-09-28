export async function handler(event, context) {
  try {
    const { endpoint } = event.queryStringParameters;

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing endpoint parameter" }),
      };
    }

    const apiKey = process.env.TMDB_API_KEY; // hidden in Netlify
    const tmdbUrl = `https://api.themoviedb.org/3${endpoint}&api_key=${apiKey}`;

    const response = await fetch(tmdbUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
