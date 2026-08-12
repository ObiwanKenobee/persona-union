-- Internal trigger functions: not callable via the API at all
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_governance_event() FROM PUBLIC, anon, authenticated;

-- Role check: signed-in only
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Escrow actions: signed-in only (both verify auth.uid() internally)
REVOKE ALL ON FUNCTION public.fund_escrow(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.fund_escrow(UUID, TEXT) TO authenticated;

REVOKE ALL ON FUNCTION public.approve_milestone(UUID, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_milestone(UUID, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT) TO authenticated;