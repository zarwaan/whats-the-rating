import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://www.netflix.com',
}));

dotenv.config();

const PORT = process.env.PORT || "3000";

const apikey = process.env.OMDB_API_KEY;

app.get('/',(req,res) => res.send(`Server running!`));

app.get('/api/omdb',async (req,res) => {
	if(!apikey) return res.status(401).json({
		success: false,
		error: "No API key provided!"
	});

	const query = new URLSearchParams({
		apikey,
		tomatoes: true,
		...req.query
	}).toString();

	const fetchUrl = `https://www.omdbapi.com/?${query}`;
	const response = await fetch(fetchUrl,{method: 'GET'});
	const result = await response.json();
	const imdbRating = result.imdbRating || 
						result.Ratings?.find(r => r.Source === "Internet Movie Database")?.Value.split('/')[0] ||
						"N/A";
	const rtScore = result.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value || "N/A";
	const metaScore = result.Ratings?.find(r => r.Source === "Metacritic")?.Value.split('/')[0] || "N/A";
	return res.status(200).json({
		success: true,
		imdbRating,
		rtScore,
		metaScore
	});
})

app.listen(PORT, () => console.log(`Server running!`))