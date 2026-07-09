import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';
export async function GET(req,{params}){try{const supabase=getSupabaseAdmin();const{data,error}=await supabase.from('payment_requests').select('*').eq('id',params.id).single();if(error)return NextResponse.json({error:error.message},{status:404});if(data.status!=='approved')return NextResponse.json({status:data.status,approved:false});return NextResponse.json({approved:true,request:data})}catch(error){return NextResponse.json({error:error.message},{status:500})}}
