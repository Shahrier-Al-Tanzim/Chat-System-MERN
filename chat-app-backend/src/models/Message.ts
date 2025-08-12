import mongoose, { Document, Model, Schema } from 'mongoose';

interface ISender {
  id: string;
  username: string;
}

export interface IMessage extends Document {
  room: string;
  sender: ISender;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  room: { type: String, required: true },
  sender: {
    id: { type: String, required: true },
    username: { type: String, required: true },
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
