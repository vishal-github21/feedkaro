
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

  const { img,userId,placeId } = body
  
  let post;
  try {
    const course=await db.feeds.create({
        data: {
          img:img,
          userId:userId,
          placeId:placeId,
        },
      });
      await db.reuser.update({
        where:{id:userId},
        data: {
            feedplaces: {
                push: placeId,
              },
              earning: {
                increment: 4,
              },
        },
      });
      await db.place.update({
        where:{id:placeId},
        data: {
            balance: {
                decrement:10,
              },
        },
      });
  return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json({ error: 'Internal Server Error while creating post'}, { status: 500 })
  }

  return NextResponse.json(post)
}
