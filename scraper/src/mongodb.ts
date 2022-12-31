import { connect, connection } from "mongoose";
import { config } from "dotenv";

config();
declare var process: {
  env: {
    MONGODB_URI: string;
  };
};

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export const connectToDatabase = () => connect(process.env.MONGODB_URI, options);

export const disconnectFromDatabase = () => connection.close();
