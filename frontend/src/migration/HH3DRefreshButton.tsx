import React, { useState } from 'react';

export default function HH3DRefreshButton({ onRefresh }:{ onRefresh: () => void | Promise<void> }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        if (onRefresh) {
            try {
                await onRefresh(); 
            } catch (error) {
                console.error("Refresh failed:", error);
            }
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 200);
    };

    return (
        <button
            type="button"
            id="hh3d-latest-refresh"
            className={`hh3d-latest-refresh ${isLoading ? 'is-spinning': ''}`}
            aria-label="Làm mới danh sách"
            title="Làm mới danh sách"
            onClick={handleClick}
            disabled={isLoading}
        >
            <i className="fas fa-sync-alt"
                aria-hidden="true" />
            <span className="hh3d-latest-refresh-label">Làm mới</span>
        </button>
    );
}
