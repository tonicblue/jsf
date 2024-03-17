import type { Schema } from "./schema";

export type Frame = {
  root: Schema;
  schema: Schema;
  schemaPathStack: string[];
  dataPathStack: string[];
  data: any;
}

export function createFrame (schema: Schema, data: any = {}): Frame {
  return {
    schema, data,
    root: schema,
    schemaPathStack: [],
    dataPathStack: [],
  };
}