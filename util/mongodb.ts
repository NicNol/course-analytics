import { connect, ConnectionOptions } from "mongoose";

declare var process: {
    env: {
        MONGODB_URI: string;
    };
};

const options: ConnectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

export const connectToDatabase = () =>
    connect(process.env.MONGODB_URI, options);
