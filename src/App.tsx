import React, { useMemo, useRef, useState } from "react";
import "./App.scss";
import { toPng } from "html-to-image";

function App() {
  const [imgUrl, setImgUrl] = useState("");
  const [bannerUrl, setbannerUrl] = useState("");
  const bannerRef = useRef<HTMLAnchorElement>(null);
  const [text, setText] = useState("");
  const [bannerStyle, setBannerStyle] = useState({
    width: 320,
    height: 400,
    background: "#faebd7",
    color: "black",
  });

  const [textPosition, setTextPosition] = useState({
    top: 0,
    left: 0,
  });

  const onStyleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerStyle({ ...bannerStyle, [e.target.name]: e.target.value });
  };

  const saveAsPng = async () => {
    if (bannerRef.current === null) {
      return
    }
    const dataUrl: any = await toPng(bannerRef.current)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'banner.png'
    link.click()
  }

  const copyHTML = () => {
    const html = bannerRef.current?.outerHTML
    if (html) {
      navigator.clipboard.writeText(html)
    }
  }

  const copyJSON = () => {
    const data = {
      imgUrl,
      bannerUrl,
      bannerStyle,
      textPosition,
      text
    }
    navigator.clipboard.writeText(JSON.stringify(data))
  }

  const onTextPositionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTextPosition({ ...textPosition, [e.target.name]: e.target.value });
  };

  const maxTextLength = useMemo(() => {
    return Math.floor(((bannerStyle.width - 40) * 5) / 21);
  }, [bannerStyle.width]);

  const onTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxTextLength) {
      setText(e.target.value);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="creator__title">Banner Creator</h1>
        <div className="creator__tools">
          <form className="creator__form">
            <div className="sizes__inputs">
              <label htmlFor="width__input">Width:</label>
              <input
                type="number"
                id="width__input"
                name="width"
                value={bannerStyle.width}
                onChange={onStyleInputChange}
              />
              <label htmlFor="height__input">Height:</label>
              <input
                type="number"
                id="height__input"
                name="height"
                value={bannerStyle.height}
                onChange={onStyleInputChange}
              />
            </div>
            <label htmlFor="img-input">Img url:</label>
            <input
              type="url"
              id="img-input"
              placeholder="Img url"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            <label htmlFor="banner-url-input">Banner url:</label>
            <input
              type="url"
              id="banner-url-input"
              placeholder="Banner url"
              value={bannerUrl}
              onChange={(e) => setbannerUrl(e.target.value)}
            />
            <div className="color__input">
              <label htmlFor="background-input">Banner Background:</label>
              <input
                type="color"
                id="background-input"
                name="background"
                value={bannerStyle.background}
                onChange={onStyleInputChange}
              />
            </div>
            <label htmlFor="text-input">Banner text:</label>
            <input
              type="text"
              id="text-input"
              placeholder="Banner text"
              value={text}
              onChange={onTextInput}
            />
            <div className="color__input">
              <label htmlFor="text-color-input">Text Color:</label>
              <input
                type="color"
                id="text-color-input"
                name="color"
                value={bannerStyle.color}
                onChange={onStyleInputChange}
              />
            </div>
            <div className="text__position">
              <h4>Text position</h4>
              <div className="text__position__inputs">
                <label htmlFor="text-top">Top</label>
                <input
                  type="number"
                  id="text-top"
                  name="top"
                  value={textPosition.top}
                  onChange={onTextPositionInputChange}
                />
                <label htmlFor="text-left">Left</label>
                <input
                  type="number"
                  id="text-left"
                  name="left"
                  value={textPosition.left}
                  onChange={onTextPositionInputChange}
                />
              </div>
            </div>
            <button type="button" onClick={saveAsPng}>Download</button>
            <button type="button" onClick={copyHTML}>CopyHTML</button>
            <button type="button" onClick={copyJSON}>Copy JSON config</button>
          </form>
          <a
            style={{ display: "block", textDecoration: "none" }}
            href={bannerUrl}
            target="_blank"
            rel="noreferrer"
            ref={bannerRef}
          >
            <div
              className="banner"
              style={{
                ...bannerStyle,
                width: bannerStyle.width + "px",
                height: bannerStyle.height + "px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {imgUrl && (
                <img
                  style={{
                    width: bannerStyle.width + "px",
                    maxHeight: bannerStyle.height + "px",
                  }}
                  src={imgUrl}
                  alt="incorrect img url"
                />
              )}
              {text && (
                <p
                  style={{
                    padding: "20px",
                    fontSize: "24px",
                    fontWeight: 700,
                    wordWrap: "break-word",
                    position: "absolute",
                    top: textPosition.top + "px",
                    left: textPosition.left + "px",
                    maxWidth: bannerStyle.width - textPosition.left + "px",
                  }}
                >
                  {text}
                </p>
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
