import React, { useState, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone, FaCamera } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Table, Button } from "react-bootstrap";
import styles from "../../Styles/Profile/Profile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempSelectedImage, setTempSelectedImage] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : sessionStorage.getItem("token");
  const navigate = useNavigate();

  const imageList = [
    "/images/avatar/image1.jpg",
    "/images/avatar/image2.jpeg",
    "/images/avatar/image3.jpg",
    "/images/avatar/image4.jpg",
    "/images/avatar/image5.jpg",
    "/images/avatar/image6.jpg",
    "/images/avatar/image7.jpg",
    "/images/avatar/image8.jpg",
    "/images/avatar/imageDefault.jpg",
  ];

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9999/users/get-profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserInfo(response.data);
          setSelectedImage(response.data.profile.avatar || null);
          setTempSelectedImage(response.data.profile.avatar || null);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
      fetchUserInfo();
    }
  }, [token]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const phoneNumber = event.target.phone.value;
    const formData = new FormData();
    let uploadedImageUrl = tempSelectedImage; // Mặc định dùng ảnh có sẵn

    if (selectedFile) {
      formData.append("image", selectedFile); // Nếu chọn file mới

      try {
        const response = await axios.post(
          "http://localhost:9999/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.data.error) {
          return alert(response.data.error.message);
        }
        console.log(response);
        uploadedImageUrl = response.data.imageUrl; // Lưu URL mới
        setTempSelectedImage(uploadedImageUrl); // Cập nhật state
      } catch (error) {
        console.error("Upload failed:", error);
        return alert("Failed to upload image.");
      }
    }

    // Gửi thông tin cập nhật profile
    const payload = {
      username,
      email,
      phoneNumber,
      avatar: uploadedImageUrl, // Cập nhật avatar mới
    };

    try {
      const response = await axios.put(
        "http://localhost:9999/users/update-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedImage(uploadedImageUrl); // Cập nhật hình đại diện
      navigate("/profile/profileInfo");
      alert("User information updated successfully.");
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response ? error.response.data : error
      );
      alert("Failed to update user profile.");
    }
  };

  const handleImageSelect = (image) => {
    setTempSelectedImage(image);
    setSelectedFile(null); // Nếu chọn ảnh có sẵn, bỏ file đã chọn
    setShowImageList(false);
  };

  const toggleImageList = () => {
    setShowImageList((prev) => !prev);
  };
  const handleImageSelectOther = (event) => {
    const file = event.target.files[0]; // Lấy file được chọn
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempSelectedImage(reader.result); // Cập nhật ảnh preview
      };
      reader.readAsDataURL(file); // Chuyển file thành URL
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header background */}
      <div className={styles.headerBackground}>
        <div className={styles.cameraIcon}>
          <FaCamera size={122} color="rgba(0,0,0,0.15)" />
        </div>
      </div>

      {/* Avatar section */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper} onClick={() => setShowImageList(true)}>
          <img
            src={tempSelectedImage || "/images/avatar/imageDefault.jpg"}
            alt="Profile"
            className={styles.avatarImage}
          />
          <div className={styles.avatarOverlay}>
            <FaCamera />
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveChanges} className={styles.formContainer}>
        {/* Name section */}
        <div className={styles.section}>
          <h3>Name</h3>
          <input
            type="text"
            name="username"
            defaultValue={userInfo?.account.username}
            className={styles.input}
          />
        </div>

        {/* About section */}
        <div className={styles.section}>
          <h3>About</h3>
          <textarea
            className={styles.textarea}
            rows={6}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Contact section */}
        <div className={styles.section}>
          <h3>Contact</h3>
          <input
            type="email"
            name="email"
            defaultValue={userInfo?.account.email}
            className={styles.input}
            readOnly
          />
          <input
            type="tel"
            name="phone"
            defaultValue={userInfo?.profile.phoneNumber}
            className={styles.input}
          />
        </div>

        {/* Projects section */}
        <div className={styles.section}>
          <h3>Projects</h3>
          <div className={styles.demoContent}>
            Coming soon...
          </div>
        </div>

        {/* History section */}
        <div className={styles.section}>
          <h3>History</h3>
          <div className={styles.demoContent}>
            Coming soon...
          </div>
        </div>
      </form>

      {/* Image selection modal */}
      {showImageList && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.imageGrid}>
              {imageList.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Avatar ${index + 1}`}
                  onClick={() => handleImageSelect(image)}
                  className={tempSelectedImage === image ? styles.selectedImage : ''}
                />
              ))}
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowImageList(false)}>Cancel</button>
              <button onClick={handleSaveChanges}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
