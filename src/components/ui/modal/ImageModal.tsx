import React from "react";
import { Modal } from "../modal/index.js";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string | null;
  alt?: string;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt = "Image",
  title = "Image Preview",
}) => {
  if (!src) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl mx-auto p-0"
      showCloseButton={true}
    >
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
