const MovieSkeleton = () => (
    <div className="card w-72 bg-base-200 flex-shrink-0">
      <figure className="skeleton w-full h-72"></figure>
      <div className="card-body p-4 flex flex-col justify-between">
        <div className="skeleton w-3/4 h-6 mb-2"></div>
        <div className="flex justify-between">
          <div className="skeleton w-1/4 h-6"></div>
          <div className="skeleton w-1/4 h-6"></div>
        </div>
      </div>
    </div>
  );
  const BookingSkeleton = () => (
    <div className="skeleton w-full h-56 bg-base-200"></div>
  );

  const MovieDetailSkeleton = () => (
    <div className="grid grid-cols-12 gap-6 p-6 rounded-lg ">
      <div className="col-span-12 lg:col-span-6 lg:text-left">
        <div className="skeleton bg-base-200 h-96 max-w-full lg:max-w-sm mx-auto rounded-lg"></div>
      </div>
      <div className="col-span-12 lg:col-span-6 flex flex-col justify-between lg:justify-start lg:text-left">
        <div className="pt-6">
          <div className="skeleton bg-base-200 h-8 w-3/4 mb-4"></div>
          <div className="skeleton bg-base-200 h-6 w-28 mb-4"></div>
          <div className="skeleton bg-base-200 h-6 w-full mb-4"></div>
          <div className="skeleton bg-base-200 h-6 w-full mb-4"></div>
          <div className="skeleton bg-base-200 h-6 w-full mb-4"></div>
          <div className="skeleton bg-base-200 h-6 w-full mb-4"></div>
          <div className="skeleton bg-base-200 h-10 w-full mb-4 "></div>
        </div>
      </div>
    </div>
  );

  export { BookingSkeleton, MovieSkeleton, MovieDetailSkeleton };