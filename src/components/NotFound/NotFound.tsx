import {
  Content,
  Heading,
  IllustratedMessage,
  Link,
  View,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { useNavigate } from "react-router";

function NotFoundComponent() {
  const navigate = useNavigate();
  return (
    <View height="80vh">
      <IllustratedMessage marginTop="10vh">
        <NotFound />
        <Heading level={1}>Error: 404</Heading>
        <Content>
          Page not found. Return to{" "}
          <Link onPress={() => void navigate("/")}>home</Link>
        </Content>
      </IllustratedMessage>
    </View>
  );
}

export default NotFoundComponent;
