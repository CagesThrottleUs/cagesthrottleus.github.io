import { Footer, View } from "@adobe/react-spectrum";
import "./Footer.css";

function FooterComponent() {
  return (
    <View
      UNSAFE_className="app-footer"
      borderWidth="thin"
      borderBottomWidth="none"
      borderXWidth="none"
      width="100%"
      backgroundColor="gray-50"
      colorVersion={6}
    >
      <Footer UNSAFE_className="text-footer">
        Built with ❤️ by CagesThrottleUs. &copy; 2025. &nbsp;
      </Footer>
    </View>
  );
}

export default FooterComponent;
