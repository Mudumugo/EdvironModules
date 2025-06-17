import multer from 'multer';
import sharp from 'sharp';
import { fileStorage, BUCKETS } from './minioClient';
import { randomUUID } from 'crypto';

// Configure multer for memory storage (files stored in memory before uploading to MinIO)
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed mime types
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    // Video
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp3',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10, // Maximum 10 files per upload
  },
});

// File processing utilities
export class FileProcessor {
  
  static async processImage(buffer: Buffer, options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  }): Promise<Buffer> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 80,
      format = 'jpeg'
    } = options || {};

    return await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format, { quality })
      .toBuffer();
  }

  static async generateThumbnail(buffer: Buffer, size: number = 300): Promise<Buffer> {
    return await sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  static async generateMultipleSizes(buffer: Buffer): Promise<{
    thumbnail: Buffer;
    medium: Buffer;
    large: Buffer;
  }> {
    const [thumbnail, medium, large] = await Promise.all([
      this.generateThumbnail(buffer, 300),
      this.processImage(buffer, { maxWidth: 800, maxHeight: 600 }),
      this.processImage(buffer, { maxWidth: 1920, maxHeight: 1080 })
    ]);

    return { thumbnail, medium, large };
  }
}

// Upload handlers for different content types
export class UploadHandlers {

  static async uploadLibraryResource(
    file: Express.Multer.File,
    metadata: Record<string, string> = {}
  ): Promise<{
    originalUrl: string;
    thumbnailUrl?: string;
    fileId: string;
    metadata: any;
  }> {
    const fileId = randomUUID();
    const fileName = `${fileId}-${file.originalname}`;
    
    // Enhanced metadata
    const enhancedMetadata = {
      ...metadata,
      originalName: file.originalname,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      fileId,
    };

    // Upload original file
    await fileStorage.uploadFile(
      BUCKETS.LIBRARY_RESOURCES,
      fileName,
      file.buffer,
      enhancedMetadata
    );

    const result: any = {
      originalUrl: await fileStorage.generatePresignedUrl(BUCKETS.LIBRARY_RESOURCES, fileName),
      fileId,
      metadata: enhancedMetadata,
    };

    // Generate thumbnail for images
    if (file.mimetype.startsWith('image/')) {
      try {
        const thumbnail = await FileProcessor.generateThumbnail(file.buffer);
        const thumbnailName = `thumb-${fileName}`;
        
        await fileStorage.uploadFile(
          BUCKETS.THUMBNAILS,
          thumbnailName,
          thumbnail,
          { ...enhancedMetadata, type: 'thumbnail' }
        );

        result.thumbnailUrl = await fileStorage.generatePresignedUrl(
          BUCKETS.THUMBNAILS,
          thumbnailName
        );
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    }

    return result;
  }

  static async uploadUserFile(
    userId: string,
    file: Express.Multer.File,
    folder: string = 'general'
  ): Promise<{
    url: string;
    fileId: string;
    metadata: any;
  }> {
    const fileId = randomUUID();
    const fileName = `${userId}/${folder}/${fileId}-${file.originalname}`;
    
    const metadata = {
      userId,
      folder,
      originalName: file.originalname,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      fileId,
    };

    await fileStorage.uploadFile(
      BUCKETS.USER_UPLOADS,
      fileName,
      file.buffer,
      metadata
    );

    return {
      url: await fileStorage.generatePresignedUrl(BUCKETS.USER_UPLOADS, fileName),
      fileId,
      metadata,
    };
  }

  static async uploadProcessedMedia(
    originalFileId: string,
    processedBuffer: Buffer,
    type: 'thumbnail' | 'medium' | 'large',
    metadata: Record<string, string> = {}
  ): Promise<string> {
    const fileName = `${originalFileId}-${type}`;
    
    const enhancedMetadata = {
      ...metadata,
      originalFileId,
      processedType: type,
      processedAt: new Date().toISOString(),
    };

    await fileStorage.uploadFile(
      BUCKETS.PROCESSED_MEDIA,
      fileName,
      processedBuffer,
      enhancedMetadata
    );

    return await fileStorage.generatePresignedUrl(BUCKETS.PROCESSED_MEDIA, fileName);
  }
}

// Error handling middleware for uploads
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 100MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 10 files allowed per upload'
      });
    }
  }
  
  if (err.message.includes('File type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  return res.status(500).json({
    error: 'Upload failed',
    message: 'An error occurred during file upload'
  });
};