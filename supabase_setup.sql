-- Run this in your Supabase SQL Editor to set up the Realtime Quiz & App State
CREATE TABLE app_state (
  id int primary key default 1,
  stage_index int default 0,
  temperature int default 50,
  garden_flowers jsonb default '[]'::jsonb,
  bensons_choice jsonb default '{}'::jsonb,
  slot_result text default '???',
  scratch_revealed boolean default false,
  mood text,
  together_category text,
  together_q_index int default 0,
  together_benson_ans text,
  together_kendy_ans text
);

-- Insert initial state
INSERT INTO app_state (id) VALUES (1);

-- Realtime Quiz Table
CREATE TABLE quiz_state (
  id int primary key default 1,
  question_index int default 0,
  benson_answer text,
  kendy_answer text
);

INSERT INTO quiz_state (id, question_index, benson_answer, kendy_answer)
VALUES (1, 0, null, null);



-- Set up Row Level Security (RLS) to allow anonymous read/write for this app

