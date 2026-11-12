import React from "react";
import { useMemo, useId, useState } from "react";
import CodeBlock from "@theme/CodeBlock";

export function useCustomDetectorGenerator() {
  const [name, setName] = useState("Your Custom Detector");
  const [id, setId] = useState("your-detector-id");
  const [language, setLanguage] = useState("solidity");
  const [desc, setDesc] = useState("This is a custom detector that ...");

  const [pattern, setPattern] = useState(
    'FIND Contract c WHERE c.name == "Example"',
  );
  const [message, setMessage] = useState("Found example contract $c");
  const [title, setTitle] = useState("Title of your finding involving $c");

  const generate = () => `Detector.register {
  name = "${name}",
  id = "${id}",
  language = "${language}",
  description = [[
    ${desc}
  ]],

  pattern = [[

${pattern}

  ]],
  title = "${title}",
  message = [[
    ${message}
  ]],
}
`;

  const generateDependencies = [
    name,
    desc,
    language,
    id,
    language,
    pattern,
    message,
    title,
  ];

  return {
    name,
    setName,
    id,
    setId,
    language,
    setLanguage,
    desc,
    setDesc,
    pattern,
    setPattern,
    message,
    setMessage,
    title,
    setTitle,
    generate,
    generateDependencies,
  };
}

/** @return {React.ReactComponent} **/
export function CustomDetectorGenerator() {
  const state = useCustomDetectorGenerator();

  const nameId = useId();
  const idId = useId();
  const descId = useId();
  const patternId = useId();
  const messageId = useId();
  const titleId = useId();

  const [generated, setGenerated] = useState("");
  useMemo(() => setGenerated(state.generate()), state.generateDependencies);

  return (
    <form className="container" onSubmit={(evt) => evt.preventDefault()}>
      <div className="row">
        <label className="col col--2" htmlFor={nameId}>
          Detector Title
        </label>
        <input
          className="col col--10"
          type="text"
          name={nameId}
          value={state.name}
          onChange={(e) => state.setName(e.target.value)}
        />
      </div>

      <div className="row">
        <label className="col col--2" htmlFor={idId}>
          Detector ID
        </label>
        <input
          className="col col--10"
          type="text"
          name={idId}
          value={state.id}
          onChange={(e) => state.setId(e.target.value)}
        />
      </div>

      <div className="row">
        <label className="col" htmlFor={descId}>
          Description
        </label>
        <textarea
          name={descId}
          value={state.desc}
          onChange={(e) => state.setDesc(e.target.value)}
          style={{ minWidth: "100%" }}
        />
      </div>

      <div className="row">
        <label className="col" htmlFor={patternId}>
          Pattern
        </label>
        <textarea
          name={patternId}
          value={state.pattern}
          onChange={(e) => state.setPattern(e.target.value)}
          style={{ minWidth: "100%" }}
        />
      </div>

      <div className="row">
        <label className="col" htmlFor={messageId}>
          Finding Message
        </label>
        <textarea
          name={messageId}
          value={state.message}
          onChange={(e) => state.setMessage(e.target.value)}
          style={{ minWidth: "100%" }}
        />
      </div>

      <div className="row">
        <label className="col" htmlFor={titleId}>
          Finding Title
        </label>
        <textarea
          name={titleId}
          value={state.title}
          onChange={(e) => state.setTitle(e.target.value)}
          style={{ minWidth: "100%" }}
        />
      </div>

      <CodeBlock
        language="lua"
        title="Generated Custom Detector Definition"
        showLineNumbers
      >
        {generated}
      </CodeBlock>
    </form>
  );
}
