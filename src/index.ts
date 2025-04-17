import app from '@/app';
import { connectDb } from '@/lib/connectDb';
import { env } from '@/config/enviroment';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from '@/socket/index';

const PORT = env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

initSocket(io);

// Connect to the database
connectDb();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
