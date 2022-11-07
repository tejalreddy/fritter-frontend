import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  following?: Types.ObjectId[];
  followers?: Types.ObjectId[];
  likes?: Types.ObjectId[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  }
});

// (virtual-population)
// Auto-populate a User.following field with any followings where User._id == Follow.followerId
UserSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followerId'
});

// (virtual-population)
// Auto-populate a User.followers with any followings where User._id == Follow.followedId
UserSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followedId'
});

// (virtual-population)
// Auto-populate a User.likes with any followings where User._id == Like.userId
UserSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'userId'
});

UserSchema.set('toObject', {virtuals: true});
UserSchema.set('toJSON', {virtuals: true});
const UserModel = model<User>('User', UserSchema);
export default UserModel;
