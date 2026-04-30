import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmqrgnxlqalvlggljncd.supabase.co'
const supabaseKey = 'sb_publishable_Zh6u-HXiR14xrqOl7ADZVg_XfhEkXSF'

export const supabase = createClient(supabaseUrl, supabaseKey)