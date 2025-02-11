import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  artist: Album;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  continuance: string;

  @Prop({ default: 0 })
  number: Number;

}

export const TrackSchema = SchemaFactory.createForClass(Track);