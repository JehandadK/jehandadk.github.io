import clsx from 'clsx';
import { type FC, useEffect, useRef, useState } from 'react';

import { generateTimestamp, ScreenCapture } from '../utils/screenCapture';

interface DeviceSize {
  name: string;
  width: number;
  height: number;
  icon: string;
}

const deviceSizes: DeviceSize[] = [
  { name: 'Mobile', width: 375, height: 667, icon: '📱' },
  { name: 'Tablet', width: 768, height: 1024, icon: '📱' },
  { name: 'Laptop', width: 1024, height: 768, icon: '💻' },
  { name: 'Desktop', width: 1440, height: 900, icon: '🖥️' },
  { name: 'Large', width: 1920, height: 1080, icon: '🖥️' },
];

interface DevicePreviewProps {
  url?: string;
}

const DevicePreview: FC<DevicePreviewProps> = ({
  url = 'http://localhost:4005',
}) => {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([
    'Mobile',
    'Tablet',
    'Desktop',
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [captureSupported, setCaptureSupported] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const screenCapture = useRef<ScreenCapture>(new ScreenCapture());
  const recordingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setCaptureSupported(ScreenCapture.isSupported());
  }, []);

  const toggleDevice = (deviceName: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceName)
        ? prev.filter((d) => d !== deviceName)
        : [...prev, deviceName],
    );
  };

  const captureScreenshot = async (deviceName: string) => {
    try {
      const deviceElement = document.querySelector(
        `[data-device="${deviceName}"]`,
      ) as HTMLElement;
      if (!deviceElement) {
        alert('Device preview not found');
        return;
      }

      const dataUrl = await screenCapture.current.captureElement(deviceElement);
      const timestamp = generateTimestamp();

      // Convert data URL to blob and download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      screenCapture.current.downloadBlob(
        blob,
        `${deviceName}-${timestamp}.png`,
      );

      console.log(`Screenshot captured for ${deviceName}`);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Error capturing screenshot. Please try again.');
    }
  };

  const startRecording = async () => {
    if (!captureSupported) {
      alert('Screen recording is not supported in this browser');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      await screenCapture.current.startRecording();
      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      alert('Error starting recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      const videoBlob = await screenCapture.current.stopRecording();
      const timestamp = generateTimestamp();

      // Download the video
      screenCapture.current.downloadBlob(
        videoBlob,
        `portfolio-demo-${timestamp}.webm`,
      );

      // Optionally convert to GIF (placeholder for now)
      // const gifBlob = await screenCapture.current.convertToGif(videoBlob);
      // screenCapture.current.downloadBlob(gifBlob, `portfolio-demo-${timestamp}.gif`);

      console.log('Recording completed and downloaded');
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Error stopping recording');
    } finally {
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">
      {/* Header Controls */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          📱 Device Preview Studio
        </h1>

        {/* Theme Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme:
          </label>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={clsx(
              'rounded-lg px-4 py-2 font-medium transition-colors',
              theme === 'light'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200',
            )}
          >
            {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Device Selection */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Devices to Preview:
          </label>
          <div className="flex flex-wrap gap-2">
            {deviceSizes.map((device) => (
              <button
                key={device.name}
                onClick={() => toggleDevice(device.name)}
                className={clsx(
                  'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
                  selectedDevices.includes(device.name)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
                )}
              >
                <span>{device.icon}</span>
                <span>{device.name}</span>
                <span className="text-xs opacity-75">
                  {device.width}×{device.height}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-wrap gap-4">
          {captureSupported ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors',
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600',
              )}
            >
              {isRecording ? (
                <>🔴 Stop Recording ({formatTime(recordingTime)})</>
              ) : (
                '🎬 Start Screen Recording'
              )}
            </button>
          ) : (
            <div className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-400 px-6 py-3 font-medium text-white">
              ❌ Screen Recording Not Supported
            </div>
          )}

          <button
            onClick={() => {
              selectedDevices.forEach((device) => captureScreenshot(device));
            }}
            className="flex items-center gap-2 rounded-lg bg-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-600"
          >
            📸 Capture All Screenshots
          </button>

          <button
            onClick={() => window.open(url, '_blank')}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
          >
            🚀 Open Full Site
          </button>
        </div>
      </div>

      {/* Device Previews Grid */}
      <div className="grid gap-8">
        {selectedDevices.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            Select at least one device to preview
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {selectedDevices.map((deviceName) => {
              const device = deviceSizes.find((d) => d.name === deviceName)!;
              const scale = Math.min(400 / device.width, 300 / device.height);

              return (
                <div
                  key={deviceName}
                  className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
                  data-device={deviceName}
                >
                  {/* Device Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{device.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {device.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {device.width} × {device.height}px
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => captureScreenshot(deviceName)}
                      className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
                    >
                      📸 Capture
                    </button>
                  </div>

                  {/* Device Frame */}
                  <div
                    className="relative mx-auto rounded-lg bg-gray-900 p-2"
                    style={{
                      width: device.width * scale + 16,
                      height: device.height * scale + 16,
                    }}
                  >
                    {/* Screen */}
                    <div
                      className="relative overflow-hidden rounded bg-white"
                      style={{
                        width: device.width * scale,
                        height: device.height * scale,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <iframe
                        src={`${url}${theme === 'dark' ? '?theme=dark' : ''}`}
                        className="size-full border-0"
                        style={{
                          width: device.width,
                          height: device.height,
                          transform: `scale(${1 / scale})`,
                          transformOrigin: 'top left',
                        }}
                        title={`${deviceName} Preview`}
                      />

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                          <div className="size-2 animate-pulse rounded-full bg-white"></div>
                          REC {formatTime(recordingTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scale: {Math.round(scale * 100)}% • Viewport:{' '}
                      {device.width}×{device.height}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
          📋 How to Use:
        </h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>
            • Select devices to preview your website across different screen
            sizes
          </li>
          <li>• Toggle between light and dark themes to test both modes</li>
          <li>• Use &quot;Start Screen Recording&quot; to capture your entire screen (including animations)</li>
          <li>• Click &quot;Capture&quot; on individual devices for screenshots</li>
          <li>• All previews update in real-time as you make changes</li>
          <li>• Files are automatically downloaded to your Downloads folder</li>
        </ul>
      </div>
    </div>
  );
};

export default DevicePreview;
