import type { Schema } from "./schema";

export type Frame = {
  root: Schema;
  schema: Schema;
  pathStack: string[];
  data: any;
}