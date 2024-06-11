import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {db} from '../../../lib/db'
// app\api\us\route.ts

export async function GET() {
  let currentuser;
  try {
    currentuser = await currentUser()
    if (!currentuser) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ error: 'Internal Server Error while fetching user' }, { status: 500 })
  }
  
  // let body;
  // try {
  //   // body = await req.json()
  // } catch (error) {
  //   console.error('Error parsing request body:', error)
  //   return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  // }

  // const { title, content } = body
  const clerk_id=currentuser?.id
  const name=currentuser?.firstName
  const link='Error fetching current user:'
  let post;
  try {
    const course=await db.reuser.upsert({
      where: { clerk_id: clerk_id },
      update: {},
      create: { clerk_id: currentuser?.id,name:name },
    });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
