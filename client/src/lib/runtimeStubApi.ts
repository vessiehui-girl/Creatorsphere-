type StubUser = {
  id: number;
  email: string;
  name: string;
};

type StubPlatform = {
  id: number;
  platform: string;
  connected: boolean;
};

type StubVaultItem = {
  id: number;
  type: string;
  title: string;
  content?: string;
  fileUrl?: string;
};

type StubPost = {
  id: number;
  caption?: string;
  mediaUrl?: string;
  status?: string;
};

type StubPlannerItem = {
  id: number;
  postId: number;
  platform: string;
  scheduledFor: string;
};

type StubState = {
  currentUser: StubUser | null;
  platforms: StubPlatform[];
  vault: StubVaultItem[];
  posts: StubPost[];
  planner: StubPlannerItem[];
};

const STORAGE_KEY = 'creatorsphere.runtime-stub';

const defaultState = (): StubState => ({
  currentUser: { id: 1, email: 'creator@local.dev', name: 'Creator' },
  platforms: [
    { id: 1, platform: 'TikTok', connected: true },
    { id: 2, platform: 'Instagram', connected: false },
    { id: 3, platform: 'YouTube', connected: false },
  ],
  vault: [
    { id: 1, type: 'idea', title: 'Launch teaser concept' },
    { id: 2, type: 'caption', title: 'Weekend promo caption' },
  ],
  posts: [{ id: 1, caption: 'Behind the scenes', status: 'draft' }],
  planner: [],
});

const parseBody = (options?: RequestInit) => {
  if (!options?.body || typeof options.body !== 'string') return {};
  try {
    return JSON.parse(options.body);
  } catch {
    return {};
  }
};

const loadState = (): StubState => {
  if (typeof window === 'undefined') return defaultState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
};

const saveState = (state: StubState) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

let state = loadState();

const nextId = <T extends { id: number }>(items: T[]) =>
  items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;

const ensureUser = () => {
  if (!state.currentUser) {
    state.currentUser = { id: 1, email: 'creator@local.dev', name: 'Creator' };
  }
};

export async function runtimeStubApiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const body = parseBody(options);

  if (path === '/api/auth/me' && method === 'GET') {
    ensureUser();
    saveState(state);
    return state.currentUser as T;
  }

  if (path === '/api/auth/login' && method === 'POST') {
    state.currentUser = {
      id: 1,
      email: body.email || 'creator@local.dev',
      name: body.name || 'Creator',
    };
    saveState(state);
    return state.currentUser as T;
  }

  if (path === '/api/auth/register' && method === 'POST') {
    state.currentUser = {
      id: 1,
      email: body.email || 'creator@local.dev',
      name: body.name || 'Creator',
    };
    saveState(state);
    return state.currentUser as T;
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    state.currentUser = null;
    saveState(state);
    return null as T;
  }

  if (path === '/api/platforms' && method === 'GET') {
    return state.platforms as T;
  }

  if (path === '/api/platforms/connect' && method === 'POST') {
    const selected = Array.isArray(body.platforms) ? body.platforms : [];
    state.platforms = state.platforms.map((platform) => ({
      ...platform,
      connected: selected.includes(platform.platform),
    }));
    saveState(state);
    return state.platforms as T;
  }

  if (path === '/api/vault' && method === 'GET') {
    return state.vault as T;
  }

  if (path === '/api/vault' && method === 'POST') {
    const item: StubVaultItem = {
      id: nextId(state.vault),
      type: body.type || 'draft',
      title: body.title || 'Untitled Item',
      content: body.content,
      fileUrl: body.fileUrl,
    };
    state.vault = [item, ...state.vault];
    saveState(state);
    return item as T;
  }

  if (path === '/api/posts' && method === 'GET') {
    return state.posts as T;
  }

  if (path === '/api/posts' && method === 'POST') {
    const post: StubPost = {
      id: nextId(state.posts),
      caption: body.caption || '',
      mediaUrl: body.mediaUrl,
      status: body.status || 'draft',
    };
    state.posts = [post, ...state.posts];
    saveState(state);
    return post as T;
  }

  if (path === '/api/planner' && method === 'GET') {
    return state.planner as T;
  }

  if (path === '/api/planner/schedule' && method === 'POST') {
    const item: StubPlannerItem = {
      id: nextId(state.planner),
      postId: Number(body.postId) || (state.posts[0]?.id ?? 1),
      platform: body.platform || 'TikTok',
      scheduledFor: body.scheduledFor || new Date().toISOString(),
    };
    state.planner = [item, ...state.planner];
    saveState(state);
    return item as T;
  }

  if (path === '/api/analytics/summary' && method === 'GET') {
    const connected = state.platforms.filter((p) => p.connected);
    const stats = connected.map((platform, index) => ({
      platform: platform.platform,
      views: 1000 + index * 250,
      likes: 120 + index * 25,
      comments: 20 + index * 5,
    }));
    return stats as T;
  }

  return [] as T;
}
