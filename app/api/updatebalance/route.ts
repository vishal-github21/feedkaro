
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

  const { placeid,amount } = body
  const amountInt = parseInt(amount, 10);
  if (isNaN(amountInt)) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  let post;
  try {
    const course=await db.place.update({
      where: { id: placeid },
      data:{
        balance:{
            increment:amountInt
        }
      }
    });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
