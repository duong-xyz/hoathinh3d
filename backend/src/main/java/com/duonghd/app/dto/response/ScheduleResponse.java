package com.duonghd.app.dto.response;

import java.util.List;

public record ScheduleResponse(
        List<MovieResponseDto> normalMovies,
        List<MovieResponseDto> earlyMovies
) {
}
