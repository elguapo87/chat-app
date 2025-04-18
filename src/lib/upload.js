const upload = async (file) => {
  const cloudName = "duhsxvy7n";
  const uploadPreset = "chat_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
  
        const data = await response.json();
        resolve(data.secure_url); // Cloudinary URL of the uploaded image
      } catch (error) {
        reject("Cloudinary Upload Error: " + error.message);
      }
    });
};

export default upload;