import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Camera,
  Upload,
  Plus,
  Check,
  Image as ImageIcon,
  DollarSign,
  Package,
  FileText,
} from "lucide-react";
import { Language, User } from "../App";
import { t } from "../utils/translations";
import { postsAPI } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface PostSectionProps {
  language: Language;
  user: User;
  onBack: () => void;
}

interface CropPost {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhone: string;
  cropName: string;
  quantity: string;
  price: string;
  description: string;
  image: string;
  postedDate: string;
  rating: number;
}

export function PostSection({
  language,
  user,
  onBack,
}: PostSectionProps) {
  const [postData, setPostData] = useState({
    cropName: "",
    quantity: "",
    price: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(
    null,
  );

  const cropOptions = [
    "Rice (Paddy)",
    "Wheat",
    "Tomato",
    "Onion",
    "Potato",
    "Green Gram",
    "Black Gram",
    "Cotton",
    "Sugarcane",
    "Maize",
    "Carrot",
    "Cabbage",
    "Cauliflower",
    "Brinjal",
    "Okra",
    "Chili",
    "Ginger",
    "Turmeric",
    "Groundnut",
    "Sesame",
  ];

  const startCamera = async () => {
    try {
      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Camera access denied or not available. Please use the upload option instead.",
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(imageDataUrl);
        setPostData((prev) => ({
          ...prev,
          image: imageDataUrl,
        }));
        stopCamera();
      }
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setPostData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !postData.cropName ||
      !postData.quantity ||
      !postData.price ||
      !postData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new post object
      const newPostData = {
        cropName: postData.cropName,
        quantity: postData.quantity,
        price: postData.price,
        description: postData.description,
        image: postData.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
        farmerName: user.profile.name,
        farmerLocation: user.profile.location,
        farmerPhone: user.profile.phoneNumber,
        postedDate: new Date().toISOString().split("T")[0],
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      };

      // Save to backend
      await postsAPI.create(newPostData);

      setIsSubmitting(false);
      setShowSuccess(true);
      toast.success("Post created successfully!");

      // Reset form after 2 seconds
      setTimeout(() => {
        setPostData({
          cropName: "",
          quantity: "",
          price: "",
          description: "",
          image: "",
        });
        setImagePreview(null);
        setShowSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      console.log('Create post error:', error);
      setIsSubmitting(false);
      toast.error("Failed to create post: " + error.message);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Post Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your crop listing is now visible to buyers in the
              marketplace.
            </p>
            <Button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              {t("createPost", language)}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>List Your Crop for Sale</span>
            </CardTitle>
            <p className="text-gray-600">
              Create a listing to connect directly with buyers
              and get the best price for your produce.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Crop Image</span>
                </Label>

                {!imagePreview && !isCameraActive && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      onClick={startCamera}
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center space-y-2"
                    >
                      <Camera className="w-8 h-8" />
                      <span>Take Photo</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center space-y-2"
                    >
                      <Upload className="w-8 h-8" />
                      <span>Upload Image</span>
                    </Button>
                  </div>
                )}

                {/* Camera View */}
                {isCameraActive && (
                  <div className="space-y-4">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full max-w-md mx-auto rounded-lg"
                        autoPlay
                        playsInline
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                    </div>
                    <div className="flex space-x-4 justify-center">
                      <Button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button
                        type="button"
                        onClick={stopCamera}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="w-full max-w-md mx-auto rounded-lg border"
                    />
                    <div className="text-center">
                      <Button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setPostData((prev) => ({
                            ...prev,
                            image: "",
                          }));
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Crop Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crop Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cropName"
                    className="flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Crop Name *</span>
                  </Label>
                  <Select
                    value={postData.cropName}
                    onValueChange={(value) =>
                      setPostData((prev) => ({
                        ...prev,
                        cropName: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropOptions.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Quantity Available *</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="text"
                    placeholder="e.g., 500 kg, 50 bags"
                    value={postData.quantity}
                    onChange={(e) =>
                      setPostData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Price per kg *</span>
                </Label>
                <Input
                  id="price"
                  type="text"
                  placeholder="e.g., ₹25/kg"
                  value={postData.price}
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Description *</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your crop quality, harvest date, organic/conventional, storage conditions, etc."
                  value={postData.description}
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500">
                  Include details about quality, harvest date,
                  and any special features to attract buyers.
                </p>
              </div>

              {/* Farmer Contact Info Display */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Your Contact Information
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Name:</strong> {user.profile.name}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {user.profile.location}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {user.profile.phoneNumber}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This information will be visible to buyers
                    interested in your crop.
                  </p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Post...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("publish", language)}
                  </>
                )}
              </Button>

              {/* Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Tips for Better Sales
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • Upload clear, high-quality images of
                      your crops
                    </li>
                    <li>
                      • Mention if your crops are organic or
                      pesticide-free
                    </li>
                    <li>
                      • Include harvest date and expected shelf
                      life
                    </li>
                    <li>• Be competitive with your pricing</li>
                    <li>
                      • Respond quickly to buyer inquiries
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}