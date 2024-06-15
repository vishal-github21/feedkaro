import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {db} from '../../../lib/db'
// app\api\us\route.ts

export async function GET() {
 
  
  // let body;
  // try {
  //   // body = await req.json()
  // } catch (error) {
  //   console.error('Error parsing request body:', error)
  //   return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  // }

  // const { title, content } = body
 
  let post;
  try {
    const course=await db.place.findMany({
       where: { balance:{
        gt: 9
      } },
    });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
