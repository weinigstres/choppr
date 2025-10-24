/*
  # Choppr Core Schema - Initial Setup

  ## Overview
  This migration creates the foundational database structure for Choppr, an IT governance 
  and operating-model platform based on IT4IT™ reference architecture.

  ## 1. New Tables

  ### organizations
  - `id` (uuid, primary key) - Unique organization identifier
  - `name` (text) - Organization name
  - `domain` (text, unique) - Organization domain for identification
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### users
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `organization_id` (uuid, foreign key) - Organization membership
  - `full_name` (text) - User's full name
  - `role` (text) - User role within organization
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### profiles
  - `id` (uuid, primary key) - Unique profile identifier
  - `key` (text, unique) - Profile key (e.g., 'utility', 'responder', 'differentiator')
  - `name` (text) - Display name of the profile
  - `description` (text) - Detailed profile description
  - `created_at` (timestamptz) - Record creation timestamp

  ### value_streams
  - `id` (uuid, primary key) - Unique value stream identifier
  - `name` (text) - Value stream name (e.g., 'Strategy to Portfolio')
  - `description` (text) - Detailed description
  - `display_order` (integer) - Order for UI display
  - `created_at` (timestamptz) - Record creation timestamp

  ### processes
  - `id` (uuid, primary key) - Unique process identifier
  - `name` (text) - Process name
  - `description` (text) - Detailed process description
  - `default_enabled` (boolean) - Whether enabled by default
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### process_value_streams
  - `process_id` (uuid, foreign key) - References processes
  - `value_stream_id` (uuid, foreign key) - References value_streams
  - `stage_name` (text) - Stage within the value stream
  - Composite primary key on (process_id, value_stream_id)

  ### frameworks
  - `id` (uuid, primary key) - Unique framework identifier
  - `name` (text, unique) - Framework name (e.g., 'ITIL 4', 'COBIT', 'ISO 27001')
  - `description` (text) - Framework description
  - `version` (text) - Framework version
  - `created_at` (timestamptz) - Record creation timestamp

  ### process_framework_refs
  - `id` (uuid, primary key) - Unique reference identifier
  - `process_id` (uuid, foreign key) - References processes
  - `framework_id` (uuid, foreign key) - References frameworks
  - `reference` (text) - Specific reference (e.g., clause number)
  - `description` (text) - Description of the reference
  - `created_at` (timestamptz) - Record creation timestamp

  ### risk_controls
  - `id` (uuid, primary key) - Unique control identifier
  - `code` (text, unique) - Control code (e.g., 'ITGC-01', 'ISO-A.5.1')
  - `name` (text) - Control name
  - `description` (text) - Detailed control description
  - `framework_id` (uuid, foreign key) - Associated framework
  - `control_type` (text) - Type of control (e.g., 'preventive', 'detective')
  - `created_at` (timestamptz) - Record creation timestamp

  ### process_risk_controls
  - `process_id` (uuid, foreign key) - References processes
  - `risk_control_id` (uuid, foreign key) - References risk_controls
  - Composite primary key on (process_id, risk_control_id)

  ### governance_bodies
  - `id` (uuid, primary key) - Unique body identifier
  - `organization_id` (uuid, foreign key) - Organization ownership
  - `name` (text) - Body name (e.g., 'Change Advisory Board')
  - `description` (text) - Body description
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### org_selected_profile
  - `organization_id` (uuid, primary key, foreign key) - References organizations
  - `profile_id` (uuid, foreign key) - References profiles
  - `selected_at` (timestamptz) - When profile was selected

  ### org_enabled_processes
  - `organization_id` (uuid, foreign key) - References organizations
  - `process_id` (uuid, foreign key) - References processes
  - `enabled_at` (timestamptz) - When process was enabled
  - Composite primary key on (organization_id, process_id)

  ## 2. Security

  - RLS enabled on ALL tables
  - Policies ensure organizations can only access their own data
  - Users can only access data for their organization
  - Public can read reference data (profiles, value_streams, frameworks, risk_controls)

  ## 3. Important Notes

  - All tables use UUIDs for primary keys
  - Timestamps use timestamptz for timezone awareness
  - Foreign keys enforce referential integrity
  - Indexes added for common query patterns
  - RLS policies follow least-privilege principle
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  full_name text,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table (reference data)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create value_streams table (reference data)
CREATE TABLE IF NOT EXISTS value_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create processes table (reference data)
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  default_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create process_value_streams junction table
CREATE TABLE IF NOT EXISTS process_value_streams (
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  value_stream_id uuid REFERENCES value_streams(id) ON DELETE CASCADE,
  stage_name text,
  PRIMARY KEY (process_id, value_stream_id)
);

-- Create frameworks table (reference data)
CREATE TABLE IF NOT EXISTS frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  version text,
  created_at timestamptz DEFAULT now()
);

-- Create process_framework_refs table
CREATE TABLE IF NOT EXISTS process_framework_refs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  framework_id uuid REFERENCES frameworks(id) ON DELETE CASCADE,
  reference text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create risk_controls table (reference data)
CREATE TABLE IF NOT EXISTS risk_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  framework_id uuid REFERENCES frameworks(id) ON DELETE SET NULL,
  control_type text,
  created_at timestamptz DEFAULT now()
);

-- Create process_risk_controls junction table
CREATE TABLE IF NOT EXISTS process_risk_controls (
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  risk_control_id uuid REFERENCES risk_controls(id) ON DELETE CASCADE,
  PRIMARY KEY (process_id, risk_control_id)
);

-- Create governance_bodies table
CREATE TABLE IF NOT EXISTS governance_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create org_selected_profile table
CREATE TABLE IF NOT EXISTS org_selected_profile (
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  selected_at timestamptz DEFAULT now()
);

-- Create org_enabled_processes table
CREATE TABLE IF NOT EXISTS org_enabled_processes (
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  enabled_at timestamptz DEFAULT now(),
  PRIMARY KEY (organization_id, process_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_process_value_streams_process ON process_value_streams(process_id);
CREATE INDEX IF NOT EXISTS idx_process_value_streams_value_stream ON process_value_streams(value_stream_id);
CREATE INDEX IF NOT EXISTS idx_governance_bodies_organization ON governance_bodies(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_enabled_processes_organization ON org_enabled_processes(organization_id);
CREATE INDEX IF NOT EXISTS idx_process_framework_refs_process ON process_framework_refs(process_id);
CREATE INDEX IF NOT EXISTS idx_process_risk_controls_process ON process_risk_controls(process_id);

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_value_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_framework_refs ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_risk_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_selected_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_enabled_processes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies for reference data (public read)
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view value_streams"
  ON value_streams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view processes"
  ON processes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view process_value_streams"
  ON process_value_streams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view frameworks"
  ON frameworks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view process_framework_refs"
  ON process_framework_refs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view risk_controls"
  ON risk_controls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view process_risk_controls"
  ON process_risk_controls FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for governance_bodies
CREATE POLICY "Users can view governance bodies in their organization"
  ON governance_bodies FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert governance bodies"
  ON governance_bodies FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update governance bodies"
  ON governance_bodies FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete governance bodies"
  ON governance_bodies FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for org_selected_profile
CREATE POLICY "Users can view their organization's selected profile"
  ON org_selected_profile FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage organization profile"
  ON org_selected_profile FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for org_enabled_processes
CREATE POLICY "Users can view their organization's enabled processes"
  ON org_enabled_processes FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage enabled processes"
  ON org_enabled_processes FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON processes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_bodies_updated_at
  BEFORE UPDATE ON governance_bodies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();