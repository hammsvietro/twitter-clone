import fs from 'fs';
import path from 'path';

export default function deleteFilesIfExists(files: string[]):void {
  files.map((file) => {
    if(file === null) {
      return;
    }
    
    fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'uploads', file));
  });
}
