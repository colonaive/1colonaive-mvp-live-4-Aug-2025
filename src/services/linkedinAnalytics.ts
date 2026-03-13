/**
 * LinkedIn Post Performance Analytics — placeholder service.
 *
 * Currently returns zeroed metrics.
 * Future: integrate LinkedIn Analytics API to fetch real engagement data.
 */

export interface PostPerformance {
  post_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  last_checked: string | null;
}

export const linkedinAnalytics = {
  /**
   * Get performance metrics for a single post.
   * Placeholder — returns zero metrics until LinkedIn Analytics API is integrated.
   */
  getPostPerformance: async (postId: string): Promise<PostPerformance> => {
    return {
      post_id: postId,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      last_checked: null,
    };
  },

  /**
   * Get performance metrics for multiple posts.
   */
  getBatchPerformance: async (postIds: string[]): Promise<PostPerformance[]> => {
    return postIds.map((id) => ({
      post_id: id,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      last_checked: null,
    }));
  },
};
