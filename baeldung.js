import axios from "axios";
import cheerio from "cheerio";
import {
  getHTML,
  groupReducer,
  retrieveTagsByTitle,
  removeComicStripLinks,
  retrieveGroupedTagsByTagsArray
} from "./utils";

var fs = require("fs");

export const getData = async () => {
  let data = [];
  for (let week = 294; week >= 280; week--) {
    console.log("INITIATING SCRAPING FOR WEEK ", week);
    const html = await getHTML(`https://www.baeldung.com/java-weekly-${week}`);
    const $ = cheerio.load(html);
    const details = $("a[rel*='noopener']")
      .map((i, el) => ({
        title: $(el)
          .text()
          .trim(),
        link: $(el)
          .attr("href")
          .trim()
      }))
      .toArray()
      .filter(removeComicStripLinks)
      .map(({ title, link }) => ({
        week,
        link,
        title: title.substring(3),
        tags: retrieveTagsByTitle(title)
      }));
    // const groupedTags = retrieveGroupedTagsByTagsArray(
    //   details.map(d => d.tags)
    // );
    data.push(...details);
  }

  const dataStr = JSON.stringify(data);

  fs.writeFile("./data.json", dataStr, err => {
    if (err) console.error(err);
  });

  return data;
};
