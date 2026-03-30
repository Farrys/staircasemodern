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

function readArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

loadEnvFile(envPath);

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = readArg('user-id');
const email = readArg('email');
const password = readArg('password');
const confirmEmail = readArg('confirm-email') !== 'false';

if (!supabaseUrl) {
  fail('Missing SUPABASE_URL or VITE_SUPABASE_URL in environment.');
}

if (!serviceRoleKey) {
  fail('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local or shell environment.');
}

if (!password) {
  fail('Pass a password with --password=your_new_password');
}

if (!userId && !email) {
  fail('Pass either --user-id=<uuid> or --email=<user@example.com>');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resolveUserId() {
  if (userId) return userId;

  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) fail(`Failed to load users: ${error.message}`);

  const user = data.users.find((item) => item.email?.toLowerCase() === email?.toLowerCase());
  if (!user) {
    fail(`User with email ${email} was not found in auth.users.`);
  }

  return user.id;
}

const targetUserId = await resolveUserId();

const { data, error } = await supabase.auth.admin.updateUserById(targetUserId, {
  password,
  email_confirm: confirmEmail,
});

if (error) {
  fail(`Failed to update user: ${error.message}`);
}

console.log('User updated successfully.');
console.log(`id: ${data.user.id}`);
console.log(`email: ${data.user.email}`);
console.log(`email_confirmed_at: ${data.user.email_confirmed_at ?? 'null'}`);
