"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface LoadScriptProps {
  scripts: string[];
}

export function LoadScript({ scripts }: LoadScriptProps) {
  scripts.push("/assets/js/plugins/perfect-scrollbar.min.js");
  scripts.push("/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1");
  const router = useRouter();
  let scriptRefArr: any[] = [];

  useEffect(() => {
    if (router) {
      for (let item of scripts) {
        loadScript(item);
      }
    }

    return () => {
      if (scriptRefArr.length > 0) {
        removeScript();
      }
    };
  }, [router]);

  const loadScript = (src: string) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    if (!scriptRefArr.find((item) => item.url === src)) {
      document.body.appendChild(script);
      scriptRefArr.push({ url: src, script });
    }
  };

  const removeScript = () => {
    scriptRefArr.forEach((item) => {
      if (document.body.contains(item.script)) {
        document.body.removeChild(item.script);
      }
    });
  };

  return null;
}

export function LoadScript_NavPills({ scripts }: LoadScriptProps) {
  // scripts.push("/assets/js/plugins/perfect-scrollbar.min.js");
  // scripts.push("/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1");
  const router = useRouter();
  let scriptRefArr: any[] = [];

  useEffect(() => {
    if (router) {
      for (let item of scripts) {
        loadScript(item);
      }
    }

    return () => {
      if (scriptRefArr.length > 0) {
        removeScript();
      }
    };
  }, [router]);

  const loadScript = (src: string) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    if (!scriptRefArr.find((item) => item.url === src)) {
      document.body.appendChild(script);
      scriptRefArr.push({ url: src, script });
    }
  };

  const removeScript = () => {
    scriptRefArr.forEach((item) => {
      if (document.body.contains(item.script)) {
        document.body.removeChild(item.script);
      }
    });
  };

  return null;
}

// Source: https://github.com/vercel/next.js/discussions/17919
export function LoadScript_github() {
  const scriptRoot: any = useRef(); // gets assigned to a root node
  const script = `<script src="/assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1"></script>
  <script src="/assets/js/plugins/flatpickr.min.js"></script>`;

  useEffect(() => {
    // creates a document range (grouping of nodes in the document is my understanding)
    // in this case we instantiate it as empty, on purpose
    const range = document.createRange();
    // creates a mini-document (light weight version), in our range with our script in it
    const documentFragment = range.createContextualFragment(script);
    // appends it to our script root - so it renders in the correct location
    if (scriptRoot.current !== undefined)
      scriptRoot.current.append(documentFragment);
  }, []);

  return <div ref={scriptRoot} />;
}
