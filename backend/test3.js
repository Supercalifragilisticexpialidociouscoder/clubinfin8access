async function run() {
  const token = (await import('jsonwebtoken')).sign({ id: 'u1', role: 'hod' }, 'clubpass-jwt-secret-2024-production');
  const res = await fetch('http://localhost:8787/api/permissions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(await res.json());
}
run();
