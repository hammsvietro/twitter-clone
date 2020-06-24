export interface IUser {
  id?: number;
  name: string;
  username: string; // @
  email: string;
  password: string;
  profilePhoto?: string; // path
  darkThemeActive: boolean;  
}

export interface ITweet {
  // id => PK
  // hasMany replies;
  // mainTweetId => FK {1:1} | Nullable
  // userId => FK {1:1}
  
  
  content: string;
  media: string; // path
  likes: number; // int
  retweets: number;
  time: Date;
  isMention?: boolean;
  isReply?:boolean;
}
