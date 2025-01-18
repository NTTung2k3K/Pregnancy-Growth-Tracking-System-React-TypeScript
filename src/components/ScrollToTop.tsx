import { useEffect } from "react";

const ScrollToTop = ({ router }: { router: any }) => {
  useEffect(() => {
    const unsubscribe = router.subscribe(() => {
      window.scrollTo(0, 0);
    });

    return () => unsubscribe(); // Clean up on unmount
  }, [router]);

  return null;
};

export default ScrollToTop;
