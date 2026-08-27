import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface EpisodeSummaryDto {
  id: number;
  episodeNumber: number;
  title: string;
}

interface WatchState {
  episodes: EpisodeSummaryDto[];
  currentEpId: string | null;
}

const initialState: WatchState = {
  episodes: [],
  currentEpId: null,
};

export const playerSlice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    // 1. Cập nhật danh sách tập và tập đang chọn
    setPlaylist: (
      state,
      action: PayloadAction<{ episodes: EpisodeSummaryDto[]; epId: string }>
    ) => {
      state.episodes = action.payload.episodes;
      state.currentEpId = action.payload.epId;
    },

    // 2. Thêm action đổi tập nhanh (tùy chọn nhưng nên có)
    setCurrentEpId: (state, action: PayloadAction<string>) => {
      state.currentEpId = action.payload;
    },

    // 3. Action dọn dẹp state khi thoát khỏi trang xem phim
    resetWatchState: (state) => {
      state.episodes = [];
      state.currentEpId = null;
    },
  },
});

// Export các actions để dùng với useDispatch()
export const { setPlaylist, setCurrentEpId, resetWatchState } = playerSlice.actions;

// Export reducer để khai báo vào store
export default playerSlice.reducer;