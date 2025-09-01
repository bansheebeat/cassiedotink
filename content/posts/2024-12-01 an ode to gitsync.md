---
title: an ode to gitsync
date: 2024-12-01
url: an-ode-to-gitsync
tags:
  - tech
  - meta
draft: false
---
Since I [moved this site to Hugo](https://cassie.ink/what%27s-this-%28and-how-it-works%29/), I've been using an app called GitJournal to post from my phone. I have a beautiful desk setup with a clacky mechanical keyboard that's a joy to write on, but the simple fact is that I'm a lazy shit and want to update my blog from the couch. It's all mostly worked fine, with some headaches. I originally intended to use GitJournal to store my Github repo to my phone's filesystem and then point an Obsidian[^1] vault at that.

Unfortunately, GitJournal currently [cannot store the repo](https://github.com/GitJournal/GitJournal/issues/925) in the Android filesystem due to a permissions issue, so I can't use it with Obsidian. GitJournal's note-taking app is serviceable, but again, I want to use Obsidian. I've been making-do with GitJournal for a few months now — for once in my life, not fixing what's broken — operating under the assumption that there were no other options.

Allow me to repeat myself: I am a lazy shit.

I am now using [GitSync](https://github.com/ViscousPot/GitSync). It's dead simple: you sign in with your Github account, select the repo you want to clone to your device, and that's it. Critically for me, however, it has a setting to automatically sync the repo when you open and close certain apps — for me, Obsidian.

![GitSync screenshot](/img/2024/gitsync.png)

This is the beauty of GitSync: it stays out of my way. Now that it's configured, I don't have to open it or think about it. I open Obsidian, write my silly little posts, close Obsidian, and I'm done.

Everyone should have their own space on the web, and there are great tools out there like [bearblog](https://bearblog.dev) and [Pika](https://pika.page/) and so on. But I'm tired of hoping platforms and losing content: I want to own my space and what I write. **I'm an idiot and I generally have no idea what I'm doing**, so if you're of a similar mind to me but daunted by the concept of creating your own website, shoot me an email. I'm not an expert, but I can at least share what I've learned and what I've set up: a way to run your own website but really just type shit in a note-taking app.  Simple and frictionless.[^2]
[^1]: Obsidian is currently my preferred app for writing on my phone and on my PC. I'm not really using it as a knowledge management system like some people (although I would like to maybe move my Notion database of lesson and unit plans over to it), and I'm only currently using two plugins with it majorly, but [its ethos aligns with mine](https://obsidian.md/about) for what an app should be.
[^2]: that is, unless you like to incessantly poke at shit and tinker like me, and then things change and break. but the posting, the posting is simple. 
