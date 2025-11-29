import { Content, Flex } from "@adobe/react-spectrum";
import { Heading } from "react-aria-components";
import { useEffect, useRef, useState } from "react";
import ResumeContent from "./ResumeContent/ResumeContent";
import { resumeData } from "./ResumeContent/resumeData.tsx";
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
    <Flex marginTop="5vh" alignItems="center" direction="column" gap="size-100">
      <div className="homepage-intro">
        <Heading level={1} ref={headingRef} className="text-intro-name">
          CagesThrottleUs
        </Heading>
        <Content className="intro-content">
          I like to code and keep learning. I graduated from BITS Pilani in 2023
          with a B.E. in Computer Science with a CGPA of 8.05
        </Content>
      </div>

      {/* Resume Content with configurable options */}
      <ResumeContent
        experiences={resumeData}
        hoverScale={1.1} // Scale to 125% on hover
        animationDuration={150} // 300ms animation
      />
    </Flex>
  );
}

export default Homepage;
