import React, { useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, XIcon, FileVideo } from 'lucide-react';
import axios from 'axios';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleVideoChange = async (e) => {
      const file = e.target.files[0];
      if (!file.type.startsWith("video/")) {
          toast.error("Please select a video file");
          return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my_preset'); // Replace with your Cloudinary preset
  
      try {
          const response = await axios.post(
              'https://api.cloudinary.com/v1_1/dbi3tuuli/video/upload', // Replace with your Cloudinary cloud name
              formData
          );
          setVideoPreview(response.data.secure_url);
      } catch (error) {
          console.error("Video upload failed:", error.response?.data || error.message);
      }
  };
  

    const removeMedia = () => {
        setImagePreview(null);
        setVideoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview && !videoPreview) return;

        let uploadedImageUrl = null;
        let uploadedVideoUrl = null;

        try {
            // Upload image if selected
            if (imagePreview && fileInputRef.current.files[0]) {
                const formData = new FormData();
                formData.append('file', fileInputRef.current.files[0]);
                formData.append('upload_preset', 'my_preset');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dbi3tuuli/image/upload',
                    formData
                );
                uploadedImageUrl = response.data.secure_url;
            }

            // Upload video if selected
            if (videoPreview && videoInputRef.current.files[0]) {
                const formData = new FormData();
                formData.append('file', videoInputRef.current.files[0]);
                formData.append('upload_preset', 'my_preset');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dbi3tuuli/video/upload',
                    formData
                );
                uploadedVideoUrl = response.data.secure_url;
            }

            // Send message
            await sendMessage({
                text: text.trim(),
                image: uploadedImageUrl,
                video: uploadedVideoUrl,
            });

            setText("");
            removeMedia();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="p-4 w-full">
            {(imagePreview || videoPreview) && (
                <div className="mb-3 flex items-center gap-2">
                    {imagePreview && (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                        </div>
                    )}
                    {videoPreview && (
                        <div className="relative">
                            <video src={videoPreview} controls className="w-20 h-20 rounded-lg border border-zinc-700" />
                        </div>
                    )}
                    <button onClick={removeMedia} className="btn btn-sm btn-circle bg-base-300" type="button">
                        <XIcon className="size-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        ref={videoInputRef}
                        onChange={handleVideoChange}
                    />
                    <button
                        type="button"
                        className="btn btn-circle text-zinc-400"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                    <button
                        type="button"
                        className="btn btn-circle text-zinc-400"
                        onClick={() => videoInputRef.current?.click()}
                    >
                        <FileVideo size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview && !videoPreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
