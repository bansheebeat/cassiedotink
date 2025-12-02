const styles=`
p {
  margin: 0 0 1rem 0;
}

#mastodon-stats {

}

#mastodon-title {
  font-weight: bold;
}

#mastodon-comments-list {
  margin: 0 auto;
  padding: 0;
}

#mastodon-comments-list ul {
  padding-left: var(--comment-indent);
}

#mastodon-comments-list li {
  list-style: none;
}

.mastodon-comment {
  padding: 15px;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.mastodon-comment p {
  margin-bottom: 0px;
}

.mastodon-comment .author {
  padding-top:0;
  display:flex;
}

.mastodon-comment .author a {
  text-decoration: none;
}

.mastodon-comment .author .avatar img {
  margin-right:1rem;
  min-width:60px;
}

.mastodon-comment .author .details {
  display: flex;
  flex-direction: column;
  line-height: 1.2em;
}

.mastodon-comment .author .details .name {
  font-weight: bold;
}

.mastodon-comment .author .details .user {

}

.mastodon-comment .author .date {
  margin-left: auto;
  font-size: small;
}

.mastodon-comment .content {
  margin: 15px 0;
  line-height: 1.5em;
}

.mastodon-comment .author .details a,
.mastodon-comment .content p {
  margin-bottom: 10px;
}

.mastodon-comment .attachments {
  margin: 0px 10px;
}

.mastodon-comment .attachments > * {
  margin: 0px 10px;
}

.mastodon-comment .attachments img {
  max-width: 100%;
}

.mastodon-comment .status > div, #mastodon-stats > div {
  display: inline-block;
  margin-right: 15px;
}

.mastodon-comment .status a, #mastodon-stats a {
  text-decoration: none;
}

.mastodon-comment .status .replies.active a, #mastodon-stats .replies.active a {
}

.mastodon-comment .status .reblogs.active a, #mastodon-stats .reblogs.active a {
}

.mastodon-comment .status .favourites.active a, #mastodon-stats .favourites.active a {
}
`;class MastodonComments extends HTMLElement{constructor(){super(),this.host=this.getAttribute("host"),this.user=this.getAttribute("user"),this.tootId=this.getAttribute("tootId"),this.commentsLoaded=!1;const e=document.createElement("style");e.innerHTML=styles,document.head.appendChild(e)}connectedCallback(){this.innerHTML=`
      <div id="mastodon-stats"></div>
      <div id="mastodon-title">Comments</div>

      <noscript>
        <div id="error">
          Enable JavaScript to view the comments from Mastodon. Alternatively, just go <a class="link" href="https://${this.host}/@${this.user}/${this.tootId}" rel="ugc">here</a>.
        </div>
      </noscript>

      <p>You can use your Fediverse account to reply to this <a class="link"
          href="https://${this.host}/@${this.user}/${this.tootId}" rel="ugc">post</a>.
      </p>
      <ul id="mastodon-comments-list"></ul>
    `;const e=document.getElementById("mastodon-comments-list"),t=this.getAttribute("style");t&&e.setAttribute("style",t),this.respondToVisibility(e,this.loadComments.bind(this))}escapeHtml(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}toot_active(e,t){var n=e[t+"_count"];return n>0?"active":""}toot_count(e,t){var n=e[t+"_count"];return n>0?n:""}toot_stats(e){return`
      <div class="replies ${this.toot_active(e,"replies")}">
        <a href="${e.url}" rel="ugc nofollow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg>
        ${this.toot_count(e,"replies")}</a>
      </div>
      <div class="reblogs ${this.toot_active(e,"reblogs")}">
        <a href="${e.url}/reblogs" rel="nofollow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg>
        ${this.toot_count(e,"reblogs")}</a>
      </div>
      <div class="favourites ${this.toot_active(e,"favourites")}">
        <a href="${e.url}/favourites" rel="nofollow"><i class="fa fa-star fa-fw"></i>${this.toot_count(e,"favourites")}</a>
      </div>
    `}user_account(e){var n,t=`@${e.acct}`;return e.acct.indexOf("@")===-1&&(n=new URL(e.url),t+=`@${n.hostname}`),t}render_toots(e,t){var n=e.filter(e=>e.in_reply_to_id===t).sort((e,t)=>e.created_at.localeCompare(t.created_at));n.forEach(t=>this.render_toot(e,t))}render_toot(e,t){t.account.display_name=this.escapeHtml(t.account.display_name),t.account.emojis.forEach(e=>{t.account.display_name=t.account.display_name.replace(`:${e.shortcode}:`,`<img src="${this.escapeHtml(e.static_url)}" alt="Emoji ${e.shortcode}" height="20" width="20" />`)});const o=e=>new Date(e).toLocaleString("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1,formatMatcher:"basic"}).replace(",","").replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$1-$2"),s=`
      <article class="mastodon-comment">
        <div class="author">
          <div class="avatar">
            <img src="${this.escapeHtml(t.account.avatar_static)}" height=60 width=60 alt="">
          </div>
          <div class="details">
            <a class="name" href="${t.account.url}" rel="nofollow">${t.account.display_name}</a>
            <a class="user" href="${t.account.url}" rel="nofollow">${this.user_account(t.account)}</a>
          </div>
          <a class="date" href="${t.url}" rel="nofollow">
              <time datetime="${t.created_at}">
                ${o(t.created_at)}${t.edited_at?"*":""}
              </time>
          </a>
        </div>
        <div class="content">${t.content}</div>
        <div class="attachments">
          ${t.media_attachments.map(e=>e.type==="image"?`<a href="${e.url}" rel="ugc nofollow"><img src="${e.preview_url}" alt="${this.escapeHtml(e.description)}" loading="lazy" /></a>`:e.type==="video"?`<video controls preload="none"><source src="${e.url}" type="${e.mime_type}"></video>`:e.type==="gifv"?`<video autoplay loop muted playsinline><source src="${e.url}" type="${e.mime_type}"></video>`:e.type==="audio"?`<audio controls><source src="${e.url}" type="${e.mime_type}"></audio>`:`<a href="${e.url}" rel="ugc nofollow">${e.type}</a>`).join("")}
        </div>
        <div class="status">
          ${this.toot_stats(t)}
        </div>
      </article>
    `;var n=document.createElement("li");if(n.setAttribute("id",t.id),n.innerHTML=typeof DOMPurify!="undefined"?DOMPurify.sanitize(s.trim()):s.trim(),t.in_reply_to_id===this.tootId)document.getElementById("mastodon-comments-list").appendChild(n);else{const s=e.find(e=>e.id===t.in_reply_to_id);if(s){const e=document.createElement("ul");document.getElementById(t.in_reply_to_id).appendChild(e).appendChild(n)}}this.render_toots(e,t.id)}loadComments(){if(this.commentsLoaded)return;document.getElementById("mastodon-comments-list").innerHTML="Loading comments from the Fediverse...";let e=this;fetch("https://"+this.host+"/api/v1/statuses/"+this.tootId).then(e=>e.json()).then(e=>{document.getElementById("mastodon-stats").innerHTML=this.toot_stats(e)}),fetch("https://"+this.host+"/api/v1/statuses/"+this.tootId+"/context").then(e=>e.json()).then(t=>{t.descendants&&Array.isArray(t.descendants)&&t.descendants.length>0?(document.getElementById("mastodon-comments-list").innerHTML="",e.render_toots(t.descendants,e.tootId,0)):document.getElementById("mastodon-comments-list").innerHTML="<p>No comments found</p>",e.commentsLoaded=!0})}respondToVisibility(e,t){var n={root:null},s=new IntersectionObserver((e)=>{e.forEach(e=>{e.intersectionRatio>0&&t()})},n);s.observe(e)}}customElements.define("mastodon-comments",MastodonComments)