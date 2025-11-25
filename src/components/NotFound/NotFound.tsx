import {
  Content,
  Heading,
  IllustratedMessage,
  Link,
  View,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { useNavigate } from "react-router";
import "./NotFound.css";

function NotFoundComponent() {
  const navigate = useNavigate();
  return (
    <View height="80vh">
      <IllustratedMessage
        marginTop="10vh"
        UNSAFE_className="not-found-container"
      >
        <NotFound />
        <Heading level={1}>Error: 404</Heading>
        <Content UNSAFE_className="not-found-content">
          Page not found. Return to{" "}
          <Link onPress={() => void navigate("/")}>home</Link>
        </Content>
      </IllustratedMessage>
    </View>
  );
}

export default NotFoundComponent;
