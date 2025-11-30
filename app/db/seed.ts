import { prisma } from "./client.server";
import { hashPassword } from "../services/auth.server";
async function seed() {
  const hashedPassword = await hashPassword("password");
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const users = await Promise.all([
    prisma.user.create({ data: { username: "alice", email: "alice@example.com", password: hashedPassword, displayName: "Alice Anderson", bio: "Software Developer | Coffee Enthusiast | Love Building Cool Stuff", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice", isAdmin: true } }),
    prisma.user.create({ data: { username: "bob", email: "bob@example.com", password: hashedPassword, displayName: "Bob Builder", bio: "Full Stack Developer | React And Node.js | Open Source Contributor", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" } }),
    prisma.user.create({ data: { username: "charlie", email: "charlie@example.com", password: hashedPassword, displayName: "Charlie Chen", bio: "UI/UX Designer | Creating Beautiful Experiences", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie" } }),
    prisma.user.create({ data: { username: "diana", email: "diana@example.com", password: hashedPassword, displayName: "Diana Davis", bio: "Product Manager | Tech Enthusiast | Dog Mom", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana" } }),
    prisma.user.create({ data: { username: "eve", email: "eve@example.com", password: hashedPassword, displayName: "Eve Evans", bio: "Data Scientist | AI And Machine Learning | Python Developer", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve" } })
  ]);
  const posts = await Promise.all([
    prisma.post.create({ data: { userId: users[0].id, content: "Just Launched My New Project!\n\nExcited To Share What I Have Been Working On For The Past Few Months. Check It Out And Let Me Know What You Think! #webdev #javascript #react", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[1].id, content: "Pro Tip For Developers: Always Write Tests Before You Debug. Your Future Self Will Thank You! #coding #bestpractices", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[2].id, content: "Here Are My Top 5 Design Tools For 2024:\n\n1. Figma\n2. Adobe XD\n3. Sketch\n4. Framer\n5. Principle\n\nWhat Is Your Favorite? #design #ux #tools", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[0].id, content: "Coffee And Code Makes A Perfect Morning #developerlife", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[3].id, content: "Just Finished Reading \"The Lean Startup\" By Eric Ries. Highly Recommend For Anyone In Tech! #productmanagement #books #startup", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[4].id, content: "Excited About The Latest Advances In AI! The Future Is Here #artificialintelligence #machinelearning #tech", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[1].id, content: "Quick Question: TypeScript Or JavaScript? Let Me Know Your Thoughts! #typescript #javascript #webdev", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } }),
    prisma.post.create({ data: { userId: users[2].id, content: "New Blog Post: \"10 Design Principles Every Developer Should Know\" - Link In Bio! #design #webdesign #development", likesCount: 0, commentsCount: 0, bookmarksCount: 0 } })
  ]);
  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[0].id },
      { followerId: users[1].id, followingId: users[3].id },
      { followerId: users[2].id, followingId: users[0].id },
      { followerId: users[2].id, followingId: users[4].id },
      { followerId: users[3].id, followingId: users[1].id },
      { followerId: users[4].id, followingId: users[0].id },
      { followerId: users[4].id, followingId: users[2].id }
    ]
  });
  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: users[1].id },
      { postId: posts[0].id, userId: users[2].id },
      { postId: posts[0].id, userId: users[4].id },
      { postId: posts[1].id, userId: users[0].id },
      { postId: posts[1].id, userId: users[3].id },
      { postId: posts[2].id, userId: users[0].id },
      { postId: posts[2].id, userId: users[1].id },
      { postId: posts[3].id, userId: users[1].id },
      { postId: posts[4].id, userId: users[2].id },
      { postId: posts[5].id, userId: users[0].id },
      { postId: posts[6].id, userId: users[0].id },
      { postId: posts[6].id, userId: users[2].id }
    ]
  });
  await prisma.post.update({ where: { id: posts[0].id }, data: { likesCount: { increment: 3 } } });
  await prisma.post.update({ where: { id: posts[1].id }, data: { likesCount: { increment: 2 } } });
  await prisma.post.update({ where: { id: posts[2].id }, data: { likesCount: { increment: 2 } } });
  await prisma.post.update({ where: { id: posts[3].id }, data: { likesCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[4].id }, data: { likesCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[5].id }, data: { likesCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[6].id }, data: { likesCount: { increment: 2 } } });
  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, userId: users[1].id, content: "This Looks Amazing! Great Work!" },
      { postId: posts[0].id, userId: users[2].id, content: "Can Not Wait To Try It Out!" },
      { postId: posts[1].id, userId: users[0].id, content: "So True! Testing Saves So Much Time In The Long Run." },
      { postId: posts[2].id, userId: users[1].id, content: "I Am Team Figma All The Way!" },
      { postId: posts[6].id, userId: users[0].id, content: "TypeScript For Sure! The Type Safety Is Worth It." }
    ]
  });
  await prisma.post.update({ where: { id: posts[0].id }, data: { commentsCount: { increment: 2 } } });
  await prisma.post.update({ where: { id: posts[1].id }, data: { commentsCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[2].id }, data: { commentsCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[6].id }, data: { commentsCount: { increment: 1 } } });
  await prisma.bookmark.createMany({
    data: [
      { postId: posts[1].id, userId: users[0].id },
      { postId: posts[2].id, userId: users[0].id },
      { postId: posts[4].id, userId: users[1].id },
      { postId: posts[5].id, userId: users[2].id }
    ]
  });
  await prisma.post.update({ where: { id: posts[1].id }, data: { bookmarksCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[2].id }, data: { bookmarksCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[4].id }, data: { bookmarksCount: { increment: 1 } } });
  await prisma.post.update({ where: { id: posts[5].id }, data: { bookmarksCount: { increment: 1 } } });
  await prisma.notification.createMany({
    data: [
      { userId: users[0].id, type: "like", content: "Liked Your Post", actorId: users[1].id, postId: posts[0].id, isRead: false },
      { userId: users[0].id, type: "comment", content: "Commented On Your Post", actorId: users[1].id, postId: posts[0].id, isRead: false },
      { userId: users[1].id, type: "follow", content: "Started Following You", actorId: users[0].id, isRead: true }
    ]
  });
  await prisma.message.createMany({
    data: [
      { senderId: users[1].id, receiverId: users[0].id, content: "Hey! Love Your Latest Project!", isRead: true },
      { senderId: users[0].id, receiverId: users[1].id, content: "Thanks So Much! Appreciate It!", isRead: true },
      { senderId: users[2].id, receiverId: users[0].id, content: "Can We Collaborate On A Design Project?", isRead: false }
    ]
  });
}
seed().catch(() => { process.exit(1) });
