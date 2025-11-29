import { Flex } from "@adobe/react-spectrum";

import ResumeContent from "./ResumeContent/ResumeContent";
import { resumeData } from "./ResumeContent/resumeData.tsx";
import "./Homepage.css";

function Homepage() {
  return (
    <Flex marginTop="5vh" alignItems="center" direction="column" gap="size-100">
      <div className="homepage-intro">
        <div className="ascii-art-name">
          <pre className="ascii-text">
            {`
  ██████╗ █████╗  ██████╗ ███████╗███████╗████████╗██╗  ██╗██████╗  ██████╗ ████████╗████████╗██╗     ███████╗██╗   ██╗███████╗  
 ██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔════╝╚══██╔══╝██║  ██║██╔══██╗██╔═══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝██║   ██║██╔════╝  
 ██║     ███████║██║  ███╗█████╗  ███████╗   ██║   ███████║██████╔╝██║   ██║   ██║      ██║   ██║     █████╗  ██║   ██║███████╗  
 ██║     ██╔══██║██║   ██║██╔══╝  ╚════██║   ██║   ██╔══██║██╔══██╗██║   ██║   ██║      ██║   ██║     ██╔══╝  ██║   ██║╚════██║  
 ╚██████╗██║  ██║╚██████╔╝███████╗███████║   ██║   ██║  ██║██║  ██║╚██████╔╝   ██║      ██║   ███████╗███████╗╚██████╔╝███████║  
  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚══════╝╚══════╝ ╚═════╝ ╚══════╝  

                                                         [ CLASSIFIED ]                                                                   


`}
          </pre>
        </div>
        <div className="intro-content">
          I like to code and keep learning. I graduated from BITS Pilani in 2023
          with a B.E. in Computer Science with a CGPA of 8.05
        </div>
      </div>

      {/* Resume Content with configurable options */}
      <ResumeContent
        experiences={resumeData}
        hoverScale={1.1}
        animationDuration={150}
      />
    </Flex>
  );
}

export default Homepage;
