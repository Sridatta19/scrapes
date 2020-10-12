import axios from "axios";
import cheerio from "cheerio";
import {
  getHTML,
  groupReducer,
  retrieveTagsByTitle,
  removeComicStripLinks,
  retrieveGroupedTagsByTagsArray,
} from "./utils";

var fs = require("fs");

export const getData = async () => {
  let data = [];
  console.log("SCRAPING HIGH AVERAGE PLAYERS");
  const html1 = await getHTML(
    `http://stats.espncricinfo.com/ci/content/records/282910.html`
  );
  let $ = cheerio.load(html1);

  const players = $(
    "#ciHomeContentlhs > div.pnl650M > div > table:nth-child(5) > tbody > tr"
  )
    .map((i, el) => ({
      playerId: $(el)
        .find("td:nth-child(1)")
        .find("a")
        .attr("href")
        .match(/[0-9]*/g)
        .filter((a) => a)[0],
      name: $(el).find("td:nth-child(1)").find("a").text(),
      country: [$(el).find("td:nth-child(1)").text()].map((a) => {
        const reg = a.match(/\([A-b]*\)/g) || a.match(/\([A-b]*\/[A-b]*\)/g);
        return reg && reg[0];
      })[0],
    }))
    .toArray();

  for (let playerCount = 0; playerCount < players.length; playerCount++) {
    console.log("INITIATING SCRAPING FOR PLAYER ", players[playerCount].name);
    const html = await getHTML(
      `http://stats.espncricinfo.com/ci/engine/player/${players[playerCount].playerId}.html?class=1;template=results;type=batting;view=cumulative`
    );
    $ = cheerio.load(html);
    const details = $(
      "#ciHomeContentlhs > div.pnl650M > table:nth-child(5) > tbody > tr"
    )
      .map((i, el) => $(el).find("td:nth-child(6)").text())
      .toArray()
      .map((average, matchNo) => ({
        playerName: players[playerCount].name,
        playerId: Number(players[playerCount].playerId),
        country: players[playerCount].country,
        height: 56,
        average: Number(average),
        matchNo: Number(matchNo) + 1,
      }));
    data.push(...details);
  }
  const dataStr = JSON.stringify(data);
  fs.writeFile("./data.json", dataStr, (err) => {
    if (err) console.error(err);
  });
  return data;
};

export const processData = () => {
  const masterData = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const masterResult = Array.from({ length: 73 }).reduce((acc, elem, index) => {
    const filteredAndSorted = masterData
      .filter((entry) => entry.matchNo === index + 1)
      .map((entry) => ({
        ...entry,
        country: entry.country.substr(1, entry.country.length - 2),
      }));
    filteredAndSorted.sort((a1, a2) => a2.average - a1.average);
    return {
      ...acc,
      [index + 1]: filteredAndSorted.slice(0, 10),
    };
  }, {});
  fs.writeFile("./result.json", JSON.stringify(masterResult), (err) => {
    if (err) console.error(err);
  });
};
