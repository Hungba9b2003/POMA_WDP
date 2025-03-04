import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsChevronDown, BsTrashFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

function MemberList() {
    const { projectId } = useParams();
    const [projectMembers, setProjectMembers] = useState([]);
    const [accessToken] = useState(localStorage.getItem('accessToken') || '');
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [hoveredRole, setHoveredRole] = useState(null);

    const roles = ['member', 'viewer'];

    useEffect(() => {
        const fetchProjectMembers = async () => {
            try {
                const response = await fetch(`http://localhost:9999/projects/${projectId}/get-member`);
                if (response.ok) {
                    const data = await response.json();
                    setProjectMembers(data.memberInfo || []); // Đảm bảo luôn có mảng
                } else {
                    setProjectMembers([]); // Nếu API lỗi, vẫn đảm bảo là mảng
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thành viên:", error);
                setProjectMembers([]);
            }
        };

        // const fetchCurrentUserRole = async () => {
        //     try {
        //         const response = await fetch(`http://localhost:9999/projects/user/${projectId}/get-user-role`, {
        //             headers: { Authorization: `Bearer ${accessToken}` },
        //             body:{
        //                 "id":
        //             }
        //         });
        //         console.log("user role", response);

        //         if (response.ok) {
        //             const data = await response.json();
        //             console.log(data);

        //             setCurrentUserRole(data.role);
        //         }
        //     } catch (error) {
        //         console.error("Lỗi khi lấy vai trò người dùng:", error);
        //     }
        // };

        fetchProjectMembers();
        // fetchCurrentUserRole();
        //laasy dduwoc role cua user hien tai, truoc lay duoc id cua use hien tai
    }, [projectId, accessToken]);

    const handleRoleChange = async (memberId, role) => {
        console.log("Role change", memberId, role);

        //lấy được current user roles đã
        // if (currentUserRole?.projectRole !== 'owner' || role === 'owner') return;
        console.log("fetched role change", memberId, role);

        const response = await fetch(`http://localhost:9999/projects/${projectId}/member/${memberId}/set-role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ id: memberId, role: role }),
        });
        console.log(response);

        if (response.ok) {
            setNewRole('');
            setDropdownOpen(false);
            setProjectMembers((prev) =>
                prev.map((member) => (member.id === memberId ? { ...member, projectRole: role } : member))
            );
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (currentUserRole?.projectRole !== 'owner') return;

        if (window.confirm('Delete this member?')) {
            const response = await fetch(`http://localhost:9999/projects/${projectId}/member/${memberId}/delete`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.ok) {
                setProjectMembers((prev) => prev.filter((m) => m.id !== memberId));
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMembers = (projectMembers || []).filter((member) =>
        member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <div className="container">
            <h2>Project Members</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member, index) => (
                        <tr key={member.id}>
                            <td>{index + 1}</td>
                            <td>{member.name}</td>
                            <td>
                                {member.role === 'owner' ? (
                                    'Owner'
                                ) : (
                                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                                        {editingMemberId === member.id ? (
                                            <>
                                                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                                                    {newRole || 'Select Role'} <BsChevronDown />
                                                </div>
                                                {dropdownOpen && (
                                                    <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', zIndex: 1 }}>
                                                        {roles.map((role) => (
                                                            <div
                                                                key={role}
                                                                onClick={() => handleRoleChange(member.id, role)}
                                                                onMouseEnter={() => setHoveredRole(role)}  // Set hovered role
                                                                onMouseLeave={() => setHoveredRole(null)}   // Reset on mouse leave
                                                                style={{
                                                                    padding: '8px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: hoveredRole === role ? 'lightgray' : 'transparent', // Change background on hover
                                                                }}
                                                            >
                                                                {role}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div onClick={() => setEditingMemberId(member.id)} style={{ cursor: 'pointer' }}>
                                                {member.role} <BsChevronDown />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </td>

                            <td>
                                <Button variant="link" onClick={() => handleDeleteMember(member.id)}>
                                    <BsTrashFill title="Delete" className="text-danger" />
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default MemberList;