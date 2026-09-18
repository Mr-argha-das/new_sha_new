'use client';

import { useRef, UIEvent, PropsWithChildren, ReactNode } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface Props<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasMore: boolean;
    fetchNextPage: () => void;
    onEndReachedOffset?: number; // px from right to trigger
    className?: string;
    itemGapPx?: number;
}

export default function HorizontalInfiniteList<T>(props: PropsWithChildren<Props<T>>) {
    const {
        items,
        renderItem,
        isLoading,
        isFetchingNextPage,
        hasMore,
        fetchNextPage,
        onEndReachedOffset = 200,
        className,
        itemGapPx = 12,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const onScroll = (e: UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
        if (remaining <= onEndReachedOffset && hasMore && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <div className={className}>
            <div
                ref={ref}
                onScroll={onScroll}
                style={{ overflowX: 'auto', display: 'flex', gap: itemGapPx, paddingBottom: 8 }}
            >
                {items.map((item, idx) => (
                    <div key={idx} style={{ flex: '0 0 auto' }}>
                        {renderItem(item, idx)}
                    </div>
                ))}
                {(isLoading || isFetchingNextPage) && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                        <CircularProgress size={22} />
                    </div>
                )}
            </div>
        </div>
    );
}