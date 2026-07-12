import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt, sign, verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

app.get('/', (c) => {
  return c.text('ClubPass API is running!')
})

// === AUTH ===
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json()
  // Mock login logic for demo purposes.
  // In production, query Admins/HODs/Coordinators tables and check password_hash
  let user = null;
  
  if (email === 'admin@clubpass.com' && password === 'admin123') {
    user = { id: 'admin1', name: 'Super Admin', email, role: 'super_admin' };
  } else if (email === 'hod@clubpass.com' && password === 'hod123') {
    user = { id: 'hod1', name: 'Dr. Smith', email, role: 'hod', department: 'CSE' };
  } else if (email === 'coord@clubpass.com' && password === 'coord123') {
    user = { id: 'coord1', name: 'John Doe', email, role: 'coordinator', club_id: 'club1' };
  }

  if (user) {
    const token = await sign({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET || 'secret');
    return c.json({ token, user });
  }

  return c.json({ error: 'Invalid credentials' }, 401);
})

// === MEMBERS ===
app.get('/api/members/:id', async (c) => {
  const id = c.req.param('id')
  // Fetch member info
  try {
    const member = await c.env.DB.prepare('SELECT * FROM Members WHERE id = ?').bind(id).first();
    if (!member) return c.json({ error: 'Member not found' }, 404);
    
    // Also fetch club info
    const club = await c.env.DB.prepare('SELECT name FROM Clubs WHERE id = ?').bind(member.club_id).first();
    
    return c.json({ ...member, club_name: club?.name || 'Unknown Club' });
  } catch (e) {
    return c.json({ error: 'Database error' }, 500);
  }
})

// === PERMISSIONS ===
// Check today's permission
app.get('/api/permissions/today/:member_id', async (c) => {
  const member_id = c.req.param('member_id')
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const permission = await c.env.DB.prepare('SELECT * FROM Permissions WHERE member_id = ? AND date = ?').bind(member_id, today).first();
    if (permission) {
      // fetch HOD name
      const hod = await c.env.DB.prepare('SELECT name FROM HODs WHERE id = ?').bind(permission.hod_id).first();
      return c.json({ permission, hod_name: hod?.name || 'Unknown HOD' });
    }
    return c.json({ permission: null });
  } catch (e) {
    return c.json({ error: 'Database error' }, 500);
  }
})

app.post('/api/permissions', async (c) => {
  // Requires HOD role (middleware omitted for brevity in this mock)
  const { member_id, hod_id, purpose, remark, status } = await c.req.json()
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];
  const id = crypto.randomUUID();

  try {
    // Unique constraint on (member_id, date) will throw error if duplicate
    await c.env.DB.prepare(
      'INSERT INTO Permissions (id, member_id, hod_id, date, time, purpose, remark, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, member_id, hod_id, date, time, purpose, remark, status).run();
    
    return c.json({ success: true, id });
  } catch (e: any) {
    if (e.message.includes('UNIQUE constraint failed')) {
       return c.json({ error: 'Permission already granted today' }, 400);
    }
    return c.json({ error: 'Database error' }, 500);
  }
})

export default app
