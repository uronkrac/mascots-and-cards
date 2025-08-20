import React from 'react';
import MascotBubble from '@/components/tutorial/MascotBubble';

export default function AlphaBotMessage({ content }: { content: string }) {
  return (
    <div className="w-full">
      <MascotBubble pose="welcome" text={content} />
    </div>
  );
}
