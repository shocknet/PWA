import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Loader from "../../common/Loader";
import Http from "../../utils/Http";
import ImagePreview from "../../common/Post/components/ImagePreview";
import VideoPreview from "../../common/Post/components/VideoPreview";
import DarkPage from "../../common/DarkPage";

import "./css/index.scoped.css";

const PublishContentPage = () => {
  const history = useHistory();
  const publishedContent = useSelector(
    //@ts-expect-error
    ({ content }) => content.publishedContent
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paragraph, setParagraph] = useState("");
  const [postType, setPostType] = useState("public");
  const [selectedContent, setSelectedContent] = useState("");

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();

      console.log("submitting");
      if (selectedContent === "" && paragraph === "") {
        setError("at least one paragraph or one media is required");
        return;
      }
      setLoading(true);
      let contentItems = [];
      if (paragraph !== "") {
        contentItems.push({
          type: "text/paragraph",
          text: paragraph
        });
      }
      const isPrivate = postType === "private";
      if (selectedContent !== "") {
        const item = publishedContent[selectedContent];
        if (item) {
          contentItems.push({
            type: item.type,
            width: item.width,
            height: item.height,
            magnetURI: item.magnetURI,
            isPreview: false,
            isPrivate: isPrivate
          });
        }
      }
      try {
        const res = await Http.post(`/api/gun/wall`, {
          tags: [],
          title: "Post",
          contentItems
        });
        if (res.status === 200) {
          console.log("post created successfully");
          setLoading(false);
          history.push("/profile");
        } else {
          setError("invalid response status");
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setError(err?.errorMessage ?? err?.message);
        setLoading(false);
      }
    },
    [
      selectedContent,
      paragraph,
      publishedContent,
      postType,
      history,
      setLoading,
      setError
    ]
  );
  const onDiscard = useCallback(async e => {
    e.preventDefault();
    setError(null);
    setParagraph("");
    setSelectedContent("");
  }, []);
  const onInputChange = useCallback(
    e => {
      const { value, name } = e.target;
      switch (name) {
        case "paragraph": {
          setParagraph(value);
          return;
        }
        case "postType": {
          console.log(value);
          setPostType(value);
          return;
        }
        default:
          return;
      }
    },
    [setParagraph]
  );

  const parseContent = ([key, item], index) => {
    if (item.type === "image/embedded") {
      return (
        <div style={{ width: 100, margin: "1em" }}>
          <ImagePreview
            id={key}
            item={item}
            index={index}
            postId={"content"}
            key={`${index}`}
            width="100px"
            selected={selectedContent}
            updateSelection={setSelectedContent}
          />
        </div>
      );
    }

    if (item.type === "video/embedded") {
      return (
        <div style={{ width: 100 }}>
          <VideoPreview
            id={key}
            item={item}
            index={index}
            postId={"content"}
            key={`${index}`}
            width="100px"
            selected={selectedContent}
            updateSelection={setSelectedContent}
          />
        </div>
      );
    }

    return null;
  };
  console.log(selectedContent);
  return (
    <DarkPage padding scrolls pageTitle="CREATE POST">
      {loading ? <Loader overlay fullScreen text="Creating post..." /> : null}

      <form
        className="publish-content-form"
        onSubmit={onSubmit}
        onReset={onDiscard}
      >
        <h2>
          Say Something<div className="line"></div>
        </h2>

        <textarea
          className="input-field"
          name={"paragraph"}
          value={paragraph}
          onChange={onInputChange}
          placeholder="What's up?"
          rows={4}
        ></textarea>

        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <strong>
            Audience:{" "}
            <i
              className={`fas ${
                postType === "public" ? "fa-globe-europe" : "fa-credit-card"
              }`}
            ></i>
          </strong>
          <select
            name="postType"
            id="postType"
            onChange={onInputChange}
            style={{
              appearance: "none",
              backgroundColor: "rgba(0,0,0,0)",
              color: "var(--main-blue)",
              marginLeft: "0.3rem"
            }}
          >
            <option
              value="public"
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                color: "var(--main-blue)"
              }}
            >
              Public
            </option>
            <option value="private">Paywall</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            overflow: "auto",
            whiteSpace: "nowrap"
          }}
        >
          {Object.entries(publishedContent).map(parseContent)}
        </div>

        {error ? <p className="error-container">{error}</p> : null}

        <div className="flex-center">
          <input type="reset" value="reset" className="shock-form-button m-1" />
          <input
            type="submit"
            value="submit"
            className="shock-form-button-confirm m-1"
          />
        </div>
      </form>
    </DarkPage>
  );
};

export default PublishContentPage;
