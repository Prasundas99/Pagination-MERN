import Post from "../model/postSchema.js";

export const addPostsController = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const posts = []

  for(let i = 0; i <= 10000000; i++){
    posts.push({title: `Post-test-${i + 2000007}`, content: `Content ${i + 2000007}`})
  }

  await Post.insertMany(posts)

  res.status(200).json({ message: "Post added successfully" });
};

export const getInfiniteScrollController = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const lastItemId = req.query.lastItemId || null;

  try {
    let query = {};

    if (lastItemId) {
      query = { _id: { $gt: lastItemId } };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts,
        lastItemId: posts[posts.length - 1]._id,
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

  try {
    const total = await Post.countDocuments();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts,
        total,
        totalPages: totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
