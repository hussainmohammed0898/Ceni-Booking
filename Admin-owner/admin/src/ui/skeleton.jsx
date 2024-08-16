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