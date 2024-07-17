import "./App.css";
import QRCode from "react-qr-code";
import React, { useState } from "react";

function App() {
  let path = window.location.href.split("?")[0];

  const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    console.log("Query variable %s not found", variable);
    return "";
  };

  const fallbackCopyTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
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

  const handlePress = () => {
    copyTextToClipboard(path + "?u=" + url);
    setButtonText("✓ Copied!");
    setTimeout(() => setButtonText("Copy URL to clipboard for sharing"), 2000);
  };

  const u = getQueryVariable("u");
  console.log(u);
  const [url, setUrl] = useState(u);

  const [buttonText, setButtonText] = useState(
    "Copy URL to clipboard for sharing"
  );

  return (
    <div
      style={{
        height: "auto",
        margin: "200px auto",
        width: "100%",
        textAlign: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <QRCode
          size={256}
          style={{
            height: "auto",
            maxWidth: "256px",
            width: "100%",
            marginBottom: 20,
          }}
          value={url}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          name="url"
          placeholder="Paste or type your URL here"
        />
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
            {path}?u={url}
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
