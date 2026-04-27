const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const email = 'dannumannusyed@gmail.com';
  const newPassword = 'Password123!';

  console.log(`Checking user: ${email}...`);

  try {
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError.message);
      return;
    }

    const user = users.users.find(u => u.email === email);

    if (user) {
      console.log(`User found (ID: ${user.id}). Resetting password...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword,
        email_confirm: true
      });

      if (updateError) {
        console.error('Error updating password:', updateError.message);
      } else {
        console.log('✅ Password reset successfully!');
      }
    } else {
      console.log('User not found. Creating user...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: newPassword,
        email_confirm: true,
        user_metadata: { first_name: 'Danny', last_name: 'Syed' }
      });

      if (createError) {
        console.error('Error creating user:', createError.message);
      } else {
        console.log('✅ User created successfully!');
      }
    }
    
    console.log(`\nYou can now log in with:\nEmail: ${email}\nPassword: ${newPassword}`);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
