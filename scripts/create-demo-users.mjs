import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env.local');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const source = fs.readFileSync(filePath, 'utf8');
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

loadEnvFile(envPath);

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) fail('Missing SUPABASE_URL or VITE_SUPABASE_URL in environment.');
if (!serviceRoleKey) fail('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local or shell environment.');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: 'client.demo@stairs-pro.kz',
    password: 'DemoClient123!',
    full_name: 'Александр Н.',
    phone: '+7 (701) 555-12-34',
    role: 'client',
  },
  {
    email: 'designer.demo@stairs-pro.kz',
    password: 'DemoDesigner123!',
    full_name: 'Айдана К.',
    phone: '+7 (707) 555-11-22',
    role: 'client',
  },
  {
    email: 'admin.demo@stairs-pro.kz',
    password: 'DemoAdmin123!',
    full_name: 'Менеджер Staircase Pro',
    phone: '+7 (700) 555-77-11',
    role: 'admin',
  },
];

async function listUsers() {
  const users = [];
  let page = 1;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`Failed to load auth users: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < 200) break;
    page += 1;
  }

  return users;
}

const existingAuthUsers = await listUsers();

for (const demoUser of demoUsers) {
  const existing = existingAuthUsers.find((item) => item.email?.toLowerCase() === demoUser.email.toLowerCase());
  let authUserId = existing?.id;

  if (!authUserId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: demoUser.email,
      password: demoUser.password,
      email_confirm: true,
      user_metadata: { full_name: demoUser.full_name },
    });

    if (error) fail(`Failed to create auth user ${demoUser.email}: ${error.message}`);
    authUserId = data.user.id;
    console.log(`Created auth user: ${demoUser.email}`);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      password: demoUser.password,
      email_confirm: true,
      user_metadata: { full_name: demoUser.full_name },
    });

    if (error) fail(`Failed to update auth user ${demoUser.email}: ${error.message}`);
    console.log(`Updated auth user: ${demoUser.email}`);
  }

  const { error: profileError } = await supabase.from('users').upsert(
    {
      id: authUserId,
      email: demoUser.email,
      full_name: demoUser.full_name,
      phone: demoUser.phone,
      role: demoUser.role,
    },
    { onConflict: 'id' },
  );

  if (profileError) fail(`Failed to upsert public.users profile for ${demoUser.email}: ${profileError.message}`);
}

console.log('');
console.log('Demo users are ready:');
for (const demoUser of demoUsers) {
  console.log(`- ${demoUser.email} / ${demoUser.password} (${demoUser.role})`);
}
