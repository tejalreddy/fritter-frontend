import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties of the follow concept
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followerName: string;
  followedId: Types.ObjectId;
  followedName: string;
};

// Mongoose schema defintion
const FollowSchema = new Schema<Follow>({
  // The followerId
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followerName: {
    type: String,
    required: true,
  },
  // The followerId
  followedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followedName: {
    type: String,
    required: true,
  },
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
