import { IUser } from '../../database/models';

export default function serializeUsers(users: IUser[], baseUrl: string) {

  return users.map((user) => {
    if(user.profilePhotoThumbnail === null || user.profilePhoto === null) return user;

    user.profilePhoto = `${baseUrl}${user.profilePhoto}`;
    user.profilePhotoThumbnail = `${baseUrl}${user.profilePhotoThumbnail}`;

    return user;
  });

}
