package com.duonghd.app.model;

import com.duonghd.app.contant.SourceType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "episode_sources")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EpisodeSource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "episode_id", nullable = false)
    private Episode episode;
    @Column(name = "server_name", length = 40)
    private String serverName;
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    @Builder.Default
    private SourceType sourceType = SourceType.HLS;
    @Column(name = "source_url", nullable = false, columnDefinition = "TEXT")
    private String sourceURL;
    private String quality;
}
