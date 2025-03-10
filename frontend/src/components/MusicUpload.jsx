// import { useState } from "react";
// import axios from "axios";

// const MusicUpload = () => {
//   const [file, setFile] = useState(null);

//   const handleUpload = async () => {
//     if (!file) return;
    
//     const formData = new FormData();
//     formData.append("song", file);

//     try {
//       const { data } = await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert(`Uploaded: ${data.url}`);
//     } catch (error) {
//       console.error("Upload failed:", error);
//     }
//   };

//   return (
//     <div className="p-4 border rounded">
//       <input type="file" accept="audio/mp3" onChange={(e) => setFile(e.target.files[0])} />
//       <button className="bg-green-500 px-4 py-2 ml-2" onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default MusicUpload;
