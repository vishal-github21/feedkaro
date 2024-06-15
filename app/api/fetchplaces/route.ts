import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {db} from '../../../lib/db'
// app\api\us\route.ts

export async function GET(req:Request) {
 
  
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const amountInt = 9;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
  
    try {
      const course = await db.place.findMany({
        where: {balance:{
          gt:amountInt,
        }},
      });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  
}
