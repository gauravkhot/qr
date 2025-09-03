import "./App.css";
import QRCode from "react-qr-code";
import React, { useState, useEffect, useRef } from "react";

function App() {
  let path = window.location.href.split("?")[0];
  const inputRef = useRef(null);

  const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    console.log("Query variable %s not found", variable);
    return "";
  };

  const fallbackCopyTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  };

  const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const removeParamsAndUpdateURL = (newUrl, checkStatus) => {
    setUrl(newUrl);
    setRemoveParams(checkStatus);
    if (newUrl !== "") {
      try {
        const parsedUrl = new URL(newUrl);
        if (checkStatus) {
          parsedUrl.search = "";
        }
        setQrUrl(parsedUrl.toString());
      } catch (err) {
        setQrUrl(newUrl);
      }
    }
  };

  const handlePress = () => {
    copyTextToClipboard(path + "?u=" + url);
    setButtonText("✓ Copied!");
    setTimeout(() => setButtonText("Copy URL to clipboard for sharing"), 2000);
  };

  const u = getQueryVariable("u");
  const [url, setUrl] = useState(u);
  const [buttonText, setButtonText] = useState(
    "Copy URL to clipboard for sharing"
  );
  const [qrUrl, setQrUrl] = useState(u);

  const [removeParams, setRemoveParams] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      style={{
        height: "auto",
        margin: "200px auto",
        width: "100%",
        textAlign: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <QRCode
          size={256}
          style={{
            height: "auto",
            maxWidth: "256px",
            width: "100%",
            marginBottom: 20,
          }}
          value={qrUrl}
          viewBox={`0 0 256 256`}
        />
      </div>

      {/* Text input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <input
          type="text"
          value={url}
          onChange={(event) =>
            removeParamsAndUpdateURL(event.target.value, removeParams)
          }
          ref={inputRef}
          name="url"
          placeholder="Paste or type your URL here"
        />
      </div>

      {/* Checkbox on a new line, left-aligned */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "fit-content",
            textAlign: "left",
          }}
        >
          <input
            type="checkbox"
            checked={removeParams}
            onChange={() => removeParamsAndUpdateURL(url, !removeParams)}
          />
          <label style={{ marginLeft: "5px" }}>Remove query parameters</label>
        </div>
      </div>

      {url !== "" && (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          <p
            style={{
              width: "50%",
              margin: "auto",
              background: "aqua",
              fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
            }}
          >
            {path}?u={qrUrl}
          </p>
          <p>
            <button onClick={handlePress}>{buttonText}</button>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
