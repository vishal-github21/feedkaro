
import { NextResponse } from 'next/server'
import {db} from '../../../lib/db'


export async function POST(req:Request) {
  
  let body;
  try {
    body = await req.json()
  } catch (error) {
    console.error('Error parsing request body:', error)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  const { name,link,img,UserId } = body
  
  let post;
  try {
    const course=await db.place.create({
        data: {
          name:name,
          link:link,
          img:img,
          user: { connect: { id: UserId } },
        },
      });
      await db.reuser.update({
        where:{id:UserId},
        data: {
          places: { push: course.id },
        },
      });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
