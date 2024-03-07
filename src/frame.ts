import type { Schema } from "./schema";

export type Frame = {
  root: Schema;
  schema: Schema;
  pathStack: string[];
  data: any;
}

export function createFrame (schema: Schema, data: any = {}) {
  return {
    schema, data,
    root: schema,
    pathStack: [],
  };
}