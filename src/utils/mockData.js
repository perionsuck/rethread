// Mock data — replace with Supabase queries later

export const MOCK_USERS = [
  { id: "u1", username: "threadbare_alex", displayName: "Alex Chen", avatar: null, bio: "Turning trash into treasure since 2021 ♻️", karma: 342, rankedPoints: 85, posts: 12, joined: "2024-01-15" },
  { id: "u2", username: "sewsustainable", displayName: "Mira Patel", avatar: null, bio: "Zero-waste fashion designer. Every stitch counts.", karma: 891, rankedPoints: 210, posts: 34, joined: "2023-06-20" },
  { id: "u3", username: "patchwork_riley", displayName: "Riley Kim", avatar: null, bio: "Denim lover. Patchwork enthusiast.", karma: 567, rankedPoints: 150, posts: 23, joined: "2023-09-10" },
  { id: "u4", username: "eco_stitcher", displayName: "Sam Torres", avatar: null, bio: "Making old things new again 🌿", karma: 234, rankedPoints: 45, posts: 8, joined: "2024-03-01" },
  { id: "u5", username: "vintagevibes_jo", displayName: "Jo Williams", avatar: null, bio: "Thrift flip queen. DIY or die.", karma: 1203, rankedPoints: 320, posts: 45, joined: "2022-11-05" },
];

export const MOCK_POSTS = [
  {
    id: "p1", userId: "u2", username: "sewsustainable", displayName: "Mira Patel",
    title: "Turned my old curtains into a summer dress!",
    beforeImg: "🪟", afterImg: "👗",
    process: "Found these gorgeous floral curtains at a thrift store. Cut them into a simple A-line pattern, added elastic waist, and hand-stitched the hem. Total cost: $3!",
    upvotes: 89,
    comments: [
      { id: "c1", userId: "u3", username: "patchwork_riley", text: "This is incredible! The print works perfectly as a dress.", time: "2h ago" },
      { id: "c2", userId: "u5", username: "vintagevibes_jo", text: "Need a tutorial for this!! 🔥", time: "1h ago" },
    ],
    timeAgo: "4h ago", competitionId: null,
  },
  {
    id: "p2", userId: "u3", username: "patchwork_riley", displayName: "Riley Kim",
    title: "Denim jacket → Patchwork tote bag",
    beforeImg: "🧥", afterImg: "👜",
    process: "My old denim jacket had too many stains to wear. Cut it into patches, mixed with some scrap fabric, and sewed a sturdy tote. Added a vintage belt as the strap!",
    upvotes: 156,
    comments: [
      { id: "c3", userId: "u1", username: "threadbare_alex", text: "The belt strap idea is genius", time: "5h ago" },
    ],
    timeAgo: "8h ago", competitionId: "comp1",
  },
  {
    id: "p3", userId: "u5", username: "vintagevibes_jo", displayName: "Jo Williams",
    title: "Stained white shirt → Tie-dye crop top",
    beforeImg: "👔", afterImg: "🎨",
    process: "Had coffee stains that wouldn't come out. Used natural dyes from avocado pits (pink!) and turmeric (yellow). Cropped it, added a raw hem edge. Looks completely intentional now!",
    upvotes: 234,
    comments: [
      { id: "c4", userId: "u2", username: "sewsustainable", text: "Natural dyes are so underrated! Love the avocado pink.", time: "1d ago" },
      { id: "c5", userId: "u4", username: "eco_stitcher", text: "How long did the dye take to set?", time: "20h ago" },
      { id: "c6", userId: "u5", username: "vintagevibes_jo", text: "@eco_stitcher About 2 hours in the dye bath, then overnight to dry!", time: "18h ago" },
    ],
    timeAgo: "1d ago", competitionId: null,
  },
  {
    id: "p4", userId: "u1", username: "threadbare_alex", displayName: "Alex Chen",
    title: "Old sweater → Cozy mittens + headband set",
    beforeImg: "🧶", afterImg: "🧤",
    process: "Felted an old wool sweater in the washing machine, then cut out mitten shapes and a headband strip. Simple blanket stitch around the edges. Perfect for winter!",
    upvotes: 67,
    comments: [],
    timeAgo: "2d ago", competitionId: "comp1",
  },
  {
    id: "p5", userId: "u4", username: "eco_stitcher", displayName: "Sam Torres",
    title: "Ripped jeans → Denim plant pot covers",
    beforeImg: "👖", afterImg: "🪴",
    process: "Cut the legs off, turned inside out, stitched the bottom closed, and rolled the top edge. Added a waterproof liner. My plants have never looked so stylish!",
    upvotes: 45,
    comments: [
      { id: "c7", userId: "u3", username: "patchwork_riley", text: "This is such a creative use! Stealing this idea.", time: "1d ago" },
    ],
    timeAgo: "3d ago", competitionId: null,
  },
];

export const MOCK_COMPETITIONS = [
  { id: "comp1", title: "Denim Reimagined", description: "Transform any denim piece into something completely new. Jackets, jeans, skirts — show us what denim can become!", theme: "🔵 Denim", deadline: "2026-04-20", entries: 12, status: "active" },
  { id: "comp2", title: "Zero-Waste Formal", description: "Create formal/evening wear using only upcycled materials. Prove sustainability can be glamorous!", theme: "✨ Formal", deadline: "2026-05-01", entries: 5, status: "active" },
  { id: "comp3", title: "T-Shirt Transformation", description: "Old t-shirts only! Cut, sew, dye, print — anything goes.", theme: "👕 T-Shirts", deadline: "2026-03-15", entries: 28, winner: "u5", status: "ended" },
];

export const AI_RECOMMENDATIONS = [
  {
    title: "Embroidered Patch Art", icon: "🪡",
    description: "Add hand-embroidered botanical designs over worn areas. Use satin stitch for flowers and stem stitch for vines.",
    steps: [
      "Sketch your design with washable marker on the fabric",
      "Thread embroidery needle with 3 strands of floss",
      "Start with stem stitch outlines for stems and vines",
      "Fill flower petals with satin stitch in contrasting colors",
      "Add French knots for flower centers and small details",
      "Press finished embroidery with a damp cloth on reverse side",
    ],
  },
  {
    title: "Crop & Fringe Restyle", icon: "✂️",
    description: "Transform into a trendy cropped piece with a fringed hem. Modern, edgy, and no-sew friendly.",
    steps: [
      "Try on the garment and mark desired crop length with chalk",
      "Cut straight across at the marked line",
      "Cut vertical slits 1cm apart, 8cm deep along the bottom edge",
      "Stretch each fringe strip to make them curl naturally",
      "Optional: add beads to some fringe strips and knot ends",
      "Wash gently to let the fringe relax and curl more",
    ],
  },
  {
    title: "Patchwork Color Block", icon: "🎨",
    description: "Cut and reassemble with contrasting fabric scraps to create a bold color-blocked patchwork design.",
    steps: [
      "Collect 3-4 coordinating scrap fabrics in different colors",
      "Cut geometric shapes from both old garment and new fabrics",
      "Lay out your patchwork design on a flat surface",
      "Pin pieces together with 1cm seam allowance",
      "Sew pieces together, pressing seams open as you go",
      "Finish raw edges with zigzag stitch or bias tape",
    ],
  },
];
