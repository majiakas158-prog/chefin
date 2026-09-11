import { app } from './app.js';
import { env } from './config/env.js';

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`CheafIn API listening on http://localhost:${PORT}`));
