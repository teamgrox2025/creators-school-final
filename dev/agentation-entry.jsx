import React from "react";
import { createRoot } from "react-dom/client";
import { Agentation } from "agentation";

const localHosts = new Set(["localhost", "127.0.0.1"]);
const isLocalPreview = window.location.protocol === "file:"
  || localHosts.has(window.location.hostname);

if (isLocalPreview && !document.querySelector("[data-creators-school-agentation-host]")) {
  const toolbarRoot = document.createElement("div");
  toolbarRoot.dataset.creatorsSchoolAgentationHost = "";
  document.body.append(toolbarRoot);

  createRoot(toolbarRoot).render(
    <Agentation endpoint="http://127.0.0.1:4747" />,
  );
}
