import Loader from '@/components/loader/Loader';

export default function PageLoader() {
  return (
    <div className='fixed inset-0 h-full w-full bg-white'>
      <Loader />
    </div>
  );
}
