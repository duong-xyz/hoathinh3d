import axiosClient from './axiosClient';
import type { Page } from '../types/movie';
import type {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../types/comment';

export const commentApi = {
  getRootComments: (movieId: number, userId?: number, page = 0, size = 10) =>
    axiosClient.get<Page<CommentResponse>>(`/comments/movie/${movieId}`, {
      params: { userId, page, size },
    }),

  getReplies: (parentId: number, userId?: number, page = 0, size = 5) =>
    axiosClient.get<Page<CommentResponse>>(`/comments/${parentId}/replies`, {
      params: { userId, page, size },
    }),

  createComment: (userId: number, data: CreateCommentRequest) =>
    axiosClient.post<CommentResponse>(`/comments`, data, {
      params: { userId },
    }),

  updateComment: (commentId: number, userId: number, data: UpdateCommentRequest) =>
    axiosClient.put<CommentResponse>(`/comments/${commentId}`, data, {
      params: { userId },
    }),

  deleteComment: (commentId: number, userId: number) =>
    axiosClient.delete<void>(`/comments/${commentId}`, {
      params: { userId },
    }),
};