import { model, Schema, Types } from 'mongoose';

export interface ProdAR {
  title: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  content: string;
  photo: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  exposed: boolean;
}

export const ProdARSchema = new Schema<ProdAR>({
  title: { type: 'String', required: true },
  positionX: { type: 'Number', required: true },
  positionY:{ type: 'Number', required: true },
  positionZ:{ type: 'Number', required: true },
  content: { type: 'String', required: true },
  photo: { type: 'String' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  exposed: { type: 'Boolean' },
});

export const ProdARModel = model<ProdAR>('ProdAR', ProdARSchema);