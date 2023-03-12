import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PROJECTS_IMAGE_PATH } from './constants';

const deleteFile = async (path: string) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

export const deleteProjectImage = async (imageName: string) => {
  const imagePath = path.join('./public', PROJECTS_IMAGE_PATH, imageName);
  deleteFile(imagePath);
};

export const saveFormFile = async (file: formidable.File, fileName: string) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(fileName, data);
  fs.unlinkSync(file.filepath);
  return;
};
