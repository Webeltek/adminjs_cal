import { model, Schema, Types } from 'mongoose';

export interface Prod {
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

export const ProdSchema = new Schema<Prod>({
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

export const ProdModel = model<Prod>('Prod', ProdSchema);