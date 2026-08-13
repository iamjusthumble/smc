import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../assets/wrap-image.css";

const wrapImage = (img: JSX.Element) => {
  return <Zoom classDialog="custom-zoom">{img}</Zoom>;
};

export default wrapImage;
