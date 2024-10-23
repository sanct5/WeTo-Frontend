export const getTopReactions = (reactions: any) => {
    const reactionCounts: Record<string, number> = reactions?.reduce((acc: Record<string, number>, reaction: { type: string }) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    return Object.keys(reactionCounts)
        .sort((a, b) => reactionCounts[b] - reactionCounts[a])
        .slice(0, 3);
};
