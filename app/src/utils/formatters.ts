export function slugify(text: string) {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export function limitStrLength(text: string, max_length: number) {
  if (text.length > max_length - 3) {
    return text.substring(0, max_length).trimEnd() + '...';
  } else {
    return text;
  }
}

export const formatAddress = (address: string) => {
  return address.slice(0, 4) + '...' + address.slice(-4);
};

export const formatNumber = (input: string | number, decimals?: number) => {
  //console.log(`Number to format: ${input}`);
  //console.log(`Decimals to format: ${decimals}`);
  let formattedNumber = input.toLocaleString('en-US');
  if (decimals) {
    formattedNumber = input.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  //console.log(`Formatted Number: ${formattedNumber}`);
  return formattedNumber;
};

export const getSBTLocalURL = (level: number) => {
  return `/images/profileSBT/level${level}.jpg`;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const imageExtensions: { [type: string]: string } = {
  'image/bmp': '.bmp',
  'image/cis-cod': '.cod',
  'image/gif': '.gif',
  'image/ief': '.ief',
  'image/jpeg': '.jpg',
  'image/pipeg': '.jfif',
  'image/tiff': '.tif',
  'image/x-cmu-raster': '.ras',
  'image/x-cmx': '.cmx',
  'image/x-icon': '.ico',
  'image/x-portable-anymap': '.pnm',
  'image/x-portable-bitmap': '.pbm',
  'image/x-portable-graymap': '.pgm',
  'image/x-portable-pixmap': '.ppm',
  'image/x-rgb': '.rgb',
  'image/x-xbitmap': '.xbm',
  'image/x-xpixmap': '.xpm',
  'image/x-xwindowdump': '.xwd',
  'image/png': '.png',
  'image/x-jps': '.jps',
  'image/x-freehand': '.fh',
};

export const getImageExtFromType = (imageType: string) => {
  return imageExtensions[imageType];
};

export const getFileFromImageUri = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const file = new File([blob], getImageExtFromType(blob.type), {
    type: blob.type,
  });
  return file;
};
