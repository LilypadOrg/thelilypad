import Image from 'next/image';
import { useRef, useState, WheelEvent } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import Modal from '../Modal';
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from '~/utils/canvasPreview';

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

const ImageInput = ({
  label,
  error,
  register,
}: {
  label: string;
  error: FieldError | undefined;
  register: UseFormRegisterReturn;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [imgSrc, setImgSrc] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropCompleted, setIsCropCompleted] = useState(false);
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

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      setIsCropCompleted(false);
      setScale(1);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onScroll = (e: WheelEvent<HTMLDivElement>) => {
    // document.body.classList.add('no-scroll');
    let newScale = scale + e.deltaY * -0.0005;
    if (newScale > 3) newScale = 3;
    if (newScale < 0.5) newScale = 0.5;

    setScale(newScale);
  };

  const applyCrop = () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      console.log('cropping');
      // We use canvasPreview as it's much faster than imgPreview.
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
      setIsCropCompleted(true);
    }
    setShowModal(false);
  };

  return (
    <>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        {!!imgSrc && (
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
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <button onClick={applyCrop}>Apply Crop</button>
          </div>
        )}
      </Modal>
      <div className="flex flex-col gap-4">
        <label className="font-bold uppercase tracking-widest">{label}</label>
        <div className="flex flex-col items-start gap-y-4">
          <input
            type="file"
            {...register}
            accept="image/*"
            onChange={onSelectFile}
          />
          <div>
            {imgSrc && !isCropCompleted && (
              <Image
                src={imgSrc}
                width={320}
                height={180}
                alt="Image Preview"
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
          </div>
          {imgSrc && (
            <button type="button" onClick={() => setShowModal(true)}>
              Crop image
            </button>
          )}
        </div>
        {error && <span>{error.message}</span>}
      </div>
    </>
  );
};

export default ImageInput;
