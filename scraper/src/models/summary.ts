import mongoose from "mongoose";
const { Schema, model, Model, models } = mongoose;

interface ISummary {
  code: string;
  title: string;
  "average difficulty": string;
  "time commitment": string;
  "review count": string;
  tags: string[];
}

interface ISummaryByDate {
  "All Time": ISummary[];
  "Past 2 Years": ISummary[];
  "Past 6 Months": ISummary[];
}

const summarySchema = new Schema<ISummary>({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  "average difficulty": {
    type: String,
    required: true,
  },
  "time commitment": {
    type: String,
    required: true,
  },
  "review count": {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
});

const summaryByDateSchema = new Schema<ISummaryByDate>(
  {
    "All Time": {
      type: [summarySchema],
      required: true,
    },
    "Past 2 Years": {
      type: [summarySchema],
      required: true,
    },
    "Past 6 Months": {
      type: [summarySchema],
      required: true,
    },
  },
  { collection: "summary-data-by-date", versionKey: false }
);

const Summary: typeof Model<ISummaryByDate> =
  models?.SummaryByDate || model<ISummaryByDate>("SummaryByDate", summaryByDateSchema);

export { Summary };
export type { ISummary, ISummaryByDate };
