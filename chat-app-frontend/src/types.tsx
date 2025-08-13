export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ChatResponse {
    room: string;
    sender: {id: string; username: string};
    content: string;
    timestamp: string | Date;
}

export interface ChatMessage {
  room: string;
  sender: {
    id: string;
    username: string;
  };
  content: string;
  timestamp: string; // or Date, but string is easier for JSON
}
    