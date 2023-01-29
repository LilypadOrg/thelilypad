import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  PROJECTS_IMAGE_PATH,
  PROJECT_DESC_MAX_LENGTH,
  PROJECT_DESC_MIN_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_NAME_MIN_LENGTH,
} from '~/utils/constants';
import formidable from 'formidable';
import { prisma } from '~/server/prisma';
import { getImageExtFromType, slugify } from '~/utils/formatters';
import fs from 'fs';
import { defaultProjectSelect } from '~/server/routers/projects';

export const config = {
  api: {
    bodyParser: false,
  },
};

const reqDataSchema = z.object({
  author: z
    .string()
    .min(PROJECT_NAME_MIN_LENGTH, {
      message: `Author name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
    })
    .max(PROJECT_NAME_MAX_LENGTH, {
      message: `Author name can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  title: z
    .string()
    .min(PROJECT_NAME_MIN_LENGTH, {
      message: `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
    })
    .max(PROJECT_NAME_MAX_LENGTH, {
      message: `Project name can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  description: z
    .string()
    .min(PROJECT_DESC_MIN_LENGTH, {
      message: `Description must be at least ${PROJECT_DESC_MIN_LENGTH} characters`,
    })
    .max(PROJECT_DESC_MAX_LENGTH, {
      message: `Description can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  url: z.string().url(),
  codeUrl: z.string().url().optional(),
  image: z
    .custom<formidable.File>()
    .refine((file) => {
      return file.size <= MAX_FILE_SIZE;
    }, `Max file size is ${MAX_FILE_SIZE / 1000000} MB.`)
    .refine(
      (file) => file.mimetype && ACCEPTED_IMAGE_TYPES.includes(file.mimetype),
      `${ACCEPTED_IMAGE_TYPES.join(',')} files are accepted.`
    ),
  techs: z.number().array(),
  tags: z.number().array(),
});

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (Array.isArray(files.image)) {
      return res.status(401).send('Unauthorized');
    }
    const image = files.image;

    ({ image });
    fields['techs'] = Array.isArray(fields['techs'])
      ? JSON.parse(fields['techs'][0])
      : JSON.parse(fields['techs']);
    fields['tags'] = Array.isArray(fields['tags'])
      ? JSON.parse(fields['tags'][0])
      : JSON.parse(fields['tags']);
    ({ fields });
    try {
      const validFields = reqDataSchema.parse({
        ...fields,
        image,
      });

      const slug = slugify(validFields.title);
      const extension = getImageExtFromType(image.mimetype || '');
      const outputFilename = `${slug}-${new Date().getTime()}${extension}`;
      console.log(outputFilename);
      await saveFile(image, './public' + PROJECTS_IMAGE_PATH + outputFilename);

      const project = await prisma.communityProject.create({
        data: {
          author: validFields.author,
          codeUrl: validFields.codeUrl || null,
          submittedBy: { connect: { id: session.user.userId } },
          content: {
            create: {
              title: validFields.title,
              slug,
              description: validFields.description,
              url: validFields.url,
              coverImageUrl: outputFilename,
              contentType: { connect: { name: 'Community Project' } },
              technologies: {
                connect: validFields.techs.map((l) => ({ id: l })),
              },
              tags: { connect: validFields.tags.map((l) => ({ id: l })) },
            },
          },
        },
        // TODO: Move defaultSelect outside of roouters
        select: defaultProjectSelect,
      });

      return res.status(201).json(project);
    } catch (error) {
      return res.status(400);
    }
  });
};

const saveFile = async (file: formidable.File, fileName: string) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(fileName, data);
  fs.unlinkSync(file.filepath);
  return;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('');
};

export default handler;
