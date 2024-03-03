export const calcIntervals = (
  values: number[] | undefined,
  intervals: [number, number][] | undefined
) => {
  const initial = intervals?.reduce(
    (acc, interval) => ({ ...acc, [`${interval?.[0]}-${interval?.[1]}`]: 0 }),
    {}
  );
  return values
    ?.map((value) => value)
    .reduce((acc, value) => {
      const interval = intervals?.find(
        (interval) => value >= interval[0] && value < interval[1]
      );
      if (!interval) return acc;
      const key = `${interval?.[0]}-${interval?.[1]}`;
      return { ...acc, [key]: (acc[key] || 0) + 1 };
    }, initial as Record<string, number>);
};
