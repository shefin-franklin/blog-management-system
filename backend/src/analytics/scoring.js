export function trendingScore(stats, createdAt = new Date()) {
  const ageHours = Math.max((Date.now() - new Date(createdAt).getTime()) / 36e5, 1);
  const weightedActivity =
    stats.views * 1 + stats.likes * 4 + stats.comments * 6 + stats.shares * 8 + stats.readDuration * 0.02;

  return Number((weightedActivity / Math.pow(ageHours, 0.8)).toFixed(2));
}

export function relatedScore(blog, candidate) {
  const tags = new Set((blog.tags || []).map(String));
  const categories = new Set((blog.categories || []).map(String));
  let score = 0;

  (candidate.tags || []).forEach((tag) => {
    if (tags.has(String(tag))) score += 5;
  });

  (candidate.categories || []).forEach((category) => {
    if (categories.has(String(category))) score += 8;
  });

  score += Math.max(0, 10 - Math.abs((candidate.stats?.trendingScore || 0) - (blog.stats?.trendingScore || 0)));
  return score;
}

export function personalizedScore(user, blog) {
  const interests = new Set((user?.interests || []).map((interest) => interest.toLowerCase()));
  let score = blog.stats?.trendingScore || 0;

  (blog.tags || []).forEach((tag) => {
    const name = tag.name || tag;
    if (interests.has(String(name).toLowerCase())) score += 12;
  });

  return score;
}
