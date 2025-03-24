import React, { useState, useEffect } from "react";
import { FaAddressCard, FaUser, FaPhone } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { Table, Button } from "react-bootstrap";
import styles from "../../Styles/Profile/Profile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProfile() {
  const [isSaving, setIsSaving] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [tempImage, setTempImage] = useState(null);

  const [imageList, setImageList] = useState([
    "/images/avatar/image1.jpg",
    "/images/avatar/image2.jpeg",
    "/images/avatar/image3.jpg",
    "/images/avatar/image4.jpg",
    "/images/avatar/image5.jpg",
    "/images/avatar/image6.jpg",
    "/images/avatar/image7.jpg",
    "/images/avatar/image8.jpg",
    "/images/avatar/imageDefault.jpg",
  ]);

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

          setSelectedImage(response.data.profile.avatar || null); // Ensure we reference the correct avatar path
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
      fetchUserInfo();
    }
  },[]);

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    let avatarToSave = selectedImage;
    function getImageNameFromUrl(url) {
      return url.split("/").pop(); // Lấy phần cuối cùng sau dấu "/"
    }
    // Nếu có ảnh mới upload, tiến hành upload trước khi gửi API cập nhật
    if (tempImage) {
      const formData = new FormData();
      formData.append("image", document.getElementById("fileInput").files[0]);
      formData.append("oldAvatar", userInfo.profile.avatar);
      console.log(userInfo.profile.avatar);
      const oldAvatar = getImageNameFromUrl(userInfo.profile.avatar);
      try {
        const response = await fetch(
          `http://localhost:9999/api/upload?oldAvatar=${oldAvatar}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.success) {
          avatarToSave = data.imageUrl;
          setIsSaving(false);
        } else {
          setIsSaving(false);
          console.error("Lỗi upload:", data.message);
          return;
        }
      } catch (error) {
        setIsSaving(false);
        alert("Lỗi khi upload ảnh!");
        console.error("Lỗi khi upload ảnh:", error);
        return;
      }
    }

    const payload = {
      username: event.target.username.value,
      email: event.target.email.value,
      phoneNumber: event.target.phone.value,
      avatar: avatarToSave, // Sử dụng ảnh đã upload (hoặc ảnh đã chọn từ danh sách)
    };

    try {
      await axios.put("http://localhost:9999/users/update-profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      navigate("/profile/profileInfo");
      alert("User information updated successfully.");
    } catch (error) {
      console.error(
        "Error updating user information:",
        error.response ? error.response.data : error
      );
    }
  };
  const handleAddImage = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận các file ảnh: JPG, PNG, GIF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result); // Hiển thị ảnh trước khi upload
    };

    reader.readAsDataURL(file);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setShowImageList(false);
  };

  const toggleImageList = () => {
    setShowImageList((prev) => !prev);
  };

  return (
    <div>
      <h2>Edit User Profile</h2>
      <form onSubmit={handleSaveChanges}>
        {/* Display selected avatar above the tables */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3>Select an Image:</h3>
          <div onClick={toggleImageList} style={{ cursor: "pointer" }}>
            {tempImage ? (
              <img
                src={tempImage} // Hiển thị ảnh tạm nếu có
                alt="Temporary Avatar"
                className={styles.avatarImage}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #0F67B1",
                }}
              />
            ) : selectedImage ? (
              <img
                src={selectedImage} // Hiển thị ảnh chính nếu chưa chọn ảnh mới
                alt="Selected Avatar"
                className={styles.avatarImage}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #0F67B1",
                }}
              />
            ) : (
              <Button variant="primary">Select Avatar</Button>
            )}
          </div>

          {/* List of images to choose from */}
          {showImageList && (
            <div
              className={styles.imageList}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px", // Khoảng cách giữa các ảnh
              }}
            >
              {imageList.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    onClick={() => handleImageSelect(image)}
                    className={styles.imageItem}
                    style={{
                      cursor: "pointer",
                      border:
                        selectedImage === image ? "2px solid #0F67B1" : "none",
                      width: "100px",
                      height: "100px",
                    }}
                  />
                </div>
              ))}

              {/* Hiển thị ảnh mới chọn từ máy và có thể nhấn để chọn lại */}
              {tempImage ? (
                <label htmlFor="fileInput">
                  <img
                    src={tempImage}
                    alt="Preview"
                    className={styles.imageItem}
                    style={{
                      margin: "10.5%",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "2px dashed #0F67B1",
                      cursor: "pointer",
                    }}
                  />
                </label>
              ) : (
                <div
                  className={styles.addImageButton}
                  onClick={handleAddImage}
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    marginLeft: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100px",
                    height: "100px",
                    border: "2px dashed #ccc",
                    cursor: "pointer",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#0F67B1",
                  }}
                >
                  +
                </div>
              )}

              {/* Input file bị ẩn nhưng dùng để nhận sự kiện chọn file */}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Đảm bảo input luôn tồn tại trong DOM */}
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
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
          <Button
            variant="primary"
            type="submit"
            style={{ marginRight: 5 }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="secondary"
            style={{ marginRight: 5 }}
            type="reset"
            disabled={isSaving}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
