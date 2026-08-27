import React, { useEffect, useState } from 'react';
import { movieApi } from '../api/movieApi';
import { episodeApi } from '../api/episodeApi';
import { episodeSourceApi } from '../api/episodeSourceApi';
import { useAppSelector } from '../store/store';
import { AdminLayout } from '../layout/AdminLayout';
import type { MovieResponseDto, MovieDetailResponseAdDto, EpisodeSourceDto } from '../types/movie';
import type { EpisodeCreateRequest, EpisodeUpdateRequest } from '../types/episode';
import type { EpisodeSourceCreateRequest, EpisodeSourceUpdateRequest, SourceType } from '../types/episodeSource';

export const EpisodeManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role.includes('ROLE_ADMIN');

  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetailResponseAdDto | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal & State Episode
  const [showCreateEpModal, setShowCreateEpModal] = useState(false);
  const [editingEp, setEditingEp] = useState<{ id: number; episodeNumber: number; title: string } | null>(null);

  // Modal & State Episode Source
  const [addingSourceEpId, setAddingSourceEpId] = useState<number | null>(null);
  const [editingSource, setEditingSource] = useState<EpisodeSourceDto | null>(null);

  // Form States
  const [epCreateData, setEpCreateData] = useState<EpisodeCreateRequest>({ episodeNumber: 1, title: '', duration: 24 });
  const [epUpdateData, setEpUpdateData] = useState<EpisodeUpdateRequest>({ episodeNumber: 1, title: '' });

  const [sourceCreateData, setSourceCreateData] = useState<EpisodeSourceCreateRequest>({
    serverName: 'Server Vietsub',
    sourceType: 'HLS',
    sourceURL: '',
    quality: '1080p',
  });

  const [sourceUpdateData, setSourceUpdateData] = useState<EpisodeSourceUpdateRequest>({
    serverName: '',
    sourceType: 'HLS',
    sourceURL: '',
    quality: '',
  });

  useEffect(() => {
    const fetchMoviesList = async () => {
      try {
        const res = await movieApi.getAllMovies(0, 100);
        setMovies(res.data.content);
        if (res.data.content.length > 0) {
          setSelectedMovieId(res.data.content[0].id);
        }
      } catch (err) {
        console.error('Lỗi tải danh sách phim:', err);
      }
    };
    fetchMoviesList();
  }, []);

  const fetchEpisodesByMovie = async (movieId: number) => {
    setLoading(true);
    try {
      const res = await movieApi.getMovieByIdForAd(movieId);
      setMovieDetail(res.data);
    } catch (err) {
      console.error('Lỗi tải danh sách tập phim:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMovieId) {
      fetchEpisodesByMovie(selectedMovieId);
    }
  }, [selectedMovieId]);

  // Handle Episode Actions
  const handleCreateEpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovieId) return;
    try {
      await episodeApi.createEpisode(selectedMovieId, epCreateData);
      setShowCreateEpModal(false);
      setEpCreateData({ episodeNumber: 1, title: '', duration: 24 });
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Tạo tập phim thất bại:', err);
    }
  };

  const handleUpdateEpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEp || !selectedMovieId) return;
    try {
      await episodeApi.updateEpisode(editingEp.id, epUpdateData);
      setEditingEp(null);
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Cập nhật tập phim thất bại:', err);
    }
  };

  const handleDeleteEp = async (id: number) => {
    if (!selectedMovieId || !window.confirm('Bạn có chắc muốn xóa tập phim này?')) return;
    try {
      await episodeApi.deleteEpisode(id);
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Xóa tập phim thất bại:', err);
    }
  };

  // Handle Source Actions
  const handleCreateSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingSourceEpId || !selectedMovieId) return;
    try {
      await episodeSourceApi.createSource(addingSourceEpId, sourceCreateData);
      setAddingSourceEpId(null);
      setSourceCreateData({ serverName: 'Server Vietsub', sourceType: 'HLS', sourceURL: '', quality: '1080p' });
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Thêm nguồn phát thất bại:', err);
    }
  };

  const handleUpdateSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource || !selectedMovieId) return;
    try {
      await episodeSourceApi.updateSource(editingSource.id, sourceUpdateData);
      setEditingSource(null);
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Cập nhật nguồn phát thất bại:', err);
    }
  };

  const handleDeleteSource = async (sourceId: number) => {
    if (!selectedMovieId || !window.confirm('Bạn có chắc muốn xóa nguồn phát này?')) return;
    try {
      await episodeSourceApi.deleteSource(sourceId);
      fetchEpisodesByMovie(selectedMovieId);
    } catch (err) {
      console.error('Xóa nguồn phát thất bại:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="header-actions">
        <h2>Quản Lý Tập Phim & Server Phát</h2>
        {isAdmin && selectedMovieId && (
          <button className="btn-primary" onClick={() => setShowCreateEpModal(true)}>
            + Thêm Tập Mới
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px', background: 'white', padding: '16px', borderRadius: '8px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Chọn Phim:</label>
        <select
          value={selectedMovieId ?? ''}
          onChange={(e) => setSelectedMovieId(Number(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
        >
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.id}] {m.title}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Tập</th>
              <th>Số Tập</th>
              <th>Tên Tập</th>
              <th>Danh Sách Server Nguồn Phát</th>
              <th style={{ textAlign: 'right' }}>Hành Động Tập</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : movieDetail?.episodes && movieDetail.episodes.length > 0 ? (
              movieDetail.episodes.map((ep) => (
                <tr key={ep.id}>
                  <td>{ep.id}</td>
                  <td><strong>Tập {ep.episodeNumber}</strong></td>
                  <td>{ep.title || 'Chưa cập nhật'}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {ep.sources && ep.sources.length > 0 ? (
                        ep.sources.map((src) => (
                          <div key={src.id} style={{ fontSize: '13px', background: '#f1f5f9', padding: '6px 10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                              <strong>[{src.serverName || 'Server'}]</strong> ({src.quality || 'HD'}):{' '}
                              <a href={src.sourceURL} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>Xem Link</a>
                            </span>
                            {isAdmin && (
                              <span style={{ marginLeft: '10px' }}>
                                <button
                                  className="btn-link"
                                  onClick={() => {
                                    setEditingSource(src);
                                    setSourceUpdateData({
                                      serverName: src.serverName,
                                      sourceType: src.sourceType,
                                      sourceURL: src.sourceURL,
                                      quality: src.quality,
                                    });
                                  }}
                                >
                                  Sửa Server
                                </button>
                                <button className="btn-link danger" onClick={() => handleDeleteSource(src.id)}>
                                  Xóa
                                </button>
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có nguồn phát nào</span>
                      )}
                      {isAdmin && (
                        <button
                          style={{ marginTop: '4px', fontSize: '12px', width: 'fit-content', padding: '3px 8px' }}
                          className="btn-secondary"
                          onClick={() => setAddingSourceEpId(ep.id)}
                        >
                          + Thêm Server
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isAdmin && (
                      <>
                        <button
                          className="btn-link"
                          onClick={() => {
                            setEditingEp({ id: ep.id, episodeNumber: ep.episodeNumber, title: ep.title || '' });
                            setEpUpdateData({ episodeNumber: ep.episodeNumber, title: ep.title || '' });
                          }}
                        >
                          Sửa Tập
                        </button>
                        <button className="btn-link danger" onClick={() => handleDeleteEp(ep.id)}>
                          Xóa Tập
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Phim này chưa có tập nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm Tập */}
      {showCreateEpModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleCreateEpSubmit}>
            <h3>Thêm Tập Phim</h3>
            <br />
            <div className="form-group">
              <label>Số tập</label>
              <input type="number" min={1} required value={epCreateData.episodeNumber} onChange={(e) => setEpCreateData({ ...epCreateData, episodeNumber: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Tên tập</label>
              <input type="text" value={epCreateData.title || ''} onChange={(e) => setEpCreateData({ ...epCreateData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Thời lượng (phút)</label>
              <input type="number" min={1} value={epCreateData.duration || 24} onChange={(e) => setEpCreateData({ ...epCreateData, duration: Number(e.target.value) })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCreateEpModal(false)}>Hủy</button>
              <button type="submit" className="btn-primary">Tạo Tập</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Sửa Tập */}
      {editingEp && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleUpdateEpSubmit}>
            <h3>Sửa Tập Phim #{editingEp.episodeNumber}</h3>
            <br />
            <div className="form-group">
              <label>Số tập</label>
              <input type="number" min={1} value={epUpdateData.episodeNumber || ''} onChange={(e) => setEpUpdateData({ ...epUpdateData, episodeNumber: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Tên tập</label>
              <input type="text" value={epUpdateData.title || ''} onChange={(e) => setEpUpdateData({ ...epUpdateData, title: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditingEp(null)}>Hủy</button>
              <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Thêm Server */}
      {addingSourceEpId && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleCreateSourceSubmit}>
            <h3>Thêm Server Nguồn Phát</h3>
            <br />
            <div className="form-group">
              <label>Tên Server</label>
              <input type="text" maxLength={40} value={sourceCreateData.serverName || ''} onChange={(e) => setSourceCreateData({ ...sourceCreateData, serverName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Loại nguồn (SourceType)</label>
              <select
                value={sourceCreateData.sourceType}
                onChange={(e) => setSourceCreateData({ ...sourceCreateData, sourceType: e.target.value as SourceType })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="HLS">HLS (.m3u8)</option>
                <option value="MP4_DIRECT">MP4 Direct</option>
                <option value="IFRAME">IFRAME</option>
                <option value="EMBED_HTML">EMBED HTML</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL Nguồn phát</label>
              <input type="text" required value={sourceCreateData.sourceURL} onChange={(e) => setSourceCreateData({ ...sourceCreateData, sourceURL: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Chất lượng</label>
              <input type="text" value={sourceCreateData.quality || ''} onChange={(e) => setSourceCreateData({ ...sourceCreateData, quality: e.target.value })} placeholder="1080p, 720p..." />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setAddingSourceEpId(null)}>Hủy</button>
              <button type="submit" className="btn-primary">Tạo Nguồn</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Sửa Server */}
      {editingSource && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleUpdateSourceSubmit}>
            <h3>Sửa Server Nguồn Phát</h3>
            <br />
            <div className="form-group">
              <label>Tên Server</label>
              <input type="text" maxLength={40} value={sourceUpdateData.serverName || ''} onChange={(e) => setSourceUpdateData({ ...sourceUpdateData, serverName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Loại nguồn (SourceType)</label>
              <select
                value={sourceUpdateData.sourceType || 'HLS'}
                onChange={(e) => setSourceUpdateData({ ...sourceUpdateData, sourceType: e.target.value as SourceType })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="HLS">HLS (.m3u8)</option>
                <option value="MP4_DIRECT">MP4 Direct</option>
                <option value="IFRAME">IFRAME</option>
                <option value="EMBED_HTML">EMBED HTML</option>
              </select>
            </div>
            <div className="form-group">
              <label>URL Nguồn phát</label>
              <input type="text" value={sourceUpdateData.sourceURL || ''} onChange={(e) => setSourceUpdateData({ ...sourceUpdateData, sourceURL: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Chất lượng</label>
              <input type="text" value={sourceUpdateData.quality || ''} onChange={(e) => setSourceUpdateData({ ...sourceUpdateData, quality: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setEditingSource(null)}>Hủy</button>
              <button type="submit" className="btn-primary">Lưu Thay Đổi</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};