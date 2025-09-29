#!/usr/bin/env node

/**
 * Database Setup Script for Student Information Management System
 *
 * This script provides instructions for setting up the database.
 * Since Supabase doesn't allow direct SQL execution from client-side scripts
 * for security reasons, you'll need to run these SQL files manually.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Student Information Management System - Database Setup');
console.log('='.repeat(60));

console.log('\n📋 To set up your database, follow these steps:');
console.log('\n1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to the SQL Editor tab');
console.log('4. Run the following SQL files in order:');

const sqlFiles = [
  'scripts/01_create_tables.sql',
  'scripts/02_enable_rls_minimal.sql',
  'scripts/03_create_functions.sql',
  'scripts/04_seed_data.sql'
];

sqlFiles.forEach((file, index) => {
  const filePath = path.join(__dirname, '..', file);
  try {
    const stats = fs.statSync(filePath);
    console.log(`\n${index + 1}. ${file} (${stats.size} bytes)`);
    console.log(`   Copy and paste the contents of this file into the SQL Editor`);
  } catch (err) {
    console.log(`\n${index + 1}. ${file} - FILE NOT FOUND`);
  }
});

console.log('\n🔑 Important Notes:');
console.log('- Make sure you have the service role key or admin access to your Supabase project');
console.log('- Run scripts ONE BY ONE in the SQL Editor to identify which one fails');
console.log('- Start with 01_create_tables.sql first');
console.log('- 02_enable_rls_minimal.sql DISABLES RLS for development (no security yet)');
console.log('- The handle_new_user() function automatically creates user profiles when users register');
console.log('- You can enable proper RLS policies later for production security');

console.log('\n⚠️  Alternative: Using Supabase CLI');
console.log('If you have Supabase CLI installed, you can run:');
console.log('supabase db push');

console.log('\n✨ After running all scripts, your database will be ready!');
console.log('Users can register and the application will work properly.');

console.log('\n='.repeat(60));
console.log('Setup instructions completed. Happy coding! 🎉');