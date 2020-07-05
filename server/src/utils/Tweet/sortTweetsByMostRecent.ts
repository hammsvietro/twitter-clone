export default function sortTweetsByMostRecent(tweets: object[]): object[] {
  
  tweets.sort((a: any, b: any) => {
    const dateA: any = new Date(a.time);
    const dateB: any = new Date(b.time);
    return dateB - dateA;
  });

  return tweets;
}
