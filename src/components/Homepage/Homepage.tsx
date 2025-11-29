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
          I like to code and keep learning. This webpage is meant to be a little
          trollish and fun. Do not take it seriously as a professional
          portfolio.
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
