import axios from "axios";
import { keyWords, commonWords } from "./constants";

export const getHTML = async url => {
  const { data: html } = await axios.get(url);
  return html;
};

export const retrieveTagsByTitle = title =>
  title
    .split(" ")
    .map(split => split.replace(/[^a-z]/gi, ""))
    .map(split => split.toLowerCase())
    .filter(
      split => split !== "" && keyWords.some(key => split.indexOf(key) !== -1)
    )
    .map(tag => keyWords.find(key => tag.indexOf(key) !== -1))
    .filter((value, index, self) => self.indexOf(value) === index);

export const groupReducer = (group, tag) => {
  if (group[tag]) {
    group[tag] = group[tag] + 1;
  } else {
    group[tag] = 1;
  }
  return group;
};

export const retrieveGroupedTagsByTagsArray = tags => {
  const allTags = [];
  tags.forEach(tagEntries => allTags.push(...tagEntries));
  const groupedTags = allTags.reduce(groupReducer, {});
  Object.keys(groupedTags).forEach(key => {
    if (groupedTags[key] === 1) delete groupedTags[key];
  });
  return groupedTags;
};

export const removeComicStripLinks = entry =>
  entry.link.indexOf("dilbert.com") === -1;
