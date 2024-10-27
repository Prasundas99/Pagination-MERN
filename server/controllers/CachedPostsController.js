import Post from "../model/postSchema.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const addPostsController = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newPost = new Post({ title, content });
    await newPost.save();

    cache.flushAll();

    // For infinity Scroll
    await refreshInitialCache();

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while adding the post" });
  }
};

export const getInfiniteScrollController = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const lastItemId = req.query.lastItemId || null;

  const cacheKey = `infinite_${lastItemId}_${limit}`;

  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({
      posts: cachedData.posts,
      lastItemId: cachedData.lastItemId,
      fromCache: true,
    });
  }

  try {
    let query = {};

    if (
      lastItemId ||
      lastItemId !== null ||
      lastItemId !== undefined ||
      lastItemId !== "null"
    ) {
      query = { _id: { $gt: lastItemId } };
    }

    const posts = await Post.find(lastItemId ? query : {})
      .select({ _id: 1, title: 1, content: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const newLastItemId = posts[posts.length - 1]?._id;

    // Cache the result
    cache.set(cacheKey, { posts, lastItemId: newLastItemId });

    console.log(posts);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts,
        lastItemId: newLastItemId,
        fromCache: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaginationController = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const cacheKey = `paginate_${page}_${limit}`;

  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({
      posts: cachedData.posts,
      currentPage: page,
      totalPages: cachedData.totalPages,
      hasNextPage: cachedData.hasNextPage,
      hasPreviousPage: cachedData.hasPreviousPage,
      fromCache: true,
    });
  }

  try {
    const total = await Post.countDocuments();

    const posts = await Post.find()
      .select({ _id: 1, title: 1, content: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .hint({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    // Cache the result
    cache.set(cacheKey, {
      posts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });

    console.log(posts);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts,
        total,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        fromCache: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const refreshInitialCache = async() => {
  console.log("Refreshing initial cache...");
  const limit = 10;
  const lastItemId = null;

  const cacheKey = `infinite_${lastItemId}_${limit}`;

  console.log(cacheKey);

  try {
    const posts = await Post.find()
      .select({ _id: 1, title: 1, content: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const newLastItemId = posts[posts.length - 1]?._id;

    // Cache the result
    cache.set(cacheKey, { posts, lastItemId: newLastItemId });
    console.log("cache set for infinite scroll cache");
  } catch (error) {
    console.error("Error fetching infinite scroll posts:", error);
  }

  const page =  1;
  const skip = (page - 1) * limit;

  const cacheKeyForPagination = `paginate_${page}_${limit}`;

  console.log(cacheKeyForPagination);
  try {
    const total = await Post.countDocuments();

    const posts = await Post.find()
      .select({ _id: 1, title: 1, content: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .hint({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    // Cache the result
    cache.set(cacheKeyForPagination, {
      posts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });

    console.log("cache set for pagination cache");
  } catch (error) {
    console.error("Error fetching pagination posts:", error);
  }
}

