import { useMemo } from 'react';
import Fuse from 'fuse.js';

const defaultOptions = {
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
  threshold: 0.4,
};

const useFuse = <T>(valueList: T[], keys: string[], options: Fuse.IFuseOptions<T> = {}) => {
  const fuse = useMemo(() => new Fuse(valueList, { ...defaultOptions, ...options, keys }), [
    valueList,
  ]);

  return fuse;
};

export default useFuse;
