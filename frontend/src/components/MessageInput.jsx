import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, XIcon, FileVideo, Smile, Music } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [songPreview, setSongPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const songInputRef = useRef(null);

    const { sendMessage } = useChatStore();

    const handleEmojiClick = (emoji) => {
        setText((prev) => prev + emoji.emoji);
    };

    const uploadToCloudinary = async (file, type) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my_preset");

            const resourceType = type === "video" || type === "audio" ? "video" : "image";
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dbi3tuuli/${resourceType}/upload`,
                formData
            );

            setUploading(false);
            return response.data.secure_url;
        } catch (error) {
            console.error(`${type} upload failed:`, error);
            setUploading(false);
            return null;
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview && !videoPreview && !songPreview) return;

        let uploadedImageUrl = null;
        let uploadedVideoUrl = null;
        let uploadedSongUrl = null;

        if (imagePreview && fileInputRef.current.files[0]) {
            uploadedImageUrl = await uploadToCloudinary(fileInputRef.current.files[0], "image");
        }

        if (videoPreview && videoInputRef.current.files[0]) {
            uploadedVideoUrl = await uploadToCloudinary(videoInputRef.current.files[0], "video");
        }

        if (songPreview && songInputRef.current.files[0]) {
            uploadedSongUrl = await uploadToCloudinary(songInputRef.current.files[0], "audio");
        }

        await sendMessage({
            text: text.trim(),
            image: uploadedImageUrl,
            video: uploadedVideoUrl,
            song: uploadedSongUrl,
        });

        setText("");
        setImagePreview(null);
        setVideoPreview(null);
        setSongPreview(null);
    };

    return (
        <div className="p-4 w-full relative">
            {/* Media Preview */}
            {(imagePreview || videoPreview || songPreview) && (
                <div className="mb-3 flex items-center gap-2">
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                    )}
                    {videoPreview && (
                        <video src={videoPreview} controls className="w-20 h-20 rounded-lg border border-zinc-700" />
                    )}
                    {songPreview && (
                        <audio src={songPreview} controls className="w-40 border border-zinc-700 rounded-lg" />
                    )}
                    <button
                        onClick={() => {
                            setImagePreview(null);
                            setVideoPreview(null);
                            setSongPreview(null);
                        }}
                        className="btn btn-sm btn-circle bg-base-300"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>
            )}

            {/* Input and Actions */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Emoji Picker Button */}
                <button
                    type="button"
                    className="btn btn-circle text-zinc-400"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <Smile size={20} />
                </button>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="absolute bottom-14 left-4 bg-white p-2 rounded-lg shadow-lg z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}

                {/* Text Input */}
                <input
                    type="text"
                    className="w-full input-bordered rounded-lg input-sm sm:input-md"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setShowEmojiPicker(false)}
                />

                {/* Image Upload */}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                    }
                }} />
                <button type="button" className="btn btn-circle text-zinc-400" onClick={() => fileInputRef.current?.click()}>
                    <Image size={20} />
                </button>

                {/* Video Upload */}
                <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith("video/")) {
                        setVideoPreview(URL.createObjectURL(file));
                    }
                }} />
                <button type="button" className="btn btn-circle text-zinc-400" onClick={() => videoInputRef.current?.click()}>
                    <FileVideo size={20} />
                </button>

                {/* Song Upload */}
                <input type="file" accept="audio/*" className="hidden" ref={songInputRef} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith("audio/")) {
                        setSongPreview(URL.createObjectURL(file));
                    }
                }} />
                <button type="button" className="btn btn-circle text-zinc-400" onClick={() => songInputRef.current?.click()}>
                    <Music size={20} />
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview && !videoPreview && !songPreview}
                >
                    {uploading ? "Uploading..." : <Send size={22} />}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
