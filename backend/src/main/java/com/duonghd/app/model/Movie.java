package com.duonghd.app.model;

import com.duonghd.app.contant.MovieType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
    private BigDecimal ratingScore = BigDecimal.ZERO;
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    @Column(length = 255)
    private String schedule;
    @Column(columnDefinition = "TEXT")
    private String description;
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Episode> episodes = new ArrayList<>();
}
