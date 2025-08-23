// Seed script to create test data for Artopia
// Run this with Node.js after setting up your Supabase project

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- VITE_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nPlease add these to your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create test users
    console.log('Creating test users...')
    
    // Test User 1
    const { data: user1, error: user1Error } = await supabase.auth.admin.createUser({
      email: 'alice@example.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        display_name: 'Alice Cooper'
      }
    })

    if (user1Error) {
      console.error('Error creating user1:', user1Error)
      return
    }

    // Test User 2  
    const { data: user2, error: user2Error } = await supabase.auth.admin.createUser({
      email: 'bob@example.com', 
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        display_name: 'Bob Ross'
      }
    })

    if (user2Error) {
      console.error('Error creating user2:', user2Error)
      return
    }

    // Create profiles
    console.log('Creating profiles...')
    
    const profiles = [
      {
        id: user1.user.id,
        email: 'alice@example.com',
        display_name: 'Alice Cooper',
        bio: 'Digital artist and photographer. Love capturing moments and creating surreal art.',
        location: 'San Francisco, CA',
        artforms: 'Digital Art, Photography, Illustration'
      },
      {
        id: user2.user.id,
        email: 'bob@example.com',
        display_name: 'Bob Ross',
        bio: 'Happy little trees and peaceful landscapes. Teaching the joy of painting to everyone.',
        location: 'Orlando, FL',
        artforms: 'Oil Painting, Landscape, Teaching'
      }
    ]

    const { error: profilesError } = await supabase
      .from('profiles')
      .insert(profiles)

    if (profilesError) {
      console.error('Error creating profiles:', profilesError)
      return
    }

    // Create sample posts (using placeholder images from Pexels)
    console.log('Creating sample posts...')
    
    const posts = [
      {
        user_id: user1.user.id,
        image_url: 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=800',
        image_path: 'sample1.jpg',
        caption: 'Sunset over the city - captured this beautiful moment from my rooftop! 🌅'
      },
      {
        user_id: user1.user.id,
        image_url: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=800',
        image_path: 'sample2.jpg',
        caption: 'Digital art experiment with light and shadow. What do you think?'
      },
      {
        user_id: user2.user.id,
        image_url: 'https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&w=800',
        image_path: 'sample3.jpg',
        caption: 'Happy little mountains in the distance. Remember, there are no mistakes, only happy accidents!'
      },
      {
        user_id: user2.user.id,
        image_url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
        image_path: 'sample4.jpg',
        caption: 'Forest painting session today. The trees were whispering their secrets to the wind.'
      },
      {
        user_id: user1.user.id,
        image_url: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=800',
        image_path: 'sample5.jpg',
        caption: 'Street art photography - love the colors and energy of urban creativity!'
      }
    ]

    const { error: postsError } = await supabase
      .from('posts')
      .insert(posts)

    if (postsError) {
      console.error('Error creating posts:', postsError)
      return
    }

    // Create a sample chat between users
    console.log('Creating sample chat...')
    
    const chatId = [user1.user.id, user2.user.id].sort().join('_')
    
    const { error: chatError } = await supabase
      .from('chats')
      .insert({
        id: chatId,
        participant_1: user1.user.id,
        participant_2: user2.user.id
      })

    if (chatError) {
      console.error('Error creating chat:', chatError)
      return
    }

    // Create sample messages
    console.log('Creating sample messages...')
    
    const messages = [
      {
        chat_id: chatId,
        sender_id: user1.user.id,
        content: 'Hey Bob! Love your latest landscape painting 🎨'
      },
      {
        chat_id: chatId,
        sender_id: user2.user.id,
        content: 'Thank you Alice! Your digital art is absolutely amazing. How do you get those lighting effects?'
      },
      {
        chat_id: chatId,
        sender_id: user1.user.id,
        content: 'It\'s all about layer blending and working with gradients. I could show you sometime!'
      },
      {
        chat_id: chatId,
        sender_id: user2.user.id,
        content: 'That would be wonderful! I\'m always eager to learn new techniques 😊'
      }
    ]

    const { error: messagesError } = await supabase
      .from('messages')
      .insert(messages)

    if (messagesError) {
      console.error('Error creating messages:', messagesError)
      return
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📝 Test Accounts Created:')
    console.log('1. Email: alice@example.com | Password: password123')
    console.log('2. Email: bob@example.com | Password: password123')
    console.log('\n🎨 Sample data includes:')
    console.log('- 2 user profiles with bios and locations')
    console.log('- 5 sample posts with images')
    console.log('- 1 chat conversation with 4 messages')
    console.log('\n🚀 You can now test the application with these accounts!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Run the seed function
seedDatabase()

// To run this script:
// 1. Install dependencies: npm install @supabase/supabase-js
// 2. Update the supabaseUrl and supabaseServiceRoleKey variables above
// 3. Run: node seed.js