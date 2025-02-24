import React, { useState, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone } from "react-icons/fa";
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
    <div>
      <h2>Edit User Profile</h2>
      <form onSubmit={handleSaveChanges}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3>Select an Image:</h3>
          <div onClick={toggleImageList} style={{ cursor: "pointer" }}>
            {tempSelectedImage ? (
              <img
                src={tempSelectedImage}
                alt="Selected Avatar"
                className={styles.avatarImage}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <Button variant="primary">Select Avatar</Button>
            )}
          </div>

          {showImageList && (
            <div className={styles.imageList}>
              {imageList.map((image, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    onClick={() => handleImageSelect(image)}
                    style={{
                      cursor: "pointer",
                      border:
                        tempSelectedImage === image
                          ? "2px solid #0F67B1"
                          : "none",
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                      margin: "5px",
                    }}
                  />
                </div>
              ))}

              {/* Upload ảnh mới */}
              <div>
                <label
                  htmlFor="upload-avatar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    marginTop: "5px",
                    height: "100px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  ➕
                </label>
                <input
                  id="upload-avatar"
                  type="file"
                  onChange={handleImageSelectOther}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            </div>
          )}
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
                <FaUser /> User Information
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Username:</strong>
              </td>
              <td>
                <input
                  type="text"
                  name="username"
                  defaultValue={userInfo ? userInfo.username : ""}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
                <FaAddressCard /> Contact
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>
                  <IoMail /> Email:
                </strong>
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  defaultValue={userInfo ? userInfo.account.email : ""}
                  className={styles.inputField}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                <strong>
                  <FaPhone /> Phone:
                </strong>
              </td>
              <td>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={userInfo ? userInfo.profile.phoneNumber : ""}
                  className={styles.inputField}
                  required
                />
              </td>
            </tr>
          </tbody>
        </Table>

        <div style={{ marginTop: "10px" }}>
          <Button variant="primary" type="submit" style={{ marginRight: 5 }}>
            Save
          </Button>
          <Button variant="secondary" style={{ marginRight: 5 }} type="reset">
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
