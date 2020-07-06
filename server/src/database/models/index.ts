export interface IUser {
  id?: number;
  
  // followers (users - (n)followers(m) - user) 
  // following (users - (n)following(m) - user) 

  name: string;
  username: string; // @
  email: string;
  password: string;
  profilePhoto?: string; // path
  profilePhotoThumbnail?: string;
  darkThemeActive: boolean;  
}

export interface ITweet {
  // id => PK
  // hasMany replies;
  // mainTweetId => FK {1:1} | Nullable
  // userId => FK {1:1}
  
  id?: number;
  content: string;
  media: string; // path
  likes: number; // int
  retweets: number;
  time: Date;
  isMention?: boolean;
  isReply?: boolean;
  mainTweetId?: number;
}
