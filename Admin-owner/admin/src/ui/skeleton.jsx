export const MyTheatersSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-4 w-full ">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                    key={item}
                    className=" skeleton bg-base-200  rounded-lg h-28 mx-6 p-4 animate-fade-in-down"
                ></div>
            ))}
        </div>
    );
};

export const MovieDetailSkeleton = () => (
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

