import {
  useEffect,
  Dispatch
} from 'react';

const useOutsideClick = (ref: any, handleClose: Dispatch<React.SetStateAction<boolean>>) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) =>  {
      if (ref.current && !ref.current.contains(e.target)) {
        handleClose(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, handleClose]);
}

export default useOutsideClick;