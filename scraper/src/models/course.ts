import mongoose from "mongoose";
const { Schema, model, Model, models } = mongoose;

interface ICourse {
  name?: string;
  code?: string;
  title?: string;
  difficulty: string;
  "time commitment": string;
  review: string;
  "review date": string;
  quarter: string;
  "other courses": string[];
}

const schema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    "time commitment": {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: function () {
        return typeof this === "string";
      },
    },
    "review date": {
      type: String,
      required: true,
    },
    quarter: {
      type: String,
      required: true,
    },
    "other courses": {
      type: [String],
      required: true,
    },
  },
  { collection: "course-data-v2", versionKey: false, _id: false }
);

const Course: typeof Model<ICourse> = models?.Course || model<ICourse>("Course", schema);

export { Course };
export type { ICourse };
