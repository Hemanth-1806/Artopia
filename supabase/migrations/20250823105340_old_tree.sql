/*
  # Artopia Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `posts` - User posts with images and captions
    - `chats` - Chat conversations between users
    - `messages` - Individual messages in chats

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text DEFAULT '',
  location text DEFAULT '',
  artforms text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  image_path text NOT NULL,
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id text PRIMARY KEY,
  participant_1 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chats policies
CREATE POLICY "Users can read their chats"
  ON chats FOR SELECT
  TO authenticated
  USING (
    auth.uid() = participant_1 OR 
    auth.uid() = participant_2
  );

CREATE POLICY "Users can create chats they participate in"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = participant_1 OR 
    auth.uid() = participant_2
  );

-- Messages policies
CREATE POLICY "Users can read messages from their chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = chat_id 
      AND (chats.participant_1 = auth.uid() OR chats.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = chat_id 
      AND (chats.participant_1 = auth.uid() OR chats.participant_2 = auth.uid())
    )
  );

-- Create updated_at function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();