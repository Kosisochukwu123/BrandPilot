import { useEffect, useState, useRef } from "react";
import { 
  X, 
  Loader2, 
  Share2, 
  Send, 
  MessageCircle, 
  Instagram, 
  Facebook,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  ExternalLink,
  Smartphone,
  Laptop,
  ArrowRight,
  Check
} from "lucide-react";
import { SpotlightCard } from "@/components/dashboard/overview/motion-primitives";

export type Poster = {
  id: string;
  headline: string | null;
  subheadline: string | null;
  finalUrl: string | null;
  backgroundUrl: string | null;
};

interface PublishPosterDialogProps {
  poster: Poster;
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function PublishPosterDialog({
  poster,
  open,
  onClose,
  triggerRef,
}: PublishPosterDialogProps) {
  const imageUrl = poster.finalUrl ?? poster.backgroundUrl;
  const [caption, setCaption] = useState(
    [poster.headline, poster.subheadline].filter(Boolean).join("\n\n"),
  );
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | 'confirmation'>('info');
  const [isSharing, setIsSharing] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 });
  const [shareStep, setShareStep] = useState<'idle' | 'opening' | 'opened' | 'confirmed'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Get button position when dialog opens
  useEffect(() => {
    if (open && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setAnimationOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [open, triggerRef]);

  // Reset caption when poster changes
  useEffect(() => {
    setCaption([poster.headline, poster.subheadline].filter(Boolean).join("\n\n"));
    setStatus(null);
    setShareStep('idle');
  }, [poster]);

  // Close on escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function shareToWhatsApp() {
    if (!imageUrl) {
      setStatusType('error');
      setStatus("No image available to share");
      return;
    }

    setIsSharing(true);
    setStatus(null);
    setShareStep('opening');

    try {
      // Method 1: Web Share API (Mobile)
      if (navigator.share) {
        try {
          // Fetch the image
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], `poster-${poster.id}.png`, {
            type: blob.type || "image/png",
          });

          // Open native share sheet
          await navigator.share({
            files: [file],
            text: caption || undefined,
            title: poster.headline || "Poster",
          });

          // Share sheet opened successfully
          setShareStep('opened');
          setStatusType('success');
          setStatus("Share sheet is open. Please select WhatsApp and send your message.");
          setIsSharing(false);
          return;
        } catch (shareError: any) {
          // User cancelled the share dialog
          if (shareError.name === 'AbortError' || shareError.message?.includes('cancel')) {
            setShareStep('idle');
            setStatusType('info');
            setStatus("Share cancelled");
            setIsSharing(false);
            return;
          }
          // Other error, fall through to URL method
          console.log("Share API failed:", shareError);
        }
      }

      // Method 2: WhatsApp URL (Desktop & Fallback)
      const text = [caption, imageUrl].filter(Boolean).join("\n\n");
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      
      const newWindow = window.open(whatsappUrl, "_blank", "noopener", "noreferrer");
      
      if (!newWindow || newWindow.closed) {
        // If popup was blocked, navigate current window
        window.location.href = whatsappUrl;
        setShareStep('opened');
        setStatusType('info');
        setStatus("WhatsApp is opening. Complete your message and send it.");
      } else {
        setShareStep('opened');
        setStatusType('info');
        setStatus("WhatsApp opened in a new tab. Compose your message and send it.");
      }
    } catch (err) {
      console.error("Share error:", err);
      // Ultimate fallback - just open WhatsApp URL
      const text = [caption, imageUrl].filter(Boolean).join("\n\n");
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank", "noopener", "noreferrer");
      setShareStep('opened');
      setStatusType('info');
      setStatus("Opening WhatsApp...");
    } finally {
      setIsSharing(false);
    }
  }

  // User confirms they've sent the message
  const confirmSent = () => {
    setShareStep('confirmed');
    setStatusType('confirmation');
    setStatus("✓ Great! Your poster has been shared.");
  };

  // Get the appropriate icon based on status type
  const getStatusIcon = () => {
    switch (statusType) {
      case 'success':
        return <CheckCircle className="h-4 w-4 flex-shrink-0" />;
      case 'error':
        return <XCircle className="h-4 w-4 flex-shrink-0" />;
      case 'confirmation':
        return <Check className="h-4 w-4 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 flex-shrink-0" />;
    }
  };

  // Get status color classes
  const getStatusClasses = () => {
    switch (statusType) {
      case 'success':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
      case 'confirmation':
        return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400';
      case 'info':
      default:
        return 'border-border/60 bg-secondary/30 text-muted-foreground';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-title"
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4"
      style={{
        pointerEvents: "none",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
        style={{
          pointerEvents: "auto",
          opacity: open ? 1 : 0,
          animation: open ? "fadeIn 0.5s ease-out" : "fadeOut 0.3s ease-in",
        }}
      />

      {/* Main Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-background/95 rounded-t-3xl sm:rounded-3xl border border-border/70 shadow-2xl flex flex-col"
        style={{
          pointerEvents: "auto",
          maxHeight: "100vh",
          transformOrigin: `${animationOrigin.x}px ${animationOrigin.y}px`,
          animation: open 
            ? `slideUpFromButton 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
            : "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(100%) scale(0.9)",
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366] flex-shrink-0">
              <Send className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="publish-title"
                className="text-base sm:text-lg font-semibold tracking-tight truncate"
              >
                Publish Poster
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Share to WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
            {/* Preview */}
            <div className="hidden md:block">
              <SpotlightCard className="overflow-hidden rounded-2xl p-0">
                {imageUrl ? (
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
                    <img
                      src={imageUrl}
                      alt={poster.headline || "Poster preview"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-[4/5] place-items-center bg-secondary p-8 text-center text-sm text-muted-foreground">
                    No poster image available
                  </div>
                )}
              </SpotlightCard>
            </div>

            {/* Controls */}
            <div className="space-y-5">
              {/* Mobile Preview Thumbnail */}
              <div className="md:hidden">
                <div className="flex gap-4 items-start">
                  {imageUrl ? (
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={poster.headline || "Poster preview"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-24 rounded-xl bg-secondary flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">
                      {poster.headline || "Poster"}
                    </h3>
                    {poster.subheadline && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {poster.subheadline}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label
                  htmlFor="caption"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-secondary/30 px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30 focus:bg-secondary/50"
                  placeholder="Write your message…"
                  style={{
                    minHeight: "80px",
                    maxHeight: "150px",
                  }}
                />
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  {caption.length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  disabled={isSharing || !imageUrl || shareStep === 'confirmed'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 sm:py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,211,102,0.5)] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(37,211,102,0.6)] disabled:opacity-50 disabled:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : shareStep === 'confirmed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  {isSharing ? "Preparing…" : 
                   shareStep === 'confirmed' ? "Shared ✓" : 
                   "Share to WhatsApp"}
                </button>

                {/* Confirmation button - appears after share sheet opens */}
                {shareStep === 'opened' && (
                  <button
                    type="button"
                    onClick={confirmSent}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500/30 bg-green-500/10 py-3 text-sm font-semibold text-green-600 dark:text-green-400 transition-all duration-200 hover:bg-green-500/20 active:scale-95"
                  >
                    <Check className="h-4 w-4" />
                    I've sent it ✓
                  </button>
                )}

                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 bg-secondary/20 px-4 py-3">
                  <Instagram className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Instagram</p>
                    <p className="text-[10px] text-muted-foreground truncate">Coming soon</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground flex-shrink-0">
                    Soon
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 bg-secondary/20 px-4 py-3">
                  <Facebook className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Facebook</p>
                    <p className="text-[10px] text-muted-foreground truncate">Coming soon</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground flex-shrink-0">
                    Soon
                  </span>
                </div>
              </div>

              {/* Status Message - With proper icons and honest messaging */}
              {status && (
                <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 ${getStatusClasses()}`}>
                  {getStatusIcon()}
                  <p className="text-xs leading-relaxed break-words flex-1">
                    {status}
                  </p>
                </div>
              )}

              {/* Step indicator */}
              {shareStep !== 'idle' && shareStep !== 'confirmed' && (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 border-t border-border/30 pt-3">
                  <div className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${shareStep === 'opening' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                    <span>{shareStep === 'opening' ? 'Opening...' : 'Opened ✓'}</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    <span>Send message</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    <span>Confirm</span>
                  </div>
                </div>
              )}

              {/* Help text about sharing */}
              <div className="flex items-start gap-2 text-[10px] text-muted-foreground/70 border-t border-border/30 pt-3 mt-2">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" /> Mobile: Share sheet opens → Select WhatsApp
                  </p>
                  <p className="flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> Desktop: WhatsApp Web opens in new tab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Safe area padding */}
        <div className="h-safe-bottom sm:hidden" />
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUpFromButton {
          0% {
            transform: translateY(100%) scale(0.85);
            opacity: 0;
          }
          40% {
            transform: translateY(-10%) scale(1.02);
            opacity: 1;
          }
          70% {
            transform: translateY(5%) scale(0.99);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .h-safe-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }

        .overscroll-contain {
          overscroll-behavior: contain;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default PublishPosterDialog;