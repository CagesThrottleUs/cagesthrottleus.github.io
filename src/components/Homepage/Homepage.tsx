import { Content, Flex } from "@adobe/react-spectrum";
import { Heading } from "react-aria-components";
import { useEffect, useRef, useState } from "react";
import "./Homepage.css";

function Homepage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentHeading = headingRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            // Trigger animation after a small delay
            setTimeout(() => {
              if (currentHeading) {
                currentHeading.classList.add("animate");
              }
            }, 100);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Start animation slightly before fully visible
      }
    );

    if (currentHeading) {
      observer.observe(currentHeading);
    }

    return () => {
      if (currentHeading) {
        observer.unobserve(currentHeading);
      }
    };
  }, [isVisible]);

  return (
    <Flex marginTop="5vh" alignItems="center" direction="column" gap="size-200">
      <Heading level={1} ref={headingRef} className="text-intro-name">
        CagesThrottleUs
      </Heading>
      <Content>See my work below.</Content>
    </Flex>
  );
}

export default Homepage;
