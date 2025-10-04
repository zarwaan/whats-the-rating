import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

const NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({path: `.env.${NODE_ENV}`});

const PORT = process.env.PORT || "3000";

const apikey = process.env.OMDB_API_KEY;

app.get('/',(req,res) => res.send(`Server running in ${NODE_ENV} mode`));

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
	return res.status(200).json('yay');
})

app.listen(PORT, () => console.log(`Server running in ${NODE_ENV} mode`))