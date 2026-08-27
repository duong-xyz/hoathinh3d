export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface UserSummaryDto {
  id: number;
  username: string;
  avatarUrl?: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  reactionCount: number;
  replyCount: number;
  createdAt: string;
  user: UserSummaryDto;
  currentUserReaction?: ReactionType | null;
}

export interface CreateCommentRequest {
  movieId: number;
  parentId?: number | null;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}