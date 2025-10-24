import { supabase } from './supabase/client';

export async function linkFrameworksToOrg(
  orgId: string,
  frameworkIds: string[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('org_frameworks')
    .delete()
    .eq('org_id', orgId);

  if (deleteError) throw deleteError;

  if (frameworkIds.length > 0) {
    const rows = frameworkIds.map((framework_id) => ({
      org_id: orgId,
      framework_id,
    }));

    const { error: insertError } = await supabase
      .from('org_frameworks')
      .insert(rows);

    if (insertError) throw insertError;
  }
}
