import cheerio from "cheerio";
import { getHTML } from "./utils";

export const getCount = async () => {
  let score = 400;
  for (let year = 2019; year >= 2008; year--) {
    const html = await getHTML(
      `https://www.iplt20.com/stats/${year}/most-runs`
    );
    const $ = cheerio.load(html);
    const FOUR_LENGTH = $(".js-row")
      .find(".top-players__r")
      .map((index, el) =>
        $(el)
          .text()
          .trim()
      )
      .toArray()
      .map(a => Number(a))
      .filter(a => a > score)
      .reduce((acc, elem) => acc + elem, 0);
    console.log(
      `The bastman who scored more than ${score} have hit ${FOUR_LENGTH} runs combined in the year ${year}`
    );
  }

  return "followerCount";
};
