import React, { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import { AdminLayout } from '../layout/AdminLayout';
import type {
  UserResponseDto,
  UserCreateRequest,
  UserUpdateRequest,
  UserChangePasswordRequest,
  Role,
} from '../types/user';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modals & States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const [changingPassUserId, setChangingPassUserId] = useState<number | null>(null);

  // Form States
  const [createData, setCreateData] = useState<UserCreateRequest>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'USER',
  });

  const [updateData, setUpdateData] = useState<UserUpdateRequest>({
    fullName: '',
    avatarUrl: '',
    isActive: true,
    role: 'USER',
  });

  const [passData, setPassData] = useState<UserChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
  });

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers(pageNumber, 10);
      setUsers(res.data.content);
      if (res.data.page) {
        setTotalPages(res.data.page.totalPages);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.createUser(createData);
      setShowCreateModal(false);
      setCreateData({ username: '', email: '', password: '', fullName: '', role: 'USER' });
      fetchUsers(page);
    } catch (err) {
      console.error('Tạo người dùng thất bại:', err);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await userApi.updateUser(editingUser.id, updateData);
      setEditingUser(null);
      fetchUsers(page);
    } catch (err) {
      console.error('Cập nhật người dùng thất bại:', err);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPassUserId) return;
    try {
      await userApi.changePassword(changingPassUserId, passData);
      alert('Đổi mật khẩu thành công!');
      setChangingPassUserId(null);
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error('Đổi mật khẩu thất bại:', err);
      alert('Đổi mật khẩu thất bại, vui lòng kiểm tra lại mật khẩu cũ!');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      await userApi.deleteUser(id);
      fetchUsers(page);
    } catch (err) {
      console.error('Xóa người dùng thất bại:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="header-actions">
        <h2>Quản Lý Người Dùng</h2>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Thêm Người Dùng
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.fullName || '—'}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-link"
                      onClick={() => {
                        setEditingUser(u);
                        setUpdateData({
                          fullName: u.fullName || '',
                          avatarUrl: u.avatarUrl || '',
                          isActive: u.isActive,
                          role: u.role,
                        });
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-link"
                      onClick={() => setChangingPassUserId(u.id)}
                    >
                      Đổi pass
                    </button>
                    <button className="btn-link danger" onClick={() => handleDeleteUser(u.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>Không có người dùng nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Trang trước
          </button>
          <span>Trang {page + 1} / {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Trang sau
          </button>
        </div>
      )}

      {/* Modal Thêm Người Dùng */}
      {showCreateModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleCreateSubmit}>
            <h3>Thêm Người Dùng Mới</h3>
            <br />
            <div className="form-group">
              <label>Username *</label>
              <input type="text" required value={createData.username} onChange={(e) => setCreateData({ ...createData, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" required value={createData.email} onChange={(e) => setCreateData({ ...createData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input type="password" required minLength={6} value={createData.password} onChange={(e) => setCreateData({ ...createData, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Họ tên</label>
              <input type="text" value={createData.fullName} onChange={(e) => setCreateData({ ...createData, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Quyền (Role)</label>
              <select value={createData.role} onChange={(e) => setCreateData({ ...createData, role: e.target.value as Role })}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Tạo Mới</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Sửa Người Dùng */}
      {editingUser && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleUpdateSubmit}>
            <h3>Sửa Người Dùng: {editingUser.username}</h3>
            <br />
            <div className="form-group">
              <label>Họ tên</label>
              <input type="text" value={updateData.fullName || ''} onChange={(e) => setUpdateData({ ...updateData, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input type="text" value={updateData.avatarUrl || ''} onChange={(e) => setUpdateData({ ...updateData, avatarUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Quyền (Role)</label>
              <select value={updateData.role} onChange={(e) => setUpdateData({ ...updateData, role: e.target.value as Role })}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={updateData.isActive} onChange={(e) => setUpdateData({ ...updateData, isActive: e.target.checked })} />
                {' '}Hoạt động (Active)
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditingUser(null)}>Hủy</button>
              <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Đổi Mật Khẩu */}
      {changingPassUserId && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleChangePasswordSubmit}>
            <h3>Đổi Mật Khẩu</h3>
            <br />
            <div className="form-group">
              <label>Mật khẩu hiện tại</label>
              <input type="password" required value={passData.oldPassword} onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" required minLength={6} value={passData.newPassword} onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setChangingPassUserId(null)}>Hủy</button>
              <button type="submit" className="btn-primary">Xác Nhận</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};