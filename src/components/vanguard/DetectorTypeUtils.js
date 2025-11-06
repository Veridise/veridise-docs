import React from "react";
import {
  useDoc,
  useDocsSidebar,
  useAllDocsData,
  useActivePlugin,
} from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import pluralize from "pluralize";
import DocCard from "@theme/DocCard";

// On a detector documentation page, displays the "detector types" associated
// with this detector.
export function DisplayDetectorTypes(typeNameMap, rootUrl) {
  const { metadata } = useDoc();
  const detectorTypes = metadata.frontMatter.detectorTypes;
  if (!detectorTypes || detectorTypes.length === 0) return null;

  return (
    <h4>
      Detector {pluralize("Type", detectorTypes.length)}:
      <span className="doc-tags">
        {detectorTypes.map((type) => {
          const typeName = typeNameMap[type];
          if (typeName !== undefined) {
            return (
              <Link
                key={type}
                className="doc-tag"
                to={`${rootUrl}#${type}`} // auto-generated tag page
              >
                {typeName}
              </Link>
            );
          }
        })}
      </span>
    </h4>
  );
}

const zkVanguardTypeNameMap = {
  "compute-constrain": "Compute and Constrain",
  "compute-only": "Compute Only",
  "constrain-only": "Constrain Only",
};

// Displays the badges for ZK Vanguard detector types.
export function DisplayZKVanguardDetectorTypes({ rootUrl = "." }) {
  return DisplayDetectorTypes(zkVanguardTypeNameMap, rootUrl);
}

// Displays doc information for the documents matching the given doc IDs.
export function DisplayDetectorCards({ docIds }) {
  const allDocsData = useAllDocsData();
  const activePlugin = useActivePlugin(); // returns { pluginId, version }
  const pluginId = activePlugin?.pluginId;
  const version = allDocsData[pluginId].versions[0];

  console.log(docIds, typeof docIds);

  const sidebar = useDocsSidebar();

  console.log(sidebar.items);

  // Sidebar items are nested, so we need to flatten the lists of items into
  // a single list.
  function allItemsFrom(item) {
    var res = [item];
    if (item.items !== undefined) {
      for (const i of item.items) {
        const subres = allItemsFrom(i);
        res = res.concat(subres);
      }
    }
    return res;
  }

  // Combines all top level items
  const allItems = sidebar.items
    .map(allItemsFrom)
    .reduce((p, c) => p.concat(c));

  const itemsToShow = allItems.filter((i) => docIds.includes(i.docId));

  // Using individual doc cards instead of the DocCardList to present them in
  // a list rather than in multiple columns.
  return (
    <div>
      {itemsToShow.map((i) => {
        return <DocCard item={i} />;
      })}
    </div>
  );
}
