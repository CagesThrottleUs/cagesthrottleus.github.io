import { Flex, Heading, Text } from "@adobe/react-spectrum";
import { Link } from "react-aria-components";
import { useNavigate } from "react-router";

import { APPLICATION_VERSION, SUPPORTED_APPLICATIONS } from "./constants";

import "./Header.css";

function HeaderComponent() {
  const navigate = useNavigate();
  return (
    <div className="app-header header-container no-cursor-track">
      <div className="text-header">
        <Flex
          direction="row"
          gap="size-400"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            direction="row"
            gap="size-100"
            justifyContent="start"
            // alignItems="center"
          >
            <Link href="/" className="link-header-no-effect">
              <Heading level={1} marginY="auto">
                cagesthrottleus
              </Heading>
            </Link>
            <Text marginTop="size-200">v{APPLICATION_VERSION}</Text>
          </Flex>
          <Flex
            direction="row"
            gap="size-500"
            justifyContent="end"
            alignItems="center"
          >
            {SUPPORTED_APPLICATIONS.map((application) => (
              <Heading level={2} marginY="auto" key={application.url}>
                <Link
                  onPress={() => {
                    void navigate(application.url);
                  }}
                  className="link-header"
                >
                  {application.name}
                </Link>
              </Heading>
            ))}
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

export default HeaderComponent;
