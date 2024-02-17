import { useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

import { cn } from '@/lib/utils';

interface BubbleProps {
  message: string;
  createdAt?: string;
}
export function RightBubble({ message, createdAt }: BubbleProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const showReadMore = message.length > 211;
  return (
    <div>
      <div className='flex justify-end'>
        <div
          className='flex justify-center rounded-lg bg-gray-500 px-[17px] pb-[12px] pt-[10px] text-sm text-white'
          style={{
            maxWidth: 'fit-content',
          }}
        >
          <div className='flex flex-col'>
            <span
              className={cn([
                'break-all text-justify',
                !isExpanded && showReadMore ? 'line-clamp-6' : '',
              ])}
            >
              {showReadMore && !isExpanded
                ? message.slice(0, 211) + '...'
                : message}
            </span>
            {showReadMore && !isExpanded && (
              <span
                className='cursor-pointer underline'
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </span>
            )}
          </div>
        </div>
      </div>
      {createdAt ? (
        <div className='flex items-center justify-end space-x-1.5'>
          <span className='text-end text-xs leading-[24px] text-[#797979]'>
            <ReactTimeAgo date={new Date(createdAt)} locale='en-US' />
          </span>
        </div>
      ) : null}
    </div>
  );
}

export const LeftBubble: React.FC<BubbleProps> = ({ message, createdAt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showReadMore = message.length > 211;

  return (
    <div>
      <div className='flex justify-start'>
        <div
          className='bg-graydark flex justify-center rounded-lg px-[17px] pb-[12px] pt-[10px] text-sm text-white'
          style={{
            maxWidth: 'fit-content',
          }}
        >
          <div className='flex flex-col'>
            <span
              className={cn([
                'break-all text-justify',
                !isExpanded && showReadMore ? 'line-clamp-6' : '',
              ])}
            >
              {showReadMore && !isExpanded
                ? message.slice(0, 211) + '...'
                : message}
            </span>
            {showReadMore && !isExpanded && (
              <span
                className='cursor-pointer underline'
                onClick={() => setIsExpanded(true)}
              >
                Read more
              </span>
            )}
          </div>
        </div>
      </div>
      {createdAt ? (
        <div className='flex items-center space-x-1.5'>
          <span className='text-start text-xs leading-[24px] text-[#797979]'>
            <ReactTimeAgo date={new Date(createdAt)} locale='en-US' />
          </span>
        </div>
      ) : null}
    </div>
  );
};
