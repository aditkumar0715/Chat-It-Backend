import app from '@/app';
import { connectDb } from '@/lib/connectDb';
import {env} from '@/config/enviroment';

const PORT = env.PORT || 5000;

// Connect to the database
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});