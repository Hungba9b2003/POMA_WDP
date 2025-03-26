import React, { useState, useEffect } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
function ProjectSetting() {
  const [isSaving, setIsSaving] = useState(false);
  const [projectInfo, setProjectInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
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

  const { projectId } = useParams();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && projectId) {
      const fetchProjectInfo = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9999/projects/${projectId}/get-project`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProjectInfo(response.data.project);
          setImageList((prevList) => {
            if (
              response.data.project.projectAvatar &&
              !prevList.includes(response.data.project.projectAvatar)
            ) {
              return [...prevList, response.data.project.projectAvatar];
            }
            return prevList;
          });
          setSelectedImage(response.data.project.projectAvatar || null);
        } catch (error) {
          console.error("Error fetching project information:", error);
        }
      };
      fetchProjectInfo();
    }
  }, [token, projectId]);

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
      formData.append("oldAvatar", projectInfo.projectAvatar);
      console.log(projectInfo.projectAvatar);
      const oldAvatar = getImageNameFromUrl(projectInfo.projectAvatar);
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
    let id = null; // Dùng let thay vì const

    if (token) {
      try {
        console.log("Token:", token);
        const decoded = jwtDecode(token);
        id = decoded.id; // Gán lại giá trị id

        console.log("Decoded Token:", decoded);
        console.log("User ID:", id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.log("No token found");
    }
    const payload = {
      projectName: event.target.projectName.value,
      projectCode: event.target.projectCode.value,
      projectAvatar: avatarToSave,
      id: id,
    };

    try {
      await axios.put(
        `http://localhost:9999/projects/${projectId}/edit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate(`/project/${projectId}/setting`);
      alert("Project information updated successfully.");
    } catch (error) {
      console.error(
        "Error updating project information:",
        error.response ? error.response.data : error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleImageList = () => {
    setShowImageList(!showImageList);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setTempImage(null); // Xóa tempImage để hiển thị ảnh được chọn từ danh sách
    setShowImageList(false);
  };

  const handleAddImage = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2>Project Setting</h2>
      <form onSubmit={handleSaveChanges}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h3>Select an Image:</h3>
          <div onClick={toggleImageList} style={{ cursor: "pointer" }}>
            {tempImage ? (
              <img
                src={tempImage}
                alt="Temporary Avatar"
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
                src={selectedImage}
                alt="Selected Avatar"
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

          {showImageList && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {imageList.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    onClick={() => handleImageSelect(image)}
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
              {tempImage ? (
                <label htmlFor="fileInput">
                  <img
                    src={tempImage}
                    alt="Preview"
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
                  onClick={handleAddImage}
                  style={{
                    display: "flex",
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
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: "1.3em", color: "#0F67B1" }}>
                <FaProjectDiagram /> Project Information
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Project Name:</strong>
              </td>
              <td>
                <input
                  type="text"
                  name="projectName"
                  defaultValue={projectInfo ? projectInfo.projectName : ""}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <strong>Project Code:</strong>
              </td>
              <td>
                <input
                  type="text"
                  name="projectCode"
                  defaultValue={projectInfo ? projectInfo.projectCode : ""}
                  required
                  readOnly
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
          <Button variant="secondary" type="reset" disabled={isSaving}>
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProjectSetting;
