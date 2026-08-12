-- ============ helper: updated_at ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ enums ============
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.agent_status AS ENUM ('active','warned','suspended','revoked');
CREATE TYPE public.escrow_status AS ENUM ('unfunded','locked','released','refunded');
CREATE TYPE public.task_status AS ENUM ('draft','open','in_progress','completed','cancelled');
CREATE TYPE public.milestone_status AS ENUM ('pending','submitted','approved','rejected');
CREATE TYPE public.governance_kind AS ENUM ('violation','warning','suspension','clearance','note');

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1), 'Principal'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_own_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============ agents ============
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Research',
  purpose TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  rate_cents INTEGER NOT NULL DEFAULT 10000,
  avg_delivery TEXT NOT NULL DEFAULT '~24h',
  status public.agent_status NOT NULL DEFAULT 'active',
  constitution_score NUMERIC(5,2) NOT NULL DEFAULT 100,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  jobs_completed INTEGER NOT NULL DEFAULT 0,
  revenue_cents BIGINT NOT NULL DEFAULT 0,
  rep_trust NUMERIC(5,2) NOT NULL DEFAULT 75,
  rep_accuracy NUMERIC(5,2) NOT NULL DEFAULT 75,
  rep_speed NUMERIC(5,2) NOT NULL DEFAULT 75,
  rep_quality NUMERIC(5,2) NOT NULL DEFAULT 75,
  rep_reliability NUMERIC(5,2) NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agents TO authenticated;
GRANT SELECT ON public.agents TO anon;
GRANT ALL ON public.agents TO service_role;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents_public_read" ON public.agents FOR SELECT USING (true);
CREATE POLICY "agents_owner_insert" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "agents_owner_update" ON public.agents FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "agents_owner_delete" ON public.agents FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER trg_agents_touch BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_agents_owner ON public.agents(owner_id);
CREATE INDEX idx_agents_category ON public.agents(category);

-- ============ tasks ============
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hirer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Research',
  total_cents BIGINT NOT NULL DEFAULT 0,
  status public.task_status NOT NULL DEFAULT 'open',
  escrow public.escrow_status NOT NULL DEFAULT 'unfunded',
  released_cents BIGINT NOT NULL DEFAULT 0,
  payment_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_party_read" ON public.tasks FOR SELECT TO authenticated USING (
  auth.uid() = hirer_id OR auth.uid() = (SELECT owner_id FROM public.agents a WHERE a.id = tasks.agent_id)
);
CREATE POLICY "tasks_hirer_insert" ON public.tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = hirer_id);
CREATE POLICY "tasks_party_update" ON public.tasks FOR UPDATE TO authenticated USING (
  auth.uid() = hirer_id OR auth.uid() = (SELECT owner_id FROM public.agents a WHERE a.id = tasks.agent_id)
);
CREATE POLICY "tasks_hirer_delete" ON public.tasks FOR DELETE TO authenticated USING (auth.uid() = hirer_id);
CREATE TRIGGER trg_tasks_touch BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_tasks_hirer ON public.tasks(hirer_id);
CREATE INDEX idx_tasks_agent ON public.tasks(agent_id);

-- ============ milestones ============
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  amount_cents BIGINT NOT NULL DEFAULT 0,
  status public.milestone_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_party_read" ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.tasks t LEFT JOIN public.agents a ON a.id = t.agent_id
    WHERE t.id = milestones.task_id AND (t.hirer_id = auth.uid() OR a.owner_id = auth.uid())
  )
);
CREATE POLICY "milestones_party_write" ON public.milestones FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = milestones.task_id AND t.hirer_id = auth.uid())
);
CREATE POLICY "milestones_party_update" ON public.milestones FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.tasks t LEFT JOIN public.agents a ON a.id = t.agent_id
    WHERE t.id = milestones.task_id AND (t.hirer_id = auth.uid() OR a.owner_id = auth.uid())
  )
);
CREATE POLICY "milestones_hirer_delete" ON public.milestones FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = milestones.task_id AND t.hirer_id = auth.uid())
);
CREATE TRIGGER trg_milestones_touch BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX idx_milestones_task ON public.milestones(task_id);

-- ============ reputation events ============
CREATE TABLE public.reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  rated_trust NUMERIC(5,2),
  rated_accuracy NUMERIC(5,2),
  rated_speed NUMERIC(5,2),
  rated_quality NUMERIC(5,2),
  rated_reliability NUMERIC(5,2),
  delta_trust NUMERIC(6,3) NOT NULL DEFAULT 0,
  delta_accuracy NUMERIC(6,3) NOT NULL DEFAULT 0,
  delta_speed NUMERIC(6,3) NOT NULL DEFAULT 0,
  delta_quality NUMERIC(6,3) NOT NULL DEFAULT 0,
  delta_reliability NUMERIC(6,3) NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reputation_events TO authenticated;
GRANT SELECT ON public.reputation_events TO anon;
GRANT ALL ON public.reputation_events TO service_role;
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reputation_public_read" ON public.reputation_events FOR SELECT USING (true);
CREATE INDEX idx_rep_agent ON public.reputation_events(agent_id, created_at DESC);

-- ============ governance events ============
CREATE TABLE public.governance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind public.governance_kind NOT NULL,
  article TEXT NOT NULL DEFAULT '',
  severity INTEGER NOT NULL DEFAULT 1,
  note TEXT NOT NULL DEFAULT '',
  score_delta NUMERIC(6,3) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.governance_events TO authenticated;
GRANT SELECT ON public.governance_events TO anon;
GRANT ALL ON public.governance_events TO service_role;
ALTER TABLE public.governance_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "governance_public_read" ON public.governance_events FOR SELECT USING (true);
CREATE POLICY "governance_owner_or_admin_insert" ON public.governance_events FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = recorded_by
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.agents a WHERE a.id = governance_events.agent_id AND a.owner_id = auth.uid())
  )
);
CREATE INDEX idx_gov_agent ON public.governance_events(agent_id, created_at DESC);

-- ============ governance -> agent score automation ============
CREATE OR REPLACE FUNCTION public.apply_governance_event()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_delta NUMERIC(6,3);
BEGIN
  v_delta := CASE NEW.kind
    WHEN 'violation'  THEN -(3 * GREATEST(NEW.severity,1))
    WHEN 'warning'    THEN -(1 * GREATEST(NEW.severity,1))
    WHEN 'suspension' THEN -(10 * GREATEST(NEW.severity,1))
    WHEN 'clearance'  THEN 2
    ELSE 0 END;

  UPDATE public.governance_events SET score_delta = v_delta WHERE id = NEW.id;

  UPDATE public.agents SET
    constitution_score = LEAST(100, GREATEST(0, constitution_score + v_delta)),
    status = CASE
      WHEN NEW.kind = 'suspension' THEN 'suspended'::public.agent_status
      WHEN LEAST(100, GREATEST(0, constitution_score + v_delta)) < 40 THEN 'revoked'::public.agent_status
      WHEN LEAST(100, GREATEST(0, constitution_score + v_delta)) < 60 THEN 'suspended'::public.agent_status
      WHEN LEAST(100, GREATEST(0, constitution_score + v_delta)) < 80 THEN 'warned'::public.agent_status
      WHEN NEW.kind = 'clearance' AND LEAST(100, GREATEST(0, constitution_score + v_delta)) >= 80 THEN 'active'::public.agent_status
      ELSE status END
  WHERE id = NEW.agent_id;

  RETURN NEW;
END; $$;
CREATE TRIGGER trg_apply_governance AFTER INSERT ON public.governance_events
FOR EACH ROW EXECUTE FUNCTION public.apply_governance_event();

-- ============ fund escrow ============
CREATE OR REPLACE FUNCTION public.fund_escrow(p_task_id UUID, p_payment_ref TEXT DEFAULT NULL)
RETURNS public.tasks LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_task public.tasks;
BEGIN
  SELECT * INTO v_task FROM public.tasks WHERE id = p_task_id;
  IF v_task.id IS NULL THEN RAISE EXCEPTION 'Task not found'; END IF;
  IF v_task.hirer_id <> auth.uid() THEN RAISE EXCEPTION 'Only the hirer can fund escrow'; END IF;
  IF v_task.escrow <> 'unfunded' THEN RAISE EXCEPTION 'Escrow is already %', v_task.escrow; END IF;

  UPDATE public.tasks
    SET escrow = 'locked', status = 'in_progress', payment_ref = COALESCE(p_payment_ref, payment_ref)
    WHERE id = p_task_id
    RETURNING * INTO v_task;
  RETURN v_task;
END; $$;
GRANT EXECUTE ON FUNCTION public.fund_escrow(UUID, TEXT) TO authenticated;

-- ============ approve milestone (release + reputation) ============
CREATE OR REPLACE FUNCTION public.approve_milestone(
  p_milestone_id UUID,
  p_trust NUMERIC DEFAULT NULL,
  p_accuracy NUMERIC DEFAULT NULL,
  p_speed NUMERIC DEFAULT NULL,
  p_quality NUMERIC DEFAULT NULL,
  p_reliability NUMERIC DEFAULT NULL,
  p_note TEXT DEFAULT ''
)
RETURNS public.milestones LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_ms public.milestones;
  v_task public.tasks;
  v_agent public.agents;
  v_w NUMERIC := 0.25;
  d_trust NUMERIC := 0; d_acc NUMERIC := 0; d_spd NUMERIC := 0; d_qua NUMERIC := 0; d_rel NUMERIC := 0;
  v_remaining INTEGER;
BEGIN
  SELECT * INTO v_ms FROM public.milestones WHERE id = p_milestone_id;
  IF v_ms.id IS NULL THEN RAISE EXCEPTION 'Milestone not found'; END IF;

  SELECT * INTO v_task FROM public.tasks WHERE id = v_ms.task_id;
  IF v_task.hirer_id <> auth.uid() THEN RAISE EXCEPTION 'Only the hirer can approve milestones'; END IF;
  IF v_task.escrow <> 'locked' THEN RAISE EXCEPTION 'Escrow must be locked to release funds'; END IF;
  IF v_ms.status = 'approved' THEN RAISE EXCEPTION 'Milestone already approved'; END IF;

  SELECT * INTO v_agent FROM public.agents WHERE id = v_task.agent_id;

  IF p_trust       IS NOT NULL THEN d_trust := (LEAST(100,GREATEST(0,p_trust))       - v_agent.rep_trust)       * v_w; END IF;
  IF p_accuracy    IS NOT NULL THEN d_acc   := (LEAST(100,GREATEST(0,p_accuracy))    - v_agent.rep_accuracy)    * v_w; END IF;
  IF p_speed       IS NOT NULL THEN d_spd   := (LEAST(100,GREATEST(0,p_speed))       - v_agent.rep_speed)       * v_w; END IF;
  IF p_quality     IS NOT NULL THEN d_qua   := (LEAST(100,GREATEST(0,p_quality))     - v_agent.rep_quality)     * v_w; END IF;
  IF p_reliability IS NOT NULL THEN d_rel   := (LEAST(100,GREATEST(0,p_reliability)) - v_agent.rep_reliability) * v_w; END IF;

  UPDATE public.milestones SET status = 'approved', approved_at = now()
    WHERE id = p_milestone_id RETURNING * INTO v_ms;

  UPDATE public.tasks SET released_cents = released_cents + v_ms.amount_cents
    WHERE id = v_task.id RETURNING * INTO v_task;

  UPDATE public.agents SET
    revenue_cents   = revenue_cents + v_ms.amount_cents,
    rep_trust       = LEAST(100, GREATEST(0, rep_trust       + d_trust)),
    rep_accuracy    = LEAST(100, GREATEST(0, rep_accuracy    + d_acc)),
    rep_speed       = LEAST(100, GREATEST(0, rep_speed       + d_spd)),
    rep_quality     = LEAST(100, GREATEST(0, rep_quality     + d_qua)),
    rep_reliability = LEAST(100, GREATEST(0, rep_reliability + d_rel))
    WHERE id = v_agent.id RETURNING * INTO v_agent;

  UPDATE public.agents SET
    rating = ROUND(((rep_trust + rep_accuracy + rep_speed + rep_quality + rep_reliability) / 5.0) / 20.0, 2)
    WHERE id = v_agent.id;

  INSERT INTO public.reputation_events (
    agent_id, task_id, milestone_id,
    rated_trust, rated_accuracy, rated_speed, rated_quality, rated_reliability,
    delta_trust, delta_accuracy, delta_speed, delta_quality, delta_reliability, note
  ) VALUES (
    v_agent.id, v_task.id, v_ms.id,
    p_trust, p_accuracy, p_speed, p_quality, p_reliability,
    d_trust, d_acc, d_spd, d_qua, d_rel,
    COALESCE(NULLIF(p_note,''), 'Milestone approved: ' || v_ms.title)
  );

  SELECT count(*) INTO v_remaining FROM public.milestones
    WHERE task_id = v_task.id AND status <> 'approved';

  IF v_remaining = 0 THEN
    UPDATE public.tasks SET status = 'completed', escrow = 'released' WHERE id = v_task.id;
    UPDATE public.agents SET jobs_completed = jobs_completed + 1 WHERE id = v_agent.id;
  END IF;

  RETURN v_ms;
END; $$;
GRANT EXECUTE ON FUNCTION public.approve_milestone(UUID, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT) TO authenticated;

-- ============ realtime ============
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.milestones REPLICA IDENTITY FULL;
ALTER TABLE public.agents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;