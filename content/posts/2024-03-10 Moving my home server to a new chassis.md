---
title: Moving my home server to a new chassis
date: 2024-03-10
url: moving-my-home-server-to-a-new-chassis
tags:
  - home
  - life
  - tech
draft: false
---
I have a home server (running Unraid) that I use to backup computers, as media storage, and to run various apps. It's mostly been cobbled together from used parts I found for cheap, and it generally followed [Serverbuild's NAS Killer 4 guide](https://forums.serverbuilds.net/t/guide-nas-killer-4-0-fast-quiet-power-efficient-and-flexible-starting-at-125/667). It runs like a dream, and putting it together is one of the best decisions I've ever made. More recently, with streaming sites like Netflix, Hulu, etc. cracking down on password sharing, it has become my pathway to shedding some monthly subscriptions and owning my own media.

For years, that server has lived in an old NZXT case that I had used when I built my first PC, primarily because I had the case laying around and because it still had bays for 3.5" drives (most modern PC cases only include one or two and instead provide storage for 2.5" drives). That bulky case has been shoved away in whatever corner of my apartments I could find, but now that I own a house, I have dreams of setting up a proper server rack in a closet somewhere. My home's basement has a strange little room that housed only the oil tank and is conveniently right below my office space, so that's the intended home. We replaced and relocated the tank and ran electrical to it, so it's now good to go.

I purchased a rack mount case (Rosewill RSV-L4500U) off of the [hardwareswap](https://www.reddit.com/r/hardwareswap/) Discord not too long ago and intended to move the server when I had some free time. Just a few days ago, I found that one of my 6TB drives was throwing errors in Unraid. I ran a SMART test, which seemed to clear, so I thought I would start by checking the physical connections — and if I was going to have to take the server down, I might as well move it into the new case.

Easy enough, right? I've been tinkering with and building PCs for over ten years now. I'm at a stage where I can put one together and confidently turn it on on the first try. There was a bit of an adjustment period to a proper server case (particularly the drive cages — I like the idea of them, but the screwless design is a proper pain in the ass), but for the most part, this was smooth sailing — at least in the context of what was to come.

![The new case](https://cdn.cassie.ink/images/2024/02/PXL_20240219_164002815.jpg "The new case")

![The old server](https:///cdn.cassie.ink/images/2024/02/PXL_20240219_164215573.jpg "The old server")

![Transferred](https:///cdn.cassie.ink/images/2024/02/PXL_20240219_180817832.jpg "Transfered")

I'm normally better at straightening up the cables, but with a non-modular PSU, I don't have a lot of options. I'll replace it one day...

Now, part of what I wanted to do was also replace my cache drive. I had been running it off of an *old* 120GB SSD which would fill up pretty easily. I had a 500GB SSD kicking around to swap to; I had thought I'd set my appdata folder to copy to my array so that I could just pop in the new drive, remove the old one, and be good to go. This was my fatal error.

I boot up the server — first try — and see the new cache drive needs to be formatted. Great. I do so, then check my Dockers. *Everything is gone.*

Oh fuck — but I can just put in the old drive, right? I do so. It is, according to Unraid, unmountable.

Well, I had switched from an xfs file system to btrfs with the new drive. Maybe I just need to set the cache pool to accept xfs again.

The drive is still unreadable.

I try `xfs_repair` on it with no luck. I spent several hours trying all kinds of drive recovery and tricks online. Nothing.

This resulted in me having to recreate all of my Docker containers — all of my -arr setups, my Plex configuration (including all of my playlists), etc. It took *hours*, but I learned my lesson: all of that is set to automatically backup now. If I'm looking for silver linings, this finally forced me to migrate from Jackett to Prowlarr, which removes a lot of manual configuration on my part; my indexers all automatically sync to Radarr, Sonarr, Lidarr, etc. It's a pain in the ass, and something is still off with my Lidarr config, but again, lessons learned...

A few weeks later, the supposed failed drive is running just fine and passing all checks and tests. I'm getting frequent warnings that some of the drives are running hot, so I'm planning to replace the stock fans (which I've read some folks online confirming that they're awful) with Arctic P12s. Further down the line, I need to get a proper rack and run cables down to my "server room" (old furnace room in my basement) — for now, the server will continue to live on the floor of my office.