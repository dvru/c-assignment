addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
* Respond with my worker text
* @param {Request} request
*/


// JavaScript Links
async function handleRequest(request) {

  //Initialize the links array
  var link0 = { name: "Blog", url: "https://medium.com/@dvru", }
  var link1 = { name: "Github", url: "https://github.com/dvru", }
  var link2 = { name: "LinkedIn", url: "https://www.linkedin.com/in/damini-varu-71607b197/", }
  var links = [link0, link1, link2]
  var links_str = links.map((link) => JSON.stringify(link))

  //Get pathname of the request url
  const url = new URL(request.url)
  var url_path = url.pathname

  //My github avatar and username
  var avatar_url = "https://miro.medium.com/fit/c/262/262/1*5UdS4qD-lL-lqD1ccL-UBg.jpeg"
  var username = "Damini Varu"

  //html option
  var html_option = { html: true }

  /** Class transforming the div#links */
  class LinksTransformer {
    /**
     * @param {Array} links - The link array
     */
    constructor(links) {
      this.links = links
    }
    /**
     * Put the array into the element's content
     * @param {E} element 
     */
    async element(element) {
      let content = this.links.map((link) => `<a href="${link.url}">${link.name}</a>`).join("\r\n")
      element.setInnerContent(content, html_option)
    }
  }

  /** Class transforming the div#profile and all its descendants */
  class ProfileTransformer {
    /**
     * @param {String} avatar_url - The url of the avatar
     * @param {String} username - My username
     */
    constructor(avatar_url, username) {
      this.avatar_url = avatar_url
      this.username = username
    }
    /**
     * Handle different tags respectively
     * @param {E} element 
     */
    async element(element) {
      if (element["tagName"] == "div")
        element.setAttribute("style", "")
      if (element["tagName"] == "img")
        element.setAttribute("src", this.avatar_url)
      if (element["tagName"] == "h1")
        element.setInnerContent(`${username}`)
    }
  }

  // Initialize social links
  var social_link0 = { url: "https://www.instagram.com/da.minimal/", svg: "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" }
  var social_link1 = { url: "https://twitter.com/VaruDamini", svg: "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" }
  var social_links = [social_link0, social_link1]

  /** Class transforming the div#social */
  class SocialTransformer {
    /**
     * @param {Array} social_links - The social link array
     */
    constructor(social_links) {
      this.social_links = social_links
    }
    /**
     * Put social links and corresponding SVG into the element's content
     * @param {E} element 
     */
    async element(element) {
      element.setAttribute("style", "");
      let content = this.social_links.map((link) => `<a href="${link.url}">\r\n<img src="${link.svg}">\r\n</a>`).join("\r\n")
      element.setInnerContent(content, html_option)
    }
  }

  /** Class transforming the div#title */
  class TitleTransformer {
    /**
     * @param {String} title - My username
     */
    constructor(title) {
      this.title = title
    }
    /**
     * Set the username as the title
     * @param {E} element 
     */
    async element(element) {
      element.setInnerContent(this.title)
    }
  }

  //Choose a color
  var color = "bg-gray-300"
  /** Class transforming the body */
  class BodyTransformer {
    /**
     * @param {String} color - The background color
     */
    constructor(color) {
      this.color = color
    }
    /**
     * Change the background color
     * @param {E} element 
     */
    async element(element) {
      element.setAttribute("class", this.color)
    }
  }

  // Return links Json if request /links
  if (url_path == "/links")
    return new Response(links_str, {
      headers: { "content-type": "application/json;charset=UTF-8" },
    })
  // Return transformed static html otherwise
  else {
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const res = await fetch("https://static-links-page.signalnerve.workers.dev", init)
    return new HTMLRewriter()
      .on("div#links", new LinksTransformer(links))
      .on("div#profile, div#profile > *", new ProfileTransformer(avatar_url, username))
      .on("div#social", new SocialTransformer(social_links))
      .on("title", new TitleTransformer(username))
      .on("body", new BodyTransformer(color))
      .transform(res)
  }

}