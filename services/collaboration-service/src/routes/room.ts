import express, { Request, Response } from 'express';
import { Socket, Server } from 'socket.io';

interface Room {
    users_socket_id: Array<string>;
    status: "active" | "inactive";
    text: string;
}
  
interface SaveTextRequest extends Request {
    body: {
        room_id: string;
        text: string;
    };
}
  
const sessions: Record<string, Room> = {};
const users: Record<string, string> = {};  // true_user_id, socket_id

export const roomRouter = (io: Server) => {
    const router = express.Router();
    
    // API to join a room
    router.get("/join/:id", (req: Request, res: Response) => {
        const room_id = req.params.id as string;
        const user_id = req.query.user_id as string;

        if (!room_id) {
            return res.status(400).json({ error: "Invalid input parameters" });
        }
    
        if (!sessions[room_id]) {
            sessions[room_id] = {
                users_socket_id: [user_id],
                status: "active",
                text: "",
            };
        } else {
            sessions[room_id].users_socket_id.push(user_id);
            sessions[room_id].status = "active";
        }
        
        io.once("connection", (socket: Socket) => {
            console.log("User connected:", socket.id);
        
            socket.on("join-room", (roomId: string) => {
                socket.join(roomId);
                console.log(socket.id + " joined room:", roomId);
        
                socket.on("textchange", (text: string) => {
                    io.to(roomId).emit("textchange", { text });
                });
            });
        
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        res.status(200).json({
            room_id: room_id,
            info: sessions[room_id]
        });

    })

    // API to save text
    router.post("/save", (req: SaveTextRequest, res: Response) => {
        try {
        const { room_id, text } = req.body;
    
        if (!(room_id in sessions)) {
            return res.status(400).json({ error: "Invalid roomId provided" });
        }
    
        const session = sessions[room_id];
        session.text = text;
        session.status = "active";
    
        res.status(200).json({
            message: "Session saved successfully",
            info: sessions[room_id],
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving session" });
        }
    });

    return router;
};

export default roomRouter;
