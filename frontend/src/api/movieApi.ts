import axiosClient from './axiosClient';
import type {
  Page,
  MovieResponseDto,
  MovieDetailResponseDto,
  MovieDetailResponseAdDto,
  MovieCreateRequest,
  MovieUpdateRequest,
  ScheduleResponse,
} from '../types/movie';

export const movieApi = {
  getAllMovies: (page = 0, size = 20) =>
    axiosClient.get<Page<MovieResponseDto>>('/movies', {
      params: { page, size, sort: 'id,desc' },
    }),

  getMovieDetail: (id: number) =>
    axiosClient.get<MovieDetailResponseDto>(`/movies/${id}/detail`),

  getMovieByIdForAd: (id: number) =>
    axiosClient.get<MovieDetailResponseAdDto>(`/movies/${id}`),

  createMovie: (data: MovieCreateRequest) =>
    axiosClient.post<MovieResponseDto>('/movies', data),
  updateMovie: (id:number, data: MovieUpdateRequest) =>
    axiosClient.put<MovieResponseDto>(`/movies/${id}`, data),
  deleteMovie: (id: number) =>
    axiosClient.delete<void>(`/movies/${id}`),
  searchMovies: async (keyword: string, page: number = 0): Promise<Page<MovieResponseDto>> => {
    const res = await axiosClient.get<Page<MovieResponseDto>>('/movies/search',{
      params: {
        q: keyword,
      },
    });
    return res.data;
  },
  getScheduleByDay: (day: string, page = 0, size = 12) =>
    axiosClient.get<ScheduleResponse>('/movies/schedule', {
      params: { day, page, size },
    }),
};