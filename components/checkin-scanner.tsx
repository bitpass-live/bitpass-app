'use client';

import { useState, useRef, useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QrCodeIcon as QrScanIcon, CheckIcon, XIcon, CameraIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { TicketsTable } from './tickets-table';

export function CheckinScanner() {
  const [reference, setReference] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    reference?: string;
  } | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const { toast } = useToast();

  // Check if camera is available
  useEffect(() => {
    if (navigator.mediaDevices) {
      setHasCamera(true);
    }
  }, []);

  // Function to start camera
  const startCamera = async () => {
    if (!hasCamera) {
      toast({
        title: 'Camera not available',
        description: "Your device doesn't have a camera or browser permissions are not granted.",
        variant: 'destructive',
      });
      return;
    }

    setShowCameraModal(true);
    setIsScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraPermission(true);
        scanQRCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraPermission(false);
      setIsScanning(false);
      setShowCameraModal(false);
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera access to scan QR codes.',
        variant: 'destructive',
      });
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
      setShowCameraModal(false);
    }
  };

  // Function to scan QR code from video stream
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Check if video is playing
    if (video.readyState === video.HAVE_ENOUGH_DATA && isScanning) {
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Here we would normally use a QR code scanning library
      // For this demo, we'll simulate finding a QR code after a delay
      setTimeout(() => {
        if (isScanning) {
          // TO-DO
          // Simulate finding a random valid ticket

          toast({
            title: 'No valid tickets',
            description: 'No valid tickets found to scan.',
            variant: 'destructive',
          });
          stopCamera();
        }
      }, 2000);
    }

    // Continue scanning if still in scanning mode
    if (isScanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleManualCheckin = (ref = reference) => {
    if (!ref) {
      toast({
        title: 'Missing reference',
        description: 'Please enter a ticket reference code.',
        variant: 'destructive',
      });
      return;
    }

    // TO-DO
    // CHECKIN TICKET

    setLastResult({
      success: false,
      message: 'Invalid or already used ticket.',
      reference: ref.toUpperCase(),
    });

    toast({
      title: 'Check-in failed',
      description: 'Invalid or already used ticket.',
      variant: 'destructive',
    });

    // Close camera modal if open
    if (showCameraModal) {
      stopCamera();
    }

    setReference('');
  };

  return (
    <div className='mx-auto'>
      {/* Highlighted Search Bar */}
      <div className='mb-8 w-full max-w-2xl mx-auto'>
        <div className='relative'>
          {/* Background with enhanced glow effect */}
          <div className='absolute -inset-1 bg-fluorescent-yellow rounded-xl blur-md opacity-70'></div>

          {/* Main search container */}
          <div className='relative flex items-center bg-background rounded-xl shadow-2xl border border-border overflow-hidden p-1'>
            {/* Search icon */}
            <div className='pl-4'>
              <SearchIcon className='h-6 w-6 text-muted-foreground' />
            </div>

            {/* Input field */}
            <Input
              id='reference'
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder='Search ticket by reference code...'
              className='flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg text-foreground placeholder:text-muted-foreground py-6 px-3'
            />

            {/* Filter button */}
            <Button
              onClick={() => handleManualCheckin()}
              size='icon'
              variant='ghost'
              className='h-12 w-12 rounded-lg mr-1 text-muted-foreground hover:text-foreground hover:bg-muted'
            >
              <FilterIcon className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Button>
          </div>
        </div>

        {/* Subtle instruction text */}
        <p className='text-xs text-center mt-3 text-muted-foreground'>Enter ticket reference code or scan QR below</p>
      </div>

      {/* Camera section */}
      <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md border-gray-700 bg-gray-900 mb-8'>
        <div className='text-center'>
          <CameraIcon className='h-16 w-16 mx-auto text-gray-400' />
          <p className='mt-2 text-gray-300'>Ready to scan</p>
          <div className='flex flex-wrap gap-2 justify-center mt-4'>
            <Button
              onClick={startCamera}
              className='bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-0'
            >
              Start Camera
            </Button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className='mb-8'>
        <TicketsTable />
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center'>
          <div className='relative w-full h-full md:w-auto md:h-auto md:max-w-2xl md:max-h-[80vh]'>
            <div className='absolute top-4 right-4 z-10'>
              <Button
                variant='secondary'
                size='icon'
                className='rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                onClick={stopCamera}
              >
                <XIcon className='h-5 w-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </div>

            <div className='w-full h-full md:rounded-lg overflow-hidden'>
              <div className='relative w-full h-full'>
                <video ref={videoRef} className='w-full h-full object-cover' playsInline />
                <canvas ref={canvasRef} className='absolute top-0 left-0 w-full h-full hidden' />

                {/* Enhanced scanning overlay */}
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                  <div className='w-64 h-64 border-2 border-white rounded-lg opacity-70'></div>
                  <div className='absolute'>
                    <div className='animate-pulse'>
                      <QrScanIcon className='h-24 w-24 text-white drop-shadow-lg' />
                    </div>
                  </div>
                </div>

                <div className='absolute bottom-8 left-0 right-0 text-center'>
                  <p className='text-white text-lg font-medium drop-shadow-lg'>Position QR code in the center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {lastResult && (
        <Card
          className={`mt-6 ${lastResult.success ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10'}`}
        >
          <CardHeader className={lastResult.success ? 'border-b border-green-200' : 'border-b border-red-200'}>
            <div className='flex items-center gap-2'>
              {lastResult.success ? (
                <CheckIcon className='h-5 w-5 text-green-500' />
              ) : (
                <XIcon className='h-5 w-5 text-red-500' />
              )}
              <CardTitle className={lastResult.success ? 'text-green-500' : 'text-red-500'}>
                {lastResult.success ? 'Success' : 'Failed'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='pt-4'>
            <p className='text-gray-300'>{lastResult.message}</p>
            {lastResult.reference && <p className='mt-2 font-mono font-bold text-white'>{lastResult.reference}</p>}
            {lastResult.success && (
              <div className='mt-4 p-2 bg-gray-800 rounded text-sm'>
                <p className='font-medium text-gray-300'>Ticket Details:</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
