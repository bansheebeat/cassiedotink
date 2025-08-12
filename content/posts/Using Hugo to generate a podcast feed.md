---
title: Using Hugo to generate a podcast feed
date: 2025-08-12
url: hugo-podcast
tags:
  - podcasting
  - tech
draft: false
---
I've been podcasting on and off for over ten years now — all shows that I've since abandoned[^1], either intentionally or due to time — but I've kept websites for them up and running for archival purposes. Originally, the sites were powered by WordPress and podcasting plugins (PowerPress and then Podlove). I didn't want to continue paying to host the sites nor maintain a WordPress install[^2]. I could, of course, use one of the many podcast hosting services out there — but just like I believe in owning your own space on the internet, I believe you should own and control your podcast feed (and not have to pay a company $15/mo in perpetuity). I use [Hugo](https://gohugo.io/) (which I then deploy with Cloudflare Pages) to generate the sites and feeds; I chose  because I understand how to use it. I'm sure you could make this work with other static site generators. There's [an 11ty plugin](https://eleventy-plugin-podcaster.com/) out there, for example, which is far more advanced than what I've set up. But I built this myself. It works. It does not require me to endlessly fiddle or update (unless I want to). 

I am not going to cover hosting your audio files in this post. I offload mine to a storage zone on [Bunny](https://bunny.net/); my podcasts are low traffic, so that costs me $12/yr. You could probably get away with using archive.org for free instead, as long as you can get a direct link to your mp3. I'm also not going to cover creating a theme for your podcast in this post. I made my own for both of my sites, but you can easily use a premade one.

A podcast is, at its core, a collection of audio files served by an RSS feed. That feed provides information to podcast apps, like where to download an episode and how long it is. An SSG like Hugo, which is designed primarily for bloggers, works great for this because it already has an [an embedded RSS template](https://gohugo.io/templates/rss/#custom-templates) that it uses to syndicate your content. The only difference is that we're going to set up the RSS feed to serve both text (your show notes) *and* audio — as well as all the information that podcast apps need to surface your show. We're going to work from Hugo's RSS base template but inject [basic podcast tags](https://help.apple.com/itc/podcasts_connect/#/itcb54353390) as well as some additional ones for newer features like chapter support.

## Creating a custom feed template
First, find your Hugo config file. I use `toml` format, so mine is hugo.toml at the root of my site directory. I believe Hugo uses `toml` by default, but if you use `yaml`, you'll have to adapt the syntax (but if you use `yaml`, you probably know how to do that).
```TOML 
[outputs]
home = ["HTML", "RSS", "podcast" ] # Sets up podcast feed

[outputFormats]
    [outputFormats.podcast]
        MediaType = "application/rss+xml"
        BaseName = "feed" # Your feed will be located at example.org/feed.xml.
```
This tells that we're making a new RSS feed template and that it should use it to serve our content. Now, create a new file at `layouts/index.podcast.xml`.

In `layouts/index.podcast.xml`, first copy and paste the default Hugo RSS feed template to use as a base.
```go-html-template
{{- $authorEmail := "" }}
{{- with site.Params.author }}
  {{- if reflect.IsMap . }}
    {{- with .email }}
      {{- $authorEmail = . }}
    {{- end }}
  {{- end }}
{{- end }}

{{- $authorName := "" }}
{{- with site.Params.author }}
  {{- if reflect.IsMap . }}
    {{- with .name }}
      {{- $authorName = . }}
    {{- end }}
  {{- else }}
    {{- $authorName  = . }}
  {{- end }}
{{- end }}

{{- $pctx := . }}
{{- if .IsHome }}{{ $pctx = .Site }}{{ end }}
{{- $pages := slice }}
{{- if or $.IsHome $.IsSection }}
{{- $pages = $pctx.RegularPages }}
{{- else }}
{{- $pages = $pctx.Pages }}
{{- end }}
{{- $limit := .Site.Config.Services.RSS.Limit }}
{{- if ge $limit 1 }}
{{- $pages = $pages | first $limit }}
{{- end }}
{{- printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" | safeHTML }}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ if eq .Title .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{ . }} on {{ end }}{{ .Site.Title }}{{ end }}</title>
    <link>{{ .Permalink }}</link>
    <description>Recent content {{ if ne .Title .Site.Title }}{{ with .Title }}in {{ . }} {{ end }}{{ end }}on {{ .Site.Title }}</description>
    <generator>Hugo</generator>
    <language>{{ site.Language.LanguageCode }}</language>{{ with $authorEmail }}
    <managingEditor>{{.}}{{ with $authorName }} ({{ . }}){{ end }}</managingEditor>{{ end }}{{ with $authorEmail }}
    <webMaster>{{ . }}{{ with $authorName }} ({{ . }}){{ end }}</webMaster>{{ end }}{{ with .Site.Copyright }}
    <copyright>{{ . }}</copyright>{{ end }}{{ if not .Date.IsZero }}
    <lastBuildDate>{{ (index $pages.ByLastmod.Reverse 0).Lastmod.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</lastBuildDate>{{ end }}
    {{- with .OutputFormats.Get "RSS" }}
    {{ printf "<atom:link href=%q rel=\"self\" type=%q />" .Permalink .MediaType | safeHTML }}
    {{- end }}
    {{- range $pages }}
    <item>
      <title>{{ .Title }}</title>
      <link>{{ .Permalink }}</link>
      <pubDate>{{ .PublishDate.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
      {{- with $authorEmail }}<author>{{ . }}{{ with $authorName }} ({{ . }}){{ end }}</author>{{ end }}
      <guid>{{ .Permalink }}</guid>
      <description>{{ .Summary | transform.XMLEscape | safeHTML }}</description>
    </item>
    {{- end }}
  </channel>
</rss>
```

We're going to start by changing the `rss` tag to add podcasting namespaces. Find the `rss` tag at line 34.
```go-html-template
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
```
and replace it with...
```go-html-template
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:podcast="https://podcastindex.org/namespace/1.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
```
We need to do this because otherwise, a feed reader (like a browser or a podcast app) won't be able to recognize the podcast-specific tags we're using. Most of them are `itunes` tags because Apple controlled the game early on in podcasts; they never updated the syntax when they rebranded to Apple Podcasts (which is a good thing — if they had, everyone would have had to update their feeds). We're also adding supporting for [Podcast Index's newer tags](https://podcasting2.org/docs/podcast-namespace) — you can think of them like a modern, open competitor to Apple. They added a bunch of modern features to podcast feeds (like standardized chapter support and transcripts). Their tags are supported by most modern podcast apps, including Apple Podcasts.

## The channel tag

Next, let's take a look at the first few items in `<channel>` tag. Think of this as the basic show information; we'll get to the episodes later in the `<item>` tag. Here's what Hugo has by default at the start of the `<channel>` tag.
```go-html-template
<title>{{ if eq .Title .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{ . }} on {{ end }}{{ .Site.Title }}{{ end }}</title>
    <link>{{ .Permalink }}</link>
    <description>Recent content {{ if ne .Title .Site.Title }}{{ with .Title }}in {{ . }} {{ end }}{{ end }}on {{ .Site.Title }}</description>
    <generator>Hugo</generator>
    <language>{{ site.Language.LanguageCode }}</language>{{ with $authorEmail }}
    <managingEditor>{{.}}{{ with $authorName }} ({{ . }}){{ end }}</managingEditor>{{ end }}{{ with $authorEmail }}
    <webMaster>{{ . }}{{ with $authorName }} ({{ . }}){{ end }}</webMaster>{{ end }}{{ with .Site.Copyright }}
    <copyright>{{ . }}</copyright>{{ end }}{{ if not .Date.IsZero }}
    <lastBuildDate>{{ (index $pages.ByLastmod.Reverse 0).Lastmod.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</lastBuildDate>{{ end }}
```
We can leave `title`, `link`, `generator`, `language`, `copyright`, and `lastBuildDate` alone. We don't need `managingEditor` or `webMaster`, so you can remove those. 

Edit the `description` tag with your podcast's tagline.
```go-html-template
<description>Just another podcast feed.</description>
```
Now, we'll have to add a few podcasting-specific declarations, starting with the show information.

First, we need to add `itunes:author`. This can be your name, your podcast network, or just the name of the show. Be aware that most podcatchers display this information prominently, so make your decision accordingly: if you don't want your full first and last name out there, don't put it here.
```go-html-template
<itunes:author>John Podcast</itunes:author>
```
Now, we need the `itunes:type` tag, which can have two possible values: `episodic` (appropriate for most podcasts — episodes don't need to be consumed in any particular order) or `serial` (episodes should be consumed sequentially).
```go-html-template
<itunes:type>episodic</itunes:type>
```

The `itunes:image` tag is where you'll specify your show's cover art. I also declare this through `image`, which will display your cover art on the raw RSS feed displayed in a browser, too.
```go-html-template
<itunes:image href="https://yourwebsite.com/cover.png" />
<image>
	<url>https://yourwebsite.com/cover.png</url>
</image>
```
Next, we need to specify the category for the show with the `itunes:category` tag. Apple [has the full list of available categories and sub-categories here](https://podcasters.apple.com/support/1691-apple-podcasts-categories). For the sake of this example, let's assume you're a podcast about video games.
```go-html-template
<itunes:category text="Leisure">
      <itunes:category text="Video Games"/>
</itunes:category>
```
If your show is in a category with an ampersand (&), make sure you escape the character, as in the example below. This example also shows how to specify multiple categories if appropriate for your show; you can have up to three.
```go-html-template
<itunes:category text="Society &amp; Culture">
	<itunes:category text="Documentary" />
</itunes:category>
<itunes:category text="Health &amp; Fitness">
	<itunes:category text="Mental Health" />
</itunes:category>
```
Ampersands break RSS feeds, so why Apple decided to create categories with ampersands, I will never know.

We'll also need to specify if the show is explicit using the `itunes:explicit` tag. The possible values are either `true` or `false`. I am told that Apple can be quite strict about this, so if there's any cursing or adult content on your show, use `true`.
```go-html-template
<itunes:explicit>true</itunes:explicit>
```
I'm not actually sure if this part is required, but I have it and it doesn't hurt. This is a link to your feed. Obviously, change `yourwebsite.com` to your actual domain.
```go-html-template
<atom:link
      href="https://yourwebsite.com/feed.xml"
      rel="self"
      type="application/rss+xml" />
```
If you changed the `BaseName` in `hugo.toml`, make sure it matches here.

## The item tag
Okay — we're all set on the `channel` information. Now, let's work on the `item` tag. When Hugo generates your actual RSS feed, there will be an `item` tag for every episode you release. Of course, we'll need to customize it to have some podcast-specific data, just like we did in the `channel` tag; this time around, though, it's a little more complicated. The content in the `channel` tag is relatively constant — you're probably not changing the name of your show all that often. But the information we have to provide about our *episodes* will, naturally, change on an episode-by-episode basis. This means we're going to have to create some custom parameters that we will then specify in the episode content files.

Here's what Hugo has by default:
```go-html-template
<item>
      <title>{{ .Title }}</title>
      <link>{{ .Permalink }}</link>
      <pubDate>{{ .PublishDate.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
      {{- with $authorEmail }}<author>{{ . }}{{ with $authorName }} ({{ . }}){{ end }}</author>{{ end }}
      <guid>{{ .Permalink }}</guid>
      <description>{{ .Summary | transform.XMLEscape | safeHTML }}</description>
    </item>
```
We're off to a start, but, of course, there's a lot to add and edit. The `title`, `link`, `pubDate`, and `guid` tags can all remain as is.

The `description` tag renders what will become your show notes. Right now, it's set to your post's summary, which, by default in Hugo, is the first paragraph or so of your post. We want that to be the full text of our post, so we're going to change `.Summary` to `.Content`, like so:
```go-html-template
<description>{{ .Content | transform.XMLEscape | safeHTML }}</description>
```
OK — now let's dig into actually making these podcast episodes. We're going to be slotting in a lot of custom parameters, which we'll eventually flesh out when we get to our post template. Let's start with the episode title. We've already specified that in the `title` tag, but there's an Apple-specific one to declare again. We can reuse the same syntax from before, though.
```go-html-template
<itunes:title>{{ .Title }}</itunes:title>
```

Next up is `itunes:episodeType`, which can be either `full`, `bonus`, or `trailer`. Because this varies on an episode-to-episode basis, we'll need a custom parameter.
```go-html-template
<itunes:episodeType>{{ .Params.episodeType }}</itunes:episodeType>
```
We'll also add a `content:encoded` tag. Similar to `itunes:title`, this is redundant with another tag (`description`), but we're aiming for compatibility here. Some older podcast apps still use `content:encoded`, so we want to support it.

Now for the `itunes:summary` tag. This is your episode's tagline, a preview of its contents. Not all podcast apps surface this, but some do. We're going to use `.Summary` here; we'll get to customizing it when we set up our actual post templates.
```go-html-template
<itunes:summary>{{ .Summary | transform.XMLEscape | safeHTML }}</itunes:summary>
```
The next tag is probably the most important: `enclosure`, which is where you link your actual media file. We'll do this with two custom parameters: `episodeLength` (a bit of a misnomer — it's the file size in bytes) and `episodeURL`.
```go-html-template
<enclosure length="{{ .Params.episodeLength }}" type="audio/mpeg" url="{{ .Params.episodeURL }}" />
```
Now, for the actual *duration* of the episode, we need `itunes:duration`.
```go-html-template
<itunes:duration>{{ .Params.episodeDuration }}</itunes:duration>
```
I'm choosing to remain consistent with the code's syntax; I wish it was `enclosure size` because duration and length are too interchangeable, but it's not, so we will have to solider on.

Podcast feeds can also have some episodes marked explicit and some non-explicit, so we have to declare that on an episode-to-episode basis. Imagine, for example, that your show as a *whole* isn't generally explicit, but on a particular episode, you discuss a Chuck Tingle book — you can mark just that episode as explicit.
```go-html-template
<itunes:explicit>{{ .Params.episodeExplicit }}</itunes:explicit>
```
We'll also need to specify an episode and season number. If your show is episodic, we'll just always use season 1, and podcatchers shouldn't show any season number. But you can also leave out that tag if your show is episodic and you never plan on using seasons. Some episodic shows still use seasons, though, like shows that go on extended breaks. I don't use seasons right now, but I'd like to have the opportunity in the future, so I'll include it.
```go-html-template
<itunes:episode>{{ .Params.episodeNumber }}</itunes:episode>
<itunes:season>{{ .Params.episodeSeason }}</itunes:season>
```
Now, we're going to build in support for podcast chapters, which are perhaps the greatest innovation in the podcasting space in the last ten years. We're going to wrap this in an `if` statement to check if the parameter returns `true`, meaning, your episode has chapters; if it does, we'll use a standard URL format. If it's `false`, this tag won't render. If we didn't do this, there would be a broken link in the feed.
```go-html-template
{{ if eq .Params.episodeChapters false }}
	{{ else }}
		<podcast:chapters url="{{ .Permalink }}chapters.json" type="application/json+chapters" />
{{ end }}
```
If you need help generating chapters for your podcast, by the way, [there's a great web-based tool here](https://mp3chapters.github.io/).

We'll do the same if/else statement for transcripts (for the same reason). I like `vtt` format, but there are others out there; just specify whichever one you prefer.
```go-html-template
{{ if eq .Params.episodeTranscript false }}
	{{ else }}
		<podcast:transcript url="{{ .Permalink }}transcript.vtt" type="text/vtt" />
{{ end }}
```
And that's it! There are a lot of other [available podcast tags](https://podcasting2.org/docs/podcast-namespace/1.0) and a lot of tags that have been deprecated over the years; this covers the major required ones and the ones that most people will want. If you're interested in using any other tags, just add them as we have been and build those custom parameters into your post template.

## Finished Feed Template
We have created a custom podcast feed, which will render at `yourwebsite.com/feed.xml`. We've filled it with the following contents:
```go-html-template
{{- $authorEmail := "" }}
{{- with site.Params.author }}
  {{- if reflect.IsMap . }}
    {{- with .email }}
      {{- $authorEmail = . }}
    {{- end }}
  {{- end }}
{{- end }}

{{- $authorName := "" }}
{{- with site.Params.author }}
  {{- if reflect.IsMap . }}
    {{- with .name }}
      {{- $authorName = . }}
    {{- end }}
  {{- else }}
    {{- $authorName  = . }}
  {{- end }}
{{- end }}

{{- $pctx := . }}
{{- if .IsHome }}{{ $pctx = .Site }}{{ end }}
{{- $pages := slice }}
{{- if or $.IsHome $.IsSection }}
{{- $pages = $pctx.RegularPages }}
{{- else }}
{{- $pages = $pctx.Pages }}
{{- end }}
{{- $limit := .Site.Config.Services.RSS.Limit }}
{{- if ge $limit 1 }}
{{- $pages = $pages | first $limit }}
{{- end }}
{{- printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" | safeHTML }}
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:podcast="https://podcastindex.org/namespace/1.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{{ if eq .Title .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{ . }} on {{ end }}{{ .Site.Title }}{{ end }}</title>
    <link>{{ .Permalink }}</link>
    <description>Just another podcast feed.</description>
    <generator>Hugo</generator>
    <language>{{ site.Language.LanguageCode }}</language>{{ with $authorEmail }}
    <copyright>{{ . }}</copyright>{{ end }}{{ if not .Date.IsZero }}

    <itunes:author>John Podcast</itunes:author>
    <itunes:type>episodic</itunes:type>
    <itunes:image href="https://yourwebsite.com/cover.png" />
    <image>
      <url>https://yourwebsite.com/cover.png</url>
    </image>
    <itunes:category text="Leisure">
      <itunes:category text="Video Games"/>
    </itunes:category>
    <itunes:explicit>true</itunes:explicit>
    <atom:link
      href="https://yourwebsite.com/feed.xml"
      rel="self"
      type="application/rss+xml" />

    <lastBuildDate>{{ (index $pages.ByLastmod.Reverse 0).Lastmod.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</lastBuildDate>{{ end }}
    {{- with .OutputFormats.Get "RSS" }}
    {{ printf "<atom:link href=%q rel=\"self\" type=%q />" .Permalink .MediaType | safeHTML }}
    {{- end }}
    {{- range $pages }}
    <item>
        <title>{{ .Title }}</title>
        <link>{{ .Permalink }}</link>
        <pubDate>{{ .PublishDate.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
        {{- with $authorEmail }}<author>{{ . }}{{ with $authorName }} ({{ . }}){{ end }}</author>{{ end }}
        <guid>{{ .Permalink }}</guid>
        <description>{{ .Content | transform.XMLEscape | safeHTML }}</description>

        <itunes:title>{{ .Title }}</itunes:title>
        <itunes:episodeType>{{ .Params.episodeType }}</itunes:episodeType>
        <content:encoded>{{ .Content | transform.XMLEscape | safeHTML }}</content:encoded>
        <itunes:subtitle>{{ .Summary | transform.XMLEscape | safeHTML }}</itunes:subtitle>
        <enclosure length="{{ .Params.episodeLength }}" type="audio/mpeg" url="{{ .Params.episodeURL }}" />
        <itunes:duration>{{ .Params.episodeDuration }}</itunes:duration>
        <itunes:explicit>{{ .Params.episodeExplicit }}</itunes:explicit>
        <itunes:episode>{{ .Params.episodeNumber }}</itunes:episode>
        <itunes:season>{{ .Params.episodeSeason }}</itunes:season>
        {{ if eq .Params.episodeChapters false }}
            {{ else }}
                <podcast:chapters url="{{ .Permalink }}chapters.json" type="application/json+chapters" />
        {{ end }}
        {{ if eq .Params.episodeTranscript false }}
            {{ else }}
                <podcast:transcript url="{{ .Permalink }}transcript.vtt" type="text/vtt" />
        {{ end }}
    </item>
    {{- end }}
  </channel>
</rss>
```
Now, we'll need to work on creating episodes.
## Episode Template
Inside Hugo's `content` folder, we're going to create another folder titled `episodes`. Each episode will go in a folder, like so:
```txt
├── content/
│   └── episodes/
│       └── YYYY-MM-DD Title/
│			└── chapters.json
│			└── index.md
│			└── transcript.vtt
```
I use the YYYY-MM-DD format for my folders because it keeps them in episode order, but you could easily do something like S01E01. The naming schema is only used for file organization; it's not surfaced on your feed or in your post at all.

You can omit the `chapters.json` and `transcript.vtt` files if that episode doesn't have chapters or a transcript, respectively. The `index.md` file contains the actual content of our episode. In the frontmatter of every `index.md` file, we'll need to include the custom parameters that we created in our feed. Let's open up `index.md` for our first episode and get to work.

We will start with the standard frontmatter that Hugo requires:
```yaml
---
title: "My First Post"
date: 2024-01-14T07:07:07+01:00
draft: false
---

Type your shownotes in markdown format here!
```
First, let's address the `itunes:subtitle` tag, which is currently set to pull Hugo's post summary. By default, Hugo will just use the first paragraph of your post as a summary. If that works for you, you don't have to do this next step, but if you want want to specify a custom subtitle for your episode, you can add in the `summary` tag.
```yaml
---
title: "My First Post"
date: 2024-01-14T07:07:07+01:00
draft: false
summary: 'This is my episode subtitle!'
---

Type your shownotes in markdown format here!
```
OK — now onto the parameters that we created for our podcast feed.

| Parameter         | Type    | Description                                                                                                                                                                                            |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| episodeType       | String  | `full`, `bonus`, or `trailer`                                                                                                                                                                          |
| episodeLength     | Number  | The length (in bytes) of your media file. There are a lot of ways to find this information, but on Windows, right-click on the file and select Properties. You'll see it after `Size:` in parentheses. |
| episodeURL        | String  | A direct link to your media file (probably an MP3)                                                                                                                                                     |
| episodeDuration   | String  | The duration of your episode in hh:mm:ss format                                                                                                                                                        |
| episodeExplicit   | Boolean | `true` or `false`                                                                                                                                                                                      |
| episodeNumber     | Number  | Increment with every episode                                                                                                                                                                           |
| episodeSeason     | Number  | If you're not using seasons, just set this as `1` every time                                                                                                                                           |
| episodeChapters   | Boolean | `true` (the episode has chapters) or `false` (the episode does not have chapters). If set to `true`, make sure you place the `json` file in the episode folder.                                        |
| episodeTranscript | Boolean | `true` (the episode has a transcript) or `false` (the episode does not have a transcript). If set to `true`, make sure you place the `vtt` file in the episode folder.                                 |

An example might be...
```yaml
---
title: "My First Post"
date: 2024-01-14T07:07:07+01:00
draft: false
summary: 'This is my episode subtitle!'

episodeType: full
episodeLength: 20451328
episodeURL: https://yourwebsite.com/episodes/episode1.mp3
episodeDuration: 00:27:59
episodeExplicit: true
episodeNumber: 1
episodeSeason: 1
episodeChapters: false
episodeTranscript: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor aliquet urna id gravida. In sollicitudin posuere risus a malesuada. Cras pretium, neque eget molestie laoreet, urna neque consequat turpis, sed vestibulum sem mi eget velit. Integer in orci sit amet sapien pharetra malesuada a id justo. Ut pellentesque, magna at finibus tincidunt, elit ante venenatis nibh, in fermentum ipsum elit et ligula. Phasellus lorem elit, volutpat volutpat auctor et, laoreet molestie sapien. Sed hendrerit pellentesque nulla a rutrum. Nunc lobortis mattis vestibulum. Pellentesque vel orci viverra est sagittis pulvinar.
```

Every time you're ready to post a new episode, you'll just create a new folder and `index.md` with the appropriate information. You can probably automate this a bit with [a custom archetype](https://gohugo.io/content-management/archetypes/), but I usually just copy and paste the frontmatter from the previous post and tweak it as necessary.

Now, you just have to build and deploy your site. Your feed will be found at `yourwebsite.com/feed.xml`. You'll have to manually submit that feed to the major podcast directories, but that's a one time deal; once you're listed, the apps should refresh shortly after you publish your episodes.

You can see this at work on [Pitch & Play](https://pitchandplay.org/). Do note that I've made a few customizations to the feed template for my show specifically — I'm a dumbass who put an ampersand in their show name and I had to work around that. I followed the same basic protocol for [Podtrificus Totalus](https://podtrificustotalus.com/), but some of the feed structure is outdated because I generated that site further back than Pitch & Play. Both sites use custom themes; they're bespoke and probably a bit janky, so I won't be releasing them to the public for use, but the [repos for them are public](https://git.32bit.cafe/cassie/), so you can steal whatever you want.

Want to test your feed? I like the [Podbase Validator](https://podba.se/validate/); you can [run Pitch & Play's feed directly by clicking here](https://podba.se/validate/?url=https://pitchandplay.org/feed.xml).[^3]

If this post helped you — or if something isn't working — feel free to [get in touch with me](http://cassie.ink/about/).

[^1]: I think about bringing Pitch & Play back sometimes because I truly do miss podcasting and I like talking about games. I walked away from the Harry Potter one for obvious reasons, and the one before that I won't mention because episodes of it still exist online (outside of my control) and I'd rather not attach myself to them.

[^2]: WordPress is a bloated monster that constantly has security patches, and the founder is super problematic.

[^3]: I'm failing the Byte-range support test right now, but that's related to where my media is hosted, not the RSS feed — and in my testing, I'm not sure that's actually a problem.