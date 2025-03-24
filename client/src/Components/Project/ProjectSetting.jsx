import React, { useState, useEffect } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ProjectSetting() {
    const [isSaving, setIsSaving] = useState(false);
    const [projectInfo, setProjectInfo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [showImageList, setShowImageList] = useState(false);
    const [imageList, setImageList] = useState([
        "https://via.placeholder.com/100",
        "https://via.placeholder.com/100/FF0000",
        "https://via.placeholder.com/100/00FF00",
        "https://via.placeholder.com/100/0000FF",
    ]);
    
    const { projectId } = useParams();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token && projectId) {
            const fetchProjectInfo = async () => {
                try {
                    const response = await axios.get(`http://localhost:9999/projects/${projectId}/get-project`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setProjectInfo(response.data.project);
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

        const payload = {
            projectName: event.target.projectName.value,
            projectCode: event.target.projectCode.value,
            projectAvatar: selectedImage || tempImage,
        };

        try {
            await axios.put(`http://localhost:9999/projects/${projectId}/edit`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            navigate(`/project/${projectId}/setting`);
            alert("Project information updated successfully.");
        } catch (error) {
            console.error("Error updating project information:", error.response ? error.response.data : error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleImageList = () => {
        setShowImageList(!showImageList);
    };

    const handleImageSelect = (image) => {
        setSelectedImage(image);
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
                                            border: selectedImage === image ? "2px solid #0F67B1" : "none",
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
                            <td><strong>Project Name:</strong></td>
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
                            <td><strong>Project Code:</strong></td>
                            <td>
                                <input
                                    type="text"
                                    name="projectCode"
                                    defaultValue={projectInfo ? projectInfo.projectCode : ""}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{ marginTop: "10px" }}>
                    <Button variant="primary" type="submit" style={{ marginRight: 5 }} disabled={isSaving}>
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
