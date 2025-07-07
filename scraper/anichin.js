/*

     -Scrape Anichin (search & detail)-

     @base: https://anichin.co.id
     @creator: Zaboy

*/

const axios = require('axios');
const cheerio = require('cheerio');

const aniSearch = async (query) => {
try {
const res = await axios.get(`https://anichin.co.id/?s=${query}`)

    const $ = cheerio.load(res.data);
    const data = [];

    $('.listupd article.bs').each((i, el) => {
      const title = $(el).find('a').attr('title')?.trim();
      const link = $(el).find('a').attr('href');
      const status = $(el).find('.epx').text().trim();
      const image = $(el).find('img').attr('src');

      data.push({ title, link, status, image });
    });

return data;
} catch (e) {
return e.message;
}
};

const aniDetail = async (url) => {
  try {
    const res = await axios.get(url)

    const $ = cheerio.load(res.data);

    let title, title2, thumb, rating, status, studio, released, duration, type, episodes, uploader;
    const genre = [];
    
    $('.bigcontent').each((i, el) => {
      title = $(el).find('.infox h1.entry-title').text().trim();
      title2 = $(el).find('.infox span.alter').text().trim();
      status = $(el).find('.infox .info-content .spe span:contains("Status")').text().replace("Status:", "").trim();
      studio = $(el).find('.infox .info-content .spe span:contains("Studio") a').text().trim();
      released = $(el).find('.infox .info-content .spe span:contains("Released on:")').text().replace("Released on:", "").trim();
      uploader = $(el).find('.infox .info-content .spe span i.fn').text().trim();
      duration = $(el).find('.infox .info-content .spe span:contains("Duration")').text().replace("Duration:", "").trim();
      type = $(el).find('.infox .info-content .spe span:contains("Type")').text().replace("Type:", "").trim();
      episodes = $(el).find('.infox .info-content .spe span:contains("Episodes")').text().replace("Episodes:", "").trim();
      
      $(el).find('.infox .info-content .genxed a').each((i, tag) => {
        genre.push($(tag).text().trim());
        
        thumb = $(el).find('.thumbook .thumb img').attr('src');
        rating = $(el).find('.thumbook .rt .rating strong').text().replace("Rating ", "").trim();
      });
    });
    
    return {
      title: {
        entry: title,
        alt: title2,
      },
      genre: genre,
      url: url,
      thumb: thumb,
      type: type,
      status: status,
      rating: rating,
      studio: studio,
      eps: episodes,
      duration: duration,
      released: released,
      uploader: uploader
    };
    
  } catch (e) {
    return e.message;
  };
}

// How to use it like this:
(async () => {
const a = await aniSearch("Soul Land");
console.log(a);
const b = await aniDetail(a[0].link);
console.log(b);
})();
