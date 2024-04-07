import { useEffect, useState } from "react";
import axios from "axios";
import "./ClassifyNews.css";

const ClassifyNews = () => {
  const [news, setNews] = useState("abceffg");

  const classifyNews = async () => {
    axios
      .post("http://127.0.0.1:5000/classify-news", {
        news: news,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  useEffect(() => {
    classifyNews();
  }, []);

  return (
    <div>
      <input
        value={news}
        onChange={(e) => {
          setNews(e.target.value);
        }}
      />
      <button type="submit" onClick={classifyNews}>
        Submit
      </button>
    </div>
  );
};

export default ClassifyNews;
