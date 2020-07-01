import knex from '../../database/config';

export default async function isFollowing(id: string, followId: string): Promise<boolean> {
  const idFollowingFollowId = await knex('following').where({
    userId: id,
    followId
  });
  return idFollowingFollowId.length !== 0;
}
