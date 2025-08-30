import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Auth middleware to verify users
const requireAuth = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Utility function to get user profile from KV store
const getUserProfile = async (userId: string) => {
  const profile = await kv.get(`user:${userId}`);
  return profile;
};

// Utility function to generate unique IDs
const generateId = () => {
  return crypto.randomUUID();
};

// Health check endpoint
app.get("/make-server-57d47cd5/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication routes
app.post("/make-server-57d47cd5/auth/signup", async (c) => {
  try {
    const { email, password, userData } = await c.req.json();
    
    console.log('Creating user account for:', email);
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userData,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store user profile in KV store
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      role: userData.role,
      profile: userData,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    await kv.set(`user:${data.user.id}`, userProfile);
    
    // Add user to role-based list for easier querying
    const roleKey = `users:${userData.role}`;
    const existingUsers = await kv.get(roleKey) || [];
    existingUsers.push(data.user.id);
    await kv.set(roleKey, existingUsers);
    
    console.log('User created successfully:', data.user.id);
    return c.json({ 
      user: data.user, 
      profile: userProfile 
    });
    
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create user account' }, 500);
  }
});

// Get user profile
app.get("/make-server-57d47cd5/user/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    // Update last active timestamp
    profile.lastActive = new Date().toISOString();
    await kv.set(`user:${user.id}`, profile);
    
    return c.json(profile);
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get user profile' }, 500);
  }
});

// Update user profile
app.put("/make-server-57d47cd5/user/profile", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const updates = await c.req.json();
    
    const existingProfile = await getUserProfile(user.id);
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    const updatedProfile = {
      ...existingProfile,
      profile: { ...existingProfile.profile, ...updates },
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`user:${user.id}`, updatedProfile);
    
    return c.json(updatedProfile);
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Posts management
app.get("/make-server-57d47cd5/posts", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userProfile = await getUserProfile(user.id);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    // For buyers, show farmer posts. For farmers, show their own posts
    let posts = [];
    
    if (userProfile.role === 'buyer') {
      // Get all farmer posts
      const farmerIds = await kv.get('users:farmer') || [];
      for (const farmerId of farmerIds) {
        const farmerPosts = await kv.get(`posts:${farmerId}`) || [];
        for (const post of farmerPosts) {
          const farmerProfile = await getUserProfile(farmerId);
          posts.push({
            ...post,
            farmerName: farmerProfile?.profile?.name || 'Unknown Farmer',
            farmerLocation: farmerProfile?.profile?.location || 'Unknown Location'
          });
        }
      }
    } else {
      // Get user's own posts
      posts = await kv.get(`posts:${user.id}`) || [];
    }
    
    // Sort by creation date (newest first)
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json(posts);
  } catch (error) {
    console.log('Get posts error:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// Create new post
app.post("/make-server-57d47cd5/posts", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const postData = await c.req.json();
    
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const newPost = {
      id: generateId(),
      userId: user.id,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get existing posts for user
    const userPosts = await kv.get(`posts:${user.id}`) || [];
    userPosts.push(newPost);
    
    await kv.set(`posts:${user.id}`, userPosts);
    
    console.log('Post created successfully:', newPost.id);
    return c.json(newPost);
  } catch (error) {
    console.log('Create post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

// Tools management
app.get("/make-server-57d47cd5/tools", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userProfile = await getUserProfile(user.id);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    let tools = [];
    
    if (userProfile.role === 'farmer') {
      // Get all renter tools
      const renterIds = await kv.get('users:renter') || [];
      for (const renterId of renterIds) {
        const renterTools = await kv.get(`tools:${renterId}`) || [];
        for (const tool of renterTools) {
          const renterProfile = await getUserProfile(renterId);
          tools.push({
            ...tool,
            renterName: renterProfile?.profile?.name || 'Unknown Renter',
            renterLocation: renterProfile?.profile?.location || 'Unknown Location',
            renterPhone: renterProfile?.profile?.phoneNumber || 'N/A'
          });
        }
      }
    } else {
      // Get user's own tools
      tools = await kv.get(`tools:${user.id}`) || [];
    }
    
    return c.json(tools);
  } catch (error) {
    console.log('Get tools error:', error);
    return c.json({ error: 'Failed to fetch tools' }, 500);
  }
});

// Create new tool listing
app.post("/make-server-57d47cd5/tools", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const toolData = await c.req.json();
    
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const newTool = {
      id: generateId(),
      userId: user.id,
      ...toolData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const userTools = await kv.get(`tools:${user.id}`) || [];
    userTools.push(newTool);
    
    await kv.set(`tools:${user.id}`, userTools);
    
    return c.json(newTool);
  } catch (error) {
    console.log('Create tool error:', error);
    return c.json({ error: 'Failed to create tool listing' }, 500);
  }
});

// Seeds management
app.get("/make-server-57d47cd5/seeds", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userProfile = await getUserProfile(user.id);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    let seeds = [];
    
    if (userProfile.role === 'farmer') {
      // Get all renter seeds
      const renterIds = await kv.get('users:renter') || [];
      for (const renterId of renterIds) {
        const renterSeeds = await kv.get(`seeds:${renterId}`) || [];
        for (const seed of renterSeeds) {
          const renterProfile = await getUserProfile(renterId);
          seeds.push({
            ...seed,
            renterName: renterProfile?.profile?.name || 'Unknown Renter',
            renterLocation: renterProfile?.profile?.location || 'Unknown Location',
            renterPhone: renterProfile?.profile?.phoneNumber || 'N/A'
          });
        }
      }
    } else {
      // Get user's own seeds
      seeds = await kv.get(`seeds:${user.id}`) || [];
    }
    
    return c.json(seeds);
  } catch (error) {
    console.log('Get seeds error:', error);
    return c.json({ error: 'Failed to fetch seeds' }, 500);
  }
});

// Create new seed listing
app.post("/make-server-57d47cd5/seeds", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const seedData = await c.req.json();
    
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const newSeed = {
      id: generateId(),
      userId: user.id,
      ...seedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const userSeeds = await kv.get(`seeds:${user.id}`) || [];
    userSeeds.push(newSeed);
    
    await kv.set(`seeds:${user.id}`, userSeeds);
    
    return c.json(newSeed);
  } catch (error) {
    console.log('Create seed error:', error);
    return c.json({ error: 'Failed to create seed listing' }, 500);
  }
});

// Notifications management
app.post("/make-server-57d47cd5/notifications/subscribe", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { subscription, preferences } = await c.req.json();
    
    const notificationData = {
      userId: user.id,
      subscription,
      preferences,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`notification:${user.id}`, notificationData);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Subscribe notifications error:', error);
    return c.json({ error: 'Failed to subscribe to notifications' }, 500);
  }
});

app.get("/make-server-57d47cd5/notifications", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const notifications = await kv.get(`notifications:${user.id}`) || [];
    
    return c.json(notifications);
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

app.put("/make-server-57d47cd5/notifications/:id/read", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const notificationId = c.req.param('id');
    
    const notifications = await kv.get(`notifications:${user.id}`) || [];
    const updatedNotifications = notifications.map((notif: any) => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    
    await kv.set(`notifications:${user.id}`, updatedNotifications);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Mark notification read error:', error);
    return c.json({ error: 'Failed to mark notification as read' }, 500);
  }
});

// Send notification to users
app.post("/make-server-57d47cd5/notifications/send", requireAuth, async (c) => {
  try {
    const { type, message, targetUsers } = await c.req.json();
    const sender = c.get('user');
    
    const notification = {
      id: generateId(),
      type,
      message,
      senderId: sender.id,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // If no target users specified, send to all users
    const users = targetUsers || [];
    if (users.length === 0) {
      // Get all user IDs
      const roles = ['farmer', 'buyer', 'renter'];
      for (const role of roles) {
        const roleUsers = await kv.get(`users:${role}`) || [];
        users.push(...roleUsers);
      }
    }
    
    // Add notification to each target user
    for (const userId of users) {
      if (userId === sender.id) continue; // Don't send to self
      
      const userNotifications = await kv.get(`notifications:${userId}`) || [];
      userNotifications.unshift(notification); // Add to beginning
      
      // Keep only last 50 notifications
      if (userNotifications.length > 50) {
        userNotifications.splice(50);
      }
      
      await kv.set(`notifications:${userId}`, userNotifications);
    }
    
    return c.json({ success: true, sentTo: users.length });
  } catch (error) {
    console.log('Send notification error:', error);
    return c.json({ error: 'Failed to send notification' }, 500);
  }
});

// Weather alerts
app.post("/make-server-57d47cd5/weather/alerts", requireAuth, async (c) => {
  try {
    const { alertType, location, severity, message } = await c.req.json();
    
    const weatherAlert = {
      id: generateId(),
      type: 'weather',
      alertType,
      location,
      severity,
      message: {
        title: `Weather Alert: ${alertType}`,
        body: message,
        severity
      },
      timestamp: new Date().toISOString()
    };
    
    // Get all farmers in the affected location
    const farmerIds = await kv.get('users:farmer') || [];
    const targetUsers = [];
    
    for (const farmerId of farmerIds) {
      const farmerProfile = await getUserProfile(farmerId);
      if (farmerProfile && farmerProfile.profile.location.toLowerCase().includes(location.toLowerCase())) {
        targetUsers.push(farmerId);
      }
    }
    
    // Send alert to affected farmers
    for (const userId of targetUsers) {
      const userNotifications = await kv.get(`notifications:${userId}`) || [];
      userNotifications.unshift(weatherAlert);
      
      if (userNotifications.length > 50) {
        userNotifications.splice(50);
      }
      
      await kv.set(`notifications:${userId}`, userNotifications);
    }
    
    return c.json({ success: true, alertsSent: targetUsers.length });
  } catch (error) {
    console.log('Weather alert error:', error);
    return c.json({ error: 'Failed to send weather alert' }, 500);
  }
});

// Price alerts
app.post("/make-server-57d47cd5/price/alerts", requireAuth, async (c) => {
  try {
    const { cropType, priceChange, newPrice, location } = await c.req.json();
    
    const priceAlert = {
      id: generateId(),
      type: 'price',
      cropType,
      priceChange,
      newPrice,
      location,
      message: {
        title: `Price Alert: ${cropType}`,
        body: `Price ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChange)}% to ₹${newPrice} in ${location}`,
        priceChange,
        newPrice
      },
      timestamp: new Date().toISOString()
    };
    
    // Get all farmers and buyers
    const farmerIds = await kv.get('users:farmer') || [];
    const buyerIds = await kv.get('users:buyer') || [];
    const targetUsers = [...farmerIds, ...buyerIds];
    
    // Send alert to all farmers and buyers
    for (const userId of targetUsers) {
      const userNotifications = await kv.get(`notifications:${userId}`) || [];
      userNotifications.unshift(priceAlert);
      
      if (userNotifications.length > 50) {
        userNotifications.splice(50);
      }
      
      await kv.set(`notifications:${userId}`, userNotifications);
    }
    
    return c.json({ success: true, alertsSent: targetUsers.length });
  } catch (error) {
    console.log('Price alert error:', error);
    return c.json({ error: 'Failed to send price alert' }, 500);
  }
});

// Analytics endpoint for admin purposes
app.get("/make-server-57d47cd5/analytics", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userProfile = await getUserProfile(user.id);
    
    // Only allow admin access or provide user-specific analytics
    const analytics = {
      userPosts: (await kv.get(`posts:${user.id}`) || []).length,
      userTools: (await kv.get(`tools:${user.id}`) || []).length,
      userSeeds: (await kv.get(`seeds:${user.id}`) || []).length,
      notifications: (await kv.get(`notifications:${user.id}`) || []).length,
      role: userProfile?.role,
      joinDate: userProfile?.createdAt,
      lastActive: userProfile?.lastActive
    };
    
    return c.json(analytics);
  } catch (error) {
    console.log('Analytics error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

console.log('Velan AI server starting...');
Deno.serve(app.fetch);