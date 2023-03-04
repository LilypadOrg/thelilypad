import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';
import { canvasPreview } from '~/utils/canvasPreview';
import { ACCEPTED_IMAGE_TYPES } from '~/utils/constants';
import Modal from '~/components/modals/Modal';
// import { InputProps } from './Input';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog } from '@headlessui/react';
import { BiCrop } from 'react-icons/bi';

export type InputProps = {
  id?: string;
  name: string;
  label?: string;
  className?: string;
} & React.ComponentProps<'input'>;

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error?: FieldError | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setImage: (...event: any[]) => void;
  image: File;
} & Omit<InputProps, 'name' | 'onChange' | 'value'>;

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const getFileFromCanvas = (
  canvas: HTMLCanvasElement,
  fileType: string,
  fileName: string
) => {
  return new Promise<File | null>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }

      const file = new File([blob], fileName, {
        type: fileType,
      });
      resolve(file);
    }, fileType);
  });
};

const ImageInput = <TFormValues extends Record<string, unknown>>({
  name,
  // register,
  label,
  error,
  setImage: onChange,
  image: value,
}: // ...props
FormInputProps<TFormValues>) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [imageSrc, setImageSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropCompleted, setIsCropCompleted] = useState(false);
  const firstLoad = useRef(true);
  const [scale, setScale] = useState(1);
  // const [rotate, setRotate] = useState(0);
  const rotate = 0;
  // const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const aspect = 16 / 9;

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  console.log({ value });

  const setNewImage = useCallback((file: File) => {
    setCrop(undefined); // Makes crop preview update between images.
    setIsCropCompleted(false);
    setScale(1);

    const reader = new FileReader();
    reader.addEventListener('load', () =>
      setImageSrc(reader.result?.toString() || '')
    );
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (value && firstLoad.current === true) {
      firstLoad.current = false;
      setNewImage(value);
    }
  }, [value, setNewImage]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // setCrop(undefined); // Makes crop preview update between images.
      // setIsCropCompleted(false);
      // setScale(1);
      onChange(file);
      setNewImage(file);

      // const reader = new FileReader();
      // reader.addEventListener('load', () =>
      //   setImageSrc(reader.result?.toString() || '')
      // );
      // reader.readAsDataURL(file);
    }
  };

  const onScroll = (e: WheelEvent<HTMLDivElement>) => {
    let newScale = scale + e.deltaY * -0.0005;
    if (newScale > 3) newScale = 3;
    if (newScale < 0.5) newScale = 0.5;

    setScale(newScale);
  };

  const applyCrop = async () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current &&
      value
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      // const croppedImage = getCroppedImg(imgRef.current, completedCrop);
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
      const croppedImageFile = await getFileFromCanvas(
        previewCanvasRef.current,
        value.type,
        value.name
      );
      if (croppedImageFile && onChange) {
        setIsCropCompleted(true);
        onChange(croppedImageFile);
      }
    }
    setShowModal(false);
  };

  return (
    <>
      <Modal open={showModal} setOpen={setShowModal}>
        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-secondary-300 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className=" p-4 text-left">
            <div className="flex gap-x-2">
              <div className=" mx-0 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-300 sm:h-10 sm:w-10">
                <BiCrop
                  className="h-6 w-6 text-secondary-500"
                  aria-hidden="true"
                />
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Crop Project Image
              </Dialog.Title>
            </div>
            {!!imageSrc && (
              <div>
                <div onWheelCapture={onScroll}>
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    keepSelection={true}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imageSrc}
                      style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
              </div>
            )}
          </div>
          <div className="bg-secondary-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={applyCrop}
              className="rounded-md border border-gray-300 bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Apply Crop
            </button>
          </div>
        </Dialog.Panel>
      </Modal>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-y-4">
          <div className="flex flex-row items-center gap-x-4">
            {/* <p className="font-bold uppercase tracking-widest">{label}</p> */}
            <label
              htmlFor={name}
              className="cursor-pointer rounded-xl bg-primary-600 py-1 px-2 font-bold text-white hover:bg-primary-500"
            >
              {label}
            </label>
            <input
              id={name}
              className="hidden"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              multiple={false}
              onChange={onSelectFile}
              // {...(register &&
              //   register(name, { onChange: (e) => onSelectFile(e) }))}
            />
            {imageSrc && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="cursor-pointer rounded-xl bg-primary-600 py-1 px-2 font-bold text-white hover:bg-primary-500"
              >
                Crop image
              </button>
            )}
          </div>
          <div>
            {imageSrc && !isCropCompleted && (
              <Image
                src={imageSrc}
                width={320}
                height={180}
                alt="Image Preview"
                objectFit="cover"
              />
            )}
            <canvas
              className={`${isCropCompleted ? 'visible' : 'hidden'}`}
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: 320,
                height: 180,
                // width: completedCrop.width,
                // height: completedCrop.height,
              }}
            />
            {/* {imageSrc && completedCrop && (
              <Output
                imageSrc={imageSrc}
                aspect={aspect}
                croppedArea={completedCrop}
              />
            )} */}
          </div>
        </div>
        {error && (
          <span className="font-bold text-red-600">{error.message}</span>
        )}
      </div>
    </>
  );
};

export default ImageInput;
