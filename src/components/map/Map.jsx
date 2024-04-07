import "./Map.css";

function Map(props) {
  const { displayMap } = props;
  return (
    <div
      className="map-container"
      dangerouslySetInnerHTML={{ __html: displayMap }}
    />
  );
}

export default Map;
