import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Dropdown, Pagination } from 'react-bootstrap';
import { BsChevronDown, BsTrashFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import './MemberList.css';

function MemberList() {
    const { projectId } = useParams();
    const [projectMembers, setProjectMembers] = useState([]);
    const [accessToken] = useState(localStorage.getItem('accessToken') || '');
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userId, setUserId] = useState('');
    const membersPerPage = 5;
    const roles = ['member', 'viewer'];

    // Hàm lấy userId từ token
    const getUserIdFromToken = () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return "Unknown";
        try {
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);
            return decodedToken.userId || decodedToken.id || "Unknown";
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            return "Unknown";
        }
    };
    useEffect(() => {
        setUserId(getUserIdFromToken());
    }, []);

    useEffect(() => {
        const fetchProjectMembers = async () => {
            try {
                const response = await fetch(`http://localhost:9999/projects/${projectId}/get-member`);
                if (response.ok) {
                    const data = await response.json();
                    setProjectMembers(data.memberInfo || []);

                    // Kiểm tra nếu userId từ token có trong danh sách thành viên
                    const currentUser = data.memberInfo?.find(member => member.id === userId);
                    if (currentUser) {
                        setCurrentUserRole(currentUser.role);
                        console.log("Current User Role:", currentUser.role);
                    }
                } else {
                    setProjectMembers([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành viên:", error);
                setProjectMembers([]);
            }
        };

        if (userId !== "Unknown") {
            fetchProjectMembers();
        }
    }, [projectId, userId]);

    const handleDeleteMember = async (memberId) => {
        Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Thao tác này sẽ xóa thành viên khỏi dự án!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:9999/projects/${projectId}/member/${memberId}/delete`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    });

                    if (response.ok) {
                        setProjectMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
                        Swal.fire("Đã xóa!", "Thành viên đã được xóa thành công.", "success");
                    } else {
                        Swal.fire("Lỗi!", "Không thể xóa thành viên.", "error");
                    }
                } catch (error) {
                    Swal.fire("Lỗi!", "Đã xảy ra lỗi khi gọi API.", "error");
                }
            }
        });
    };

    const handleSetRole = async (memberId, newRole) => {
        try {
            const response = await fetch(`http://localhost:9999/projects/${projectId}/member/${memberId}/set-role`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role: newRole }) // Truyền role vào trong body
            });
            console.log("member", memberId, newRole);
            console.log(accessToken)

            // Kiểm tra response từ server
            if (response.ok) {
                const result = await response.json(); // Nhận kết quả từ API

                // Cập nhật lại danh sách thành viên nếu thành công
                setProjectMembers(prevMembers =>
                    prevMembers.map(member =>
                        member.id === memberId ? { ...member, role: newRole } : member
                    )
                );

                Swal.fire("Thành công!", result.message, "success");
            } else {
                const errorData = await response.json();
                // Xử lý lỗi nếu API trả về không thành công
                Swal.fire("Lỗi!", errorData.message || "Không thể cập nhật vai trò. Vui lòng thử lại.", "error");
            }
        } catch (error) {
            // Xử lý lỗi khi gọi API
            console.error("Error:", error);
            Swal.fire("Lỗi!", "Đã xảy ra lỗi khi gọi API.", "error");
        }
    };




    const filteredMembers = projectMembers.filter(member =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Project Members</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
            <Table striped bordered hover responsive className="custom-table">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member, index) => (
                        <tr key={member.id}>
                            <td>{indexOfFirstMember + index + 1}</td>
                            <td>{member.name}</td>
                            <td>
                                {member.role === "owner" || currentUserRole !== "owner" ? (
                                    <span className="badge bg-primary">{member.role}</span>
                                ) : (
                                    <Dropdown container="body">
                                        <Dropdown.Toggle variant="secondary" size="sm">
                                            {member.role} <BsChevronDown />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {roles.map(role => (
                                                <Dropdown.Item key={role} onClick={() => handleSetRole(member.id, role)}>
                                                    {role}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </td>
                            <td>
                                {currentUserRole === "owner" && member.role !== "owner" && (
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteMember(member.id)}>
                                        <BsTrashFill title="Delete" />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map(num => (
                    <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                        {num + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
}

export default MemberList;
