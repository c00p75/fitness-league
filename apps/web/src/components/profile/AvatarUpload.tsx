import { useState, useRef } from "react";
import { Button } from "@fitness-league/ui";
import { Upload, User, X } from "lucide-react";

export function AvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setLoading(true);
    try {
      // TODO: Implement actual upload logic
      console.log("Uploading avatar...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-fitness-surface-light flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white/50" />
            )}
          </div>
          {preview && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="text-white border-white/20 hover:bg-white/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Photo
        </Button>

        {preview && (
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="fitness-button"
          >
            {loading ? "Uploading..." : "Upload Avatar"}
          </Button>
        )}
      </div>

      <div className="text-xs text-white/60 text-center">
        <p>JPG, PNG or GIF. Max size 5MB.</p>
      </div>
    </div>
  );
}
