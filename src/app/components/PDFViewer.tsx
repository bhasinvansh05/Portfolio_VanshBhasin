import { useState } from 'react';
import { Button } from './ui/button';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

export function PDFViewer() {
  const [zoom, setZoom] = useState(100);

  const baseUrl = (import.meta as any).env.BASE_URL as string;
  const pdfUrl = `${baseUrl}Resume_Vansh.pdf`;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Resume_Vansh.pdf';
    link.click();
  };

  const handleFullscreen = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="hover:bg-indigo-500/20 hover:text-indigo-300"
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-3 py-1 rounded-lg bg-background/50">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="hover:bg-indigo-500/20 hover:text-indigo-300"
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="hover:bg-violet-500/20 hover:text-violet-300"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Full Screen
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/25"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </motion.div>

      {/* PDF Viewer Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/10"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        }}
      >
        {/* Decorative gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 blur-xl -z-10" />
        
        <div className="bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div 
            className="w-full overflow-auto"
            style={{ 
              height: '800px',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Resume PDF Viewer"
              style={{ minHeight: '800px' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Info text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="text-center text-muted-foreground mt-4 text-sm"
      >
        Use the controls above to zoom, view fullscreen, or download the PDF
      </motion.p>
    </div>
  );
}
