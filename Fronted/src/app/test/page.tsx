'use client';

import axios from 'axios';

export default function Page() {
  const res = axios.get('http://127.0.0.1:8000/workflow/').then((res) => {
    console.log(res.data);
  });

  return (
    <div className="relative h-64 w-64">
      <div className="before:animate-border-rotate absolute inset-0 h-full w-full before:absolute before:inset-[-2px] before:border-2 before:border-transparent before:border-t-green-500">
        <div className="flex h-full w-full items-center justify-center bg-gray-800">
          <span className="text-2xl text-white">div</span>
        </div>
      </div>
    </div>
  );
}
