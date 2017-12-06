import { PCExpression } from "./ast";

/*
const inference = 
*/

export enum InferredTypeKind {
  STRING,
  NUMBER,
  ARRAY,
  OBJECT,
};

export type Inference = {
  types: InferredTypeKind;
}

export type InferredString = {
  
} & Inference;


export type InferredAny = {
  
} & Inference;

export const inferTypes = 