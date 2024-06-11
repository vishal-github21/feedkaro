
'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import addplace from '../addplace/page';

const YourPlaces = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const clerk_id = searchParams.get('clerk_id');
  const name = searchParams.get('name');

  return (
      <div className='min-h-screen flex justify-center bg-gray-300  items-center'>
          <div className='mx-[8%] my-20 rounded-lg shadow-xl bg-white min-h-[75vh] w-full'>
            <div className='h-[32vh] bg-violet-950 shadow-md rounded-t-lg text-5xl flex items-center px-24'>
              <div className='flex-col'>
                <div>Dashboard</div>
                <div className='text-base mt-2 pl-1'>user id : {id}</div>
              </div>
              <div className='float-right w-[60%]'><Link href='addplace'><button className='px-3 py-1 rounded bg-orange-500 text-sm float-right'>Add place</button></Link></div>
            </div>
          </div>
      </div>
  );
};

export default YourPlaces;
