import { Heading, IllustratedMessage, View } from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { Link } from "react-aria-components";
import { useNavigate } from "react-router";
import "./NotFound.css";

function NotFoundComponent() {
  const navigate = useNavigate();
  return (
    <View height="80vh">
      <div className="not-found-container">
        <IllustratedMessage marginTop="10vh">
          <NotFound />
          <Heading level={1}>Error: 404</Heading>
          <div className="not-found-content">
            Page not found. Return to{" "}
            <Link onPress={() => void navigate("/")}>home</Link>
          </div>
        </IllustratedMessage>
      </div>
    </View>
  );
}

export default NotFoundComponent;
