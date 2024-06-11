
import { NextResponse } from 'next/server'
import {db} from '../../../lib/db'
// app\api\us\route.ts

export async function POST(req:Request) {
  
  let body;
  try {
    body = await req.json()
  } catch (error) {
    console.error('Error parsing request body:', error)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  const { clerk_id, name,account_no,earning,ifsc_code,bank_name,user_name_in_bank,feed_count } = body
  
  let post;
  try {
    const course=await db.reuser.upsert({
      where: { clerk_id: clerk_id },
      update: { clerk_id, name,account_no,earning,ifsc_code,bank_name,user_name_in_bank,feed_count },
      create: { clerk_id: clerk_id,name:name },
    });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
