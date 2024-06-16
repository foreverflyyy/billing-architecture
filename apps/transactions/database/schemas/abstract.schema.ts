import {Prop, Schema} from '@nestjs/mongoose';
import mongoose, {SchemaTypes, Types} from 'mongoose';

@Schema()
export class AbstractSchema {
    @Prop({type: SchemaTypes.ObjectId, default: new mongoose.Types.ObjectId()})
    _id: Types.ObjectId;
}