import { Hono } from 'hono'
import { cors } from 'hono/cors'


// IST Helpers
function getISTDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
}

function getISTTime() {
  return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }); // HH:MM:SS
}


function getISTTimeHM() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const nd = new Date(utc + (3600000 * 5.5));
  return `${nd.getHours().toString().padStart(2, '0')}:${nd.getMinutes().toString().padStart(2, '0')}`;
}

function computeEffectiveStatus(p: any, currentDate: string, currentHM: string) {
  if (!p) return null;
  // If the permission is closed or rejected, that is its final state.
  if (p.status === 'closed' || p.status === 'rejected') return p.status;
  
  // Only granted permissions can expire or remain active
  if (p.status === 'granted') {
    if (p.date < currentDate) return 'expired';
    if (p.date === currentDate) {
      if (currentHM >= '16:00') return 'expired';
      if (p.expected_return_time && currentHM >= p.expected_return_time) return 'expired';
    }
    return 'active'; // Meaning it's granted and currently valid
  }
  
  return p.status;
}

function getUTCDateTime() {
  return new Date().toISOString();
}

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

type Variables = {
  user?: {
    id: string
    name: string
    email: string
    role: string
    department?: string
    club_id?: string
    club_name?: string
    must_change_password?: boolean
  }
}

export type AppType = Hono<{ Bindings: Bindings; Variables: Variables }>

// Simple JWT helpers (no external dependency)
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return atob(str)
}

export async function signJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const data = `${encodedHeader}.${encodedPayload}`

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)))

  return `${data}.${encodedSignature}`
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const data = `${parts[0]}.${parts[1]}`
    const signature = parts[2]

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data))

    if (!valid) return null

    const payload = JSON.parse(base64UrlDecode(parts[1]))

    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) return null

    return payload
  } catch {
    return null
  }
}

// Audit log helper
export async function createAuditLog(
  db: D1Database,
  userId: string | null,
  userRole: string | null,
  action: string,
  details: string,
  ipAddress?: string
) {
  const id = crypto.randomUUID()
  await db.prepare(
    'INSERT INTO audit_logs (id, user_id, user_role, action, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, userId, userRole, action, details, ipAddress || null).run()
}

// Notification helper
export async function createNotification(
  db: D1Database,
  recipientId: string,
  recipientRole: string,
  type: string,
  title: string,
  message: string,
  relatedMemberUuid?: string
) {
  const id = crypto.randomUUID()
  await db.prepare(
    'INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message, related_member_uuid) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, recipientId, recipientRole, type, title, message, relatedMemberUuid || null).run()
}

// Password hashing — bcryptjs for Workers (pure JS, no native deps)
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hashSync(password, 10)
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // Support bcrypt hashes ($2a$, $2b$, $2y$)
  if (storedHash.startsWith('$2')) {
    return bcrypt.compareSync(password, storedHash)
  }
  // Fallback: SHA-256 hex hash (legacy)
  const data = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === storedHash || password === storedHash
}

// Password validation helper
function validatePassword(password: string): string | null {
  if (password.length < 12) return 'Password must be at least 12 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain a number'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain a special character'
  return null
}

// Format member ID: CLB-000001
function formatMemberId(id: number): string {
  return `CLB-${String(id).padStart(6, '0')}`
}

// ============================================================
// APP
// ============================================================

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'ClubPass API', version: '1.2' }))

// ============================================================
// AUTH ROUTES
// ============================================================

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const secret = c.env.JWT_SECRET || 'clubpass-secret-key-2024'
    const identifier = email.trim()

    // Check admins
    const admin = await c.env.DB.prepare('SELECT * FROM admins WHERE email = ?').bind(identifier).first()
    if (admin) {
      // Check lockout
      if (admin.locked_until) {
        const lockTime = new Date(admin.locked_until as string).getTime()
        if (Date.now() < lockTime) {
          return c.json({ error: 'Account temporarily locked. Try again later.' }, 423)
        }
        // Lockout expired, reset
        await c.env.DB.prepare('UPDATE admins SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(admin.id).run()
      }

      const valid = await verifyPassword(password, admin.password_hash as string)
      if (valid) {
        await c.env.DB.prepare('UPDATE admins SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(admin.id).run()
        const tokenPayload = {
          id: admin.id,
          name: admin.name || 'Admin',
          email: admin.email,
          role: admin.role || 'super_admin',
          exp: Math.floor(Date.now() / 1000) + 86400 // 24h
        }
        const token = await signJWT(tokenPayload, secret)
        await createAuditLog(c.env.DB, admin.id as string, 'super_admin', 'LOGIN', `Admin login: ${identifier}`)
        return c.json({ token, user: { id: admin.id, name: admin.name || 'Admin', email: admin.email, role: admin.role || 'super_admin' } })
      } else {
        const attempts = ((admin.login_attempts as number) || 0) + 1
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
          await c.env.DB.prepare('UPDATE admins SET login_attempts = ?, locked_until = ? WHERE id = ?').bind(attempts, lockUntil, admin.id).run()
        } else {
          await c.env.DB.prepare('UPDATE admins SET login_attempts = ? WHERE id = ?').bind(attempts, admin.id).run()
        }
      }
    }

    // Check HODs
    const hod = await c.env.DB.prepare('SELECT * FROM hods WHERE email = ?').bind(identifier).first()
    if (hod) {
      if (hod.status === 'disabled') {
        return c.json({ error: 'Account has been disabled. Contact the administrator.' }, 403)
      }
      // Check lockout
      if (hod.locked_until) {
        const lockTime = new Date(hod.locked_until as string).getTime()
        if (Date.now() < lockTime) {
          return c.json({ error: 'Account temporarily locked. Try again later.' }, 423)
        }
        await c.env.DB.prepare('UPDATE hods SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(hod.id).run()
      }

      const valid = await verifyPassword(password, hod.password_hash as string)
      if (valid) {
        await c.env.DB.prepare('UPDATE hods SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(hod.id).run()
        const tokenPayload = {
          id: hod.id,
          name: hod.name,
          email: hod.email,
          role: 'hod',
          department: hod.department,
          exp: Math.floor(Date.now() / 1000) + 86400
        }
        const token = await signJWT(tokenPayload, secret)
        await createAuditLog(c.env.DB, hod.id as string, 'hod', 'LOGIN', `HOD login: ${identifier}`)
        return c.json({ token, user: { id: hod.id, name: hod.name, email: hod.email, role: 'hod', department: hod.department } })
      } else {
        const attempts = ((hod.login_attempts as number) || 0) + 1
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
          await c.env.DB.prepare('UPDATE hods SET login_attempts = ?, locked_until = ? WHERE id = ?').bind(attempts, lockUntil, hod.id).run()
        } else {
          await c.env.DB.prepare('UPDATE hods SET login_attempts = ? WHERE id = ?').bind(attempts, hod.id).run()
        }
      }
    }

    // Check dedicated Club Coordinator accounts
    const clubCoord = await c.env.DB.prepare(
      `SELECT cc.*, c.name as club_name
       FROM coordinator_credentials cc
       JOIN clubs c ON cc.club_id = c.id
       WHERE cc.email = ?`
    ).bind(identifier).first()
    
    console.log('Login attempt for coord:', identifier, 'found:', !!clubCoord);
    
    if (clubCoord) {
      if (clubCoord.status === 'disabled') {
        return c.json({ error: 'Account has been disabled. Contact the administrator.' }, 403)
      }
      if (clubCoord.locked_until) {
        const lockTime = new Date(clubCoord.locked_until as string).getTime()
        if (Date.now() < lockTime) {
          return c.json({ error: 'Account temporarily locked. Try again later.' }, 423)
        }
        await c.env.DB.prepare('UPDATE coordinator_credentials SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(clubCoord.id).run()
      }

      console.log('Verifying password:', password, 'against hash:', clubCoord.password_hash);
      const valid = await verifyPassword(password, clubCoord.password_hash as string)
      console.log('Verify password result:', valid);
      
      if (valid) {
        await c.env.DB.prepare('UPDATE coordinator_credentials SET login_attempts = 0, locked_until = NULL WHERE id = ?').bind(clubCoord.id).run()
        const tokenPayload = {
          id: clubCoord.id,
          name: clubCoord.club_name + ' Coordinator',
          email: clubCoord.email,
          role: 'coordinator',
          club_id: String(clubCoord.club_id),
          club_name: clubCoord.club_name,
          exp: Math.floor(Date.now() / 1000) + 86400
        }
        const token = await signJWT(tokenPayload, secret)
        await createAuditLog(c.env.DB, clubCoord.id as string, 'coordinator', 'LOGIN', `Club Coordinator login: ${identifier}`)
        return c.json({ token, user: { id: clubCoord.id, name: tokenPayload.name, email: clubCoord.email, role: 'coordinator', club_id: String(clubCoord.club_id), club_name: clubCoord.club_name } })
      } else {
        const attempts = ((clubCoord.login_attempts as number) || 0) + 1
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
          await c.env.DB.prepare('UPDATE coordinator_credentials SET login_attempts = ?, locked_until = ? WHERE id = ?').bind(attempts, lockUntil, clubCoord.id).run()
        } else {
          await c.env.DB.prepare('UPDATE coordinator_credentials SET login_attempts = ? WHERE id = ?').bind(attempts, clubCoord.id).run()
        }
      }
    }

    // Check faculty coordinators (members with member_type='faculty')
    const faculty = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, c.name as club_name 
       FROM members m 
       JOIN member_clubs mc ON m.id = mc.member_id 
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.email = ? AND m.member_type = 'faculty'`
    ).bind(identifier).first()
    if (faculty) {
      const valid = await verifyPassword(password, (faculty.phone as string) || '')
      if (valid) {
        const tokenPayload = {
          id: faculty.uuid || String(faculty.id),
          name: faculty.full_name,
          email: faculty.email,
          role: 'coordinator',
          club_id: String(faculty.club_id),
          club_name: faculty.club_name,
          exp: Math.floor(Date.now() / 1000) + 86400
        }
        const token = await signJWT(tokenPayload, secret)
        await createAuditLog(c.env.DB, String(faculty.id), 'coordinator', 'LOGIN', `Coordinator login: ${identifier}`)
        return c.json({ token, user: { id: faculty.uuid || String(faculty.id), name: faculty.full_name, email: faculty.email, role: 'coordinator', club_id: String(faculty.club_id), club_name: faculty.club_name } })
      }
    }

    // Check student credentials (login with roll number)
    const studentCred = await c.env.DB.prepare(
      `SELECT sc.*, m.uuid, m.full_name, m.email as student_email, m.department, m.status, mc.club_id, c.name as club_name
       FROM student_credentials sc
       JOIN members m ON sc.member_id = m.id
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE sc.username = ?`
    ).bind(identifier).first()
    if (studentCred) {
      if (studentCred.status === 'suspended') {
        return c.json({ error: 'Account has been suspended. Contact the administrator.' }, 403)
      }
      if (studentCred.status === 'archived' || studentCred.status === 'graduated') {
        return c.json({ error: 'Account is no longer active.' }, 403)
      }
      // Check lockout
      if (studentCred.locked_until) {
        const lockTime = new Date(studentCred.locked_until as string).getTime()
        if (Date.now() < lockTime) {
          return c.json({ error: 'Account temporarily locked. Try again later.' }, 423)
        }
        await c.env.DB.prepare('UPDATE student_credentials SET login_attempts = 0, locked_until = NULL WHERE member_id = ?').bind(studentCred.member_id).run()
      }

      const valid = await verifyPassword(password, studentCred.password_hash as string)
      if (valid) {
        await c.env.DB.prepare('UPDATE student_credentials SET login_attempts = 0, locked_until = NULL, last_login = ? WHERE member_id = ?')
          .bind(new Date().toISOString(), studentCred.member_id).run()
        const tokenPayload = {
          id: studentCred.uuid || String(studentCred.member_id),
          name: (studentCred.full_name as string)?.trim(),
          email: studentCred.student_email || identifier,
          role: 'student',
          department: studentCred.department,
          club_id: String(studentCred.club_id),
          club_name: studentCred.club_name,
          must_change_password: studentCred.must_change_password === 1,
          exp: Math.floor(Date.now() / 1000) + 86400
        }
        const token = await signJWT(tokenPayload, secret)
        await createAuditLog(c.env.DB, String(studentCred.member_id), 'student', 'LOGIN', `Student login: ${identifier}`)
        return c.json({
          token,
          user: {
            id: studentCred.uuid || String(studentCred.member_id),
            name: (studentCred.full_name as string)?.trim(),
            email: studentCred.student_email || identifier,
            role: 'student',
            department: studentCred.department,
            club_id: String(studentCred.club_id),
            club_name: studentCred.club_name,
          },
          must_change_password: studentCred.must_change_password === 1,
        })
      } else {
        const attempts = ((studentCred.login_attempts as number) || 0) + 1
        if (attempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
          await c.env.DB.prepare('UPDATE student_credentials SET login_attempts = ?, locked_until = ? WHERE member_id = ?').bind(attempts, lockUntil, studentCred.member_id).run()
        } else {
          await c.env.DB.prepare('UPDATE student_credentials SET login_attempts = ? WHERE member_id = ?').bind(attempts, studentCred.member_id).run()
        }
      }
    }

    return c.json({ error: 'Invalid credentials' }, 401)
  } catch (e: any) {
    return c.json({ error: 'Login failed', details: e.message }, 500)
  }
})

// Change password (for students forced to change)
app.post('/api/auth/change-password', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.slice(7)
  const secret = c.env.JWT_SECRET || 'clubpass-secret-key-2024'
  const payload = await verifyJWT(token, secret)
  if (!payload) return c.json({ error: 'Invalid token' }, 401)

  try {
    const { current_password, new_password } = await c.req.json()
    if (!current_password || !new_password) {
      return c.json({ error: 'Current password and new password are required' }, 400)
    }

    const pwError = validatePassword(new_password)
    if (pwError) return c.json({ error: pwError }, 400)

    // Find student credential
    const member = await c.env.DB.prepare('SELECT id FROM members WHERE uuid = ?').bind(payload.id).first()
    if (!member) return c.json({ error: 'User not found' }, 404)

    const cred = await c.env.DB.prepare('SELECT * FROM student_credentials WHERE member_id = ?').bind(member.id).first()
    if (!cred) return c.json({ error: 'No credentials found' }, 404)

    const valid = await verifyPassword(current_password, cred.password_hash as string)
    if (!valid) return c.json({ error: 'Current password is incorrect' }, 401)

    const newHash = await hashPassword(new_password)
    await c.env.DB.prepare('UPDATE student_credentials SET password_hash = ?, must_change_password = 0 WHERE member_id = ?')
      .bind(newHash, member.id).run()

    await createAuditLog(c.env.DB, payload.id, 'student', 'PASSWORD_CHANGED', `Student changed password: ${payload.name}`)

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to change password', details: e.message }, 500)
  }
})

// Middleware: extract user from JWT (optional - doesn't block)
const optionalAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const secret = c.env.JWT_SECRET || 'clubpass-secret-key-2024'
    const payload = await verifyJWT(token, secret)
    if (payload) {
      c.set('user', payload)
    }
  }
  await next()
}

// Middleware: require auth
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.slice(7)
  const secret = c.env.JWT_SECRET || 'clubpass-secret-key-2024'
  const payload = await verifyJWT(token, secret)
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
  c.set('user', payload)
  await next()
}

// Middleware: require specific roles
const requireRole = (...roles: string[]) => async (c: any, next: any) => {
  const user = c.get('user')
  if (!user || !roles.includes(user.role)) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  await next()
}

// ============================================================
// PUBLIC VERIFY ROUTE (no auth required)
// ============================================================

app.get('/api/verify/:uuid', optionalAuth, async (c) => {
  const uuid = c.req.param('uuid')

  try {
    // Fetch member by UUID
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first()

    if (!member) {
      return c.json({ error: 'Member not found' }, 404)
    }

    // Feature 9: Suspended/archived/graduated members fail verification
    if (member.status === 'suspended') {
      return c.json({
        error: 'Member is suspended',
        member: {
          uuid: member.uuid,
          name: (member.full_name as string).trim(),
          roll_number: member.roll_number,
          status: 'suspended',
          club: member.club_name,
        }
      }, 403)
    }

    if (member.status === 'archived' || member.status === 'graduated') {
      return c.json({
        error: `Member is ${member.status}`,
        member: {
          uuid: member.uuid,
          name: (member.full_name as string).trim(),
          roll_number: member.roll_number,
          status: member.status,
          club: member.club_name,
        }
      }, 403)
    }

    // Feature 1 FIX: Club-specific faculty coordinators ONLY
    // No fallback — if no faculty assigned to this club, return empty list
    const clubCoordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all()

    // Check today's permission
    const today = getISTDate()
    const todayPermission = await c.env.DB.prepare(
      'SELECT p.*, h.name as hod_name FROM permissions p LEFT JOIN hods h ON p.hod_id = h.id WHERE p.member_uuid = ? AND p.date = ?'
    ).bind(uuid, today).first()

    // Log QR scan
    const user = c.get('user')
    await createAuditLog(
      c.env.DB,
      user?.id || 'anonymous',
      user?.role || 'public',
      'QR_SCANNED',
      `QR scanned for member: ${(member.full_name as string).trim()} (${member.roll_number})`
    )

    // Calculate overdue if applicable
    let overdue_minutes = 0
    if (todayPermission?.expected_return_time && todayPermission.status === 'granted') {
      const now = new Date()
      const [hours, minutes] = (todayPermission.expected_return_time as string).split(':').map(Number)
      const expectedReturn = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
      if (now > expectedReturn) {
        overdue_minutes = Math.floor((now.getTime() - expectedReturn.getTime()) / 60000)
      }
    }

    return c.json({
      member: {
        uuid: member.uuid,
        member_id: formatMemberId(member.id as number),
        name: (member.full_name as string).trim(),
        roll_number: member.roll_number,
        email: member.email,
        department: member.department,
        year: member.year || 1,
        section: member.section,
        club: member.club_name,
        club_id: member.club_id,
        position: member.club_role || member.position || 'Member',
        status: member.status || 'active',
        photo_url: member.photo_url,
        member_type: member.member_type,
      },
      coordinators: clubCoordinators?.results?.map((fc: any) => ({
        name: fc.full_name?.trim(),
        email: fc.email,
      })) || [],
      today_permission: todayPermission ? {
        id: todayPermission.id,
        date: todayPermission.date,
        time: todayPermission.time,
        status: todayPermission.status,
        effective_status: computeEffectiveStatus(todayPermission, getISTDate(), getISTTimeHM()),
        purpose: todayPermission.purpose,
        remark: todayPermission.remark,
        expected_return_time: todayPermission.expected_return_time,
        approved_by: todayPermission.hod_name || 'Unknown',
        approved_at: todayPermission.approved_at,
        completed_at: todayPermission.completed_at,
        created_at: todayPermission.created_at,
        overdue_minutes: overdue_minutes > 0 && todayPermission.status !== 'completed' ? overdue_minutes : null,
      } : null,
    })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// ============================================================
// PERMISSION ROUTES
// ============================================================

// Check today's permission for a member
app.get('/api/permissions/today/:uuid', optionalAuth, async (c) => {
  const uuid = c.req.param('uuid')
  const today = getISTDate()

  try {
    const permission = await c.env.DB.prepare(
      'SELECT p.*, h.name as hod_name FROM permissions p LEFT JOIN hods h ON p.hod_id = h.id WHERE p.member_uuid = ? AND p.date = ? ORDER BY p.created_at DESC'
    ).bind(uuid, today).first()

    if (permission) {
      permission.effective_status = computeEffectiveStatus(permission, today, getISTTimeHM())
    }

    return c.json({ permission: permission || null })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// TEMPORARY: Fix database schema to remove UNIQUE constraint
app.get('/api/fix-db', async (c) => {
  try {
    const tableInfo = await c.env.DB.prepare("PRAGMA table_info(permissions);").all();
    const columns = tableInfo.results.map((col: any) => col.name);
    
    // Create new table without UNIQUE constraint but same columns
    await c.env.DB.prepare(`
      CREATE TABLE permissions_new (
        id TEXT PRIMARY KEY,
        member_uuid TEXT NOT NULL,
        hod_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        purpose TEXT NOT NULL DEFAULT '',
        remark TEXT,
        status TEXT DEFAULT 'granted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        closed_at TEXT,
        closed_by TEXT,
        close_reason TEXT,
        completed_at TEXT,
        club_id TEXT,
        expected_return_time TEXT,
        approved_at TEXT
      )
    `).run();

    // Dynamically insert only columns that existed in old table
    const colList = columns.join(', ');
    await c.env.DB.prepare(`INSERT INTO permissions_new (${colList}) SELECT ${colList} FROM permissions`).run();

    await c.env.DB.prepare("DROP TABLE permissions").run();
    await c.env.DB.prepare("ALTER TABLE permissions_new RENAME TO permissions").run();

    return c.json({ success: true, message: "Fixed permissions table schema", columns });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})

// Grant or reject permission (HOD only)
app.post('/api/permissions', requireAuth, requireRole('hod', 'super_admin'), async (c) => {
  try {
    const { member_uuid, purpose, remark, status, expected_return_time } = await c.req.json()
    const user = c.get('user')

    if (!member_uuid) {
      return c.json({ error: 'member_uuid is required' }, 400)
    }

    const permissionStatus = status || 'granted'
    const date = getISTDate()
    
    // We already have a time string from new Date(), but we need IST specific time.
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istDate = new Date(now.getTime() + istOffset)
    const currentISTHour = istDate.getUTCHours()
    const currentISTMin = istDate.getUTCMinutes()
    const currentISTTimeStr = `${currentISTHour.toString().padStart(2, '0')}:${currentISTMin.toString().padStart(2, '0')}`

    if (currentISTTimeStr >= '16:00') {
      return c.json({ error: 'Permission hours for today have ended. New permissions can be granted on the next working day.' }, 403)
    }

    if (expected_return_time) {
      if (expected_return_time > '16:00') {
        return c.json({ error: 'Expected return time cannot exceed 16:00 (4:00 PM IST).' }, 400)
      }
      if (expected_return_time <= currentISTTimeStr) {
        return c.json({ error: 'Expected return time must be strictly after the current time.' }, 400)
      }
    }

    const time = new Date().toTimeString().split(' ')[0]
    const approvedAt = new Date().toISOString()
    const id = crypto.randomUUID()

    // Check duplicate: Only block if there is an ACTIVE permission today
    const existing = await c.env.DB.prepare(
      'SELECT id, status, date, expected_return_time FROM permissions WHERE member_uuid = ? AND date = ? ORDER BY created_at DESC'
    ).bind(member_uuid, date).first()

    if (existing) {
      const effective = computeEffectiveStatus(existing, date, currentISTTimeStr)
      if (effective === 'granted') {
        return c.json({
          error: 'An active permission already exists for today',
          existing_permission: existing,
        }, 409)
      }
    }

    // Fetch member for notification
    const member = await c.env.DB.prepare(
      `SELECT m.full_name, m.roll_number, c.name as club_name, mc.club_id
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(member_uuid).first()

    if (!member) {
      return c.json({ error: 'Member not found' }, 404)
    }

    // Insert permission with extended fields
    await c.env.DB.prepare(
      'INSERT INTO permissions (id, member_uuid, hod_id, date, time, purpose, remark, status, expected_return_time, approved_at, club_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, member_uuid, user!.id, date, time, purpose || '', remark || null, permissionStatus, expected_return_time || null, approvedAt, member.club_id).run()

    // Create audit log
    await createAuditLog(
      c.env.DB,
      user!.id,
      user!.role,
      permissionStatus === 'granted' ? 'PERMISSION_GRANTED' : 'PERMISSION_REJECTED',
      `Permission ${permissionStatus} for ${(member.full_name as string).trim()} (${member.roll_number}) by ${user!.name}. Purpose: ${purpose || 'N/A'}. Remark: ${remark || 'N/A'}`
    )

    // Notify coordinators assigned to this club only
    const coordinators = await c.env.DB.prepare(
      `SELECT m.id, m.uuid FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all()

    for (const coord of coordinators.results || []) {
      await createNotification(
        c.env.DB,
        coord.uuid as string || String(coord.id),
        'coordinator',
        'permission_update',
        `Permission ${permissionStatus === 'granted' ? 'Granted' : 'Rejected'}`,
        `${(member.full_name as string).trim()} (${member.roll_number}) from ${member.club_name} — Permission ${permissionStatus} by ${user!.name} on ${date} at ${time}. Purpose: ${purpose || 'N/A'}`,
        member_uuid
      )
    }

    return c.json({
      success: true,
      permission: { id, member_uuid, date, time, purpose, remark, status: permissionStatus, effective_status: permissionStatus === 'granted' ? 'active' : permissionStatus, hod_id: user!.id, approved_by: user!.name, expected_return_time, approved_at: approvedAt },
    })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return c.json({ error: 'DB_UNIQUE_ERROR: ' + e.message }, 409)
    }
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// Complete permission (Coordinator only)

app.post('/api/permissions/:id/close', requireAuth, requireRole('hod', 'super_admin'), async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  console.log('CLOSE PERMISSION CALLED WITH ID:', id, 'USER:', user.email);

  try {
    let body: any = {}
    try {
      body = await c.req.json()
    } catch (e) {
      // ignore, might not have a body
    }
    const close_reason = body?.close_reason || 'Student Returned';

    const permission = await c.env.DB.prepare('SELECT * FROM permissions WHERE id = ?').bind(id).first()
    if (!permission) return c.json({ error: 'Permission not found' }, 404)
    
    const currentHM = getISTTimeHM()
    const effective = computeEffectiveStatus(permission, getISTDate(), currentHM)
    if (effective !== 'active') {
      return c.json({ error: 'Permission is no longer active' }, 400)
    }

    const nowUTC = getUTCDateTime()
    await c.env.DB.prepare(
      "UPDATE permissions SET status = 'closed', closed_at = ?, completed_at = ?, closed_by = ?, close_reason = ? WHERE id = ?"
    ).bind(nowUTC, nowUTC, user.name, close_reason, id).run()

    return c.json({ success: true, closed_at: nowUTC })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.post('/api/permissions/:id/complete', requireAuth, requireRole('coordinator', 'super_admin'), async (c) => {
  const id = c.req.param('id')
  const completedAt = getUTCDateTime()
  const user = c.get('user')
  
  try {
    const permission = await c.env.DB.prepare('SELECT * FROM permissions WHERE id = ?').bind(id).first()
    if (!permission) return c.json({ error: 'Permission not found' }, 404)
    
    const effective = computeEffectiveStatus(permission, getISTDate(), getISTTimeHM())
    if (effective !== 'active') {
      return c.json({ error: 'Permission is no longer active' }, 400)
    }

    await c.env.DB.prepare(
      "UPDATE permissions SET status = 'closed', closed_at = ?, completed_at = ?, closed_by = ?, close_reason = 'Closed by Coordinator' WHERE id = ?"
    ).bind(completedAt, completedAt, user.name, id).run()
    
    await createAuditLog(
      c.env.DB,
      user!.id,
      user!.role,
      'PERMISSION_COMPLETED',
      `Permission marked completed by ${user!.name} for permission ID: ${id}`
    )
    
    return c.json({ success: true, completed_at: completedAt })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// Permission history for a member
app.get('/api/permissions/history/:uuid', requireAuth, async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const permissions = await c.env.DB.prepare(
      `SELECT p.*, h.name as hod_name 
       FROM permissions p 
       LEFT JOIN hods h ON p.hod_id = h.id 
       WHERE p.member_uuid = ? 
       ORDER BY p.created_at DESC 
       LIMIT 50`
    ).bind(uuid).all()

    return c.json({ permissions: permissions.results })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// List all permissions with filters
app.get('/api/permissions', requireAuth, async (c) => {
  const date = c.req.query('date')
  const club = c.req.query('club')
  const department = c.req.query('department')
  const status = c.req.query('status')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit

  try {
    let query = `
      SELECT p.*, h.name as hod_name, m.full_name as member_name, m.roll_number, m.department, m.year, m.section, c.name as club_name
      FROM permissions p
      LEFT JOIN hods h ON p.hod_id = h.id
      LEFT JOIN members m ON m.uuid = p.member_uuid
      LEFT JOIN member_clubs mc ON m.id = mc.member_id
      LEFT JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (date) { query += ' AND p.date = ?'; params.push(date) }
    if (status) {
      if (status === 'granted' || status === 'active') {
        const currentISTDate = getISTDate()
        const currentISTHM = getISTTimeHM()
        query += " AND p.status = 'granted' AND p.date = ? AND (? < '16:00') AND (p.expected_return_time IS NULL OR p.expected_return_time > ?)"
        params.push(currentISTDate, currentISTHM, currentISTHM)
      } else if (status === 'expired') {
        const currentISTDate = getISTDate()
        const currentISTHM = getISTTimeHM()
        query += " AND p.status = 'granted' AND (p.date < ? OR ? >= '16:00' OR (p.expected_return_time IS NOT NULL AND p.expected_return_time <= ?))"
        params.push(currentISTDate, currentISTHM, currentISTHM)
      } else {
        query += ' AND p.status = ?'; params.push(status)
      }
    }
    if (department) { query += ' AND m.department = ?'; params.push(department) }
    
    const user = c.get('user')
    if (user && user.role === 'coordinator' && user.club_id) {
      query += ' AND mc.club_id = ?'; params.push(user.club_id)
    } else if (club) { 
      query += ' AND c.name = ?'; params.push(club) 
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const stmt = c.env.DB.prepare(query)
    const result = await stmt.bind(...params).all()

    const currentISTDate = getISTDate()
    const currentISTHM = getISTTimeHM()
    const permissions = result.results?.map((p) => ({
      ...p,
      effective_status: computeEffectiveStatus(p, currentISTDate, currentISTHM)
    })) || []

    return c.json({ permissions, page, limit })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// ============================================================
// MEMBER ROUTES
// ============================================================

app.get('/api/coordinator/faculty', requireAuth, requireRole('coordinator', 'super_admin'), async (c) => {
  const clubId = c.req.query('club_id') || c.get('user')?.club_id;
  if (!clubId) return c.json({ error: 'club_id required' }, 400);

  try {
    const faculty = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email, m.phone, m.department 
       FROM faculty_club_assignments fca
       JOIN members m ON fca.faculty_member_id = m.id
       WHERE fca.club_id = ?`
    ).bind(clubId).all();

    return c.json({ faculty: faculty.results || [] });
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500);
  }
});

app.get('/api/members', requireAuth, async (c) => {
  const search = c.req.query('search')
  const department = c.req.query('department')
  const club = c.req.query('club')
  const memberType = c.req.query('member_type')
  const status = c.req.query('status')
  const section = c.req.query('section')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit

  try {
    let query = `
      SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
      FROM members m
      JOIN member_clubs mc ON m.id = mc.member_id
      JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    if (search) {
      query += ' AND (m.full_name LIKE ? OR m.roll_number LIKE ? OR m.email LIKE ?)'
      const s = `%${search}%`
      params.push(s, s, s)
    }
    if (department) { query += ' AND m.department = ?'; params.push(department) }
    
    const user = c.get('user')
    if (user && user.role === 'coordinator' && user.club_id) {
      query += ' AND mc.club_id = ?'; params.push(user.club_id)
    } else if (club) { 
      query += ' AND c.name = ?'; params.push(club) 
    }
    if (memberType) { query += ' AND m.member_type = ?'; params.push(memberType) }
    if (status) { query += ' AND m.status = ?'; params.push(status) }
    if (section) { query += ' AND m.section = ?'; params.push(section) }

    query += ' ORDER BY m.id ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const result = await c.env.DB.prepare(query).bind(...params).all()

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM members m JOIN member_clubs mc ON m.id = mc.member_id JOIN clubs c ON mc.club_id = c.id WHERE 1=1'
    const countParams: any[] = []
    if (search) {
      countQuery += ' AND (m.full_name LIKE ? OR m.roll_number LIKE ? OR m.email LIKE ?)'
      const s = `%${search}%`
      countParams.push(s, s, s)
    }
    if (department) { countQuery += ' AND m.department = ?'; countParams.push(department) }
    
    if (user && user.role === 'coordinator' && user.club_id) {
      countQuery += ' AND mc.club_id = ?'; countParams.push(user.club_id)
    } else if (club) { 
      countQuery += ' AND c.name = ?'; countParams.push(club) 
    }
    if (memberType) { countQuery += ' AND m.member_type = ?'; countParams.push(memberType) }
    if (status) { countQuery += ' AND m.status = ?'; countParams.push(status) }
    if (section) { countQuery += ' AND m.section = ?'; countParams.push(section) }

    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first()

    return c.json({
      members: result.results?.map((m: any) => ({
        ...m,
        full_name: m.full_name?.trim(),
        member_id: formatMemberId(m.id),
      })),
      total: countResult?.total || 0,
      page,
      limit,
    })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.get('/api/members/:uuid', requireAuth, async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first()

    if (!member) return c.json({ error: 'Member not found' }, 404)

    // Get club-specific coordinators
    const coordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all()

    return c.json({
      ...member,
      full_name: (member.full_name as string)?.trim(),
      member_id: formatMemberId(member.id as number),
      coordinators: coordinators.results?.map((fc: any) => ({
        name: fc.full_name?.trim(),
        email: fc.email,
      })) || [],
    })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Student profile with full details
app.get('/api/members/:uuid/profile', requireAuth, async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const member = await c.env.DB.prepare(
      `SELECT m.*, mc.club_id, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first()

    if (!member) return c.json({ error: 'Member not found' }, 404)

    // Club-specific coordinators
    const coordinators = await c.env.DB.prepare(
      `SELECT m.full_name, m.email
       FROM faculty_club_assignments fca
       JOIN members m ON m.id = fca.faculty_member_id
       WHERE fca.club_id = ?`
    ).bind(member.club_id).all()

    // Permission history
    const permissions = await c.env.DB.prepare(
      `SELECT p.*, h.name as hod_name FROM permissions p
       LEFT JOIN hods h ON p.hod_id = h.id
       WHERE p.member_uuid = ?
       ORDER BY p.created_at DESC LIMIT 20`
    ).bind(uuid).all()

    // Activity timeline from audit logs
    const activities = await c.env.DB.prepare(
      `SELECT * FROM audit_logs
       WHERE details LIKE ? OR details LIKE ?
       ORDER BY created_at DESC LIMIT 20`
    ).bind(`%${uuid}%`, `%${member.roll_number}%`).all()

    return c.json({
      member: {
        ...member,
        full_name: (member.full_name as string)?.trim(),
        member_id: formatMemberId(member.id as number),
      },
      coordinators: coordinators.results?.map((fc: any) => ({
        name: fc.full_name?.trim(),
        email: fc.email,
      })) || [],
      permissions: permissions.results?.map((p: any) => ({
        ...p,
        effective_status: computeEffectiveStatus(p, getISTDate(), getISTTimeHM())
      })) || [],
      activities: activities.results || [],
    })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// ============================================================
// CLUBS ROUTE
// ============================================================

app.get('/api/clubs', async (c) => {
  try {
    const clubs = await c.env.DB.prepare('SELECT * FROM clubs ORDER BY id').all()
    return c.json({ clubs: clubs.results })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// Club with statistics
app.get('/api/clubs/:id/stats', requireAuth, async (c) => {
  const clubId = c.req.param('id')
  try {
    const club = await c.env.DB.prepare('SELECT * FROM clubs WHERE id = ?').bind(clubId).first()
    if (!club) return c.json({ error: 'Club not found' }, 404)

    const total = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student'`
    ).bind(clubId).first()
    const active = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND m.status = 'active'`
    ).bind(clubId).first()
    const suspended = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND m.status = 'suspended'`
    ).bind(clubId).first()
    const archived = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM members m JOIN member_clubs mc ON m.id = mc.member_id WHERE mc.club_id = ? AND m.member_type = 'student' AND (m.status = 'archived' OR m.status = 'graduated')`
    ).bind(clubId).first()
    const faculty = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM faculty_club_assignments WHERE club_id = ?`
    ).bind(clubId).first()

    // Get assigned coordinators
    const coordinators = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email FROM faculty_club_assignments fca JOIN members m ON m.id = fca.faculty_member_id WHERE fca.club_id = ?`
    ).bind(clubId).all()

    return c.json({
      club,
      stats: {
        total_members: total?.count || 0,
        active_members: active?.count || 0,
        suspended_members: suspended?.count || 0,
        archived_members: archived?.count || 0,
        faculty_count: faculty?.count || 0,
      },
      coordinators: coordinators.results?.map((fc: any) => ({
        id: fc.id,
        name: fc.full_name?.trim(),
        email: fc.email,
      })) || [],
    })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

// ============================================================
// NOTIFICATION ROUTES
// ============================================================

app.get('/api/notifications', requireAuth, async (c) => {
  const user = c.get('user')
  const unreadOnly = c.req.query('unread') === 'true'

  try {
    let query = 'SELECT * FROM notifications WHERE recipient_id = ?'
    const params: any[] = [user!.id]

    if (unreadOnly) {
      query += ' AND read_status = 0'
    }

    query += ' ORDER BY created_at DESC LIMIT 50'

    const result = await c.env.DB.prepare(query).bind(...params).all()

    // Count unread
    const unreadCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE recipient_id = ? AND read_status = 0'
    ).bind(user!.id).first()

    return c.json({ notifications: result.results, unread_count: unreadCount?.count || 0 })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})


app.post('/api/notifications/broadcast', requireAuth, requireRole('super_admin', 'institution_admin', 'hod', 'coordinator'), async (c) => {
  const user = c.get('user')
  const { title, message, target_audience, club_id, department } = await c.req.json()

  if (!title || !message || !target_audience) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  try {
    let recipientQuery = ''
    const queryParams: any[] = []

    // 1. Authorize and build query based on role and target
    if (user.role === 'super_admin' || user.role === 'institution_admin') {
      if (target_audience === 'all_students') {
        recipientQuery = "SELECT id, 'student' as role FROM members WHERE status IN ('active', 'inactive')"
      } else if (target_audience === 'all_hods') {
        recipientQuery = "SELECT id, 'hod' as role FROM hods"
      } else if (target_audience === 'all_coordinators') {
        recipientQuery = "SELECT faculty_member_id as id, 'coordinator' as role FROM faculty_club_assignments GROUP BY faculty_member_id"
      } else if (target_audience === 'club') {
        if (!club_id) return c.json({ error: 'club_id required' }, 400)
        recipientQuery = "SELECT member_id as id, 'student' as role FROM member_clubs WHERE club_id = ?"
        queryParams.push(club_id)
      } else if (target_audience === 'department') {
        if (!department) return c.json({ error: 'department required' }, 400)
        recipientQuery = "SELECT id, 'student' as role FROM members WHERE department = ? AND status IN ('active', 'inactive')"
        queryParams.push(department)
      } else if (target_audience === 'all') {
        recipientQuery = "SELECT id, 'student' as role FROM members WHERE status IN ('active', 'inactive') UNION SELECT id, 'hod' as role FROM hods"
      } else {
        return c.json({ error: 'Invalid target_audience' }, 400)
      }
    } else if (user.role === 'hod') {
      if (target_audience !== 'department') return c.json({ error: 'HODs can only notify their department' }, 403)
      const hod = await c.env.DB.prepare('SELECT department FROM hods WHERE id = ?').bind(user.id).first()
      if (!hod || hod.department !== department) return c.json({ error: 'Unauthorized department' }, 403)
      
      recipientQuery = "SELECT id, 'student' as role FROM members WHERE department = ? AND status IN ('active', 'inactive')"
      queryParams.push(department)
    } else if (user.role === 'coordinator') {
      if (target_audience !== 'club') return c.json({ error: 'Coordinators can only notify their clubs' }, 403)
      
      const targetClub = user.club_id || club_id; // Override frontend club_id if token has it
      if (!targetClub) return c.json({ error: 'club_id required' }, 400);

      // Check legacy faculty assignment if no token club_id
      if (!user.club_id) {
        const isAssigned = await c.env.DB.prepare('SELECT 1 FROM faculty_club_assignments WHERE faculty_member_id = ? AND club_id = ?').bind(user.id, targetClub).first()
        if (!isAssigned) return c.json({ error: 'Unauthorized club' }, 403)
      } else if (String(targetClub) !== String(user.club_id)) {
        return c.json({ error: 'Unauthorized club' }, 403)
      }

      recipientQuery = "SELECT member_id as id, 'student' as role FROM member_clubs WHERE club_id = ?"
      queryParams.push(targetClub)
    }

    if (!recipientQuery) return c.json({ error: 'Invalid request' }, 400)

    const recipients = await c.env.DB.prepare(recipientQuery).bind(...queryParams).all()

    if (!recipients.results || recipients.results.length === 0) {
      return c.json({ error: 'No recipients found' }, 404)
    }

    // Insert notifications in batches to avoid limits
    const statements = []
    const type = 'announcement'
    
    // Cloudflare D1 supports batching
    for (const r of recipients.results) {
      const id = crypto.randomUUID()
      statements.push(
        c.env.DB.prepare(
          'INSERT INTO notifications (id, recipient_id, recipient_role, type, title, message) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(id, String(r.id), r.role, type, title, message)
      )
    }

    // Max 100 statements per batch in D1
    const chunkSize = 90;
    for (let i = 0; i < statements.length; i += chunkSize) {
      const chunk = statements.slice(i, i + chunkSize);
      await c.env.DB.batch(chunk);
    }

    // Log the broadcast
    await createAuditLog(
      c.env.DB,
      user.id,
      user.role,
      'BROADCAST_NOTIFICATION',
      `Sent announcement "${title}" to ${recipients.results.length} recipients`
    )

    return c.json({ success: true, count: recipients.results.length })
  } catch (e: any) {
    return c.json({ error: 'Broadcast failed', details: e.message }, 500)
  }
})

app.patch('/api/notifications/:id/read', requireAuth, async (c) => {
  const id = c.req.param('id')
  try {
    await c.env.DB.prepare('UPDATE notifications SET read_status = 1 WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.patch('/api/notifications/read-all', requireAuth, async (c) => {
  const user = c.get('user')
  try {
    await c.env.DB.prepare('UPDATE notifications SET read_status = 1 WHERE recipient_id = ?').bind(user!.id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// ============================================================
// AUDIT LOG ROUTES
// ============================================================

app.get('/api/audit-logs', requireAuth, requireRole('super_admin'), async (c) => {
  const action = c.req.query('action')
  const date = c.req.query('date')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit

  try {
    let query = 'SELECT * FROM audit_logs WHERE 1=1'
    const params: any[] = []

    if (action) { query += ' AND action = ?'; params.push(action) }
    if (date) { query += ' AND DATE(created_at) = ?'; params.push(date) }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ logs: result.results, page, limit })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// ============================================================
// EXPORT ROUTES
// ============================================================

app.get('/api/export/members', requireAuth, requireRole('super_admin', 'hod'), async (c) => {
  const format = c.req.query('format') || 'csv'
  const club = c.req.query('club')
  const department = c.req.query('department')
  const status = c.req.query('status')

  try {
    let query = `SELECT m.id, m.uuid, m.roll_number, m.full_name, m.email, m.phone, m.department, m.section, m.member_type, m.status, m.year, mc.role as club_role, c.name as club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE 1=1`
    const params: any[] = []

    if (club) { query += ' AND c.name = ?'; params.push(club) }
    if (department) { query += ' AND m.department = ?'; params.push(department) }
    if (status) { query += ' AND m.status = ?'; params.push(status) }

    query += ' ORDER BY m.id'

    const result = await c.env.DB.prepare(query).bind(...params).all()

    if (format === 'csv') {
      const headers = ['ID', 'Member ID', 'UUID', 'Roll Number', 'Name', 'Email', 'Phone', 'Department', 'Section', 'Type', 'Status', 'Year', 'Role', 'Club']
      const rows = result.results?.map((m: any) =>
        [m.id, formatMemberId(m.id), m.uuid, m.roll_number, m.full_name?.trim(), m.email, m.phone, m.department, m.section, m.member_type, m.status, m.year, m.club_role, m.club_name]
          .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      )
      const csv = [headers.join(','), ...(rows || [])].join('\n')

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="members.csv"',
        },
      })
    }

    return c.json({ data: result.results })
  } catch (e: any) {
    return c.json({ error: 'Export failed' }, 500)
  }
})

app.get('/api/export/permissions', requireAuth, requireRole('super_admin', 'hod', 'institution_admin', 'coordinator'), async (c) => {
  const format = c.req.query('format') || 'csv'
  const user = c.get('user')
  const dateFrom = c.req.query('date_from')
  const dateTo = c.req.query('date_to')
  const month = c.req.query('month') // YYYY-MM
  const date = c.req.query('date')
  const clubFilter = c.req.query('club')
  const deptFilter = c.req.query('department')
  const statusFilter = c.req.query('status')

  try {
    let query = `
      SELECT p.*, h.name as hod_name, m.full_name as member_name, m.roll_number, m.department, m.year, m.section, c.name as club_name
      FROM permissions p
      LEFT JOIN hods h ON p.hod_id = h.id
      LEFT JOIN members m ON m.uuid = p.member_uuid
      LEFT JOIN member_clubs mc ON m.id = mc.member_id
      LEFT JOIN clubs c ON mc.club_id = c.id
      WHERE 1=1
    `
    const params: any[] = []

    // Date filters
    if (date) {
      query += ' AND p.date = ?'; params.push(date)
    } else if (month) {
      query += ' AND p.date LIKE ?'; params.push(month + '%')
    } else {
      if (dateFrom) { query += ' AND p.date >= ?'; params.push(dateFrom) }
      if (dateTo) { query += ' AND p.date <= ?'; params.push(dateTo) }
    }

    // Explicitly exclude REJECTED for attendance reports unless overridden (rejected is not attendance)
    if (statusFilter && statusFilter !== 'all') {
       query += ' AND p.status = ?'; params.push(statusFilter)
    } else {
       query += " AND p.status != 'rejected'";
    }

    if (user && user.role === 'coordinator' && user.club_id) {
      query += ' AND mc.club_id = ?'; params.push(user.club_id)
    } else if (clubFilter) { 
      query += ' AND c.name = ?'; params.push(clubFilter) 
    }
    if (deptFilter) { query += ' AND m.department = ?'; params.push(deptFilter) }

    // Role-based authorization scoping
    if (user.role === 'hod') {
      const hod = await c.env.DB.prepare('SELECT department FROM hods WHERE id = ?').bind(user.id).first()
      if (hod) {
        query += ' AND m.department = ?'; params.push(hod.department)
      }
    } else if (user.role === 'coordinator' && !user.club_id) {
      query += ' AND mc.club_id IN (SELECT club_id FROM faculty_club_assignments WHERE faculty_member_id = ?)';
      params.push(user.id)
    }

    query += ' ORDER BY p.date DESC, p.created_at DESC'

    const result = await c.env.DB.prepare(query).bind(...params).all()

    if (format === 'csv') {
      const headers = ['S.No', 'Date', 'Student Name', 'Roll Number', 'Department', 'Year', 'Section', 'Club', 'Purpose', 'Permission Granted At', 'Permission Valid Until', 'Actual End Time', 'Final Status', 'Granted By', 'Closed At', 'Closed By']
      
      const rows = result.results?.map((p: any, index: number) => {
        const effectiveStatus = computeEffectiveStatus(p, getISTDate(), getISTTimeHM());
        const displayStatus = effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1);
        
        return [
          index + 1,
          p.date,
          p.member_name?.trim(),
          p.roll_number,
          p.department,
          p.year ? `Year ${p.year}` : '',
          p.section,
          p.club_name,
          p.purpose,
          p.approved_at || p.time,
          p.expected_return_time || '16:00',
          p.completed_at || '',
          displayStatus,
          p.hod_name || 'Unknown',
          p.completed_at || '',
          p.completed_at ? (p.hod_name || 'System') : '' // Assuming HOD closed it if completed
        ].map(v => `"\$\{String(v || '').replace(/"/g, '""')\}"`).join(',')
      })
      
      const csv = [headers.join(','), ...(rows || [])].join('\n')

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="Attendance_Report.csv"',
        },
      })
    }

    return c.json({ data: result.results })
  } catch (e: any) {
    return c.json({ error: 'Export failed' }, 500)
  }
})

app.get('/api/export/audit-logs', requireAuth, requireRole('super_admin'), async (c) => {
  const format = c.req.query('format') || 'csv'

  try {
    const result = await c.env.DB.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 1000').all()

    if (format === 'csv') {
      const headers = ['ID', 'User ID', 'Role', 'Action', 'Details', 'IP', 'Timestamp']
      const rows = result.results?.map((l: any) =>
        [l.id, l.user_id, l.user_role, l.action, l.details, l.ip_address, l.created_at]
          .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      )
      const csv = [headers.join(','), ...(rows || [])].join('\n')

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="audit_logs.csv"',
        },
      })
    }

    return c.json({ data: result.results })
  } catch (e: any) {
    return c.json({ error: 'Export failed' }, 500)
  }
})

app.get('/api/export/faculty', requireAuth, requireRole('super_admin'), async (c) => {
  const format = c.req.query('format') || 'csv'
  try {
    const result = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.email, m.phone, m.department, c.name as club_name
       FROM members m
       LEFT JOIN faculty_club_assignments fca ON m.id = fca.faculty_member_id
       LEFT JOIN clubs c ON fca.club_id = c.id
       WHERE m.member_type = 'faculty'
       ORDER BY m.full_name`
    ).all()

    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Assigned Club']
      const rows = result.results?.map((f: any) =>
        [f.id, f.full_name?.trim(), f.email, f.phone, f.department, f.club_name || 'Unassigned']
          .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      )
      const csv = [headers.join(','), ...(rows || [])].join('\n')
      return new Response(csv, {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="faculty.csv"' },
      })
    }
    return c.json({ data: result.results })
  } catch (e: any) {
    return c.json({ error: 'Export failed' }, 500)
  }
})

app.get('/api/export/clubs', requireAuth, requireRole('super_admin'), async (c) => {
  const format = c.req.query('format') || 'csv'
  try {
    const result = await c.env.DB.prepare(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM member_clubs mc JOIN members m ON m.id = mc.member_id WHERE mc.club_id = c.id AND m.member_type = 'student') as member_count,
        (SELECT COUNT(*) FROM faculty_club_assignments fca WHERE fca.club_id = c.id) as faculty_count
       FROM clubs c ORDER BY c.id`
    ).all()

    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Description', 'Status', 'Members', 'Faculty', 'Created At']
      const rows = result.results?.map((c: any) =>
        [c.id, c.name, c.description, c.status || 'active', c.member_count, c.faculty_count, c.created_at]
          .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      )
      const csv = [headers.join(','), ...(rows || [])].join('\n')
      return new Response(csv, {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="clubs.csv"' },
      })
    }
    return c.json({ data: result.results })
  } catch (e: any) {
    return c.json({ error: 'Export failed' }, 500)
  }
})

// ============================================================
// STATS ROUTE (for dashboards)
// ============================================================

app.get('/api/stats', requireAuth, async (c) => {
  try {
    const today = getISTDate()

    const totalMembers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members WHERE member_type = ?').bind('student').first()
    const totalClubs = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clubs').first()
    const todayPermissions = await c.env.DB.prepare('SELECT COUNT(*) as count FROM permissions WHERE date = ?').bind(today).first()
    const totalPermissions = await c.env.DB.prepare('SELECT COUNT(*) as count FROM permissions').first()
    const todayGranted = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions WHERE date = ? AND status = 'granted'").bind(today).first()
    const todayRejected = await c.env.DB.prepare("SELECT COUNT(*) as count FROM permissions WHERE date = ? AND status = 'rejected'").bind(today).first()
    const activeMembers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members WHERE member_type = 'student' AND status = 'active'").first()
    const suspendedMembers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM members WHERE member_type = 'student' AND status = 'suspended'").first()

    return c.json({
      total_members: totalMembers?.count || 0,
      total_clubs: totalClubs?.count || 0,
      today_permissions: todayPermissions?.count || 0,
      total_permissions: totalPermissions?.count || 0,
      today_granted: todayGranted?.count || 0,
      today_rejected: todayRejected?.count || 0,
      active_members: activeMembers?.count || 0,
      suspended_members: suspendedMembers?.count || 0,
    })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// ============================================================
// V1.2 ADMIN CRUD ROUTES
// ============================================================

// --- QR Regeneration (Super Admin only) ---
app.post('/api/members/:uuid/regenerate-qr', requireAuth, requireRole('super_admin'), async (c) => {
  const oldUuid = c.req.param('uuid')
  const user = c.get('user')

  try {
    const member = await c.env.DB.prepare('SELECT id, full_name, roll_number, uuid FROM members WHERE uuid = ?').bind(oldUuid).first()
    if (!member) return c.json({ error: 'Member not found' }, 404)

    const newUuid = crypto.randomUUID()
    await c.env.DB.prepare('UPDATE members SET uuid = ? WHERE id = ?').bind(newUuid, member.id).run()

    // Update any permissions referencing old UUID
    await c.env.DB.prepare('UPDATE permissions SET member_uuid = ? WHERE member_uuid = ?').bind(newUuid, oldUuid).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'QR_REGENERATED',
      `QR regenerated for ${(member.full_name as string).trim()} (${member.roll_number}). Old: ${oldUuid} → New: ${newUuid}`)

    return c.json({ success: true, new_uuid: newUuid })
  } catch (e: any) {
    return c.json({ error: 'Failed to regenerate QR', details: e.message }, 500)
  }
})

// --- Automatic Student Provisioning (creates everything in one step) ---
app.post('/api/admin/members', requireAuth, requireRole('super_admin'), async (c) => {
  const user = c.get('user')
  try {
    const body = await c.req.json()
    const { roll_number, full_name, email, phone, department, section, member_type, year, club_id, role } = body

    if (!roll_number || !full_name || !department) {
      return c.json({ error: 'roll_number, full_name, and department are required' }, 400)
    }

    const uuid = crypto.randomUUID()
    const mType = member_type || 'student'

    // Insert member
    await c.env.DB.prepare(
      `INSERT INTO members (roll_number, full_name, email, phone, department, section, member_type, uuid, year, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`
    ).bind(roll_number, full_name, email || null, phone || null, department, section || null, mType, uuid, year || 1).run()

    // Get the new member's id
    const newMember = await c.env.DB.prepare('SELECT id FROM members WHERE uuid = ?').bind(uuid).first()

    if (newMember && club_id) {
      await c.env.DB.prepare('INSERT INTO member_clubs (member_id, club_id, role) VALUES (?, ?, ?)').bind(newMember.id, club_id, role || 'Member').run()
    }

    // For students: auto-create login credentials (roll number as username and temp password)
    if (mType === 'student' && newMember) {
      const tempPasswordHash = await hashPassword(roll_number)
      await c.env.DB.prepare(
        'INSERT OR IGNORE INTO student_credentials (member_id, username, password_hash, must_change_password) VALUES (?, ?, ?, 1)'
      ).bind(newMember.id, roll_number, tempPasswordHash).run()
    }

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'MEMBER_CREATED',
      `Member created: ${full_name} (${roll_number}), dept: ${department}, club: ${club_id || 'none'}`)

    // Notify relevant coordinators
    if (club_id) {
      const coordinators = await c.env.DB.prepare(
        `SELECT m.uuid FROM faculty_club_assignments fca JOIN members m ON m.id = fca.faculty_member_id WHERE fca.club_id = ?`
      ).bind(club_id).all()
      for (const coord of coordinators.results || []) {
        await createNotification(c.env.DB, coord.uuid as string, 'coordinator', 'member_added',
          'New Member Added', `${full_name} (${roll_number}) has been added to the club.`, uuid)
      }
    }

    return c.json({
      success: true,
      uuid,
      id: newMember?.id,
      member_id: newMember ? formatMemberId(newMember.id as number) : null,
    })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) return c.json({ error: 'Member with this roll number already exists' }, 409)
    return c.json({ error: 'Failed to create member', details: e.message }, 500)
  }
})

app.put('/api/admin/members/:uuid', requireAuth, requireRole('super_admin'), async (c) => {
  const uuid = c.req.param('uuid')
  const user = c.get('user')
  try {
    const body = await c.req.json()
    const { full_name, email, phone, department, section, year, status, position } = body

    const member = await c.env.DB.prepare('SELECT id, full_name FROM members WHERE uuid = ?').bind(uuid).first()
    if (!member) return c.json({ error: 'Member not found' }, 404)

    const updates: string[] = []
    const params: any[] = []
    if (full_name !== undefined) { updates.push('full_name = ?'); params.push(full_name) }
    if (email !== undefined) { updates.push('email = ?'); params.push(email) }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone) }
    if (department !== undefined) { updates.push('department = ?'); params.push(department) }
    if (section !== undefined) { updates.push('section = ?'); params.push(section) }
    if (year !== undefined) { updates.push('year = ?'); params.push(year) }
    if (status !== undefined) { updates.push('status = ?'); params.push(status) }
    if (position !== undefined) { updates.push('position = ?'); params.push(position) }

    if (updates.length === 0) return c.json({ error: 'No fields to update' }, 400)

    params.push(uuid)
    await c.env.DB.prepare(`UPDATE members SET ${updates.join(', ')} WHERE uuid = ?`).bind(...params).run()

    const action = status === 'suspended' ? 'MEMBER_SUSPENDED' :
                   status === 'archived' ? 'MEMBER_ARCHIVED' :
                   status === 'graduated' ? 'MEMBER_GRADUATED' : 'MEMBER_UPDATED'
    await createAuditLog(c.env.DB, user!.id, 'super_admin', action,
      `Member updated: ${(member.full_name as string).trim()} → ${JSON.stringify(body)}`)

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to update member', details: e.message }, 500)
  }
})

// Student password reset by admin
app.post('/api/admin/members/:uuid/reset-password', requireAuth, requireRole('super_admin'), async (c) => {
  const uuid = c.req.param('uuid')
  const user = c.get('user')
  try {
    const member = await c.env.DB.prepare('SELECT id, full_name, roll_number FROM members WHERE uuid = ?').bind(uuid).first()
    if (!member) return c.json({ error: 'Member not found' }, 404)

    // Reset to roll number as temp password
    const tempHash = await hashPassword(member.roll_number as string)
    await c.env.DB.prepare(
      'UPDATE student_credentials SET password_hash = ?, must_change_password = 1, login_attempts = 0, locked_until = NULL WHERE member_id = ?'
    ).bind(tempHash, member.id).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'PASSWORD_RESET',
      `Password reset for student ${(member.full_name as string).trim()} (${member.roll_number})`)

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to reset password', details: e.message }, 500)
  }
})

// Member transfer between clubs
app.post('/api/admin/members/:uuid/transfer', requireAuth, requireRole('super_admin'), async (c) => {
  const uuid = c.req.param('uuid')
  const user = c.get('user')
  try {
    const { new_club_id, new_role } = await c.req.json()
    if (!new_club_id) return c.json({ error: 'new_club_id is required' }, 400)

    const member = await c.env.DB.prepare(
      `SELECT m.id, m.full_name, m.roll_number, mc.club_id as old_club_id, c.name as old_club_name
       FROM members m
       JOIN member_clubs mc ON m.id = mc.member_id
       JOIN clubs c ON mc.club_id = c.id
       WHERE m.uuid = ?`
    ).bind(uuid).first()
    if (!member) return c.json({ error: 'Member not found' }, 404)

    const newClub = await c.env.DB.prepare('SELECT name FROM clubs WHERE id = ?').bind(new_club_id).first()
    if (!newClub) return c.json({ error: 'Target club not found' }, 404)

    // Update club assignment
    await c.env.DB.prepare('UPDATE member_clubs SET club_id = ?, role = ? WHERE member_id = ?')
      .bind(new_club_id, new_role || 'Member', member.id).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'MEMBER_TRANSFERRED',
      `${(member.full_name as string).trim()} (${member.roll_number}) transferred from ${member.old_club_name} to ${newClub.name}`)

    return c.json({ success: true, old_club: member.old_club_name, new_club: newClub.name })
  } catch (e: any) {
    return c.json({ error: 'Failed to transfer member', details: e.message }, 500)
  }
})

// Bulk operations
app.post('/api/admin/members/bulk', requireAuth, requireRole('super_admin'), async (c) => {
  const user = c.get('user')
  try {
    const { action, member_uuids, club_id } = await c.req.json()
    if (!action || !member_uuids || !Array.isArray(member_uuids) || member_uuids.length === 0) {
      return c.json({ error: 'action and member_uuids[] are required' }, 400)
    }

    let processed = 0
    for (const uuid of member_uuids) {
      try {
        if (action === 'suspend') {
          await c.env.DB.prepare("UPDATE members SET status = 'suspended' WHERE uuid = ?").bind(uuid).run()
          processed++
        } else if (action === 'activate') {
          await c.env.DB.prepare("UPDATE members SET status = 'active' WHERE uuid = ?").bind(uuid).run()
          processed++
        } else if (action === 'archive') {
          await c.env.DB.prepare("UPDATE members SET status = 'archived' WHERE uuid = ?").bind(uuid).run()
          processed++
        } else if (action === 'assign_club' && club_id) {
          const member = await c.env.DB.prepare('SELECT id FROM members WHERE uuid = ?').bind(uuid).first()
          if (member) {
            await c.env.DB.prepare('UPDATE member_clubs SET club_id = ? WHERE member_id = ?').bind(club_id, member.id).run()
            processed++
          }
        }
      } catch { /* skip individual failures */ }
    }

    await createAuditLog(c.env.DB, user!.id, 'super_admin', `BULK_${action.toUpperCase()}`,
      `Bulk ${action}: ${processed}/${member_uuids.length} members processed`)

    return c.json({ success: true, processed, total: member_uuids.length })
  } catch (e: any) {
    return c.json({ error: 'Bulk operation failed', details: e.message }, 500)
  }
})

// --- HOD CRUD ---
app.post('/api/admin/hods', requireAuth, requireRole('super_admin'), async (c) => {
  const user = c.get('user')
  try {
    const { name, department, email, password } = await c.req.json()
    if (!name || !department || !email || !password) return c.json({ error: 'name, department, email, password required' }, 400)

    const pwError = validatePassword(password)
    if (pwError) return c.json({ error: pwError }, 400)

    const id = `hod-${crypto.randomUUID().slice(0, 8)}`
    const hash = await hashPassword(password)

    await c.env.DB.prepare('INSERT INTO hods (id, name, department, email, password_hash) VALUES (?, ?, ?, ?, ?)')
      .bind(id, name, department, email, hash).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'HOD_CREATED', `HOD created: ${name} (${department})`)
    return c.json({ success: true, id })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) return c.json({ error: 'HOD with this email already exists' }, 409)
    return c.json({ error: 'Failed to create HOD', details: e.message }, 500)
  }
})

app.put('/api/admin/hods/:id', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  try {
    const body = await c.req.json()
    const { name, department, email, status } = body

    const updates: string[] = []
    const params: any[] = []
    if (name !== undefined) { updates.push('name = ?'); params.push(name) }
    if (department !== undefined) { updates.push('department = ?'); params.push(department) }
    if (email !== undefined) { updates.push('email = ?'); params.push(email) }
    if (status !== undefined) { updates.push('status = ?'); params.push(status) }

    if (updates.length === 0) return c.json({ error: 'No fields to update' }, 400)

    params.push(id)
    await c.env.DB.prepare(`UPDATE hods SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'HOD_UPDATED', `HOD ${id} updated: ${JSON.stringify(body)}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to update HOD', details: e.message }, 500)
  }
})

app.post('/api/admin/hods/:id/reset-password', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  try {
    const { password } = await c.req.json()
    if (!password) return c.json({ error: 'password required' }, 400)

    const pwError = validatePassword(password)
    if (pwError) return c.json({ error: pwError }, 400)

    const hash = await hashPassword(password)
    await c.env.DB.prepare('UPDATE hods SET password_hash = ?, login_attempts = 0, locked_until = NULL WHERE id = ?').bind(hash, id).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'PASSWORD_RESET', `Password reset for HOD ${id}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to reset password', details: e.message }, 500)
  }
})

// --- HOD listing ---
app.get('/api/admin/hods', requireAuth, requireRole('super_admin', 'admin'), async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT id, name, department, email, status, created_at FROM hods ORDER BY name').all()
    return c.json({ hods: result.results })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

// --- Faculty Coordinator Management ---
app.get('/api/admin/coordinators', requireAuth, requireRole('super_admin', 'admin'), async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT m.id, m.uuid, m.full_name, m.email, m.phone, m.department,
              GROUP_CONCAT(c.name) as club_names,
              GROUP_CONCAT(c.id) as club_ids
       FROM members m
       LEFT JOIN faculty_club_assignments fca ON m.id = fca.faculty_member_id
       LEFT JOIN clubs c ON fca.club_id = c.id
       WHERE m.member_type = 'faculty'
       GROUP BY m.id
       ORDER BY m.full_name`
    ).all()
    return c.json({ coordinators: result.results?.map((f: any) => ({
      ...f,
      full_name: f.full_name?.trim(),
      clubs: f.club_names ? f.club_names.split(',').map((n: string, i: number) => ({
        id: parseInt(f.club_ids.split(',')[i]),
        name: n,
      })) : [],
    })) || [] })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.get('/api/admin/club-accounts', requireAuth, requireRole('super_admin', 'admin'), async (c) => {
  try {
    const result = await c.env.DB.prepare(
      `SELECT cc.id, cc.email, cc.status, cc.login_attempts, cc.locked_until, cc.created_at, c.name as club_name
       FROM coordinator_credentials cc
       JOIN clubs c ON cc.club_id = c.id
       ORDER BY c.name`
    ).all()
    return c.json({ accounts: result.results || [] })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.post('/api/admin/coordinators/:memberId/assign-club', requireAuth, requireRole('super_admin'), async (c) => {
  const memberId = parseInt(c.req.param('memberId'))
  const user = c.get('user')
  try {
    const { club_id } = await c.req.json()
    if (!club_id) return c.json({ error: 'club_id required' }, 400)

    await c.env.DB.prepare('INSERT OR IGNORE INTO faculty_club_assignments (faculty_member_id, club_id) VALUES (?, ?)').bind(memberId, club_id).run()

    const member = await c.env.DB.prepare('SELECT full_name FROM members WHERE id = ?').bind(memberId).first()
    const club = await c.env.DB.prepare('SELECT name FROM clubs WHERE id = ?').bind(club_id).first()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'FACULTY_ASSIGNED',
      `Faculty ${(member?.full_name as string)?.trim()} assigned to club ${club?.name}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to assign', details: e.message }, 500)
  }
})

app.delete('/api/admin/coordinators/:memberId/remove-club', requireAuth, requireRole('super_admin'), async (c) => {
  const memberId = parseInt(c.req.param('memberId'))
  const user = c.get('user')
  try {
    const { club_id } = await c.req.json()
    if (!club_id) return c.json({ error: 'club_id required' }, 400)

    await c.env.DB.prepare('DELETE FROM faculty_club_assignments WHERE faculty_member_id = ? AND club_id = ?').bind(memberId, club_id).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'FACULTY_REMOVED', `Faculty ${memberId} removed from club ${club_id}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to remove', details: e.message }, 500)
  }
})

// --- Club Management ---
app.post('/api/admin/clubs', requireAuth, requireRole('super_admin'), async (c) => {
  const user = c.get('user')
  try {
    const { name, description } = await c.req.json()
    if (!name) return c.json({ error: 'name required' }, 400)

    await c.env.DB.prepare('INSERT INTO clubs (name, description, status) VALUES (?, ?, ?)').bind(name, description || null, 'active').run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'CLUB_CREATED', `Club created: ${name}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to create club', details: e.message }, 500)
  }
})

app.put('/api/admin/clubs/:id', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  const user = c.get('user')
  try {
    const { name, description, status } = await c.req.json()

    const updates: string[] = []
    const params: any[] = []
    if (name !== undefined) { updates.push('name = ?'); params.push(name) }
    if (description !== undefined) { updates.push('description = ?'); params.push(description) }
    if (status !== undefined) { updates.push('status = ?'); params.push(status) }

    if (updates.length === 0) return c.json({ error: 'No fields to update' }, 400)

    params.push(id)
    await c.env.DB.prepare(`UPDATE clubs SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run()

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'CLUB_UPDATED', `Club ${id} updated: ${JSON.stringify({ name, description, status })}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to update club', details: e.message }, 500)
  }
})

// --- Settings ---
app.get('/api/settings', requireAuth, async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT key, value FROM settings ORDER BY key').all()
    const settings: Record<string, string> = {}
    for (const row of result.results || []) {
      settings[row.key as string] = row.value as string
    }
    return c.json({ settings })
  } catch (e: any) {
    return c.json({ error: 'Database error' }, 500)
  }
})

app.put('/api/settings', requireAuth, requireRole('super_admin'), async (c) => {
  const user = c.get('user')
  try {
    const body = await c.req.json()
    for (const [key, value] of Object.entries(body)) {
      await c.env.DB.prepare(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP'
      ).bind(key, String(value), String(value)).run()
    }

    await createAuditLog(c.env.DB, user!.id, 'super_admin', 'SETTINGS_UPDATED', `Settings updated: ${Object.keys(body).join(', ')}`)
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Failed to update settings', details: e.message }, 500)
  }
})

// --- System Health ---
app.get('/api/admin/health', requireAuth, requireRole('super_admin'), async (c) => {
  try {
    const members = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members').first()
    const clubs = await c.env.DB.prepare('SELECT COUNT(*) as count FROM clubs').first()
    const permissions = await c.env.DB.prepare('SELECT COUNT(*) as count FROM permissions').first()
    const auditLogs = await c.env.DB.prepare('SELECT COUNT(*) as count FROM audit_logs').first()
    const notifications = await c.env.DB.prepare('SELECT COUNT(*) as count FROM notifications').first()
    const lastAudit = await c.env.DB.prepare('SELECT created_at FROM audit_logs ORDER BY created_at DESC LIMIT 1').first()
    const studentCredentials = await c.env.DB.prepare('SELECT COUNT(*) as count FROM student_credentials').first()

    return c.json({
      status: 'healthy',
      version: '1.2',
      database: 'connected',
      worker: 'running',
      tables: {
        members: members?.count || 0,
        clubs: clubs?.count || 0,
        permissions: permissions?.count || 0,
        audit_logs: auditLogs?.count || 0,
        notifications: notifications?.count || 0,
        student_credentials: studentCredentials?.count || 0,
      },
      last_audit_log: lastAudit?.created_at || null,
    })
  } catch (e: any) {
    return c.json({ status: 'unhealthy', error: e.message }, 500)
  }
})


// ============================================================
// ADMIN ACCOUNT MANAGEMENT (Super Admin only)
// ============================================================

app.get('/api/admin/admins', requireAuth, requireRole('super_admin'), async (c) => {
  try {
    const admins = await c.env.DB.prepare('SELECT id, name, email, role, created_at FROM admins').all()
    return c.json({ admins: admins.results })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.post('/api/admin/admins', requireAuth, requireRole('super_admin'), async (c) => {
  const { name, email, password, role } = await c.req.json()
  if (!email || !password || !name) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  try {
    const id = 'admin-' + crypto.randomUUID().substring(0, 8)
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    
    await c.env.DB.prepare(
      'INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, name, email, passwordHash, role || 'admin').run()
    
    // Audit Log
    const user = c.get('user')
    await c.env.DB.prepare(
      'INSERT INTO audit_logs (id, user_id, user_role, action, details) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), user!.id, user!.role, 'create_admin', `Created admin ${email} with role ${role || 'admin'}`).run()
    
    return c.json({ success: true, admin: { id, name, email, role: role || 'admin' } })
  } catch (e: any) {
    if (e.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Email already exists' }, 400)
    }
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.put('/api/admin/admins/:id/password', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  const { password } = await c.req.json()
  try {
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    await c.env.DB.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').bind(passwordHash, id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

app.delete('/api/admin/admins/:id', requireAuth, requireRole('super_admin'), async (c) => {
  const id = c.req.param('id')
  try {
    await c.env.DB.prepare('DELETE FROM admins WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: 'Database error', details: e.message }, 500)
  }
})

export default app
