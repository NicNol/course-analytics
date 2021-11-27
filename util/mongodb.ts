import { connections, connect, ConnectOptions } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CourseSchema } from "./models/course";

declare var process: {
    env: {
        MONGODB_URI: string;
    };
};

const connectDB = function handler(
    req: NextApiRequest,
    res: NextApiResponse<CourseSchema>
) {
    async (req: NextApiRequest, res: NextApiResponse<CourseSchema>) => {
        if (connections[0].readyState) {
            // Use current db connection
            return handler(req, res);
        }
        // Use new db connection
        await connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useNewUrlParser: true,
        } as ConnectOptions);
        return handler(req, res);
    };
};
export default connectDB;
