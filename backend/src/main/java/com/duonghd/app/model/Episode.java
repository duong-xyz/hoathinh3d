package com.duonghd.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "episodes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Episode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
    @Column(name = "episode_number", nullable = false)
    private Integer episodeNumber;
    private String title;
    @OneToMany(mappedBy = "episode", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EpisodeSource> sources = new ArrayList<>();
}
