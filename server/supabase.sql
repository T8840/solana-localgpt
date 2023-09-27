-- Create users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY,          -- unique identifier for the user or tenant
    bearer TEXT UNIQUE NOT NULL,    -- a token or authentication identifier
    app_id TEXT NOT NULL,           -- identifier for an application
    vectorstore integer ,               -- an ID or key related to vector storage or database
    wallet_address TEXT, 
    wallet_private_key TEXT, 
    email TEXT,
    email_password TEXT
);

-- Create credentials table
CREATE TABLE credentials (
    id SERIAL PRIMARY KEY,          -- auto-incrementing primary key
    user_id UUID REFERENCES users(user_id), -- foreign key reference to users table
    connector_id TEXT NOT NULL,     -- identifier for a data connector
    credential TEXT NOT NULL,       -- a token or other authentication information
    UNIQUE(user_id, connector_id)   -- unique constraint to ensure one credential per user per connector
);

-- Create vectorstore_credentials table
CREATE TABLE vectorstore_credentials (
    id SERIAL PRIMARY KEY,          -- auto-incrementing primary key
    user_id UUID REFERENCES users(user_id), -- foreign key reference to users table
    vectorstore integer NOT NULL,      -- an ID or key representing a vector storage or database
    credential TEXT NOT NULL,       -- authentication information related to vectorstore
    UNIQUE(user_id, vectorstore)    -- unique constraint to ensure one credential per user per vectorstore
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users are public." ON users FOR
    SELECT USING (true);

CREATE POLICY "Individuals can create users." ON users FOR
    INSERT WITH CHECK (true);

CREATE POLICY "Individuals can update their own users." ON users FOR
    UPDATE USING (true);

CREATE POLICY "Individuals can delete their own users." ON users FOR
    DELETE USING (true);


-- Enable RLS
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Credentials are public." ON credentials FOR
    SELECT USING (true);

CREATE POLICY "Individuals can create credentials." ON credentials FOR
    INSERT WITH CHECK (true);

CREATE POLICY "Individuals can update their own credentials." ON credentials FOR
    UPDATE USING (true);

CREATE POLICY "Individuals can delete their own credentials." ON credentials FOR
    DELETE USING (true);

-- Enable RLS
ALTER TABLE vectorstore_credentials ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Vectorstore_credentials are public." ON vectorstore_credentials FOR
    SELECT USING (true);

CREATE POLICY "Individuals can create vectorstore_credentials." ON vectorstore_credentials FOR
    INSERT WITH CHECK (true);

CREATE POLICY "Individuals can update their own vectorstore_credentials." ON vectorstore_credentials FOR
    UPDATE USING (true);

CREATE POLICY "Individuals can delete their own vectorstore_credentials." ON vectorstore_credentials FOR
    DELETE USING (true);
