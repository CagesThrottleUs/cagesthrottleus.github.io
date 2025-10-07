import { Flex, Heading, Link, View, Text } from "@adobe/react-spectrum";
import "./Header.css";
import { APPLICATION_VERSION, SUPPORTED_APPLICATIONS } from "./constants";
import { useNavigate } from "react-router";

function HeaderComponent() {
  const navigate = useNavigate();
  return (
    <View
      UNSAFE_className="app-header"
      backgroundColor="gray-50"
      colorVersion={6}
      padding="size-200"
      borderBottomWidth="thin"
    >
      <Flex
        UNSAFE_className="text-header"
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
          <Link href="/" UNSAFE_className="link-header-no-effect">
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
            <Heading level={2} marginY="auto">
              <Link
                onPress={() => {
                  void navigate(application.url);
                }}
                UNSAFE_className="link-header"
              >
                {application.name}
              </Link>
            </Heading>
          ))}
        </Flex>
      </Flex>
    </View>
  );
}

export default HeaderComponent;
