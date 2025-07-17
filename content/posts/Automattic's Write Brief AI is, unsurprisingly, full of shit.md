---
title: Automattic's Write Brief is, unsurprisingly, full of shit
date: 2024-08-28
url: write-brief
tags: [tech, internet, ai]
draft: false
---

Automattic [recently launched their Write Brief AI assistant](https://techcrunch.com/2024/08/07/automattic-launches-ai-writing-tool-that-aims-to-make-wordpress-blogs-more-readable-and-succinct/) for folks using Jetpack with WordPress.[^1] It is automatically available to anyone using wordpress.com, which I verified by logging into my 14-year-old account.

I decided to test it out on my recent post about _The Basic Eight_. I chose this because it's one of my more recent posts that isn't #week-notes . I pasted it directly into the Gutenberg editor with all of the AI settings toggled on.

According to Write Brief, my "Reading grade score" is 11.05; they recommend between 8 and 12 for maximum readable. Most of the AI's complaints with me were the long sentences within the post (it identified 20). Some of them, I agree with, even if they are all grammatically correct.[^2] Take, for example, the following sentence:

> Flannery has to kill Adam because I’d be just as dissatisfied if she didn’t, and I’d be here complaining that Handler didn’t have the guts to follow through on his promising hook.

This is not an overly complicated sentence; it is a compound-complex sentence, grammatically, with five distinct clauses.
- "Flannery has to kill Adam" (independent)
- "because I’d be just as dissatisfied" (dependent)
- "if she didn’t" (dependent)
- "I’d be here complaining" (independent; joined with the coordinating conjunction "and")
- "that Handler didn’t have the guts to follow through on his promising hook" (relative clause)
That *sounds* like a lot, and maybe it is, but the sentence reads fairly easily — we are constantly stacking clauses on top of each other in the English language. 

Write Brief's proposed revision is as follows:

> Flannery has to kill Adam. I’d be just as dissatisfied if she didn’t. I’d be here complaining that Handler didn’t have the guts to follow through on his promising hook. I’ll keep telling myself that until I believe it.

It essentially separated the clauses out to be mostly simple sentences, with the exception of the last sentence — which would be impossible to split apart without inserting a number of words.

Most puzzlingly, Write Brief took umbrage with my use of the word "cannot" because it is a "complex word" and suggested I revise it to "can't," forcing an informal voice without ever asking me if that's what I *wanted*.

---
OK, whatever; I'm just an idiot with a blog. My writing is not exactly a gold standard of readability and clarity.[^3]  Let's instead test the model on some of the literary greats.

Of course I must start with Jane Austen's *Pride & Prejudice*, one of the finest works in the canon. I tried the iconic first sentence, "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife." Write Brief concluded that this, too, was a "long sentence" and suggested the following revision:

> It is a truth universally acknowledged. A single man in possession of a good fortune must be in want of a wife.

Again, the AI is simply splitting the clauses up, but in this case, it's butchering the *meaning* (let alone the style and humor!) of the sentence! *What* is a truth universally acknowledged?

Let's fast-forward in time a little to simpler prose.[^4] I'm trying to avoid anything with dialogue, so let's try the final major section of *The Great Gatsby*.

> And as I sat there brooding on the old, unknown world, I thought of Gatsby’s wonder when he first picked out the green light at the end of Daisy’s dock. He had come a long way to this blue lawn, and his dream must have seemed so close that he could hardly fail to grasp it. He did not know that it was already behind him, somewhere back in that vast obscurity beyond the city, where the dark fields of the republic rolled on under the night.
> 
> Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter—tomorrow we will run faster, stretch out our arms further… And one fine morning—
> 
> So we beat on, boats against the current, borne back ceaselessly into the past.

Write Brief took no issue with the final two paragraphs — presumably because they're composed only of simple and compound sentences. The entire first paragraph was flagged, once again for the "long sentences" and because "could" is an "unconfident word." Write Brief's recommended edit was:

> And as I sat there brooding on the old, unknown world. I thought of Gatsby’s wonder when he first picked out the green light at the end of Daisy’s dock. He had come a long way to this blue lawn. His dream must have seemed so close that he could hardly fail to grasp it. He did not know that it was already behind him. It was somewhere back in that vast obscurity beyond the city. The dark fields of the republic rolled on under the night.

This revision preserves the intent of the passage but again enforces the staccato rhythm of mostly simple sentences.

Of course the final test must be on Hemingway, who espoused cutting his writing to the bone (n.b. I also think he was full of shit). To give Write Brief the best possible shake, I'm deliberately selecting a fairly simplistic paragraph from early in the first chapter of *For Whom the Bell Tolls*.

> He spread the photostated military map out on the forest floor and looked at it
carefully. The old man looked over his shoulder. He was a short and solid old man in a
black peasant’s smock and gray iron-stiff trousers and he wore rope-soled shoes. He
was breathing heavily from the climb and his hand rested on one of the two heavy packs
they had been carrying.

Yet again, Write Brief believes this paragraph to contain long sentences, and it suggested this revision:

> He spread the photostated military map out on the forest floor and looked at it  
carefully. The old man looked over his shoulder. He was a short and solid old man. He wore a black peasant’s smock and gray iron-stiff trousers. He also wore rope-soled shoes. He  was breathing heavily from the climb. His hand rested on one of the two heavy packs  they had been carrying.

This revision *inserted* several words to enforce its stylistic choices for sentence structure. Note the redundancy in "He wore a black..." and "He also wore rope-soled..." If one of my students handed this in to me, I'd suggest they do some sentence-combining. My students are 12 years old.
___
Writing can and should be revised to be concise and readable — even the writing we do online. That's not what I take issue with. Forgetting that blogs are often, by practice, stream of consciousness, and WordPress is ostensibly a blogging platform, it is our unique writing styles — the structures we use and gravitate toward and the decisions we make to conform to or break those structures — that make us individuals. There is joy and beauty in seeing people as they are, and that includes online. We sometimes must compromise our idiosyncrasies to be successfully communicate — after all, communication only happens when a message is sent *and* understood — and the individual blogger can, of course, simply turn off or ignore these suggestions and make stylistic choices for themselves. And really, this AI is nothing more than a tool to turn complex and compound-complex sentences into simple or compound ones — without any other considerations like modifiers or participles and at the cost of original voice.

There is joy and value in expressing ourselves *how we are*, not how some bullshit external rules tell us *how to be*[^5] — because there is always one culture or mode of expression that is valued by the people making the AI, and those who exist outside of that hegemony are treated as wrong and in need of revision. I don't *want* to sound like an elementary schooler who never learned to use a comma and therefore simply avoids them. I want to experience the beautiful, unique minds of the bloggers I follow. I want authenticity, not the yassified, sanitized version of you. I will continue to cling to my strung-out sentences.

[^1]: I don't have actual data on this, but I'd assume this is the _majority_ of WordPress users.
[^2]: I have two halves of an English degree so I can be trusted to make these assertions.
[^3]: I write for myself and to capture what's in my head, which is mostly nonsense.
[^4]: I eat too much salt to confidently put in anything by Shakespeare and expect to survive the experience.
[^5]: I realize the same argument could be applied to all grammar rules — I side with linguistic descriptivism, and on the web, I generally encourage people to write how they want. Omit punctuation! Don't capitalize! If it bothers me, I have the choice not to read. (Formal academic writing is different.)
