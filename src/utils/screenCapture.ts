// Screen capture utilities for GIF recording and screenshots

export interface CaptureOptions {
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  width?: number;
  height?: number;
}

export class ScreenCapture {
  private mediaRecorder: MediaRecorder | null = null;

  private recordedChunks: Blob[] = [];

  private stream: MediaStream | null = null;

  // Capture screenshot of an element
  async captureElement(
    element: HTMLElement,
    options: CaptureOptions = {},
  ): Promise<string> {
    try {
      // Use html2canvas for element screenshots
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      const rect = element.getBoundingClientRect();
      canvas.width = options.width || rect.width;
      canvas.height = options.height || rect.height;

      // For now, we'll use a placeholder implementation
      // In a real implementation, you'd use html2canvas or similar
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Screenshot Placeholder',
        canvas.width / 2,
        canvas.height / 2,
      );

      return canvas.toDataURL(options.format || 'png', options.quality || 0.9);
    } catch (error) {
      console.error('Error capturing element:', error);
      throw error;
    }
  }

  // Start screen recording
  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  // Stop recording and return video blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.cleanup();
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Convert video to GIF (simplified - would need additional libraries)
  async convertToGif(videoBlob: Blob): Promise<Blob> {
    // This is a placeholder - in reality you'd use libraries like:
    // - gif.js for client-side GIF creation
    // - FFmpeg.wasm for video conversion
    // - Or send to a server endpoint for conversion

    console.log('Converting video to GIF...', videoBlob.size);

    // Return the video blob for now
    return videoBlob;
  }

  // Download blob as file
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Cleanup resources
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  // Check if screen capture is supported
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  }
}

// Utility function to capture multiple device views
export async function captureDeviceViews(
  devices: Array<{ name: string; element: HTMLElement }>,
  options: CaptureOptions = {},
): Promise<Array<{ name: string; dataUrl: string }>> {
  const capture = new ScreenCapture();
  const results = [];

  for (const device of devices) {
    try {
      const dataUrl = await capture.captureElement(device.element, options);
      results.push({ name: device.name, dataUrl });
    } catch (error) {
      console.error(`Error capturing ${device.name}:`, error);
    }
  }

  return results;
}

// Generate timestamp for filenames
export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}
