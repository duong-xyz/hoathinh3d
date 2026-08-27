package com.duonghd.app.model;

import com.duonghd.app.contant.MovieType;
import com.duonghd.app.util.ScheduleUtils;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Movie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(name = "original_title")
    private String originalTitle;
    @Enumerated(EnumType.STRING)
    private MovieType type;
    @Column(name = "rating_score", precision = 3, scale = 1)
    @Builder.Default
    private BigDecimal ratingScore = BigDecimal.ZERO;
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    @Column(length = 255)
    private String schedule;
    @Column(columnDefinition = "TEXT")
    private String description;
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Episode> episodes = new LinkedHashSet<>();

    public boolean hasScheduleAt(String targetDay, boolean isEarly) {
        return ScheduleUtils.checkSchedule(this.schedule, targetDay, isEarly);
    }
    public String getBroadcastTime() {
        return ScheduleUtils.getTime(this.schedule);
    }
}
