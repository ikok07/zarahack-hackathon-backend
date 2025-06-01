import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import * as fs from "node:fs";
import path from "node:path";

export class VideoProcessor {
  private currentVideoPath: string | undefined;
  framerate = 30;

  /**
   * Combines numbered images (1.jpg, 2.jpg, etc.) into a video
   */
  async combineImages(imagesFolder: string, outputPath: string): Promise<void> {
    const imageFiles = fs.readdirSync(imagesFolder)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.split('.')[0]);
        const numB = parseInt(b.split('.')[0]);
        return numA - numB;
      });

    if (imageFiles.length === 0) {
      throw new Error('No image files found in the folder');
    }

    console.log(`Found ${imageFiles.length} images`);
    console.log('Creating video...');

    const inputPattern = path.join(imagesFolder, '%d.jpg');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPattern)
        .inputOptions([
          '-framerate', this.framerate.toString(),
          '-start_number', '1'
        ])
        .videoCodec('libx264')
        .outputOptions([
          '-pix_fmt', 'yuv420p',
          '-crf', '23'
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}% done`);
        })
        .on('end', () => {
          console.log('Video created successfully:', outputPath);
          this.currentVideoPath = outputPath;
          resolve();
        })
        .on('error', (err) => {
          console.error('Error creating video:', err.message);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Combines audio with the previously created video
   * Must call combineImages first
   */
  async combineAudioVideo(audioPath: string, outputPath: string): Promise<void> {
    if (!this.currentVideoPath || !fs.existsSync(this.currentVideoPath)) {
      throw new Error("No video file available! Call combineImages first and ensure the video was created successfully.");
    }

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    console.log('Combining video with audio...');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(this.currentVideoPath!)
        .input(audioPath)
        .outputOptions([
          '-map', '0:v:0', // use video from first input
          '-map', '1:a:0', // use audio from second input
          '-c:v', 'copy',  // copy video codec (no re-encoding)
          '-c:a', 'aac',   // encode audio to AAC
          '-shortest'      // stop encoding when shortest stream ends
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}% done`);
        })
        .on('end', () => {
          console.log('Audio-video combination completed:', outputPath);
          this.currentVideoPath = outputPath;
          resolve();
        })
        .on('error', (err) => {
          console.error('Error combining audio-video:', err.message);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Combines images and audio in one step (more efficient)
   */
  async combineImagesWithAudio(
    imagesFolder: string,
    audioPath: string,
    outputPath: string
  ): Promise<void> {
    const imageFiles = fs.readdirSync(imagesFolder)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.split('.')[0]);
        const numB = parseInt(b.split('.')[0]);
        return numA - numB;
      });

    if (imageFiles.length === 0) {
      throw new Error('No image files found in the folder');
    }

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    console.log(`Found ${imageFiles.length} images`);
    console.log('Creating video with audio...');

    const inputPattern = path.join(imagesFolder, '%d.jpg');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPattern)
        .inputOptions([
          '-framerate', this.framerate.toString(),
          '-start_number', '1'
        ])
        .input(audioPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-pix_fmt', 'yuv420p',
          '-crf', '23',
          '-shortest'
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}% done`);
        })
        .on('end', () => {
          console.log('Video with audio created successfully:', outputPath);
          this.currentVideoPath = outputPath;
          resolve();
        })
        .on('error', (err) => {
          console.error('Error creating video:', err.message);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Alternative method for images that aren't perfectly numbered
   */
  async combineImagesFlexible(
    imagesFolder: string,
    outputPath: string,
    imageExtension: string = 'jpg'
  ): Promise<void> {
    const imageFiles = fs.readdirSync(imagesFolder)
      .filter(file => new RegExp(`\\.(${imageExtension}|jpeg|png)$`, 'i').test(file))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    if (imageFiles.length === 0) {
      throw new Error('No image files found in the folder');
    }

    console.log(`Found ${imageFiles.length} images`);
    console.log('Creating video from image list...');

    // Create temporary file list for FFmpeg concat
    const fileListPath = path.join(imagesFolder, 'temp_filelist.txt');
    const fileListContent = imageFiles
      .map(file => `file '${path.resolve(imagesFolder, file)}'`)
      .join('\n');

    fs.writeFileSync(fileListPath, fileListContent);

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(fileListPath)
        .inputOptions([
          '-f', 'concat',
          '-safe', '0'
        ])
        .outputOptions([
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-r', this.framerate.toString(),
          '-crf', '23'
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${Math.round(progress.percent || 0)}% done`);
        })
        .on('end', () => {
          console.log('Video created successfully:', outputPath);
          this.currentVideoPath = outputPath;
          // Clean up temp file
          if (fs.existsSync(fileListPath)) {
            fs.unlinkSync(fileListPath);
          }
          resolve();
        })
        .on('error', (err) => {
          console.error('Error creating video:', err.message);
          // Clean up temp file
          if (fs.existsSync(fileListPath)) {
            fs.unlinkSync(fileListPath);
          }
          reject(err);
        })
        .run();
    });
  }

  /**
   * Get the path of the currently processed video
   */
  getCurrentVideoPath(): string | undefined {
    return this.currentVideoPath;
  }

  /**
   * Set framerate for video creation
   */
  setFramerate(fps: number): void {
    this.framerate = fps;
  }

  /**
   * Reset the processor state
   */
  reset(): void {
    this.currentVideoPath = undefined;
  }
}

// Usage examples:
/*

// Basic usage - images only
const processor = new VideoProcessor();
await processor.combineImages('./images', './output.mp4');

// Two-step process - images then audio
const processor2 = new VideoProcessor();
await processor2.combineImages('./images', './temp_video.mp4');
await processor2.combineAudioVideo('./audio.mp3', './final_video.mp4');

// One-step process - images with audio (recommended)
const processor3 = new VideoProcessor();
await processor3.combineImagesWithAudio('./images', './audio.mp3', './final_video.mp4');

// Flexible method for non-sequential numbering
const processor4 = new VideoProcessor();
processor4.setFramerate(24);
await processor4.combineImagesFlexible('./images', './output.mp4', 'png');

// Error handling
try {
  const processor5 = new VideoProcessor();
  await processor5.combineImagesWithAudio('./images', './audio.mp3', './video.mp4');
  console.log('Success! Video created at:', processor5.getCurrentVideoPath());
} catch (error) {
  console.error('Failed to create video:', error.message);
}

*/