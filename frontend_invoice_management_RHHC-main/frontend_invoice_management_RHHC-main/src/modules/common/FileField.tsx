import { FormGroup } from '@mui/material';
import { FormikValues, getIn, useFormikContext } from 'formik';
import Image from 'next/image';
import React from 'react';
import { config } from './config';
import TextField from './text-field';

// Allowed file types: separate image and PDF for flexible usage
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const PDF_MIME_TYPES = ['application/pdf'];
const PDF_EXTENSIONS = ['.pdf'];

export type FileAcceptType = 'images' | 'imagesAndPdf';

type FileInputProps<T extends FormikValues> = {
  name: keyof T | string;
  label: string;
  initialVal?: string | null;
  width?: number;
  height?: number;
  disabled?: boolean;
  /** "images" = only JPG/PNG (e.g. logo, stamp). "imagesAndPdf" = images + PDF (e.g. Aadhar, PAN, documents). */
  accept?: FileAcceptType;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'type' | 'disabled' | 'onChange'
>;

const FileUploadField = <T extends FormikValues>({
  name,
  label,
  initialVal = null,
  width = 100,
  height = 100,
  disabled = false,
  accept = 'imagesAndPdf',
}: FileInputProps<T>) => {
  const { setFieldValue, setFieldError, values } = useFormikContext<T>();
  const fieldName = String(name);

  const value = getIn(values, fieldName);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [fileType, setFileType] = React.useState<'image' | 'pdf' | null>(null);

  const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
  const allowedMimeTypes =
    accept === 'images'
      ? IMAGE_MIME_TYPES
      : [...IMAGE_MIME_TYPES, ...PDF_MIME_TYPES];
  const allowedExtensions =
    accept === 'images'
      ? IMAGE_EXTENSIONS
      : [...IMAGE_EXTENSIONS, ...PDF_EXTENSIONS];
  const typeErrorLabel =
    accept === 'images'
      ? 'Allowed types: JPG, JPEG, PNG.'
      : 'Allowed types: JPG, JPEG, PNG, PDF.';

  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      // Determine file type from File object
      if (value.type === 'application/pdf') {
        setFileType('pdf');
      } else if (value.type.startsWith('image/')) {
        setFileType('image');
      } else {
        // Fallback: check extension
        const ext = value.name.slice(value.name.lastIndexOf('.')).toLowerCase();
        setFileType(ext === '.pdf' ? 'pdf' : 'image');
      }
      return () => URL.revokeObjectURL(objectUrl);
    } else if (value) {
      const url = `${config.api.baseUrl}${value}`;
      setPreview(url);
      // Determine file type from URL extension
      const ext = String(value)
        .slice(String(value).lastIndexOf('.'))
        .toLowerCase();
      setFileType(ext === '.pdf' ? 'pdf' : 'image');
    } else if (initialVal) {
      const url = `${config.api.baseUrl}${initialVal}`;
      setPreview(url);
      // Determine file type from URL extension
      const ext = String(initialVal)
        .slice(String(initialVal).lastIndexOf('.'))
        .toLowerCase();
      setFileType(ext === '.pdf' ? 'pdf' : 'image');
    } else {
      setPreview(null);
      setFileType(null);
    }
  }, [value, initialVal]);

  return (
    <FormGroup sx={{ marginBottom: 5 }}>
      <TextField
        type="file"
        fullWidth
        label={label}
        name={fieldName}
        slotProps={{
          htmlInput: {
            accept: allowedExtensions.join(','),
          },
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Clear any previous errors
            setFieldError(fieldName, undefined);

            // Size validation
            if (file.size > MAX_FILE_SIZE_BYTES) {
              setFieldError(fieldName, 'File size must be 3MB or less.');
              // Reset the input so user can choose again
              e.target.value = '';
              return;
            }

            // Type / extension validation (defensive: check both mime and extension)
            const mimeOk = allowedMimeTypes.includes(file.type);
            const extension = file.name
              .slice(file.name.lastIndexOf('.'))
              .toLowerCase();
            const extOk = allowedExtensions.includes(extension);

            if (!mimeOk && !extOk) {
              setFieldError(fieldName, `Invalid file type. ${typeErrorLabel}`);
              e.target.value = '';
              return;
            }

            // Clear error and set the file
            setFieldError(fieldName, undefined);
            setFieldValue(fieldName, file);
          } else {
            setFieldValue(fieldName, initialVal);
          }
        }}
        disabled={disabled}
        // {...rest}
      />
      {!disabled && preview && (
        <div
          style={{
            width,
            height,
            position: 'relative',
            marginTop: 8,
            marginBottom: 10,
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 2,
          }}
        >
          {fileType === 'pdf' ? (
            <iframe
              src={preview}
              title={`${label} Preview`}
              style={{
                width: '100%',
                height: '100%',
                border: '1px solid #ddd',
                borderRadius: 6,
              }}
            />
          ) : (
            <Image
              src={preview}
              alt={`${label} Preview`}
              fill
              style={{
                borderRadius: 6,
              }}
            />
          )}
        </div>
      )}
    </FormGroup>
  );
};

export default FileUploadField;
