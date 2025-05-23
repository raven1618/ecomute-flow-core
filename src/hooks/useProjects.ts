
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function useProjects() {
  const [list, setList] = useState([]);
  
  useEffect(() => {
    supabase.from('projects').select('id,name').then(({data}) => setList(data || []));
  }, []);
  
  return list;
}
